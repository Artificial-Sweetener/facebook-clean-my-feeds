// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../core/options/types";
import type { Filters } from "../core/filters/types";
import type { FeedContext, FeedProcessingState } from "./types";
import { findFirstMatch } from "../core/filters/matching";
import { facebookUrl } from "../dom/post-evidence";
import { mainColumnAtt, postAtt, postAttMPSkip } from "../dom/attributes";
import {
  ensureDirtyObserver,
  getDirtyToken,
  isElementDirty,
  markElementCleanIfUnchanged,
  markElementDirty,
  revalidateTrackedPosts,
  resetPostState,
  trackPostSignature,
} from "../dom/dirty-check";
import { mpScanTreeForText } from "../dom/walker";
import { sanitizeReason } from "../dom/hide";
import {
  collectMarketplaceListings,
  collectMarketplaceSponsoredBoxes,
  revalidateMarketplaceListings,
  getMarketplaceRoot,
} from "./marketplace-discovery";

const sponsoredBoxes = new WeakSet<Element>();

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

  if (!box.hasAttribute(state.hideWithNoCaptionAtt))
    box.setAttribute(state.hideWithNoCaptionAtt, "");
  const label = sanitizeReason(reason);
  if (box.getAttribute(postAtt) !== label) box.setAttribute(postAtt, label);
  if (options.VERBOSITY_DEBUG) {
    if (!box.hasAttribute(state.showAtt)) box.setAttribute(state.showAtt, "");
  }
  trackPostSignature(box);
}

/**
 * Remove only Facebook referral parameters in the active surface, preserving video/listing identities and fragments.
 */
function mpStopTrackingDirtIntoMyHouse(root: Element) {
  const collectionOfLinks = root.querySelectorAll<HTMLAnchorElement>("a[href]");
  for (const trackingLink of collectionOfLinks) {
    const url = facebookUrl(trackingLink);
    if (!url?.searchParams.has("ref")) continue;
    const cleaned = new URL(url.href);
    cleaned.searchParams.delete("ref");
    trackingLink.href = cleaned.href;
  }
}

/** Reconcile current ad evidence so unchanged tiles are restored when their external heading disappears. */
function reconcileSponsoredItems(root: Element, context: FeedContext) {
  const { state, options, keyWords } = context;
  const targets = new Set(
    options.MP_SPONSORED ? collectMarketplaceSponsoredBoxes(root, state.mpType === "item") : []
  );
  for (const box of root.querySelectorAll(`[${postAtt}]`)) {
    if (sponsoredBoxes.has(box) && !targets.has(box)) {
      resetPostState(box, state);
      sponsoredBoxes.delete(box);
    }
  }
  for (const box of targets) {
    if (box.hasAttribute(postAttMPSkip)) {
      if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }
    mpHideBox(box, keyWords.SPONSORED, state, options);
    sponsoredBoxes.add(box);
  }
}

/**
 * Match configured prices against complete normalized text-node tokens, not substrings; an absent price block or empty configured list produces no match.
 * @param elBlockOfText First caption row, distinct from description and location rows.
 * @param filters Materialized exact price tokens in user priority order.
 * @param boundary Owning listing used to exclude concealed ancestors.
 * @param visualText Whether this named virtualized card duplicates visible caption text in aria-hidden spans.
 * @returns The first configured matching price token, or an empty string.
 */
function mpGetBlockedPrices(
  elBlockOfText: Element | undefined,
  filters: Pick<Filters, "MP_BLOCKED_TEXT" | "MP_BLOCKED_TEXT_LC">,
  boundary = elBlockOfText,
  visualText = false
) {
  if (filters.MP_BLOCKED_TEXT.length > 0) {
    const itemPrices = elBlockOfText ? mpScanTreeForText(elBlockOfText, boundary, visualText) : [];
    return findFirstMatch(itemPrices, filters.MP_BLOCKED_TEXT_LC);
  }
  return "";
}

/**
 * Join each description block's normalized text separately and try configured substrings in order; the leading price block is skipped by default.
 * @param collectionBlocksOfText Ordered caption rows from production listing discovery.
 * @param filters Materialized description substrings in user priority order.
 * @param skipFirstBlock Exclude the independent price row from description matching.
 * @param boundary Owning listing used to exclude concealed ancestors.
 * @param visualText Whether painted accessibility duplicates belong to a named virtualized card.
 * @returns The first configured matching substring, or an empty string.
 */
function mpGetBlockedTextDescription(
  collectionBlocksOfText: ArrayLike<Element>,
  filters: Pick<Filters, "MP_BLOCKED_TEXT_DESCRIPTION" | "MP_BLOCKED_TEXT_DESCRIPTION_LC">,
  skipFirstBlock = true,
  boundary?: Element,
  visualText = false
) {
  if (filters.MP_BLOCKED_TEXT_DESCRIPTION.length > 0) {
    const startIndex = skipFirstBlock ? 1 : 0;
    for (let i = startIndex; i < collectionBlocksOfText.length; i += 1) {
      const block = collectionBlocksOfText[i];
      if (!block) continue;
      const descriptionTextList = mpScanTreeForText(block, boundary, visualText);
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
  state: Pick<FeedProcessingState, "hideWithNoCaptionAtt" | "showAtt">,
  options: Pick<HydratedOptions, "VERBOSITY_DEBUG">
) {
  for (const { box, textBlocks, visualText } of collectMarketplaceListings(root)) {
    if (box.hasAttribute(postAtt)) continue;
    if (box.hasAttribute(postAttMPSkip)) {
      if (String(box.innerHTML.length) === box.getAttribute(postAttMPSkip)) {
        continue;
      }
    }

    if (textBlocks.length > 0) {
      const blockedTextPrices = mpGetBlockedPrices(textBlocks[0], filters, box, visualText);
      const blockedTextDescription = mpGetBlockedTextDescription(
        textBlocks,
        filters,
        true,
        box,
        visualText
      );

      if (blockedTextPrices.length > 0) {
        mpHideBox(box, blockedTextPrices, state, options);
      } else if (blockedTextDescription.length > 0) {
        mpHideBox(box, blockedTextDescription, state, options);
      } else {
        box.setAttribute(postAtt, "");
      }
      trackPostSignature(box);
    }
  }
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
  const mainColumn = getMarketplaceRoot(state.mpType === "item");
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

  mpStopTrackingDirtIntoMyHouse(mainColumn);
  revalidateTrackedPosts(mainColumn, state);
  revalidateMarketplaceListings(mainColumn, state);

  if (["marketplace", "item", "category", "search"].includes(state.mpType)) {
    reconcileSponsoredItems(mainColumn, context);
    if (options.MP_BLOCKED_ENABLED) {
      mpDoBlockingByBlockedText(mainColumn, filters, state, options);
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
