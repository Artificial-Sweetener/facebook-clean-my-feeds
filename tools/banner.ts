// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";

import { projectRoot } from "./optimize-icons";

/**
 * Fill release-only metadata without allowing a malformed package or header to produce an installable file.
 * @param icon - Validated mop SVG; its static geometry is also used by the runtime icon.
 * @returns The complete userscript metadata block, including its terminating newline.
 * @throws If version or metadata delimiters are missing, rather than shipping an unversioned artifact.
 */
export async function loadBanner(icon: string): Promise<string> {
  const packageData: unknown = JSON.parse(
    await fs.readFile(path.join(projectRoot, "package.json"), "utf8")
  );
  if (
    typeof packageData !== "object" ||
    packageData === null ||
    !("version" in packageData) ||
    typeof packageData.version !== "string" ||
    !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(packageData.version)
  ) {
    throw new Error("package.json must contain a release version");
  }
  const template = await fs.readFile(path.join(projectRoot, "src/entry/metadata.txt"), "utf8");
  if (!template.startsWith("// ==UserScript==") || !template.includes("// ==/UserScript==")) {
    throw new Error("Userscript metadata delimiters are missing");
  }
  const iconDataUri = `data:image/svg+xml;base64,${Buffer.from(icon, "utf8").toString("base64")}`;
  return `${template
    .replace(/\/\/ @version\s+.*/, `// @version      ${packageData.version}`)
    .replace(/(\/\/ @name\s+.*?)\s*\(.*?\)/, `$1 (${packageData.version})`)
    .replace(/\/\/ @icon\s+.*/, `// @icon         ${iconDataUri}`)
    .replace(/\/\/ @icon64\s+.*/, `// @icon64       ${iconDataUri}`)
    .trim()}\n`;
}
