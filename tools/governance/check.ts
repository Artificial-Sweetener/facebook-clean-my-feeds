// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

import policyData from "../../governance/policy.json";
import exceptionData from "../../governance/exceptions.json";
import provenanceData from "../../governance/third-party.json";
import inventoryData from "../../governance/source-inventory.json";
import { projectRoot } from "../optimize-icons";
import { configurationProblems } from "./configuration";
import { documentationProblems } from "./documentation";
import { coversViolation, exceptionProblems } from "./exceptions";
import {
  fingerprint,
  inventoryProblems,
  nonCommentLines,
  readSource,
  repositoryFiles,
} from "./files";
import { findCycles, inspectGraph } from "./graph";
import type { Policy, ReviewedException, Violation } from "./types";

const policy: Policy = policyData;
const exceptions: ReviewedException[] = exceptionData.exceptions;

/**
 * Inspect license declarations and generated-file ownership independently of runtime reachability.
 * @param files - All reviewed repository paths, including metadata, tools and configuration.
 * @returns Exact policy mismatches that must be corrected before a release can run.
 */
function contractProblems(files: string[]): Violation[] {
  const problems: Violation[] = [];
  const packageData: unknown = JSON.parse(readSource("package.json"));
  if (
    typeof packageData !== "object" ||
    packageData === null ||
    !("license" in packageData) ||
    packageData.license !== policy.license
  ) {
    problems.push({
      rule: "license",
      file: "package.json",
      detail: `License must be ${policy.license}`,
    });
  }
  if (
    inventoryData.license !== policy.license ||
    !readSource("src/entry/metadata.txt").includes(`@license      ${policy.license};`)
  ) {
    problems.push({
      rule: "license",
      file: "src/entry/metadata.txt",
      detail: "Metadata and inventory must agree on GPL-3.0-only",
    });
  }
  if (!readSource("LICENSE").includes("Version 3, 29 June 2007")) {
    problems.push({
      rule: "license",
      file: "LICENSE",
      detail: "The GPL v3 license text is required",
    });
  }
  for (const component of provenanceData.components) {
    const source = readSource(component.source);
    const license = readSource(component.licenseFile);
    if (
      !source.includes(component.originalCopyright) ||
      !source.includes("Apache License, Version 2.0") ||
      fingerprint(license) !== component.licenseSha256
    ) {
      problems.push({
        rule: "license",
        file: component.source,
        detail: "Original upstream attribution and exact reviewed license must remain present",
      });
    }
  }
  for (const file of files) {
    if (/\.(?:c|m)?jsx?$/.test(file) && file !== policy.generatedJavaScript) {
      problems.push({
        rule: "source-language",
        file,
        detail: "Only the generated userscript may be checked-in JavaScript",
      });
    }
    if (file.startsWith("docs/"))
      problems.push({
        rule: "documentation-location",
        file,
        detail: "Keep project documentation in the approved root documents",
      });
  }
  return problems;
}

/**
 * Apply only live exact-content approvals and reject stale entries instead of silently retaining waivers.
 * @param problems - Findings before exception filtering.
 * @returns Remaining violations plus invalid or unused exception entries.
 */
function applyExceptions(problems: Violation[]): Violation[] {
  const invalid: Violation[] = [];
  const valid: ReviewedException[] = [];
  const seen = new Set<string>();
  for (const entry of exceptions) {
    const key = `${entry.rule}:${entry.file}`;
    const absolute = path.join(projectRoot, entry.file);
    const hash = fs.existsSync(absolute) ? fingerprint(fs.readFileSync(absolute)) : "missing";
    const reasons = exceptionProblems(entry, hash, policy);
    if (seen.has(key)) reasons.push("Duplicate rule/file approval");
    seen.add(key);
    if (!problems.some((problem) => coversViolation(entry, problem)))
      reasons.push("Approval is unused or its cap has been exceeded");
    if (reasons.length)
      invalid.push({
        rule: "exception",
        file: "governance/exceptions.json",
        detail: `${key}: ${reasons.join("; ")}`,
      });
    else valid.push(entry);
  }
  return [
    ...problems.filter((problem) => !valid.some((entry) => coversViolation(entry, problem))),
    ...invalid,
  ];
}

/**
 * Run the full inventory, dependency, size, contract and documentation gate without changing files.
 * @returns Structured violations for both command-line reporting and regression tests.
 */
export function checkGovernance(): Violation[] {
  const files = repositoryFiles();
  const problems = [
    ...inventoryProblems(files, inventoryData),
    ...contractProblems(files),
    ...configurationProblems(files),
  ];
  const { graph, problems: graphProblems } = inspectGraph(files, policy.layers);
  problems.push(...graphProblems);
  for (const cycle of findCycles(graph)) {
    problems.push({ rule: "cycle", file: cycle[0] ?? "src", detail: cycle.join(" -> ") });
  }
  for (const file of files.filter((name) => name.endsWith(".ts"))) {
    const content = readSource(file);
    if (!/^\/\/ SPDX-License-Identifier: GPL-3\.0-only$/m.test(content)) {
      problems.push({
        rule: "license",
        file,
        detail: "Authored TypeScript requires an explicit GPL-3.0-only SPDX header",
      });
    }
    const lines = nonCommentLines(content);
    if (lines > policy.maximumLines) {
      problems.push({
        rule: "size",
        file,
        detail: `${lines} non-comment lines exceed ${policy.maximumLines}`,
        lines,
      });
    } else if (lines > policy.warningLines) {
      console.warn(
        `Review warning: ${file} has ${lines} non-comment lines (target <=${policy.warningLines}).`
      );
    }
    problems.push(
      ...documentationProblems(ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true))
    );
  }
  return applyExceptions(problems);
}

if (require.main === module) {
  const problems = checkGovernance();
  if (problems.length) {
    console.error(
      problems.map((problem) => `[${problem.rule}] ${problem.file}: ${problem.detail}`).join("\n")
    );
    process.exitCode = 1;
  } else {
    console.log(
      "Governance passed: complete source inventory, GPL-3.0-only, strict ownership, no cycles, documented contracts and reviewed size limits."
    );
  }
}
