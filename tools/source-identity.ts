// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

/** Hash source paths and bytes deterministically, excluding timestamps, checkout location and generated artifacts. */
export async function sourceIdentity(root: string): Promise<string> {
  const source = path.join(root, "src");
  const files = (await fs.readdir(source, { recursive: true }))
    .filter((file) => /\.(?:ts|txt|svg)$/.test(file))
    .map((file) => `src/${file.replace(/\\/g, "/")}`);
  files.push(
    "package.json",
    "package-lock.json",
    "tools/build.ts",
    "tools/source-identity.ts",
    "tools/config/eslint.json"
  );
  const digest = createHash("sha256");
  for (const file of files.sort()) {
    digest.update(file);
    digest.update("\0");
    digest.update(await fs.readFile(path.join(root, file)));
    digest.update("\0");
  }
  return `source-sha256:${digest.digest("hex")}`;
}
