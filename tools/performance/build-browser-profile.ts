// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "esbuild";

/**
 * Build a self-contained offline profiling page for a separate browser tab/profile.
 * Opening the file needs no network, Facebook login, extension, or userscript-manager storage.
 * @returns Prints the temporary HTML path for manual or browser-tool inspection of JSON results.
 * @throws If bundling or writing the temporary profiling page fails.
 */
async function buildProfile(): Promise<void> {
  const bundle = await build({
    entryPoints: [path.join(__dirname, "browser-entry.ts")],
    bundle: true,
    write: false,
    platform: "browser",
    target: "es2018",
  });
  const script = bundle.outputFiles[0]?.text;
  if (!script) throw new Error("The fixture bundle is empty");
  const file = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), "cmf-feed-profile-")),
    "profile.html"
  );
  fs.writeFileSync(
    file,
    `<!doctype html><meta charset="utf-8"><title>Offline CMF feed profile</title><div role="navigation"></div><div role="main"></div><script>${script.replace(/<\/script/gi, "<\\/script")}</script>`
  );
  console.log(file);
}

void buildProfile().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
