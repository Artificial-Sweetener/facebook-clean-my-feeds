// SPDX-License-Identifier: GPL-3.0-only

import {
  mainColumnAtt,
  postAtt,
  postAttCPID,
  postAttMPSkip,
  postAttTab,
  postAttChildFlag,
} from "../dom/attributes";
import { toggleHiddenElements } from "../dom/hide";
import type { FeedProcessingState } from "./types";
import { restoreNewsPresentation } from "./news-presentation";
import { restoreReelsPresentation } from "./reels-presentation";
import { clearMarketplaceListingTracking } from "./marketplace-discovery";

/** Only feed progress and visibility markers are needed to invalidate a saved-options pass. */
export type FeedResetState = Pick<
  FeedProcessingState,
  | "isAF"
  | "scanCountStart"
  | "scanCountMaxLoop"
  | "options"
  | "echoEl"
  | "echoCount"
  | "echoCPID"
  | "hideAtt"
  | "hideWithNoCaptionAtt"
  | "cssHideEl"
  | "cssHideNumberOfShares"
  | "showAtt"
>;

/**
 * Remove stale filter presentation after saved options change while preserving post contents.
 * All roots are invalidated and debug visibility is synchronized even outside supported feeds.
 * Active feeds additionally unwrap captions, clear owned markers, and renew the dusting budget.
 * @param state Current shared runtime subset; scan counters are advanced in place by 100 passes.
 * @returns Whether the application should immediately rerun the active feed processors.
 */
export function resetFeedProcessing(state: FeedResetState): boolean {
  for (const element of document.querySelectorAll(`[${mainColumnAtt}]`)) {
    element.removeAttribute(mainColumnAtt);
  }
  toggleHiddenElements(state, state.options);
  if (!state.isAF) {
    restoreNewsPresentation();
    restoreReelsPresentation();
    clearMarketplaceListingTracking();
    return false;
  }

  state.scanCountStart += 100;
  state.scanCountMaxLoop += 100;

  restoreFeedPresentation(state);
  return true;
}

/**
 * Restore all CMF-owned filtering markers even after navigation leaves a supported feed.
 * @param state Marker names retained from the lifecycle being disposed; unrelated DOM stays intact.
 */
export function restoreFeedPresentation(state: FeedResetState): void {
  state.echoEl = null;
  state.echoCount = 0;
  state.echoCPID = "";
  restoreNewsPresentation();
  restoreReelsPresentation();
  clearMarketplaceListingTracking();
  for (const element of document.querySelectorAll(`[${mainColumnAtt}]`)) {
    element.removeAttribute(mainColumnAtt);
  }
  // A historical Marketplace size marker cannot remain valid after options or lifecycle changes.
  for (const element of document.querySelectorAll(`[${postAttMPSkip}]`)) {
    element.removeAttribute(postAttMPSkip);
  }
  for (const element of document.querySelectorAll(`details[${postAtt}]`)) {
    const parent = element.parentElement;
    if (!parent) continue;
    const content = element.lastElementChild;
    if (content?.tagName === "DIV") parent.appendChild(content);
    parent.removeChild(element);
  }

  for (const caption of document.querySelectorAll(`h6[${postAttTab}]`)) {
    caption.remove();
  }

  const visibilityAttributes = [
    state.hideAtt,
    state.hideWithNoCaptionAtt,
    state.cssHideEl,
    state.cssHideNumberOfShares,
    state.showAtt,
  ];
  for (const element of document.querySelectorAll(`[${postAtt}]`)) {
    element.removeAttribute(postAtt);
    for (const attribute of visibilityAttributes) element.removeAttribute(attribute);
  }

  for (const element of document.querySelectorAll(`[${postAttCPID}], [${postAttChildFlag}]`)) {
    element.removeAttribute(postAttCPID);
    element.removeAttribute(postAttChildFlag);
  }

  const hiddenQuery = [
    state.hideAtt,
    state.hideWithNoCaptionAtt,
    state.cssHideEl,
    state.cssHideNumberOfShares,
  ]
    .map((attribute) => `[${attribute}]`)
    .join(", ");
  for (const element of document.querySelectorAll(hiddenQuery)) {
    for (const attribute of visibilityAttributes) element.removeAttribute(attribute);
  }
}
