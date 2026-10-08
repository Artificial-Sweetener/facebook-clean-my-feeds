/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import sharp from "sharp";
import { inlineSvg, loadSvgIcons, standaloneThemeCss, validateSvg } from "../../tools/svg-assets";

/**
 * Count foreground pixels after rendering the exact light or dark declaration used by the SVG.
 * Sharp does not emulate media preferences; browser QA separately verifies inherited color-scheme.
 * @param markup Standalone hand-authored geometry and its build-reviewed theme rule.
 * @param foreground The selected declaration from that exact rule, never a geometry transformation.
 * @param background Opaque comparison surface for the selected theme.
 * @returns Pixels separated from the background by at least 30 RGB levels on one channel.
 */
async function visiblePixels(
  markup: string,
  foreground: string,
  background: number
): Promise<number> {
  const themed = inlineSvg(markup).replace('color="#1f2328"', `color="${foreground}"`);
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
    expect(await visiblePixels(markup, "#1f2328", 255)).toBeGreaterThan(20);
    expect(await visiblePixels(markup, "#f0f6fc", 13)).toBeGreaterThan(20);
    const inline = inlineSvg(markup);
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
