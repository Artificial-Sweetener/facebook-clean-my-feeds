// SPDX-License-Identifier: GPL-3.0-only

import type { Options, HydratedOptions } from "../core/options/types";
import type { Filters } from "../core/filters/types";
import type { PathInfo } from "../core/rules/feed-rules";
import type { Keywords } from "../i18n";
import type { DomState } from "../dom/types";
import type { FeedState } from "./state";

/** DOM fields consumed by feed processors, excluding stylesheets, controls, and dialog state. */
export type FeedDomState = Pick<
  DomState,
  | "hideAtt"
  | "hideWithNoCaptionAtt"
  | "showAtt"
  | "cssHideEl"
  | "cssHideNumberOfShares"
  | "cssHideVerifiedBadge"
  | "echoCount"
  | "echoCPID"
  | "echoEl"
>;

/** Feed-owned scan progress combined with the narrow presentation inputs its processors need. */
export type FeedProcessingState = FeedState &
  FeedDomState & {
    options: Options;
    language: string;
    hideAnInfoBox: boolean;
    iconNewWindow: string;
    iconNewWindowClass: string;
    isChromium: boolean;
  };

/** A hydrated filtering pass receives all dependencies explicitly rather than reaching into runtime or storage. */
export interface FeedContext {
  state: FeedProcessingState;
  options: HydratedOptions;
  filters: Filters;
  keyWords: Keywords;
  pathInfo: PathInfo;
}

/** Feed flags used by the language-independent sponsor detector; absent flags remain false. */
export type SponsoredState = Partial<Pick<FeedState, "isNF" | "isGF" | "isVF" | "isSF">>;

/** Roots may disappear during navigation; each tuple position preserves its page/dialog identity. */
export type DirtyFeedRoots = [Element | null, Element | null];
