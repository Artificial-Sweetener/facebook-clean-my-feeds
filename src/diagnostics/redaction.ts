// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import type { PendingFilters } from "../core/filters/types";
import type { Keywords } from "../i18n";
const BLOCKED_TEXT_OPTION_KEYS = [
  "NF_BLOCKED_TEXT",
  "GF_BLOCKED_TEXT",
  "VF_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT_DESCRIPTION",
  "PP_BLOCKED_TEXT",
];

const BLOCKED_TEXT_FILTER_KEYS = [
  ...BLOCKED_TEXT_OPTION_KEYS,
  "NF_BLOCKED_TEXT_LC",
  "GF_BLOCKED_TEXT_LC",
  "VF_BLOCKED_TEXT_LC",
  "MP_BLOCKED_TEXT_LC",
  "MP_BLOCKED_TEXT_DESCRIPTION_LC",
  "PP_BLOCKED_TEXT_LC",
];

/**
 * Produce a stable diagnostic hash without including the source text.
 * @param value Text to hash; non-string or empty inputs intentionally yield no identifier.
 * @returns An FNV-1a hexadecimal identifier, or an empty string for absent text.
 */
export function hashText(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `fnv1a:${(hash >>> 0).toString(16)}`;
}

/**
 * Limit hashed keyword examples while retaining the original count and truncation signal.
 * @param list Potential keyword list; malformed values are treated as an empty list.
 * @param limit Maximum number of examples to include; counts still describe the full collection.
 * @returns The original count, bounded string hashes, and whether any examples were omitted.
 */
export function summarizeList(list: unknown, limit = 20) {
  if (!Array.isArray(list)) {
    return { count: 0, hashes: [], truncated: false };
  }
  const hashes = list.slice(0, limit).map((value) => hashText(String(value)));
  return {
    count: list.length,
    hashes,
    truncated: list.length > limit,
  };
}

/**
 * Replace user-entered blocked text and remove empty legacy setting keys before serialization.
 * @param options Initialized preferences whose user-entered keyword values must remain private.
 * @returns A shallow copy with blocked text replaced and empty legacy keys removed.
 */
export function redactOptions(options: Options) {
  const redacted: Record<string, unknown> = { ...options };
  for (const key of BLOCKED_TEXT_OPTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(redacted, key)) {
      redacted[key] = "[redacted]";
    }
  }
  Object.keys(redacted).forEach((key) => {
    if (!key || key.trim() === "") {
      delete redacted[key];
    }
  });
  return redacted;
}

/**
 * Replace both raw and case-folded keyword lists while preserving the remaining filter state.
 * @param filters Materialized keyword lists used by the active filtering pass.
 * @returns A shallow copy with every configured keyword list replaced by a redaction label.
 */
export function redactFilters(filters: PendingFilters) {
  const redacted: Record<string, unknown> = { ...filters };
  for (const key of BLOCKED_TEXT_FILTER_KEYS) {
    if (Object.prototype.hasOwnProperty.call(redacted, key)) {
      redacted[key] = "[redacted]";
    }
  }
  return redacted;
}

/**
 * Report bounded hash summaries of each configurable blocked-keyword list.
 * @param filters Materialized keyword lists used by the active filtering pass.
 * @returns One bounded keyword-hash summary for each supported blocked-text filter.
 */
export function summarizeBlockedFilters(filters: PendingFilters) {
  return {
    NF_BLOCKED_TEXT_LC: summarizeList(filters.NF_BLOCKED_TEXT_LC),
    GF_BLOCKED_TEXT_LC: summarizeList(filters.GF_BLOCKED_TEXT_LC),
    VF_BLOCKED_TEXT_LC: summarizeList(filters.VF_BLOCKED_TEXT_LC),
    MP_BLOCKED_TEXT_LC: summarizeList(filters.MP_BLOCKED_TEXT_LC),
    MP_BLOCKED_TEXT_DESCRIPTION_LC: summarizeList(filters.MP_BLOCKED_TEXT_DESCRIPTION_LC),
    PP_BLOCKED_TEXT_LC: summarizeList(filters.PP_BLOCKED_TEXT_LC),
  };
}

/**
 * Allow known product labels to remain readable while excluding arbitrary post-derived text.
 * @param keyWords Current product labels used to identify safe readable reason strings.
 * @returns A set containing fixed diagnostic reasons and string-valued catalog labels.
 */
export function collectSafeReasons(keyWords: Keywords) {
  const safe = new Set([
    "",
    "hidden",
    "Sponsored Content",
    "Survey",
    "Shares",
    "Stories | Reels | Rooms tabs list box",
  ]);
  if (!keyWords || typeof keyWords !== "object") {
    return safe;
  }
  Object.values(keyWords).forEach((value) => {
    if (typeof value === "string") {
      safe.add(value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          safe.add(item);
        }
      });
    }
  });
  return safe;
}

/**
 * Preserve recognized reason labels and hash unrecognized content to avoid exposing post text.
 * @param reason Existing post marker that may contain a private matched keyword.
 * @param safeReasons Known product labels that may be emitted without hashing.
 * @returns A safe product label, hashed unknown reason, or unlabeled sentinel.
 */
export function getSanitizedReason(reason: string, safeReasons: ReadonlySet<string>) {
  if (!reason || reason.trim() === "") {
    return "unlabeled";
  }
  return safeReasons.has(reason) ? reason : `hash:${hashText(reason)}`;
}
