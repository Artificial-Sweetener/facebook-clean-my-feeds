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

/** Summarize private keyword configuration without disclosing guessable hashes or examples. */
export function summarizeList(list: unknown) {
  return { count: Array.isArray(list) ? list.length : 0 };
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
 * Report counts of each configurable private keyword list.
 * @param filters Materialized keyword lists used by the active filtering pass.
 * @returns One count summary for each supported blocked-text filter.
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
 * Preserve recognized reason labels and redact unrecognized content to avoid exposing post text.
 * @param reason Existing post marker that may contain a private matched keyword.
 * @param safeReasons Known product labels that may be emitted without redaction.
 * @returns A safe product label, redacted unknown reason, or unlabeled sentinel.
 */
export function getSanitizedReason(reason: string, safeReasons: ReadonlySet<string>) {
  if (!reason || reason.trim() === "") {
    return "unlabeled";
  }
  return safeReasons.has(reason) ? reason : "private-reason";
}
