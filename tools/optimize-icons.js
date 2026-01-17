const fs = require("fs");
const path = require("path");

const sharp = require("sharp");

const DEFAULT_SCALE = 2;
const DEFAULT_MAX_ICON_SIZE_PX = 32;

function parseArgs(argv) {
  const args = argv.slice(2);
  const getArgValue = (flag) => {
    const index = args.indexOf(flag);
    if (index === -1 || index === args.length - 1) {
      return null;
    }
    return args[index + 1];
  };

  return {
    target: getArgValue("--target"),
    scale: getArgValue("--scale"),
    dryRun: args.includes("--dry-run"),
  };
}

function getMaxIconSizeFromStyles(stylesPath) {
  if (!fs.existsSync(stylesPath)) {
    return null;
  }

  const content = fs.readFileSync(stylesPath, "utf8");
  const blocks = content.split("addToSS(").slice(1);
  const sizes = [];

  for (const block of blocks) {
    const endIndex = block.indexOf(");");
    const snippet = endIndex === -1 ? block : block.slice(0, endIndex);
    const selectorMatch = snippet.match(/["']([^"']+)["']/);
    if (!selectorMatch) {
      continue;
    }

    const selector = selectorMatch[1];
    if (!selector.includes("cmf-icon")) {
      continue;
    }

    for (const match of snippet.matchAll(/\b(?:width|height)\s*:\s*(\d+(?:\.\d+)?)px\b/g)) {
      sizes.push(Number.parseFloat(match[1]));
    }
  }

  if (sizes.length === 0) {
    return null;
  }

  return Math.max(...sizes);
}

async function optimizeIcons({ resDir, targetSize, dryRun }) {
  const entries = fs.readdirSync(resDir, { withFileTypes: true });
  const pngFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name);

  if (pngFiles.length === 0) {
    console.log("No PNG files found to optimize.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const fileName of pngFiles) {
    const filePath = path.join(resDir, fileName);
    const inputBuffer = fs.readFileSync(filePath);
    totalBefore += inputBuffer.length;

    const image = sharp(inputBuffer);
    const meta = await image.metadata();

    const resized = image.resize({
      width: targetSize,
      height: targetSize,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: true,
    });

    const outputBuffer = await resized
      .png({
        palette: true,
        quality: 80,
        compressionLevel: 9,
        adaptiveFiltering: true,
      })
      .toBuffer();

    totalAfter += outputBuffer.length;

    if (!dryRun) {
      fs.writeFileSync(filePath, outputBuffer);
    }

    const beforeSize = meta.width && meta.height ? `${meta.width}x${meta.height}` : "unknown";
    const afterMeta = await sharp(outputBuffer).metadata();
    const afterSize =
      afterMeta.width && afterMeta.height ? `${afterMeta.width}x${afterMeta.height}` : "unknown";

    console.log(
      `${fileName}: ${beforeSize} -> ${afterSize} (${(inputBuffer.length / 1024).toFixed(
        1
      )}KB -> ${(outputBuffer.length / 1024).toFixed(1)}KB)`
    );
  }

  const delta = totalBefore - totalAfter;
  const percent = totalBefore > 0 ? ((delta / totalBefore) * 100).toFixed(1) : "0.0";
  console.log(
    `Total: ${(totalBefore / 1024).toFixed(1)}KB -> ${(totalAfter / 1024).toFixed(
      1
    )}KB (${percent}% smaller)`
  );
}

async function main() {
  const { target, scale, dryRun } = parseArgs(process.argv);
  const stylesPath = path.join(__dirname, "..", "src", "dom", "styles.js");
  const resDir = path.join(__dirname, "..", "src", "res");
  const parsedScale = scale ? Number.parseFloat(scale) : DEFAULT_SCALE;
  const maxCssSize = getMaxIconSizeFromStyles(stylesPath) || DEFAULT_MAX_ICON_SIZE_PX;
  const targetSize = target ? Number.parseInt(target, 10) : Math.ceil(maxCssSize * parsedScale);

  if (!Number.isFinite(targetSize) || targetSize <= 0) {
    throw new Error(`Invalid target size: ${targetSize}`);
  }

  console.log(
    `Optimizing icons to ${targetSize}px (max CSS size ${maxCssSize}px, scale ${parsedScale}x).`
  );
  await optimizeIcons({ resDir, targetSize, dryRun });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
