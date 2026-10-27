// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttMPSkip } from "../dom/attributes";
import { resetPostState } from "../dom/dirty-check";
import type { PostPresentationState } from "../dom/dirty-check";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { sharedSelectors } from "../selectors/shared";
import { matchesSponsoredLabel } from "../core/filters/disclosure-labels";
import { isSponsoredDisclosure } from "./shared/sponsored";
import {
  marketplaceListingQueries,
  marketplaceSponsoredHeadingQuery,
  marketplaceSponsoredTileQuery,
  marketplaceItemSponsoredHeadingQuery,
  marketplaceLegacySponsoredQuery,
  marketplaceVirtualizedListingQuery,
  marketplaceVirtualizedAnchorQuery,
  marketplaceSelectors,
  marketplaceTextBlockQuery,
  marketplaceVirtualizedTextBlockQuery,
} from "../selectors/marketplace";

/** Pair each independently styled listing with its content anchor, never once per matching selector. */
export interface MarketplaceListing {
  box: Element;
  item: Element;
  textBlocks: Element[];
  visualText: boolean;
}

let listingSignatures = new WeakMap<Element, string>();

/**
 * Combine legacy styled tiles with current independent virtualized cards without class-name dependencies.
 * Current cells require one named Facebook listing destination and separate media/caption regions;
 * authored links and containers owning multiple listings cannot become filtering roots.
 * @param root Active Marketplace column or item dialog, excluding retained background pages.
 * @returns Deduplicated listing roots, content anchors, ordered caption rows and their text-visibility policy.
 */
export function collectMarketplaceListings(root: Element): MarketplaceListing[] {
  const boxes = new Map<Element, MarketplaceListing>();
  for (const query of marketplaceListingQueries) {
    for (const item of root.querySelectorAll(query)) {
      const box = item.closest("div[style]");
      if (box && box !== root && root.contains(box) && !boxes.has(box))
        boxes.set(box, {
          box,
          item,
          textBlocks: Array.from(item.querySelectorAll(marketplaceTextBlockQuery)),
          visualText: false,
        });
    }
  }
  for (const item of root.querySelectorAll(marketplaceVirtualizedListingQuery)) {
    const box = item.closest("[data-virtualized]");
    const url = facebookUrl(item);
    const content =
      item.childElementCount === 1 && item.firstElementChild?.localName === "div"
        ? item.firstElementChild
        : item;
    if (
      !box ||
      box === root ||
      !root.contains(box) ||
      boxes.has(box) ||
      !url ||
      !/^\/marketplace\/(?:np\/)?item\/\d+\/?$/.test(url.pathname) ||
      item.closest(
        `${sharedSelectors.authoredContent}, ${sharedSelectors.postOwner}, article, [role="article"], nav, [role="navigation"]`
      ) ||
      box.querySelectorAll(marketplaceVirtualizedAnchorQuery).length !== 1 ||
      content.childElementCount !== 2 ||
      content.firstElementChild?.localName !== "div" ||
      content.lastElementChild?.localName !== "div"
    )
      continue;
    const textBlocks = Array.from(content.querySelectorAll(marketplaceVirtualizedTextBlockQuery));
    if (textBlocks.length < 2) continue;
    boxes.set(box, { box, item, textBlocks, visualText: true });
  }
  return Array.from(boxes.values());
}

/**
 * Select the current dialog or visible listing column, excluding retained background surfaces.
 * @param item Whether an item-route dialog takes precedence over its background listing column.
 * @returns The active supported surface, or null before Facebook mounts one.
 */
export function getMarketplaceRoot(item = false): Element | null {
  const queries = item
    ? [marketplaceSelectors.dialogItem, marketplaceSelectors.mainColumn]
    : [marketplaceSelectors.mainColumn];
  for (const query of queries) {
    for (const root of document.querySelectorAll(query)) {
      if (!root.closest('[hidden], [inert], [aria-hidden="true"]')) return root;
    }
  }
  return null;
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
export function revalidateMarketplaceListings(root: Element, state: PostPresentationState): void {
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
 * @param root Active listing surface; only rendered, exactly named Facebook disclosures establish headings.
 * @param itemHeadings Include standalone recommendation headings on item routes.
 * @returns Independent ad headings and tiles, including validated legacy inline slots.
 */
export function collectMarketplaceSponsoredBoxes(root: Element, itemHeadings = false): Element[] {
  const boxes = new Set<Element>();
  for (const item of root.querySelectorAll(marketplaceLegacySponsoredQuery)) {
    const box = item.parentElement;
    if (!box) continue;
    const evidence = getPostEvidence(box);
    if (evidence.isRendered(item) && matchesSponsoredLabel(evidence.visibleText(item)))
      boxes.add(box);
  }
  for (const link of root.querySelectorAll(marketplaceSponsoredHeadingQuery)) {
    const parent = link.parentElement;
    const heading = parent?.tagName === "OBJECT" ? parent.parentElement : parent;
    if (
      !heading ||
      heading === root ||
      !root.contains(heading) ||
      !isSponsoredDisclosure(link, heading)
    )
      continue;
    let tile = heading.nextElementSibling;
    while (tile?.matches("div[style]")) {
      if (!tile.querySelector(marketplaceSponsoredTileQuery)) break;
      boxes.add(heading);
      boxes.add(tile);
      tile = tile.nextElementSibling;
    }
  }
  if (itemHeadings) {
    for (const link of root.querySelectorAll(marketplaceItemSponsoredHeadingQuery)) {
      const box = link.closest("h2")?.closest("span");
      if (box && root.contains(box) && isSponsoredDisclosure(link, box)) boxes.add(box);
    }
  }
  return Array.from(boxes);
}

/** Release listing identities when the application replaces its processing lifecycle. */
export function clearMarketplaceListingTracking(): void {
  listingSignatures = new WeakMap();
}
