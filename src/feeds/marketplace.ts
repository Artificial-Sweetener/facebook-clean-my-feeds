// SPDX-License-Identifier: GPL-3.0-only

import type { Keywords } from "../i18n";
import type { HydratedOptions } from "../core/options/types";
import type { Filters } from "../core/filters/types";
import type { FeedContext, FeedProcessingState } from "./types";
import { findFirstMatch } from "../core/filters/matching";
import { mainColumnAtt, postAtt, postAttMPSkip } from "../dom/attributes";
import {
  ensureDirtyObserver,
  getDirtyToken,
  isElementDirty,
  markElementCleanIfUnchanged,
  markElementDirty,
} from "../dom/dirty-check";
import { mpScanTreeForText } from "../dom/walker";
import { sanitizeReason } from "../dom/hide";
import { marketplaceSelectors } from "../selectors/marketplace";
import {
  collectMarketplaceListings,
  collectMarketplaceSponsoredBoxes,
  revalidateMarketplaceListings,
} from "./marketplace-discovery";

/** Mark a Marketplace box hidden without a caption and optionally add its debug marker. */
function mpHideBox(
  box: Element | null,
  reason: string,
  state: Pick<FeedProcessingState, "hideWithNoCaptionAtt" | "showAtt">,
  options: Pick<HydratedOptions, "VERBOSITY_DEBUG">
) {
  if (!box || !state || !options) {
    return;
  }

  box.setAttribute(state.hideWithNoCaptionAtt, "");
  box.setAttribute(postAtt, sanitizeReason(reason));
  if (options.VERBOSITY_DEBUG) {
    box.setAttribute(state.showAtt, "");
  }
}

/**
 * Remove the /?ref suffix from every matching document anchor, including any later query or fragment text; this is not scoped to the Marketplace root.
 */
function mpStopTrackingDirtIntoMyHouse() {
  const collectionOfLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="/?ref="]');
  for (const trackingLink of collectionOfLinks) {
    trackingLink.href = trackingLink.href.split("/?ref")[0] ?? trackingLink.href;
  }
}

/** Hide sponsored Marketplace boxes unless their stored skip length still matches the current markup. */
function mpHideSponsoredItems(
  root: Element,
  keyWords: Pick<Keywords, "SPONSORED">,
  state: Pick<FeedProcessingState, "hideWithNoCaptionAtt" | "showAtt">,
  options: Pick<HydratedOptions, "VERBOSITY_DEBUG">
) {
  const query = ":scope > div > div > div > div > div > div[style] > span";
  const items = root.querySelectorAll(query);
  for (const item of items) {
    const box = item.parentElement;
    if (!box) continue;
    if (box.hasAttribute(postAttMPSkip)) {
      if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }
    mpHideBox(box, keyWords.SPONSORED, state, options);
  }
}

/**
 * Match configured prices against complete normalized text-node tokens, not substrings; an absent price block or empty configured list produces no match.
 */
function mpGetBlockedPrices(
  elBlockOfText: Element | undefined,
  filters: Pick<Filters, "MP_BLOCKED_TEXT" | "MP_BLOCKED_TEXT_LC">
) {
  if (filters.MP_BLOCKED_TEXT.length > 0) {
    const itemPrices = elBlockOfText ? mpScanTreeForText(elBlockOfText) : [];
    return findFirstMatch(itemPrices, filters.MP_BLOCKED_TEXT_LC);
  }
  return "";
}

/**
 * Join each description block's normalized text separately and try configured substrings in order; the leading price block is skipped by default.
 */
function mpGetBlockedTextDescription(
  collectionBlocksOfText: ArrayLike<Element>,
  filters: Pick<Filters, "MP_BLOCKED_TEXT_DESCRIPTION" | "MP_BLOCKED_TEXT_DESCRIPTION_LC">,
  skipFirstBlock = true
) {
  if (filters.MP_BLOCKED_TEXT_DESCRIPTION.length > 0) {
    const startIndex = skipFirstBlock ? 1 : 0;
    for (let i = startIndex; i < collectionBlocksOfText.length; i += 1) {
      const block = collectionBlocksOfText[i];
      if (!block) continue;
      const descriptionTextList = mpScanTreeForText(block);
      const descriptionText = descriptionTextList.join(" ").toLowerCase();
      const blockedText = findFirstMatch(descriptionText, filters.MP_BLOCKED_TEXT_DESCRIPTION_LC);
      if (blockedText.length > 0) {
        return blockedText;
      }
    }
  }
  return "";
}

/**
 * Combine supported independent Marketplace layouts, then evaluate price matches before description matches.
 * A matching stored HTML-length marker skips the box. A scanned box with text but no match still receives an empty post marker to avoid repeated work.
 * @param root Active listing or item surface; matching cards outside this subtree are untouched.
 * @param filters Original arrays determine whether each filter is enabled; case-folded arrays provide ordered exact price tokens and description substrings.
 * @param keyWords Retained compatibility argument; matched user-entered terms, not translated labels, supply the hiding reason here.
 * @param state Attribute names used to hide a matching box without a caption and optionally expose it in debug mode.
 * @param options VERBOSITY_DEBUG controls only the extra visibility marker; the caller decides whether blocked-text filtering runs.
 */
function mpDoBlockingByBlockedText(
  root: Element,
  filters: Pick<
    Filters,
    | "MP_BLOCKED_TEXT"
    | "MP_BLOCKED_TEXT_DESCRIPTION"
    | "MP_BLOCKED_TEXT_DESCRIPTION_LC"
    | "MP_BLOCKED_TEXT_LC"
  >,
  keyWords: Keywords,
  state: Pick<FeedProcessingState, "hideWithNoCaptionAtt" | "showAtt">,
  options: Pick<HydratedOptions, "VERBOSITY_DEBUG">
) {
  for (const { box, item } of collectMarketplaceListings(root)) {
    if (box.hasAttribute(postAtt)) continue;
    if (box.hasAttribute(postAttMPSkip)) {
      if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }

    const queryTextBlock = ":scope > div > div:nth-of-type(2) > div";
    const blocksOfText = item.querySelectorAll(queryTextBlock);
    if (blocksOfText.length > 0) {
      const blockedTextPrices = mpGetBlockedPrices(blocksOfText[0], filters);
      const blockedTextDescription = mpGetBlockedTextDescription(blocksOfText, filters, true);

      if (blockedTextPrices.length > 0) {
        mpHideBox(box, blockedTextPrices, state, options);
      } else if (blockedTextDescription.length > 0) {
        mpHideBox(box, blockedTextDescription, state, options);
      } else {
        box.setAttribute(postAtt, "");
      }
    }
  }
}

/** Select a supported visible surface without reviving retained hidden dialogs or background roots. */
function findMarketplaceSurface(query: string): Element | null {
  for (const root of document.querySelectorAll(query)) {
    if (!root.closest('[hidden], [inert], [aria-hidden="true"]')) return root;
  }
  return null;
}

/**
 * Resolve the active item dialog before standalone item pages or navigation-adjacent listing columns.
 * Shared scan markers cannot establish route ownership. A clean active dialog never falls through
 * to its background page; new roots and forceProcess invalidate the selected root's dirty token.
 * @param state mpType chooses item-versus-list discovery, forceProcess bypasses cleanliness, and noChangeCounter advances only when no root is returned.
 * @returns The root to scan, or null when all available candidates are unchanged.
 */
function isMarketplaceDirty(
  state: Pick<FeedProcessingState, "mpType" | "forceProcess" | "noChangeCounter">
) {
  const mainColumn =
    state.mpType === "item"
      ? (findMarketplaceSurface(marketplaceSelectors.dialogItem) ??
        findMarketplaceSurface(marketplaceSelectors.mainColumn))
      : findMarketplaceSurface(marketplaceSelectors.mainColumn);
  if (mainColumn) {
    ensureDirtyObserver(mainColumn);
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
      markElementDirty(mainColumn);
    }
    if (state.forceProcess) markElementDirty(mainColumn);
    if (isElementDirty(mainColumn)) return mainColumn;
  }
  state.noChangeCounter += 1;

  return null;
}

/**
 * Clean referral links and filter sponsored or blocked-price/description listings only after locating a dirty Marketplace root.
 * Item pages also inspect sponsored dialog headings; category and search pages use the listing-box selectors.
 * Hiding uses no-caption markers. The original dirty token is acknowledged only if no intervening mutation invalidated it.
 * @param context mpType selects the Marketplace layout; MP options gate each filter, keyword copy labels ads, and state receives the reset idle counter. Null skips the pass.
 * @returns The inspected Marketplace root, or null when no dirty root is available.
 */
function mopMarketplaceFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords } = context;
  if (!state || !options || !filters || !keyWords) {
    return null;
  }

  const mainColumn = isMarketplaceDirty(state);
  if (!mainColumn) {
    return null;
  }
  const mainColumnToken = getDirtyToken(mainColumn);

  mpStopTrackingDirtIntoMyHouse();
  revalidateMarketplaceListings(mainColumn, state);

  if (state.mpType === "marketplace" || state.mpType === "item") {
    if (options.MP_SPONSORED) {
      mpHideSponsoredItems(mainColumn, keyWords, state, options);

      for (const box of collectMarketplaceSponsoredBoxes(mainColumn)) {
        mpHideBox(box, keyWords.SPONSORED, state, options);
      }
    }

    if (options.MP_BLOCKED_ENABLED) {
      mpDoBlockingByBlockedText(mainColumn, filters, keyWords, state, options);
    }
  }

  if (state.mpType === "item") {
    if (options.MP_SPONSORED) {
      const query = `span h2 [href*="/ads/about/"]:not([${postAtt}])`;
      const elLink = mainColumn.querySelector(query);
      if (elLink) {
        const box = elLink.closest("h2")?.closest("span") ?? null;
        mpHideBox(box, keyWords.SPONSORED, state, options);
        elLink.setAttribute(postAtt, keyWords.SPONSORED);
      }
    }
  } else if (state.mpType === "category" || state.mpType === "search") {
    if (options.MP_SPONSORED) {
      mpHideSponsoredItems(mainColumn, keyWords, state, options);
    }
    if (options.MP_BLOCKED_ENABLED) {
      mpDoBlockingByBlockedText(mainColumn, filters, keyWords, state, options);
    }
  }

  if (!mainColumn.hasAttribute(mainColumnAtt)) {
    mainColumn.setAttribute(mainColumnAtt, "1");
  }
  markElementCleanIfUnchanged(mainColumn, mainColumnToken);
  state.noChangeCounter = 0;

  return mainColumn;
}

export { mpGetBlockedPrices, mpGetBlockedTextDescription, mopMarketplaceFeed };
