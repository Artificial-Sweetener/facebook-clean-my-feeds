// SPDX-License-Identifier: GPL-3.0-only
import { getRegexValidationIssues } from "../core/options/regex-validation";
import { newsSelectors } from "../selectors/news";
import {
  getScriptInfo,
  buildSafeLocation,
  getScriptsSample,
  buildFeedSnapshot,
  buildEnvironmentSnapshot,
} from "./serialization";
import { redactOptions, redactFilters, summarizeBlockedFilters } from "./redaction";
import {
  buildFeedDomSnapshot,
  buildSelectorDiagnostics,
  collectReasonCounts,
  buildHiddenCounts,
  collectHiddenSample,
  collectSignalCounts,
} from "./snapshots";
import { buildNewsDiscoveryDiagnostics } from "./collection";
import { buildSamples } from "./samples";
import { buildMatchSummary } from "./matching";
import type { BugReportContext } from "./types";

export type { BugReportContext, DiagnosticsState } from "./types";
export { getSupportUrl } from "./serialization";

/** Serializable report shape inferred from the deliberately bounded collection pipeline. */
export type BugReportData = ReturnType<typeof collectBugReportData>;

/** Complete generated report; text is the formatted JSON representation of data. */
export interface GeneratedBugReport {
  data: BugReportData;
  text: string;
}

/** Missing context is a supported startup state and produces no copyable report text. */
export interface UnavailableBugReport {
  data: { error: string };
  text: string;
}

/** UI consumers need only the serialized text, while tests may inspect the typed snapshot. */
export type BugReportResult = GeneratedBugReport | UnavailableBugReport;

/**
 * Preserve precise snapshot fields for initialized callers.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and formatted JSON, or a startup error with empty text.
 */
export function buildBugReport(context: BugReportContext): GeneratedBugReport;
/**
 * Preserve the historical empty report when the runtime is not available.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and formatted JSON, or a startup error with empty text.
 */
export function buildBugReport(context: null | undefined): UnavailableBugReport;
/**
 * Accept deferred contexts supplied by UI capability implementations.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and formatted JSON, or a startup error with empty text.
 */
export function buildBugReport(context?: BugReportContext | null): BugReportResult;
/**
 * Serialize a fresh read-only snapshot, or retain the startup error contract without context.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and formatted JSON, or a startup error with empty text.
 */
export function buildBugReport(context?: BugReportContext | null): BugReportResult {
  if (!context) {
    return { data: { error: "No context available." }, text: "" };
  }
  const data = collectBugReportData(context);
  return { data, text: JSON.stringify(data, null, 2) };
}

/**
 * Gather privacy-safe diagnostics without mutating page content or runtime state.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The complete structured support snapshot ready for JSON serialization.
 */
function collectBugReportData(context: BugReportContext) {
  const { state, options, filters, keyWords, pathInfo } = context;
  const now = new Date();
  const scriptInfo = getScriptInfo();
  const safeLocation = buildSafeLocation();
  const newsMainColumn = document.querySelector(newsSelectors.mainColumn);
  const samples = buildSamples(context);
  return {
    generatedAt: now.toISOString(),
    script: scriptInfo,
    page: {
      url: safeLocation.url,
      pathname: safeLocation.pathname,
      search: safeLocation.search,
      scriptsSample: getScriptsSample(),
      feedDom: buildFeedDomSnapshot(),
    },
    feed: buildFeedSnapshot(state),
    environment: buildEnvironmentSnapshot(),
    options: redactOptions(options || {}),
    filters: redactFilters(filters || {}),
    blockedFilters: summarizeBlockedFilters(filters || {}),
    regexValidationIssues: getRegexValidationIssues(options || {}),
    pathInfo: pathInfo || {},
    selectors: buildSelectorDiagnostics(state),
    discovery: {
      news: buildNewsDiscoveryDiagnostics(state),
    },
    hidden: {
      reasonCounts: collectReasonCounts(keyWords),
      hiddenElements: buildHiddenCounts(state),
      sample: collectHiddenSample(keyWords),
    },
    signals: {
      page: collectSignalCounts(document),
      newsMain: collectSignalCounts(newsMainColumn),
    },
    samples: { ...samples, summary: buildMatchSummary(samples.samples) },
    notes: {
      redaction: "Post text, names, and IDs are not included. Blocked keywords are hashed.",
    },
  };
}
