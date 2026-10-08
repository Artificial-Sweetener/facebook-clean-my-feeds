// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

export const projectRoot = path.resolve(__dirname, "..");
export const iconDirectory = path.join(projectRoot, "src", "res");
const defaultTargetSize = 64;

/**
 * Prepare the same compact PNG pixels used by the historical build without touching source assets.
 *
 * @param input - Original PNG bytes; callers retain ownership and may reuse them.
 * @param targetSize - Square output canvas in pixels, normally twice the largest 32px CSS icon.
 * @returns Encoded palette PNG with transparent letterboxing and no image enlargement.
 * @throws If the target is invalid or the input cannot be decoded by sharp.
 */
export async function optimizeIcon(input: Buffer, targetSize = defaultTargetSize): Promise<Buffer> {
  if (!Number.isInteger(targetSize) || targetSize <= 0) {
    throw new Error(`Invalid icon target size: ${targetSize}`);
  }
  return sharp(input)
    .resize({
      width: targetSize,
      height: targetSize,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    })
    .png({ palette: true, quality: 80, compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
}

/** Return PNG paths in stable order so image work and diagnostic output are reproducible. */
export async function listIcons(): Promise<string[]> {
  const entries = await fs.readdir(iconDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => path.join(iconDirectory, entry.name))
    .sort();
}

/**
 * Compute all bundle-ready images in memory; neither a warm cache nor writable source files is needed.
 * @returns A map keyed by absolute source filename, suitable for esbuild's PNG loader.
 */
export async function optimizedIcons(targetSize = defaultTargetSize): Promise<Map<string, Buffer>> {
  const images = new Map<string, Buffer>();
  for (const filename of await listIcons()) {
    images.set(filename, await optimizeIcon(await fs.readFile(filename), targetSize));
  }
  return images;
}

/**
 * Print potential bundle savings without changing original artwork.
 * @throws If an unknown option or malformed size would silently change the optimization contract.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  let targetSize = defaultTargetSize;
  for (let index = 0; index < args.length; index += 1) {
    const option = args[index];
    if (option === "--target") {
      const value = args[++index];
      if (value === undefined || !/^\d+$/.test(value)) {
        throw new Error("--target requires a positive integer pixel size");
      }
      targetSize = Number(value);
    } else if (option !== "--dry-run") {
      throw new Error(`Unknown option: ${option ?? ""}; use --target PIXELS or --dry-run`);
    }
  }
  let before = 0;
  let after = 0;
  for (const [filename, buffer] of await optimizedIcons(targetSize)) {
    const originalSize = (await fs.stat(filename)).size;
    before += originalSize;
    after += buffer.length;
    console.log(`${path.basename(filename)}: ${originalSize} -> ${buffer.length} bytes`);
  }
  console.log(`Bundle PNGs: ${before} -> ${after} bytes. Source PNGs are unchanged.`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
