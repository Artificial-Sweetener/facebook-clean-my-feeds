// SPDX-License-Identifier: GPL-3.0-only

import path from "node:path";

import ts from "typescript";

import { projectRoot } from "../optimize-icons";
import type { Violation } from "./types";

/**
 * Enforce strict compiler flags and source inclusion after TypeScript resolves config inheritance.
 * @param files - Complete inventory, including files not imported by an executable entry.
 * @returns Failures for weakened checks, ambient-global leakage, or uncovered source files.
 */
export function configurationProblems(files: string[]): Violation[] {
  const problems: Violation[] = [];
  for (const scope of ["browser", "core", "tools", "tests"]) {
    const file = `tsconfig.${scope}.json`;
    const result = ts.readConfigFile(path.join(projectRoot, file), ts.sys.readFile);
    if (result.error) {
      problems.push({
        rule: "type-coverage",
        file,
        detail: "Cannot read TypeScript scope configuration",
      });
      continue;
    }
    const parsed = ts.parseJsonConfigFileContent(result.config, ts.sys, projectRoot);
    problems.push(...compilerPolicyProblems(parsed.options, file));
    for (const error of parsed.errors) {
      problems.push({
        rule: "type-coverage",
        file,
        detail: ts.flattenDiagnosticMessageText(error.messageText, " "),
      });
    }
    if (scope === "browser" || scope === "core") {
      if (parsed.options.types?.length !== 0)
        problems.push({
          rule: "type-coverage",
          file,
          detail: "Browser and pure scopes require explicit empty ambient types",
        });
    }
    if (scope === "core" && parsed.options.lib?.some((library) => /dom/i.test(library))) {
      problems.push({
        rule: "type-coverage",
        file,
        detail: "Pure core must not receive DOM globals",
      });
    }
    const covered = new Set(
      parsed.fileNames.map((name) => path.relative(projectRoot, name).replaceAll(path.sep, "/"))
    );
    const expected = files.filter(
      (name) =>
        name.endsWith(".ts") &&
        ((scope === "browser" && name.startsWith("src/")) ||
          (scope === "core" && /src\/(?:core|i18n|selectors)\//.test(name)) ||
          (scope === "tools" && name.startsWith("tools/")) ||
          (scope === "tests" && name.startsWith("tests/")))
    );
    for (const source of expected) {
      if (!covered.has(source))
        problems.push({ rule: "type-coverage", file, detail: `Uncovered source: ${source}` });
    }
  }
  return problems;
}

/**
 * Reject strict-family overrides that weaken checking even when the umbrella strict flag stays true.
 * @param options Fully resolved compiler options after inherited configs and overrides are applied.
 * @param file Config path reported to the maintainer when a policy invariant is weakened.
 * @returns Precise violations, allowing undefined strict-family settings to inherit strict=true.
 */
export function compilerPolicyProblems(options: ts.CompilerOptions, file: string): Violation[] {
  const problems: Violation[] = [];
  for (const flag of [
    "strict",
    "noEmit",
    "noUncheckedIndexedAccess",
    "exactOptionalPropertyTypes",
  ] as const) {
    if (options[flag] !== true)
      problems.push({ rule: "type-coverage", file, detail: `${flag} must remain enabled` });
  }
  for (const flag of [
    "noImplicitAny",
    "noImplicitThis",
    "strictNullChecks",
    "strictFunctionTypes",
    "strictBindCallApply",
    "strictPropertyInitialization",
    "strictBuiltinIteratorReturn",
    "alwaysStrict",
    "useUnknownInCatchVariables",
  ] as const) {
    if (options[flag] === false)
      problems.push({ rule: "type-coverage", file, detail: `${flag} cannot override strict mode` });
  }
  for (const flag of ["noCheck", "skipLibCheck", "skipDefaultLibCheck"] as const) {
    if (options[flag] === true)
      problems.push({
        rule: "type-coverage",
        file,
        detail: `${flag} cannot bypass declaration or source checking`,
      });
  }
  if (options.allowJs !== false)
    problems.push({ rule: "type-coverage", file, detail: "allowJs must remain false" });
  return problems;
}
