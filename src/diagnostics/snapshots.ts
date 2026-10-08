// SPDX-License-Identifier: GPL-3.0-only
import { postAtt } from "../dom/attributes";
import { newsSelectors } from "../selectors/news";
import { groupsSelectors } from "../selectors/groups";
import { videosSelectors } from "../selectors/videos";
import { marketplaceSelectors } from "../selectors/marketplace";
import { profileSelectors } from "../selectors/profile";
import { searchSelectors } from "../selectors/search";
import { collectSafeReasons, getSanitizedReason } from "./redaction";
import { buildDomSignature } from "./collection";
import type { Keywords } from "../i18n";
import type { DiagnosticsState } from "./types";
import type { DiagnosticCounts } from "./types";

/**
 * Count fixed product labels across descendants without retaining any surrounding page text.
 * @param root Root to inspect; a missing root returns zero counts without throwing.
 * @returns Counts for each fixed product signal, including zeroes for absent signals.
 */
export function collectSignalCounts(root: ParentNode | null = document) {
  const signals = [
    "Sponsored",
    "Suggested",
    "Follow",
    "Reels",
    "Stories",
    "People you may know",
    "Paid partnership",
    "Try Meta AI",
    "Events you may like",
  ];
  const counts: DiagnosticCounts = {};
  for (const signal of signals) {
    counts[signal] = 0;
  }
  if (!root || typeof root.querySelectorAll !== "function") {
    return counts;
  }
  const spans = Array.from(root.querySelectorAll("span[dir], span, div")).filter(
    (el) => typeof el.textContent === "string" && el.textContent.trim() !== ""
  );
  for (const el of spans) {
    const text = el.textContent ?? "";
    for (const signal of signals) {
      if (text.includes(signal)) {
        counts[signal] = (counts[signal] ?? 0) + 1;
      }
    }
  }
  return counts;
}

/**
 * Aggregate processed-post markers using only recognized labels or hashed private reasons.
 * @param keyWords Current product labels used to identify safe readable reason strings.
 * @returns Occurrence counts keyed by privacy-safe hidden-post reasons.
 */
export function collectReasonCounts(keyWords: Keywords) {
  const safeReasons = collectSafeReasons(keyWords);
  const counts: DiagnosticCounts = {};
  const nodes = document.querySelectorAll(`[${postAtt}]`);
  nodes.forEach((node) => {
    const reason = node.getAttribute(postAtt) || "";
    const key = getSanitizedReason(reason, safeReasons);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

/**
 * Collect bounded structural examples of processed posts without copying their content.
 * @param keyWords Current product labels used to identify safe readable reason strings.
 * @param limit Maximum number of examples to include; counts still describe the full collection.
 * @returns Bounded reason labels and structural signatures in document order.
 */
export function collectHiddenSample(keyWords: Keywords, limit = 3) {
  const sample = [];
  const safeReasons = collectSafeReasons(keyWords);
  const nodes = document.querySelectorAll(`[${postAtt}]`);
  for (const node of nodes) {
    if (sample.length >= limit) {
      break;
    }
    const reason = node.getAttribute(postAtt) || "";
    sample.push({
      reason: getSanitizedReason(reason, safeReasons),
      signature: buildDomSignature(node),
    });
  }
  return sample;
}

/**
 * Measure all requested selectors so diagnostics can reveal changes in Facebook layouts.
 * @param selectors Production selectors to evaluate in the current document.
 * @returns Each selector alongside its current match count.
 */
export function countSelectorMatches(selectors: readonly string[]) {
  return selectors.map((query) => ({
    query,
    count: document.querySelectorAll(query).length,
  }));
}

/**
 * Measure all supported feed layouts, including inactive ones, to aid selector troubleshooting.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @returns Per-feed selector counts and the active video subtype.
 */
export function buildSelectorDiagnostics(state: DiagnosticsState) {
  return {
    news: {
      mainColumn: document.querySelectorAll(newsSelectors.mainColumn).length,
      dialog: document.querySelectorAll(newsSelectors.dialog).length,
      postQueries: countSelectorMatches(newsSelectors.postQueries),
    },
    groups: {
      mainColumn: document.querySelectorAll(groupsSelectors.mainColumn).length,
      dialog: document.querySelectorAll(groupsSelectors.dialog).length,
      groupPageMainColumn: document.querySelectorAll(groupsSelectors.groupPageMainColumn).length,
      feedQueries: countSelectorMatches([
        groupsSelectors.feedQueryRecent,
        groupsSelectors.feedQueryMultiple,
        groupsSelectors.feedQuerySingle,
      ]),
    },
    videos: {
      mainColumn: document.querySelectorAll(videosSelectors.mainColumn).length,
      dialog: document.querySelectorAll(videosSelectors.dialog).length,
      feedQueries: countSelectorMatches(Object.values(videosSelectors.feedQueries)),
      vfType: state.vfType || "",
    },
    marketplace: {
      mainColumn: document.querySelectorAll(marketplaceSelectors.mainColumn).length,
      dialogItem: document.querySelectorAll(marketplaceSelectors.dialogItem).length,
    },
    search: {
      mainColumn: document.querySelectorAll(searchSelectors.mainColumn).length,
      postsQuery: document.querySelectorAll(searchSelectors.postsQuery).length,
    },
    profile: {
      mainColumn: document.querySelectorAll(profileSelectors.mainColumn).length,
      postsQuery: document.querySelectorAll(profileSelectors.postsQuery).length,
    },
  };
}

/**
 * Count existing hide markers without revealing or mutating their associated content.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @returns Counts for existing hidden containers, rows, blocks, and share markers.
 */
export function buildHiddenCounts(state: DiagnosticsState) {
  if (!state) {
    return {};
  }
  return {
    hiddenContainers: document.querySelectorAll(`[${state.hideAtt}]`).length,
    hiddenNoCaptionRows: document.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`).length,
    hiddenBlocks: document.querySelectorAll(`[${state.cssHideEl}]`).length,
    hiddenShares: document.querySelectorAll(`[${state.cssHideNumberOfShares}]`).length,
  };
}

/**
 * Capture feed roots and pagelet labels without serializing post content or user identifiers.
 * @returns Feed-root structure, counts, and bounded pagelet labels.
 */
export function buildFeedDomSnapshot() {
  const feedNodes = Array.from(document.querySelectorAll('[role="feed"]'));
  const pageletSample = Array.from(document.querySelectorAll('[role="feed"] [data-pagelet]'))
    .slice(0, 5)
    .map((el) => el.getAttribute("data-pagelet"));
  const mainNode = document.querySelector('div[role="main"]');
  const feedRoot = feedNodes[0] || null;
  const feedRootParent = feedRoot && feedRoot.parentElement ? feedRoot.parentElement : null;
  const mainRootParent = mainNode && mainNode.parentElement ? mainNode.parentElement : null;
  return {
    feedCount: feedNodes.length,
    pageletSample,
    mainCount: document.querySelectorAll('div[role="main"]').length,
    feedRoot: buildDomSignature(feedRoot),
    feedRootParent: buildDomSignature(feedRootParent),
    mainRoot: buildDomSignature(mainNode),
    mainRootParent: buildDomSignature(mainRootParent),
  };
}
