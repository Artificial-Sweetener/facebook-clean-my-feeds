const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const esbuild = require("esbuild");

const { loadBanner } = require("./banner");

const resDir = path.join(__dirname, "..", "src", "res");
const iconCachePath = path.join(__dirname, ".icon-cache.json");
const entryPoint = path.join(__dirname, "..", "src", "entry", "userscript.js");
const outFile = path.join(__dirname, "..", "fb-clean-my-feeds.user.js");
const banner = loadBanner();

function getIconFiles() {
  if (!fs.existsSync(resDir)) {
    return [];
  }

  return fs
    .readdirSync(resDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function hashIcons(files) {
  const hash = crypto.createHash("sha256");
  for (const fileName of files) {
    const filePath = path.join(resDir, fileName);
    hash.update(fileName);
    hash.update(fs.readFileSync(filePath));
  }
  return hash.digest("hex");
}

function loadIconCache() {
  if (!fs.existsSync(iconCachePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(iconCachePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

function saveIconCache(filesHash) {
  const payload = {
    hash: filesHash,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(iconCachePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function maybeOptimizeIcons() {
  const files = getIconFiles();
  if (files.length === 0) {
    return;
  }

  const currentHash = hashIcons(files);
  const cache = loadIconCache();

  if (cache && cache.hash === currentHash) {
    console.log("Icons unchanged. Skipping optimization.");
    return;
  }

  execFileSync(process.execPath, [path.join(__dirname, "optimize-icons.js")], {
    stdio: "inherit",
  });

  const optimizedHash = hashIcons(files);
  saveIconCache(optimizedHash);
}

maybeOptimizeIcons();

esbuild
  .build({
    entryPoints: [entryPoint],
    outfile: outFile,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["es2018"],
    loader: {
      ".png": "dataurl",
    },
    banner: {
      js: banner,
    },
    logLevel: "info",
  })
  .catch(() => process.exit(1));
