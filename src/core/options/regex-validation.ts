// SPDX-License-Identifier: GPL-3.0-only

import type { Filters } from "../filters/types";
import { buildFilters } from "./build-filters";
import { SEPARATOR } from "./constants";
import type { Options } from "./types";

/** Only feeds whose processors actually implement regex matching participate in validation. */
export type RegexFeed = "NF" | "GF" | "VF" | "PP";
/** A validation issue points to an editable source list rather than a merged destination offset. */
export type RegexSourceField = `${RegexFeed}_BLOCKED_TEXT`;

/** Safe provenance can appear in diagnostics: neither pattern text nor engine errors are retained. */
export interface RegexValidationIssue {
  field: RegexSourceField;
  line: number;
  destination: RegexFeed;
}

/** A rejected candidate carries only source coordinates, never the private expression itself. */
export class InvalidRegexOptionsError extends Error {
  /** Keep user-facing translation at the UI boundary while exposing safe field/line diagnostics. */
  constructor(readonly issues: readonly RegexValidationIssue[]) {
    super("Settings contain invalid regular expressions");
    this.name = "InvalidRegexOptionsError";
  }
}

/** Provenance stays private while a pattern is compiled, then only safe coordinates escape. */
interface EffectiveRule {
  field: RegexSourceField;
  line: number;
  pattern: string;
}

const regexFeeds: readonly RegexFeed[] = ["NF", "GF", "VF", "PP"];
const sharedFeeds = ["NF", "GF", "VF"] as const;

/** Split one enabled, nonempty source exactly as filter construction does, retaining blank tokens. */
function sourceRules(options: Options, source: RegexFeed): EffectiveRule[] {
  if (options[`${source}_BLOCKED_ENABLED`] !== true) return [];
  const field: RegexSourceField = `${source}_BLOCKED_TEXT`;
  const text = options[field] ?? "";
  return text.length
    ? text.split(SEPARATOR).map((pattern, index) => ({ field, line: index + 1, pattern }))
    : [];
}

/** Reproduce own-list-first cross-feed ordering while retaining the original field and line. */
function effectiveRules(options: Options, destination: RegexFeed): EffectiveRule[] {
  if (options[`${destination}_BLOCKED_ENABLED`] !== true) return [];
  const own = sourceRules(options, destination);
  if (destination === "PP") return own;
  const destinationIndex = sharedFeeds.indexOf(destination);
  for (const source of sharedFeeds) {
    if (source !== destination && options[`${source}_BLOCKED_FEED`]?.[destinationIndex] === "1") {
      own.push(...sourceRules(options, source));
    }
  }
  return own;
}

/** Compile with the same flags as the pure matcher without retaining an engine message containing text. */
function isValidExpression(pattern: string): boolean {
  try {
    new RegExp(pattern, "i");
    return true;
  } catch (error: unknown) {
    if (error instanceof SyntaxError) return false;
    throw error;
  }
}

/**
 * Isolate invalid effective rules at a persistence boundary without editing the user's saved text.
 * An invalid source remains available as literal text in literal-mode destinations. Only destinations
 * using regex lose that rule; valid patterns keep their source text, ordering and case-folded peers.
 * Marketplace's inert regex preference is excluded until its matching behavior is explicitly changed.
 * @param options Decoded settings; source arrays contain persisted string scope flags.
 * @returns Fresh safe runtime filters and field/line/feed diagnostics with no raw expressions.
 */
export function resolveRegexFilters(options: Options): {
  filters: Filters;
  issues: RegexValidationIssue[];
} {
  const filters = buildFilters(options);
  const issues: RegexValidationIssue[] = [];
  for (const destination of regexFeeds) {
    if (options[`${destination}_BLOCKED_RE`] !== true) continue;
    const validPatterns: string[] = [];
    for (const rule of effectiveRules(options, destination)) {
      if (isValidExpression(rule.pattern)) validPatterns.push(rule.pattern);
      else issues.push({ field: rule.field, line: rule.line, destination });
    }
    filters[`${destination}_BLOCKED_TEXT`] = validPatterns;
    filters[`${destination}_BLOCKED_TEXT_LC`] = validPatterns.map((pattern) =>
      pattern.toLowerCase()
    );
    filters[`${destination}_BLOCKED_ENABLED`] = validPatterns.length > 0;
  }
  return { filters, issues };
}

/** Return only privacy-safe diagnostics for stored expressions, including cross-feed effective rules. */
export function getRegexValidationIssues(options: Options): RegexValidationIssue[] {
  return resolveRegexFilters(options).issues;
}
