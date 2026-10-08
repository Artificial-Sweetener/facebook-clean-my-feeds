/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only
import fs from "node:fs/promises";
import path from "node:path";

import { loadBanner } from "../../tools/banner";
import { fingerprint } from "../../tools/governance/files";
import { iconDirectory, listIcons, optimizeIcon, projectRoot } from "../../tools/optimize-icons";
import { assertMetadata, assertThirdPartyNotices } from "../../tools/verify-artifact";
import { loadSvgIcons } from "../../tools/svg-assets";
import { verifyAssets } from "../../tools/verify-assets";

describe("immutable historical image contract", () => {
  test("prepares all reviewed images without changing any source PNG bytes", async () => {
    const files = await listIcons();
    const before = new Map<string, string>();
    for (const file of files) before.set(file, fingerprint(await fs.readFile(file)));
    const images = await loadSvgIcons();
    const embedded = [...images.values()]
      .map((image, index) => `const icon${index} = ${JSON.stringify(image)};`)
      .join("\n");
    await expect(verifyAssets(embedded)).resolves.toBeUndefined();
    for (const file of files) expect(fingerprint(await fs.readFile(file))).toBe(before.get(file));
  });
  test("rejects invalid output dimensions before decoding input", async () => {
    await expect(optimizeIcon(Buffer.from("invalid"), 0)).rejects.toThrow(
      "Invalid icon target size"
    );
    await expect(optimizeIcon(Buffer.from("invalid"), 2.5)).rejects.toThrow(
      "Invalid icon target size"
    );
  });
  test("detects a reviewed image omitted from the output", async () => {
    await expect(verifyAssets("// no embedded images")).rejects.toThrow("Reviewed SVG is missing");
  });
});

describe("userscript metadata contract", () => {
  let template: string;
  let banner: string;
  beforeAll(async () => {
    template = await fs.readFile(path.join(projectRoot, "src/entry/metadata.txt"), "utf8");
    banner = await loadBanner(await fs.readFile(path.join(iconDirectory, "mop.svg"), "utf8"));
  });
  test("fills the release version and embeds metadata icons", () => {
    expect(() => assertMetadata(banner, template)).not.toThrow();
    expect(banner).not.toContain("VERSION");
    expect(banner).toContain("@license      GPL-3.0-only");
  });
  test("rejects additional grants and external runtime dependencies", () => {
    expect(() =>
      assertMetadata(
        banner.replace("// @noframes", "// @grant        GM.xmlHttpRequest\n// @noframes"),
        template
      )
    ).toThrow("metadata permissions");
    expect(() =>
      assertMetadata(
        banner.replace(
          "// @noframes",
          "// @require      https://example.test/external.js\n// @noframes"
        ),
        template
      )
    ).toThrow();
  });
  test("rejects remote icons and leftover version placeholders", () => {
    expect(() =>
      assertMetadata(
        banner.replace(/\/\/ @icon\s+.*/, "// @icon         https://example.test/icon.png"),
        template
      )
    ).toThrow("embedded static SVG");
    expect(() =>
      assertMetadata(banner.replace(/\/\/ @version\s+.*/, "// @version      VERSION"), template)
    ).toThrow("placeholders");
  });
});

test("standalone userscripts retain upstream credit and a complete original license copy", async () => {
  const license = await fs.readFile(
    path.join(projectRoot, "governance/licenses/Apache-2.0.txt"),
    "utf8"
  );
  const notice = `Copyright 2016, Jake Archibald\n${license}`;
  expect(() => assertThirdPartyNotices(notice, license)).not.toThrow();
  expect(() => assertThirdPartyNotices("Copyright 2016, Jake Archibald", license)).toThrow(
    "license text"
  );
  expect(() => assertThirdPartyNotices(license, license)).toThrow("attribution");
});
