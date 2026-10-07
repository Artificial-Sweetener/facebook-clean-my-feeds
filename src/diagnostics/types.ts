// SPDX-License-Identifier: GPL-3.0-only
import type { HydratedOptions } from "../core/options/types";
import type { Filters } from "../core/filters/types";
import type { PathInfo } from "../core/rules/feed-rules";
import type { Keywords } from "../i18n";
import type { FeedState } from "../feeds/state";
import type { DomState } from "../dom/types";

/** Diagnostics need feed identity and marker names, but never mutable UI or runtime capabilities. */
export type DiagnosticsState = Pick<
  FeedState,
  "isNF" | "isGF" | "isVF" | "isMF" | "isSF" | "isRF" | "isPP" | "gfType" | "vfType" | "mpType"
> &
  Pick<DomState, "hideAtt" | "hideWithNoCaptionAtt" | "cssHideEl" | "cssHideNumberOfShares">;

/** Read-only report inputs captured from the active runtime; collecting them never changes posts. */
export interface BugReportContext {
  state: DiagnosticsState;
  options: HydratedOptions;
  filters: Filters;
  keyWords: Keywords;
  pathInfo: Partial<PathInfo>;
}

/** Match evidence contains only enabled flags or hashes of user-configured blocked text. */
export type MatchEvidence = Record<string, boolean | string>;

/** Numeric diagnostic counters are keyed by selector, signal, or privacy-safe reason. */
export type DiagnosticCounts = Record<string, number>;
