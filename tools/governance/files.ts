// SPDX-License-Identifier: GPL-3.0-only

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import ts from "typescript";

import { projectRoot } from "../optimize-icons";
import type { Inventory, Violation } from "./types";

/** Include tracked and new files while excluding deleted paths and Git-ignored build caches. */
export function repositoryFiles(): string[] {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
      cwd: projectRoot,
      encoding: "utf8",
    }
  );
  return [...new Set(output.split("\0"))]
    .filter((file) => file && fs.existsSync(path.join(projectRoot, file)))
    .sort();
}

/** Read repository-relative content with one shared root so invocation working directories cannot affect checks. */
export function readSource(file: string): string {
  return fs.readFileSync(path.join(projectRoot, file), "utf8");
}

/** Fingerprint complete bytes, including documentation, so edits invalidate earlier exception approval. */
export function fingerprint(content: string | Buffer): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Count source-bearing physical lines with the TypeScript scanner, excluding comments and blank lines.
 * String/template contents still count because data modules also have a maintenance cost.
 * @param source - Full TypeScript source, not a pre-stripped approximation.
 * @returns Number of distinct lines occupied by non-trivia tokens.
 */
export function nonCommentLines(source: string): number {
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    source
  );
  const parsed = ts.createSourceFile("source.ts", source, ts.ScriptTarget.Latest);
  const used = new Set<number>();
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (token >= ts.SyntaxKind.FirstTriviaToken && token <= ts.SyntaxKind.LastTriviaToken) continue;
    const first = parsed.getLineAndCharacterOfPosition(scanner.getTokenPos()).line;
    const last = parsed.getLineAndCharacterOfPosition(
      Math.max(scanner.getTokenPos(), scanner.getTextPos() - 1)
    ).line;
    for (let line = first; line <= last; line += 1) used.add(line);
  }
  return used.size;
}

/**
 * Reject unclassified or multiply classified paths; a new extension cannot escape checks silently.
 * @param files - Complete repository inventory, including source not reachable from the browser entry.
 * @param inventory - Reviewed declarative ownership categories.
 * @returns Violations identifying exact paths that need policy review.
 */
export function inventoryProblems(files: string[], inventory: Inventory): Violation[] {
  return files.flatMap((file) => {
    const matches = inventory.categories.filter((category) =>
      category.patterns.some((pattern) => new RegExp(pattern).test(file))
    );
    return matches.length === 1
      ? []
      : [{ rule: "inventory", file, detail: `Expected one category, found ${matches.length}` }];
  });
}
