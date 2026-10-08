// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import * as esbuild from "esbuild";

import { loadBanner } from "./banner";
import { iconDirectory, projectRoot } from "./optimize-icons";

import { inlineSvg, loadSvgIcons } from "./svg-assets";

export const artifactPath = path.join(projectRoot, "fb-clean-my-feeds.user.js");

/** Bundle bytes and dependency evidence are returned together so verification checks the actual output. */
export interface UserscriptBuild {
  code: string;
  metafile: esbuild.Metafile;
}

/**
 * Build one self-contained browser IIFE without changing any repository file.
 * Each invocation validates hand-authored SVG, making cold and repeated builds equivalent.
 *
 * @returns UTF-8 userscript text and esbuild's dependency manifest.
 * @throws If metadata, artwork validation, entry resolution, or bundling fails.
 */
export async function buildUserscript(): Promise<UserscriptBuild> {
  const icons = await loadSvgIcons();
  const mop = icons.get(path.join(iconDirectory, "mop.svg"));
  if (!mop) throw new Error("The metadata mop icon is missing");
  const result = await esbuild.build({
    absWorkingDir: projectRoot,
    entryPoints: ["src/entry/userscript.ts"],
    outfile: artifactPath,
    bundle: true,
    write: false,
    metafile: true,
    format: "iife",
    platform: "browser",
    target: ["es2018"],
    charset: "utf8",
    legalComments: "inline",
    banner: { js: await loadBanner(mop) },
    footer: {
      js: `/*! Third-party license: idb-keyval, Copyright 2016, Jake Archibald\n${await fs.readFile(path.join(projectRoot, "governance/licenses/Apache-2.0.txt"), "utf8")}*/`,
    },
    plugins: [
      {
        name: "reviewed-static-svg",
        /** Embed only validated owned shapes; no browser parsing of untrusted artwork is allowed. */
        setup(build) {
          build.onLoad({ filter: /\.svg$/ }, (args) => {
            const contents = icons.get(args.path);
            if (!contents)
              throw new Error(`SVG is outside the reviewed asset directory: ${args.path}`);
            return { contents: inlineSvg(contents), loader: "text" };
          });
        },
      },
    ],
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (!output || !result.metafile) throw new Error("esbuild did not return a complete artifact");
  return { code: output.text, metafile: result.metafile };
}

/** Publish only the final userscript after all in-memory build steps have succeeded. */
async function main(): Promise<void> {
  const { code } = await buildUserscript();
  await fs.writeFile(artifactPath, code);
  console.log(`Built ${path.basename(artifactPath)} (${Buffer.byteLength(code)} bytes)`);
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
