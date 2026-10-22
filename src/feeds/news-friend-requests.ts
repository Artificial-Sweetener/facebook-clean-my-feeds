// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext } from "./types";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";
import { isNewsFeatureCollapsed, reconcileNewsPresentation } from "./news-presentation";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";

/** Accept only Facebook's exact Friends routes, excluding lookalike hosts, paths and query-only mentions. */
function isFriendsDestination(link: Element, requestsOnly = false): boolean {
  const url = facebookUrl(link);
  return (
    !!url &&
    (/^\/friends\/requests\/?$/.test(url.pathname) ||
      (!requestsOnly && /^\/friends\/?$/.test(url.pathname)))
  );
}

/** Concealed, authored and independently nested controls cannot identify the surrounding rail section. */
function isRequestSignal(element: Element, section: Element): boolean {
  return ownsPostElement(element, section) && getPostEvidence(section).isRendered(element);
}

/** Require the destination in the heading's own header row rather than in an unrelated card below it. */
function hasFriendsHeader(section: Element, heading: Element): boolean {
  return Array.from(section.querySelectorAll(newsSelectors.railFriendLinks)).some((link) => {
    if (!isFriendsDestination(link) || !isRequestSignal(link, section)) return false;
    let row: Element | null = link;
    while (row && row !== section) {
      if (
        row.contains(heading) &&
        !Array.from(row.querySelectorAll(newsSelectors.railActions)).some((action) =>
          isRequestSignal(action, section)
        )
      )
        return true;
      row = row.parentElement;
    }
    return false;
  });
}

/** Require a request-list destination and paired actions within one heading-free request card. */
function hasRequestCard(section: Element): boolean {
  return Array.from(section.querySelectorAll(newsSelectors.railRequestLinks)).some((link) => {
    if (!isFriendsDestination(link, true) || !isRequestSignal(link, section)) return false;
    let card = link.parentElement;
    while (card && card !== section) {
      if (
        Array.from(card.querySelectorAll(newsSelectors.railHeadings)).some((heading) =>
          isRequestSignal(heading, section)
        )
      )
        return false;
      if (
        Array.from(card.querySelectorAll(newsSelectors.railActions)).filter((action) =>
          isRequestSignal(action, section)
        ).length >= 2
      )
        return true;
      card = card.parentElement;
    }
    return false;
  });
}

/**
 * Find complete request panels using header destinations and request actions, without reading labels or private identities.
 * Independent headings and authored/post boundaries prevent an ancestor from swallowing another rail section.
 * @returns Minimal section roots within complementary rails; normal navigation and feed posts are excluded.
 */
export function getRightRailFriendRequestPanels(): Element[] {
  const panels = new Set<Element>();
  for (const rail of document.querySelectorAll(newsSelectors.rightRail)) {
    if (rail.closest(newsSelectors.railContentBoundary)) continue;
    if (!getPostEvidence(rail.ownerDocument.documentElement).isRendered(rail)) continue;
    for (const heading of rail.querySelectorAll(newsSelectors.railHeadings)) {
      if (
        heading.closest(`${newsSelectors.railContentBoundary}, ${sharedSelectors.authoredContent}`)
      )
        continue;
      let section = heading.parentElement;
      while (section && section !== rail) {
        if (section.closest('[hidden], [inert], [aria-hidden="true"]')) break;
        if (
          !getPostEvidence(section).isVisible(section) &&
          !isNewsFeatureCollapsed(section, "friendRequests")
        )
          break;
        if (!isRequestSignal(heading, section)) break;
        const boundary = section;
        if (
          Array.from(boundary.querySelectorAll(newsSelectors.railHeadings)).filter((candidate) =>
            isRequestSignal(candidate, boundary)
          ).length !== 1
        )
          break;
        if (section.querySelector(newsSelectors.railContentBoundary)) break;
        if (hasFriendsHeader(section, heading) && hasRequestCard(section)) {
          panels.add(section);
          break;
        }
        section = section.parentElement;
      }
    }
  }
  return Array.from(panels);
}

/** Reconcile current rail panels so recycled, detached or disabled targets release only this feature's presentation. */
export function scrubRightRailFriendRequests(context: FeedContext): void {
  const targets = new Map(
    getRightRailFriendRequestPanels().map((panel) => [panel, ["display"]] as const)
  );
  reconcileNewsPresentation("friendRequests", targets, context.state.hideWithNoCaptionAtt);
}
