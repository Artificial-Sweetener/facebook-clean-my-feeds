// SPDX-License-Identifier: GPL-3.0-only
import { getRegexValidationIssues } from "../core/options/regex-validation";
import { readPostHistory } from "./post-history";
import { encodeReport } from "./report-encoding";
import { formatReportMarkdown } from "../core/diagnostics/report-markdown";
import { captureDomSnapshot } from "./dom-capture";
import type { SnapshotCaptureOptions } from "./dom-capture";
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
} from "./snapshots";
import { buildNewsDiscoveryDiagnostics } from "./collection";
import { buildSamples } from "./samples";
import { buildMatchSummary } from "./matching";
import type { BugReportContext } from "./types";

export type { BugReportContext, DiagnosticsState } from "./types";
export { getSupportUrl } from "./serialization";

/** Serializable report shape inferred from the deliberately bounded collection pipeline. */
export type BugReportData = Awaited<ReturnType<typeof collectBugReportData>>;

/** Complete generated report; text wraps the automatically redacted encoding in collapsible GitHub Markdown. */
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
 * @returns The report data and collapsible Markdown, or a startup error with empty text.
 */
export function buildBugReport(
  context: BugReportContext,
  capture?: SnapshotCaptureOptions
): Promise<GeneratedBugReport>;
/**
 * Preserve the historical empty report when the runtime is not available.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and collapsible Markdown, or a startup error with empty text.
 */
export function buildBugReport(
  context: null | undefined,
  capture?: SnapshotCaptureOptions
): Promise<UnavailableBugReport>;
/**
 * Accept deferred contexts supplied by UI capability implementations.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and collapsible Markdown, or a startup error with empty text.
 */
export function buildBugReport(
  context?: BugReportContext | null,
  capture?: SnapshotCaptureOptions
): Promise<BugReportResult>;
/**
 * Serialize a fresh read-only snapshot, or retain the startup error contract without context.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns The report data and collapsible Markdown, or a startup error with empty text.
 */
export async function buildBugReport(
  context?: BugReportContext | null,
  capture: SnapshotCaptureOptions = {}
): Promise<BugReportResult> {
  if (!context) {
    return { data: { error: "No context available." }, text: "" };
  }
  const data = await collectBugReportData(context, capture);
  return {
    data,
    text: formatReportMarkdown(
      await encodeReport(data),
      `${context.keyWords.DLG_REPORT_BUG} — CMF ${data.script.version}`
    ),
  };
}

/**
 * Gather privacy-safe diagnostics without mutating page content or runtime state.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @param capture Selected complaint element and bounded independent snapshot settings.
 * @returns The complete structured support snapshot ready for JSON serialization.
 */
async function collectBugReportData(context: BugReportContext, capture: SnapshotCaptureOptions) {
  const { state, options, filters, keyWords, pathInfo } = context;
  const now = new Date();
  const scriptInfo = getScriptInfo();
  const safeLocation = buildSafeLocation();
  const snapshot = await captureDomSnapshot(document, capture);
  const samples = buildSamples(context);
  return {
    schemaVersion: 2,
    history: readPostHistory(),
    generatedAt: now.toISOString(),
    snapshot,
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
    samples: { ...samples, summary: buildMatchSummary(samples.samples) },
    notes: {
      redaction:
        "Authored text and media are removed. Interface labels are automatically sanitized. IDs and classes are report-local aliases; destinations are structural templates.",
      limitations:
        "Unknown text is explicitly redacted. Coverage and attribute transformations qualify offline selector results.",
    },
  };
}
