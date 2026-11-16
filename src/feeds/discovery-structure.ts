// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { sharedSelectors } from "../selectors/shared";
import { newsSelectors } from "../selectors/news";

/** Independent discovery surfaces keep group and event settings separate without interpreting heading copy. */
export type DiscoveryKind = "groups" | "events";

/**
 * Require paired cover/title links and two stateless caption actions in one independently owned list card.
 * @param tile One plain list item; nested lists and independently owned content cannot supply its evidence.
 * @param root Feed card or rail section used to share cached ownership and rendering facts.
 * @returns Whether this item has the complete group recommendation structure observed in issue #26.
 */
function isGroupListTile(tile: Element, root: Element): boolean {
  const evidence = getPostEvidence(root);
  if (evidence.select(newsSelectors.discoveryListItems, tile).length) return false;
  const links = evidence
    .select(sharedSelectors.links, tile)
    .filter((link) => ownsPostElement(link, root) && evidence.isRendered(link));
  if (links.length !== 2) return false;
  const paths = links.map((link) => facebookUrl(link)?.pathname.replace(/\/$/, ""));
  const path = paths[0];
  if (
    !path ||
    path !== paths[1] ||
    !/^\/groups\/(?!(?:discover|feed|search|create|joins|categories|notifications|invites|memberships)$)[^/]+$/.test(
      path
    )
  )
    return false;
  const covers = links.filter((link) =>
    evidence.select(sharedSelectors.images, link).some((image) => evidence.isRendered(image))
  );
  if (covers.length !== 1) return false;
  const actions = evidence
    .select(newsSelectors.peopleActions, tile)
    .filter(
      (control) =>
        ownsPostElement(control, root) &&
        evidence.isRendered(control) &&
        !control.matches(`${sharedSelectors.statefulDisclosureControl}, [aria-haspopup]`) &&
        !evidence.select(newsSelectors.discoveryActionMedia, control).length &&
        evidence
          .select(newsSelectors.discoveryCaption, control)
          .some((caption) => !caption.childElementCount)
    );
  return actions.length === 2;
}

/** Exempt metadata only inside an actual discovery tile; unrelated list items remain ownership boundaries. */
function isTileContent(node: Element, root: Element, kind: DiscoveryKind): boolean {
  const carousel = node.closest(newsSelectors.peopleTiles);
  if (carousel && root.contains(carousel)) return true;
  const item = kind === "groups" ? node.closest(newsSelectors.discoveryListItems) : null;
  return !!item && root.contains(item) && isGroupListTile(item, root);
}

/**
 * Identify a discovery shelf using its destination and separate actionable image tiles or paired-action list cards.
 * A discovery link alone cannot identify an authored post, joined-group list, calendar or navigation.
 * @param root Independent feed card or bounded complementary-rail section.
 * @param kind Exact discovery route and tile destination family to require.
 * @returns Whether two independently owned tiles corroborate the explicit discovery destination.
 */
export function hasDiscoveryShelf(root: Element, kind: DiscoveryKind): boolean {
  const evidence = getPostEvidence(root);
  const tileSelector =
    kind === "groups"
      ? `${newsSelectors.peopleTiles}, ${newsSelectors.discoveryListItems}`
      : newsSelectors.peopleTiles;
  if (
    (!root.matches(sharedSelectors.postOwner) && !root.closest(newsSelectors.rightRail)) ||
    root.closest(sharedSelectors.authoredContent) ||
    root.parentElement?.closest(sharedSelectors.postOwner) ||
    root.querySelector(sharedSelectors.postOwner)
  )
    return false;
  if (
    !root.matches(sharedSelectors.postOwner) &&
    evidence
      .select(newsSelectors.railHeadings)
      .filter((heading) => !isTileContent(heading, root, kind) && evidence.isRendered(heading))
      .length !== 1
  )
    return false;
  if (
    evidence
      .select(`${sharedSelectors.authoredContent}, ${sharedSelectors.authorMetadata}`)
      .some((node) => evidence.isRendered(node) && !isTileContent(node, root, kind))
  )
    return false;
  const discovery = evidence.select(sharedSelectors.links).some((link) => {
    const path = facebookUrl(link)?.pathname;
    return (
      (path === `/${kind}/discover/` || path === `/${kind}/discover`) &&
      !link.closest(tileSelector) &&
      ownsPostElement(link, root) &&
      evidence.isRendered(link)
    );
  });
  if (!discovery) return false;
  const lists = new Map<Element, number>();
  const destinations = new Set<string>();
  for (const tile of evidence.select(tileSelector)) {
    if (!ownsPostElement(tile, root) || !evidence.isRendered(tile)) continue;
    if (kind === "groups" && !tile.matches(newsSelectors.peopleTiles)) {
      const list = tile.parentElement;
      if (!list || !isGroupListTile(tile, root)) continue;
      const count = (lists.get(list) || 0) + 1;
      if (count >= 2) return true;
      lists.set(list, count);
      continue;
    }
    const preview = evidence.select(sharedSelectors.links, tile).find((link) => {
      const parts = facebookUrl(link)?.pathname.split("/").filter(Boolean);
      return (
        parts?.length === 2 &&
        parts[0] === kind &&
        /^\d+$/.test(parts[1] || "") &&
        link.closest(newsSelectors.peopleTiles) === tile &&
        ownsPostElement(link, root) &&
        evidence.isRendered(link) &&
        evidence.select(sharedSelectors.images, link).some((image) => evidence.isRendered(image))
      );
    });
    const action = evidence
      .select(newsSelectors.peopleActions, tile)
      .some(
        (control) =>
          control.closest(newsSelectors.peopleTiles) === tile &&
          ownsPostElement(control, root) &&
          evidence.isRendered(control)
      );
    if (preview && action) {
      destinations.add(facebookUrl(preview)?.pathname.replace(/\/$/, "") || "");
      if (destinations.size >= 2) return true;
    }
  }
  return false;
}
