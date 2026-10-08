// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import assetContract from "../governance/asset-contract.json";
import { fingerprint } from "./governance/files";
import { optimizedIcons } from "./optimize-icons";

/**
 * Prove in-memory optimization preserves the reviewed historical decoded pixels and immutable artwork.
 * @param code - Actual output whose embedded PNGs must include each reviewed optimized asset.
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
    if (!code.includes(`data:image/png;base64,${optimized.toString("base64")}`)) {
      throw new Error(`Optimized PNG is missing from the userscript: ${name}`);
    }
  }
}
