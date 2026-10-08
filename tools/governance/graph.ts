// SPDX-License-Identifier: GPL-3.0-only

import path from "node:path";

import ts from "typescript";

import { readSource } from "./files";
import type { Layer, Violation } from "./types";

/** A complete dependency graph retains type-only edges because architectural ownership also applies to contracts. */
export type DependencyGraph = Map<string, Set<string>>;

/** Select the first matching layer; narrow reviewed patterns intentionally precede general utility patterns. */
export function layerFor(file: string, layers: Layer[]): Layer | undefined {
  return layers.find((layer) => layer.patterns.some((pattern) => new RegExp(pattern).test(file)));
}

/**
 * Collect literal module references from import/export, import types, require, and dynamic import AST nodes.
 * @param source - Parsed source whose syntax determines edges, independent of comments or string contents.
 * @returns Module specifiers plus a marker for nonliteral dynamic imports that cannot be statically reviewed.
 */
export function moduleReferences(source: ts.SourceFile): string[] {
  const references: string[] = [];
  /** Visit syntax recursively so nested import expressions cannot bypass the boundary check. */
  function visit(node: ts.Node): void {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      if (ts.isStringLiteralLike(node.moduleSpecifier)) references.push(node.moduleSpecifier.text);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      if (ts.isStringLiteralLike(node.argument.literal))
        references.push(node.argument.literal.text);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      const expression = node.moduleReference.expression;
      if (expression && ts.isStringLiteralLike(expression)) references.push(expression.text);
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === "require"))
    ) {
      const argument = node.arguments[0];
      references.push(argument && ts.isStringLiteralLike(argument) ? argument.text : "<dynamic>");
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return references;
}

/** Resolve extensionless and JavaScript-spelled TypeScript imports against the complete source inventory. */
function resolveModule(from: string, reference: string, files: Set<string>): string | undefined {
  const normalized = path.posix.normalize(path.posix.join(path.posix.dirname(from), reference));
  const stem = normalized.replace(/\.(?:js|mjs|cjs)$/, "");
  return [normalized, `${stem}.ts`, `${stem}.d.ts`, `${stem}/index.ts`].find((file) =>
    files.has(file)
  );
}

/**
 * Enforce source ownership and construct a graph, including modules not reachable from the userscript entry.
 * @param files - Full repository inventory; non-source assets can resolve but do not acquire code edges.
 * @param layers - Explicit architectural allow-list shared with contributor documentation.
 * @returns Dependency evidence and exact import violations.
 */
export function inspectGraph(
  files: string[],
  layers: Layer[]
): { graph: DependencyGraph; problems: Violation[] } {
  const allFiles = new Set(files);
  const graph: DependencyGraph = new Map();
  const problems: Violation[] = [];
  for (const file of files.filter((name) => name.startsWith("src/") && name.endsWith(".ts"))) {
    const owner = layerFor(file, layers);
    if (!owner)
      problems.push({
        rule: "boundary",
        file,
        detail: "Source has no declared architectural layer",
      });
    const source = ts.createSourceFile(file, readSource(file), ts.ScriptTarget.Latest, true);
    const edges = new Set<string>();
    graph.set(file, edges);
    for (const reference of moduleReferences(source)) {
      if (!reference.startsWith(".")) {
        problems.push({
          rule: "boundary",
          file,
          detail: `Browser source cannot depend on external module ${reference}`,
        });
        continue;
      }
      const target = resolveModule(file, reference, allFiles);
      if (!target) {
        problems.push({ rule: "boundary", file, detail: `Cannot resolve ${reference}` });
        continue;
      }
      edges.add(target);
      const dependency = layerFor(target, layers);
      if (!owner || !dependency || !owner.allows.includes(dependency.name)) {
        problems.push({
          rule: "boundary",
          file,
          detail: `${owner?.name ?? "unknown"} must not import ${dependency?.name ?? "unknown"}: ${target}`,
        });
      }
    }
  }
  return { graph, problems };
}

/**
 * Return directed cycles using depth-first active-path tracking; type-only cycles are also reported.
 * @param graph - Complete source dependency graph, not merely entry-reachable nodes.
 * @returns One concrete path per encountered back edge, ending at its starting module.
 */
export function findCycles(graph: DependencyGraph): string[][] {
  const visited = new Set<string>();
  const active = new Set<string>();
  const stack: string[] = [];
  const cycles: string[][] = [];
  /** Preserve the active stack until every dependency is visited so back edges expose their complete cycle. */
  function visit(file: string): void {
    if (active.has(file)) {
      cycles.push([...stack.slice(stack.indexOf(file)), file]);
      return;
    }
    if (visited.has(file)) return;
    visited.add(file);
    active.add(file);
    stack.push(file);
    for (const target of graph.get(file) ?? []) visit(target);
    stack.pop();
    active.delete(file);
  }
  for (const file of graph.keys()) visit(file);
  return cycles;
}
