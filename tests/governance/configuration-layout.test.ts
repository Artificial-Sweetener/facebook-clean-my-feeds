/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import { execFileSync } from "node:child_process";
import path from "node:path";
import ts from "typescript";

import manifest from "../../package.json";

const projectRoot = path.resolve(__dirname, "../..");

/** Resolve inheritance and source globs from the configuration's directory, matching TypeScript's CLI behavior. */
function parseConfiguration(file: string): ts.ParsedCommandLine {
  const configPath = path.join(projectRoot, file);
  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  expect(loaded.error).toBeUndefined();
  const parsed = ts.parseJsonConfigFileContent(
    loaded.config,
    ts.sys,
    path.dirname(configPath),
    undefined,
    configPath
  );
  expect(parsed.errors).toEqual([]);
  return parsed;
}

describe("configuration discovery and relocated scopes", () => {
  test("editors still discover the shared root configuration from nested source directories", () => {
    const discovered = ts.findConfigFile(path.join(projectRoot, "src/core"), ts.sys.fileExists);
    expect(discovered?.replaceAll("\\", "/")).toBe(
      path.join(projectRoot, "tsconfig.json").replaceAll("\\", "/")
    );
    expect(parseConfiguration("tsconfig.json").fileNames).toContain(
      path.join(projectRoot, "src/entry/userscript.ts").replaceAll(path.sep, "/")
    );
  });

  test.each([
    {
      scope: "browser",
      included: "src/entry/userscript.ts",
      excluded: "tests/governance/contracts.test.ts",
      types: [],
    },
    {
      scope: "core",
      included: "src/core/options/types.ts",
      excluded: "src/dom/types.ts",
      types: [],
    },
    {
      scope: "tools",
      included: "tools/governance/check.ts",
      excluded: "tests/governance/contracts.test.ts",
      types: ["node"],
    },
    {
      scope: "tests",
      included: "tests/governance/contracts.test.ts",
      excluded: "",
      types: ["jest", "node"],
    },
  ])(
    "$scope retains its source and ambient-type boundaries",
    ({ scope, included, excluded, types }) => {
      const parsed = parseConfiguration(`tools/config/tsconfig.${scope}.json`);
      const files = new Set(
        parsed.fileNames.map((file) => path.relative(projectRoot, file).replaceAll(path.sep, "/"))
      );
      expect(files.has(included)).toBe(true);
      if (excluded) expect(files.has(excluded)).toBe(false);
      expect(parsed.options.types).toEqual(types);
      if (scope === "core")
        expect(parsed.options.lib).not.toEqual(expect.arrayContaining(["lib.dom.d.ts"]));
    }
  );

  test("semantic-release discovers the complete package configuration and loads its plugins", () => {
    const output = execFileSync(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `
      import getConfig from "./node_modules/semantic-release/lib/get-config.js";
      const logger = { success: () => {}, log: () => {}, error: () => {}, warn: () => {} };
      const { options } = await getConfig({ cwd: process.cwd(), env: process.env, logger }, {});
      process.stdout.write(JSON.stringify({ branches: options.branches, tagFormat: options.tagFormat, plugins: options.plugins }));
    `,
      ],
      { cwd: projectRoot, encoding: "utf8", timeout: 30000 }
    );
    const discovered: unknown = JSON.parse(output);
    expect(discovered).toEqual(manifest.release);
  });
});
