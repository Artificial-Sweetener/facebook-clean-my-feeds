const path = require("path");

const esbuild = require("esbuild");

const { loadBanner } = require("./banner");

const entryPoint = path.join(__dirname, "..", "src", "entry", "userscript.js");
const outFile = path.join(__dirname, "..", "test_clean_my_feeds.user.js");
const banner = loadBanner();

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
