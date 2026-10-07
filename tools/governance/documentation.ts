// SPDX-License-Identifier: GPL-3.0-only

import ts from "typescript";

import { nonCommentLines } from "./files";
import type { Violation } from "./types";

/** Named declarations retain the node used for adjacent JSDoc and the callable body when one exists. */
interface DocumentedDeclaration {
  node: ts.Node;
  name: string;
  callable?: ts.FunctionLikeDeclaration;
}

/**
 * Identify named contracts while leaving self-evident anonymous callbacks under their enclosing operation.
 * @param node - Syntax under review, including exported contracts and named object operations.
 * @returns The documentation owner and callable body, or undefined for anonymous local expressions.
 */
function declaration(node: ts.Node): DocumentedDeclaration | undefined {
  if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
    return {
      node,
      name: node.name?.text ?? "default declaration",
      ...(ts.isFunctionDeclaration(node) ? { callable: node } : {}),
    };
  }
  if (
    ts.isMethodDeclaration(node) ||
    ts.isGetAccessor(node) ||
    ts.isSetAccessor(node) ||
    ts.isConstructorDeclaration(node)
  ) {
    return { node, name: node.name?.getText() ?? "constructor", callable: node };
  }
  if (ts.isClassExpression(node)) {
    const owner = ts.isVariableDeclaration(node.parent) ? node.parent.parent.parent : node;
    return { node: owner, name: node.name?.text ?? "class expression" };
  }
  if (
    ts.isFunctionExpression(node) &&
    node.name &&
    !ts.isVariableDeclaration(node.parent) &&
    !ts.isPropertyAssignment(node.parent)
  ) {
    return { node, name: node.name.text, callable: node };
  }
  if (
    ts.isPropertyDeclaration(node) &&
    node.initializer &&
    (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) {
    return { node, name: node.name.getText(), callable: node.initializer };
  }
  if (ts.isMethodSignature(node)) return { node, name: node.name.getText() };
  if (
    ts.isPropertyAssignment(node) &&
    (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) {
    return { node, name: node.name.getText(), callable: node.initializer };
  }
  if (
    ts.isVariableDeclaration(node) &&
    node.initializer &&
    (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))
  ) {
    const statement = node.parent.parent;
    return { node: statement, name: node.name.getText(), callable: node.initializer };
  }
  if (
    (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
    node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  ) {
    return { node, name: node.name.text };
  }
  return undefined;
}

/** Extract immediately attached JSDoc using syntax positions rather than matching unrelated preceding comments. */
function documentation(node: ts.Node, source: ts.SourceFile): string {
  const prefix = source.text.slice(node.getFullStart(), node.getStart(source));
  const comments = [...prefix.matchAll(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g)];
  const last = comments.at(-1);
  if (!last || !last[0].startsWith("/**")) return "";
  return prefix.slice((last.index ?? 0) + last[0].length).trim() ? "" : last[0];
}

/** Meaningful prose must add context beyond a camel-case declaration name or a tag-only template. */
function hasSubstance(comment: string, name: string): boolean {
  const prose =
    comment
      .split(/\n\s*\*?\s*@/)[0]
      ?.replace(/\/\*\*|\*\//g, "")
      .replace(/\*/g, " ") ?? "";
  const words = prose.toLowerCase().match(/[a-z][a-z'-]*/g) ?? [];
  const nameWords = new Set(
    name
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .match(/[a-z]+/g) ?? []
  );
  return words.length >= 5 && words.filter((word) => !nameWords.has(word)).length >= 3;
}

/**
 * Require concise semantic documentation for named declarations and fuller contracts for complex callables.
 * @param source - Parsed implementation, tool, declaration, or test file.
 * @returns Missing or shallow documentation and prohibited type-safety escape hatches.
 */
export function documentationProblems(source: ts.SourceFile): Violation[] {
  const problems: Violation[] = [];
  /**
   * Inspect every nested declaration so test helpers and local functions receive the same review.
   * @param node - Current syntax node in the full-file documentation and safety traversal.
   */
  function visit(node: ts.Node): void {
    const declared = declaration(node);
    if (declared) {
      const comment = documentation(declared.node, source);
      const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      const detail = `${declared.name} (line ${line})`;
      if (!hasSubstance(comment, declared.name)) {
        problems.push({
          rule: "documentation",
          file: source.fileName,
          detail: `${detail} needs a useful adjacent JSDoc explaining its contract`,
        });
      } else if (
        declared.callable?.body &&
        nonCommentLines(declared.callable.body.getText(source)) >= 25
      ) {
        for (const parameter of declared.callable.parameters) {
          const name = parameter.name.getText(source);
          if (
            !/@param\b/.test(comment) ||
            (ts.isIdentifier(parameter.name) && !new RegExp(`@param\\s+${name}\\b`).test(comment))
          ) {
            problems.push({
              rule: "documentation",
              file: source.fileName,
              detail: `${detail} needs @param semantics for ${name}`,
            });
          }
        }
        if (containsOwnValueReturn(declared.callable.body) && !/@returns?\b/.test(comment)) {
          problems.push({
            rule: "documentation",
            file: source.fileName,
            detail: `${detail} needs @returns semantics`,
          });
        }
        if (containsOwnThrow(declared.callable.body) && !/@throws\b/.test(comment)) {
          problems.push({
            rule: "documentation",
            file: source.fileName,
            detail: `${detail} needs @throws failure semantics`,
          });
        }
      }
    }
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      problems.push({
        rule: "type-safety",
        file: source.fileName,
        detail: "Explicit any bypasses the strict contract",
      });
    }
    if (isAssertion(node) && isAssertion(unwrapParentheses(node.expression))) {
      problems.push({
        rule: "type-safety",
        file: source.fileName,
        detail: "Double assertions bypass structural validation",
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  const scanner = ts.createScanner(
    ts.ScriptTarget.Latest,
    false,
    ts.LanguageVariant.Standard,
    source.text
  );
  let hasSuppression = false;
  for (let token = scanner.scan(); token !== ts.SyntaxKind.EndOfFileToken; token = scanner.scan()) {
    if (
      (token === ts.SyntaxKind.SingleLineCommentTrivia ||
        token === ts.SyntaxKind.MultiLineCommentTrivia) &&
      /@ts-(?:ignore|nocheck)\b/.test(scanner.getTokenText())
    )
      hasSuppression = true;
  }
  if (hasSuppression) {
    problems.push({
      rule: "type-safety",
      file: source.fileName,
      detail: "TypeScript suppression disables required coverage",
    });
  }
  return problems;
}

/** Check value-return behavior without attributing a nested callback's return to its enclosing operation. */
function containsOwnValueReturn(body: ts.Node): boolean {
  let found = false;
  /** Stop at callable boundaries because their result contracts are independent. */
  function visit(node: ts.Node): void {
    if (node !== body && ts.isFunctionLike(node)) return;
    if (ts.isReturnStatement(node) && node.expression) found = true;
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

/** Identify explicit exception paths without confusing failures raised only inside nested callbacks. */
function containsOwnThrow(body: ts.Node): boolean {
  let found = false;
  /** Restrict this scan to the current callable's own execution body. */
  function visit(node: ts.Node): void {
    if (node !== body && ts.isFunctionLike(node)) return;
    if (ts.isThrowStatement(node)) found = true;
    ts.forEachChild(node, visit);
  }
  visit(body);
  return found;
}

/** Treat angle-bracket and as assertions equivalently so alternate syntax cannot evade validation. */
function isAssertion(node: ts.Node): node is ts.AsExpression | ts.TypeAssertion {
  return ts.isAsExpression(node) || ts.isTypeAssertionExpression(node);
}

/** Remove syntactic grouping without changing the expression whose trust boundary is being checked. */
function unwrapParentheses(node: ts.Node): ts.Node {
  while (ts.isParenthesizedExpression(node)) node = node.expression;
  return node;
}
