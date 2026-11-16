// SPDX-License-Identifier: GPL-3.0-only

import { ownsPostElement } from "../dom/ownership";
import { sharedSelectors } from "../selectors/shared";
import { isNewsFeatureRendered } from "./news-presentation";

/**
 * Bound an AI destination to its own navigation entry without consuming neighboring destinations.
 * @param link Already identified AI destination inside the supplied sidebar surface.
 * @param surface Navigation or complementary region that cannot itself become a hide target.
 * @param matchesDestination Recognize sibling links belonging to the same AI feature, such as its creation page.
 * @returns The exclusive list item, its link when the item contains unrelated content, or null
 *     for concealed, authored or independently owned links.
 */
export function getAiSidebarLinkTarget(
  link: Element,
  surface: Element,
  matchesDestination: (candidate: Element) => boolean
): Element | null {
  if (!ownsPostElement(link, surface) || !isNewsFeatureRendered(link, surface, "sidebar"))
    return null;
  const item = link.closest("li");
  if (!item || item === surface || !surface.contains(item)) return link;
  const links = Array.from(item.querySelectorAll(sharedSelectors.links));
  if (links.some((candidate) => !matchesDestination(candidate))) return link;
  if (
    item.querySelector(`${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}`) ||
    Array.from(item.querySelectorAll(sharedSelectors.interactive)).some(
      (control) => !links.some((candidate) => candidate === control || candidate.contains(control))
    )
  )
    return link;
  const walker = item.ownerDocument.createTreeWalker(item, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const textNode = node;
    if (textNode.textContent?.trim() && !links.some((candidate) => candidate.contains(textNode)))
      return link;
  }
  return item;
}
