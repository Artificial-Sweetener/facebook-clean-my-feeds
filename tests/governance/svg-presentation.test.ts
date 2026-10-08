/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import path from "node:path";

import sharp from "sharp";
import { inlineSvg, loadSvgIcons, standaloneThemeCss, validateSvg } from "../../tools/svg-assets";

/**
 * Count foreground pixels after rendering the exact light or dark declaration used by the SVG.
 * Sharp does not emulate media preferences; browser QA separately verifies inherited color-scheme.
 * @param markup Already-validated inline artwork, with its standalone stylesheet removed.
 * @param foreground The selected declaration from that exact rule, never a geometry transformation.
 * @param background Opaque comparison surface for the selected theme.
 * @returns Pixels separated from the background by at least 30 RGB levels on one channel.
 */
async function visiblePixels(
  markup: string,
  foreground: string,
  background: number
): Promise<number> {
  const themed = markup.replace('color="#1f2328"', `color="${foreground}"`);
  const { data, info } = await sharp(Buffer.from(themed))
    .resize(64, 64)
    .flatten({ background: { r: background, g: background, b: background } })
    .raw()
    .toBuffer({ resolveWithObject: true });
  let visible = 0;
  for (let index = 0; index < data.length; index += info.channels) {
    if (
      [data[index], data[index + 1], data[index + 2]].some(
        (value) => value !== undefined && Math.abs(value - background) >= 30
      )
    )
      visible += 1;
  }
  return visible;
}

test("all standalone icons carry the exact high-contrast light/dark rule and preserve geometry", async () => {
  const icons = await loadSvgIcons();
  expect(icons.size).toBe(17);
  for (const markup of icons.values()) {
    expect(markup).toContain(`<style>${standaloneThemeCss}</style>`);
    const inline = inlineSvg(markup);
    expect(await visiblePixels(inline, "#1f2328", 255)).toBeGreaterThan(20);
    expect(await visiblePixels(inline, "#f0f6fc", 13)).toBeGreaterThan(20);
    expect(inline).not.toContain("<style");
    expect(inline).not.toContain(":root");
    expect(inline).toContain("currentColor");
    expect(() => validateSvg(inline, "inline.svg")).not.toThrow();
  }
});

test("standalone styling cannot admit arbitrary selectors, imports, URLs or nested style blocks", () => {
  const open = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">';
  const theme = `<style>${standaloneThemeCss}</style>`;
  expect(() => validateSvg(`${open}${theme}</svg>`, "safe.svg")).not.toThrow();
  for (const invalid of [
    `${theme}${theme}`,
    `<g>${theme}</g>`,
    "<style>:root{display:none}</style>",
    `<style>${standaloneThemeCss}body{display:none}</style>`,
    '<style>@import "https://example.test/theme.css";</style>',
    "<style>:root{fill:url(https://example.test/paint)}</style>",
    `<style media="screen">${standaloneThemeCss}</style>`,
    `<style>${standaloneThemeCss}<g/></style>`,
  ]) {
    expect(() => validateSvg(`${open}${invalid}</svg>`, "unsafe.svg")).toThrow();
  }
});

test.each([
  `<style >${standaloneThemeCss}</style>`,
  `<style\n>${standaloneThemeCss}</style>`,
  `<style>${standaloneThemeCss}</style >`,
])("every admitted stylesheet spelling is removed at the inline HTML boundary", (theme) => {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${theme}<path d="M2 2h4v4H2z"/></svg>`;
  expect(() => validateSvg(markup, "formatted.svg")).not.toThrow();
  expect(inlineSvg(markup)).not.toContain("<style");
  expect(inlineSvg(markup)).not.toContain(":root");
  expect(inlineSvg(markup)).toContain('<path d="M2 2h4v4H2z"/>');
});

/**
 * Inspect opaque-enough foreground bounds on the fixed 64px canvas, excluding antialias fringes.
 * The measurement guards placement and clipping; it does not evaluate artistic fidelity.
 * @param markup Build-validated standalone artwork; its media rule is removed before measurement.
 * @returns Foreground bounds and lower-quadrant counts used to detect the search-handle direction.
 */
async function placedPixels(markup: string) {
  const { data, info } = await sharp(Buffer.from(inlineSvg(markup)))
    .resize(64, 64)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = 64;
  let right = -1;
  let top = 64;
  let bottom = -1;
  let lowerLeft = 0;
  let lowerRight = 0;
  for (let y = 0; y < 64; y += 1) {
    for (let x = 0; x < 64; x += 1) {
      if ((data[(y * 64 + x) * info.channels + 3] ?? 0) <= 32) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      if (y > 44 && x < 28) lowerLeft += 1;
      if (y > 44 && x > 36) lowerRight += 1;
    }
  }
  return { left, right, top, bottom, lowerLeft, lowerRight };
}

test("faithful artwork remains centered and inside its icon slot after placement normalization", async () => {
  for (const markup of (await loadSvgIcons()).values()) {
    const bounds = await placedPixels(markup);
    expect(bounds.left).toBeGreaterThanOrEqual(3);
    expect(bounds.top).toBeGreaterThanOrEqual(3);
    expect(bounds.right).toBeLessThanOrEqual(60);
    expect(bounds.bottom).toBeLessThanOrEqual(60);
    expect(Math.abs((bounds.left + bounds.right + 1) / 2 - 32)).toBeLessThanOrEqual(1);
    expect(Math.abs((bounds.top + bounds.bottom + 1) / 2 - 32)).toBeLessThanOrEqual(1);
  }
});

test("the search handle points down-left like the recovered original", async () => {
  const icons = await loadSvgIcons();
  const search = [...icons].find(([filename]) => path.basename(filename) === "search.svg");
  if (!search) throw new Error("Missing search artwork");
  const bounds = await placedPixels(search[1]);
  expect(bounds.lowerLeft).toBeGreaterThan(10);
  expect(bounds.lowerLeft).toBeGreaterThan(bounds.lowerRight * 3);
});
