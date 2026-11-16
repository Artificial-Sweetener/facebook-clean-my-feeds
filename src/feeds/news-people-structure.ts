// SPDX-License-Identifier: GPL-3.0-only

import { ownsPostElement } from "../dom/ownership";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";

/**
 * Recognize the standalone friend-discovery carousel without reading its heading or action names.
 * Two independent tiles must each own a suggestion destination, a linked portrait and actions.
 * Ordinary posts containing a recommendation link, nested carousels and incomplete shelves remain
 * available to the localized fallback rather than borrowing evidence from adjacent content.
 * @param post Owning feed card; message/profile metadata outside its tiles disqualifies the structural route.
 * @returns Whether the card contains corroborated friend-discovery tiles independent of visible language.
 */
export function hasPeopleDiscoveryStructure(post: Element): boolean {
  const evidence = getPostEvidence(post);
  if (
    (!post.matches(sharedSelectors.postOwner) && !post.closest(newsSelectors.rightRail)) ||
    post.closest(sharedSelectors.authoredContent) ||
    post.parentElement?.closest(sharedSelectors.postOwner) ||
    post.querySelector(sharedSelectors.postOwner) ||
    evidence
      .select(newsSelectors.peoplePostContent)
      .some(
        (element) => evidence.isRendered(element) && !element.closest(newsSelectors.peopleTiles)
      )
  )
    return false;
  if (
    !post.matches(sharedSelectors.postOwner) &&
    evidence
      .select(newsSelectors.railHeadings)
      .filter(
        (heading) => !heading.closest(newsSelectors.peopleTiles) && evidence.isRendered(heading)
      ).length !== 1
  )
    return false;
  let matchingTiles = 0;
  for (const tile of evidence.select(newsSelectors.peopleTiles)) {
    if (!ownsPostElement(tile, post) || !evidence.isRendered(tile)) continue;
    const links = evidence
      .select(newsSelectors.peopleLinks, tile)
      .filter(
        (link) =>
          /^\/friends\/suggestions\/?$/.test(facebookUrl(link)?.pathname || "") &&
          link.closest(newsSelectors.peopleTiles) === tile &&
          ownsPostElement(link, post)
      );
    if (!links.some((link) => evidence.isRendered(link))) continue;
    // Facebook hides the duplicate portrait link from accessibility while still painting it.
    const portrait = links.some((link) =>
      evidence.select("img", link).some((image) => {
        if (!ownsPostElement(image, post)) return false;
        let ancestor: Element | null = image;
        while (ancestor && ancestor !== post) {
          if (!evidence.isPainted(ancestor)) return false;
          ancestor = ancestor.parentElement;
        }
        return ancestor === post;
      })
    );
    const actions = evidence
      .select(newsSelectors.peopleActions, tile)
      .filter(
        (action) =>
          action.closest(newsSelectors.peopleTiles) === tile &&
          ownsPostElement(action, post) &&
          evidence.isRendered(action) &&
          !action.parentElement?.closest(newsSelectors.peopleActions)
      );
    if (portrait && actions.length >= 2 && ++matchingTiles >= 2) return true;
  }
  return false;
}
