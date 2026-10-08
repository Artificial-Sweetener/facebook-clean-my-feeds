// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";

import { iconDirectory } from "./optimize-icons";

const shapeNames = new Set([
  "svg",
  "g",
  "path",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "rect",
]);
const attributeNames = new Set([
  "xmlns",
  "viewBox",
  "fill",
  "fill-rule",
  "clip-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "stroke-dashoffset",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "color",
  "d",
  "points",
  "transform",
  "x",
  "y",
  "x1",
  "y1",
  "x2",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "width",
  "height",
]);
const paintNames = new Set(["fill", "stroke", "color"]);
const paintPattern = /^(?:none|currentColor|#[\da-fA-F]{3,8})$/;

/**
 * Accept only inert, self-contained SVG geometry before trusted artwork reaches an HTML sink.
 * This is a build-time contract, not a sanitizer for arbitrary downloaded or user-provided SVG.
 * The grammar deliberately excludes links, stylesheets, filters, scripts, foreign content,
 * IDs and references, so multiple instances cannot collide or access the surrounding page.
 *
 * @param markup Hand-authored UTF-8 source, never generated from raster pixels.
 * @param filename Source name used only in actionable build diagnostics.
 * @returns The same artwork with surrounding whitespace removed; geometry is never rewritten.
 * @throws If XML is malformed or includes anything beyond the reviewed static shape contract.
 */
export function validateSvg(markup: string, filename: string): string {
  const source = markup.trim();
  if (/<!|<\?|&/.test(source)) throw new Error(`Unsupported SVG XML content: ${filename}`);
  const window = new JSDOM(source, { contentType: "image/svg+xml" }).window;
  try {
    const document = window.document;
    const root = document.documentElement;
    if (
      root.localName !== "svg" ||
      root.namespaceURI !== "http://www.w3.org/2000/svg" ||
      root.getAttribute("viewBox") !== "0 0 64 64"
    ) {
      throw new Error(`SVG must use the reviewed 64px canvas: ${filename}`);
    }
    for (const element of [root, ...root.querySelectorAll("*")]) {
      if (
        !shapeNames.has(element.localName) ||
        element.namespaceURI !== root.namespaceURI ||
        (element !== root && element.localName === "svg")
      ) {
        throw new Error(`Unsupported SVG element in ${filename}: ${element.localName}`);
      }
      for (const attribute of element.attributes) {
        if (
          !attributeNames.has(attribute.name) ||
          /url\s*\(|[<>;]/i.test(attribute.value) ||
          (paintNames.has(attribute.name) && !paintPattern.test(attribute.value))
        ) {
          throw new Error(`Unsupported SVG attribute in ${filename}: ${attribute.name}`);
        }
      }
      for (const child of element.childNodes) {
        if (child.nodeType === 3 && child.textContent?.trim()) {
          throw new Error(`SVG artwork may not contain text: ${filename}`);
        }
      }
    }
    return source;
  } finally {
    window.close();
  }
}

/**
 * Load every reviewed SVG in stable order, validating inert markup without changing artwork.
 * @returns Absolute source paths mapped to safe, hand-authored SVG text.
 * @throws If an asset is unreadable, malformed or outside the static shape contract.
 */
export async function loadSvgIcons(): Promise<Map<string, string>> {
  const filenames = (await fs.readdir(iconDirectory))
    .filter((name) => name.endsWith(".svg"))
    .sort();
  const icons = new Map<string, string>();
  for (const filename of filenames) {
    const absolute = path.join(iconDirectory, filename);
    icons.set(absolute, validateSvg(await fs.readFile(absolute, "utf8"), filename));
  }
  return icons;
}
