// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import { verifyAssets } from "./verify-assets";
import { artifactPath, buildUserscript } from "./build";
import { fingerprint, repositoryFiles } from "./governance/files";
import { moduleReferences } from "./governance/graph";
import { iconDirectory, listIcons, projectRoot } from "./optimize-icons";

/**
 * Validate the installable metadata contract against the reviewed template, including grants and matches.
 * @param code - Built userscript including the metadata header.
 * @param template - Source metadata with release placeholders.
 * @throws If a header directive changes unexpectedly, escapes its template, or references a remote dependency.
 */
export function assertMetadata(code: string, template: string): void {
  const end = code.indexOf("// ==/UserScript==");
  if (!code.startsWith("// ==UserScript==") || end < 0)
    throw new Error("Artifact metadata block is missing");
  const header = code.slice(0, end + "// ==/UserScript==".length);
  const stableTemplate = template
    .trim()
    .split("\n")
    .filter((line) => !/^\/\/ @(?:name|version|icon|icon64)\s/.test(line));
  const stableHeader = header
    .split("\n")
    .filter((line) => !/^\/\/ @(?:name|version|icon|icon64)\s/.test(line));
  if (JSON.stringify(stableTemplate) !== JSON.stringify(stableHeader))
    throw new Error("Artifact metadata permissions or identity drifted from its template");
  if (/\b(?:VERSION|ICON64?)\b/.test(header))
    throw new Error("Unresolved metadata placeholders remain");
  if (/^\/\/ @(?:require|resource)\s/m.test(header))
    throw new Error("External userscript dependencies are forbidden");
  for (const name of ["icon", "icon64"]) {
    if (!new RegExp(`^// @${name}\\s+data:image/png;base64,[A-Za-z0-9+/=]+$`, "m").test(header)) {
      throw new Error(`@${name} must be an embedded PNG`);
    }
  }
}

/**
 * Prove two independently computed builds are identical, self-contained, and do not mutate their inputs.
 * The committed artifact must already equal those bytes; this check never silently repairs it.
 * @throws If source bytes change, metadata drifts, dependencies escape the bundle, or output is stale.
 */
export async function verifyArtifact(): Promise<void> {
  const sources = repositoryFiles().filter((file) => file !== path.basename(artifactPath));
  const before = new Map<string, string>();
  for (const file of sources)
    before.set(file, fingerprint(await fs.readFile(path.join(projectRoot, file))));
  const first = await buildUserscript();
  await verifyAssets(first.code);
  const second = await buildUserscript();
  if (first.code !== second.code)
    throw new Error("Independent cold builds are not byte-for-byte reproducible");
  if (first.code !== (await fs.readFile(artifactPath, "utf8")))
    throw new Error("Tracked userscript is stale; run npm run build and include it in the change");
  assertMetadata(
    first.code,
    await fs.readFile(path.join(projectRoot, "src/entry/metadata.txt"), "utf8")
  );
  const parsed = ts.createSourceFile(
    "artifact.js",
    first.code,
    ts.ScriptTarget.ES2018,
    true,
    ts.ScriptKind.JS
  );
  if (moduleReferences(parsed).length)
    throw new Error("Generated userscript retains external module references");
  if (!/\(\(\) => \{/.test(first.code)) throw new Error("Generated userscript must remain an IIFE");
  for (const output of Object.values(first.metafile.outputs)) {
    if (output.imports.length) throw new Error("Bundle still has external imports");
  }
  for (const input of Object.keys(first.metafile.inputs)) {
    if (!input.startsWith("src/") || !/\.(?:ts|png)$/.test(input))
      throw new Error(`Unexpected runtime dependency: ${input}`);
  }
  for (const [file, hash] of before) {
    if (fingerprint(await fs.readFile(path.join(projectRoot, file))) !== hash)
      throw new Error(`Build mutated source input: ${file}`);
  }
  const icons = await listIcons();
  if (!icons.includes(path.join(iconDirectory, "mop.png")))
    throw new Error("Source icon inventory is incomplete");
  console.log(
    `Artifact verified: SHA-256 ${fingerprint(first.code)}, ${icons.length} unchanged PNGs, no external dependencies, reproducible cold builds.`
  );
}

if (require.main === module) {
  verifyArtifact().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}

/**
 * Keep upstream credit and the full original license in the single-file installable distribution.
 * @param code Final generated userscript, including its inlined legal notices.
 * @param license Exact reviewed Apache license text included in source distribution.
 * @throws Error when bundling strips provenance or omits the required standalone license copy.
 */
export function assertThirdPartyNotices(code: string, license: string): void {
  if (!code.includes("Copyright 2016, Jake Archibald") || !code.includes(license.trim())) {
    throw new Error(
      "The standalone userscript must retain idb-keyval attribution and license text"
    );
  }
}
