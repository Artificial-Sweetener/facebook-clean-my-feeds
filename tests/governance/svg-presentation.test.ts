/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import sharp from "sharp";
import { loadSvgIcons } from "../../tools/svg-assets";

/**
 * Count pixels visibly separated from an opaque preview background after actual SVG rendering.
 * @param markup Standalone source, without runtime CSS or any replacement of its default color.
 * @param background Neutral channel value, testing white and a representative dark surface.
 * @returns Number of pixels with at least 30 levels of RGB contrast on one channel.
 */
async function visiblePixels(markup: string, background: number): Promise<number> {
  const { data, info } = await sharp(Buffer.from(markup))
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

test("every standalone documentation/manager icon remains visible on light and dark surfaces", async () => {
  const icons = await loadSvgIcons();
  expect(icons.size).toBe(17);
  for (const markup of icons.values()) {
    expect(await visiblePixels(markup, 255)).toBeGreaterThan(20);
    expect(await visiblePixels(markup, 36)).toBeGreaterThan(20);
    expect(markup).toContain('color="#6b7280"');
    expect(markup).toContain("currentColor");
  }
});
