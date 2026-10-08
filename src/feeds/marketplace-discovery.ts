// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttMPSkip } from "../dom/attributes";
import { resetPostState } from "../dom/dirty-check";
import type { VisibilityState } from "../dom/types";
import {
  marketplaceListingQueries,
  marketplaceSponsoredHeadingQuery,
  marketplaceSponsoredTileQuery,
} from "../selectors/marketplace";

/** Pair each independently styled listing with its content anchor, never once per matching selector. */
interface MarketplaceListing {
  box: Element;
  item: Element;
}

let listingSignatures = new WeakMap<Element, string>();

/** Collect every supported layout while deduplicating boxes with repeated links or selector matches. */
export function collectMarketplaceListings(root: Element): MarketplaceListing[] {
  const boxes = new Map<Element, Element>();
  for (const query of marketplaceListingQueries) {
    for (const item of root.querySelectorAll(query)) {
      const box = item.closest("div[style]");
      if (box && box !== root && root.contains(box) && !boxes.has(box)) boxes.set(box, item);
    }
  }
  return Array.from(boxes, ([box, item]) => ({ box, item }));
}

/**
 * Invalidate recycled listing markers before sponsorship or text filters run.
 * Full text and destination detect same-length substitutions; owned box attributes are excluded.
 * A saved manual skip survives unchanged content but cannot hide a new listing from re-evaluation.
 * Previously classified descendants that lose listing eligibility are restored as well. Only the
 * WeakMap persists between scans, so removed cards and roots are never strongly retained here.
 * @param root Active Marketplace surface; background pages behind item dialogs are excluded.
 * @param state Owned visibility markers to remove from recycled boxes without changing their content.
 */
export function revalidateMarketplaceListings(
  root: Element,
  state: Pick<VisibilityState, "hideAtt" | "hideWithNoCaptionAtt" | "showAtt">
): void {
  const listings = collectMarketplaceListings(root);
  const currentBoxes = new Set(listings.map(({ box }) => box));
  const markedQuery = [
    postAtt,
    postAttMPSkip,
    state.hideAtt,
    state.hideWithNoCaptionAtt,
    state.showAtt,
  ]
    .map((attribute) => `[${attribute}]`)
    .join(", ");
  for (const box of root.querySelectorAll(markedQuery)) {
    if (!listingSignatures.has(box) || currentBoxes.has(box)) continue;
    resetPostState(box, state);
    box.removeAttribute(postAttMPSkip);
    listingSignatures.delete(box);
  }
  for (const { box, item } of listings) {
    const signature = `${item.getAttribute("href") ?? ""}\u0000${item.textContent ?? ""}`;
    const previous = listingSignatures.get(box);
    if (previous !== undefined && previous !== signature) {
      resetPostState(box, state);
      box.removeAttribute(postAttMPSkip);
    }
    listingSignatures.set(box, signature);
  }
}

/**
 * Find heading-owned sponsored tile runs without borrowing a heading from another page or section.
 * Each heading must directly precede one or more supported tiles. An unrelated sibling ends the
 * run, and nested navigation or listing sections are never promoted to ad containers.
 */
export function collectMarketplaceSponsoredBoxes(root: Element): Element[] {
  const boxes = new Set<Element>();
  for (const link of root.querySelectorAll(marketplaceSponsoredHeadingQuery)) {
    const parent = link.parentElement;
    const heading = parent?.tagName === "OBJECT" ? parent.parentElement : parent;
    if (!heading || heading === root || !root.contains(heading)) continue;
    let tile = heading.nextElementSibling;
    while (tile?.matches("div[style]")) {
      if (!tile.querySelector(marketplaceSponsoredTileQuery)) break;
      boxes.add(heading);
      boxes.add(tile);
      tile = tile.nextElementSibling;
    }
  }
  return Array.from(boxes);
}

/** Release listing identities when the application replaces its processing lifecycle. */
export function clearMarketplaceListingTracking(): void {
  listingSignatures = new WeakMap();
}
