// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import { JSDOM } from "jsdom";

import { iconDirectory } from "./optimize-icons";

/** The only admitted stylesheet colors a standalone image and is removed before inline embedding. */
export const standaloneThemeCss =
  ":root{color:#1f2328}@media(prefers-color-scheme:dark){:root{color:#f0f6fc}}";

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
 * The grammar deliberately excludes links, arbitrary stylesheets, filters, scripts, foreign content,
 * IDs and references. One exact root-color media rule is allowed for standalone images; the
 * inline build removes that rule so multiple instances cannot affect the surrounding page.
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
    if (root.querySelectorAll("style").length > 1) {
      throw new Error(`Duplicate standalone SVG theme: ${filename}`);
    }
    for (const element of [root, ...root.querySelectorAll("*")]) {
      if (element.localName === "style") {
        if (
          element.namespaceURI !== root.namespaceURI ||
          element.parentElement !== root ||
          element.attributes.length !== 0 ||
          element.children.length !== 0 ||
          element.textContent !== standaloneThemeCss
        ) {
          throw new Error(`Unsupported SVG stylesheet in ${filename}`);
        }
        continue;
      }
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
 * Remove the one allowlisted standalone theme before artwork is placed inside a host document.
 * @param markup Repository SVG source; validation is repeated at this HTML-boundary operation.
 * @returns Decorative markup with geometry retained verbatim and no host-root stylesheet.
 * @throws If SVG is outside the static contract or any stylesheet survives removal.
 */
export function inlineSvg(markup: string): string {
  const source = validateSvg(markup, "inline SVG");
  const inline = source.replace(/<style\s*>[\s\S]*?<\/style\s*>/g, "");
  if (/<style\b|:root/.test(inline))
    throw new Error("Standalone SVG theme survived inline stripping");
  return inline;
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
