// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";
import ts from "typescript";

import assetContract from "../governance/asset-contract.json";
import { fingerprint } from "./governance/files";
import { inlineSvg, loadSvgIcons } from "./svg-assets";
import { optimizedIcons } from "./optimize-icons";

/**
 * Preserve original PNG references and require every hand-authored SVG in the actual artifact.
 * @param code Actual output whose static string literals must contain all reviewed SVG geometry.
 * @throws If source artwork, decoded dimensions/pixels, asset inventory, or bundle embedding drifts.
 */
export async function verifyAssets(code: string): Promise<void> {
  const icons = await optimizedIcons();
  const expectedNames = Object.keys(assetContract.images).sort();
  const actualNames = [...icons.keys()].map((name) => path.basename(name)).sort();
  if (JSON.stringify(expectedNames) !== JSON.stringify(actualNames)) {
    throw new Error("PNG inventory changed; review the asset contract");
  }
  for (const [name, expected] of Object.entries(assetContract.images)) {
    const entry = [...icons].find(([filename]) => path.basename(filename) === name);
    if (!entry) throw new Error(`Reviewed PNG is missing: ${name}`);
    const [filename, optimized] = entry;
    if (fingerprint(await fs.readFile(filename)) !== expected.sourceSha256) {
      throw new Error(`Original artwork changed: ${name}; review the asset contract`);
    }
    const { data, info } = await sharp(optimized)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (
      info.width !== expected.width ||
      info.height !== expected.height ||
      fingerprint(data) !== expected.rgbaSha256
    ) {
      throw new Error(`Optimized pixels differ from the pre-port userscript: ${name}`);
    }
  }
  const svgs = await loadSvgIcons();
  const expectedSvgNames = expectedNames.map((name) => name.replace(/\.png$/, ".svg"));
  if (
    JSON.stringify([...svgs.keys()].map((name) => path.basename(name)).sort()) !==
    JSON.stringify(expectedSvgNames)
  ) {
    throw new Error("Every original PNG must have exactly one manually authored SVG counterpart");
  }
  const literals = new Set<string>();
  const parsed = ts.createSourceFile(
    "artifact.js",
    code,
    ts.ScriptTarget.ES2018,
    true,
    ts.ScriptKind.JS
  );
  /** Inspect syntax rather than quote style because esbuild may select single or double quotes. */
  function visit(node: ts.Node): void {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
      literals.add(node.text);
    ts.forEachChild(node, visit);
  }
  visit(parsed);
  for (const [filename, svg] of svgs) {
    if (!literals.has(inlineSvg(svg)))
      throw new Error(`Reviewed SVG is missing from the userscript: ${path.basename(filename)}`);
  }
  if (/data:image\/png/.test(code))
    throw new Error("Runtime and metadata icons must use SVG, not embedded PNG");
}
