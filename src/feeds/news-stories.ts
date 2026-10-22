// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";

/**
 * Recognize an independent story carousel by owned preview cards, regardless of labels or tracking parameters.
 * Authored posts, nested owners and creation trays cannot contribute evidence to an inline shelf.
 * @param post Candidate feed unit inspected without modifying its nodes or reading private captions.
 * @returns Whether Facebook story previews occupy at least two separate horizontal cards in a standalone feed carousel.
 */
export function isNewsStoryShelf(post: Element): boolean {
  if (
    !post.matches(`${newsSelectors.virtualizedContainer}, ${newsSelectors.standardPost}`) ||
    post.closest(sharedSelectors.authoredContent) ||
    post.parentElement?.closest(newsSelectors.standardPost) ||
    post.querySelector(newsSelectors.standardPost)
  )
    return false;
  const evidence = getPostEvidence(post);
  if (
    evidence
      .select(
        `${sharedSelectors.profileName}, ${sharedSelectors.storyMessage}, ${sharedSelectors.authoredContent}`
      )
      .some((content) => {
        if (!evidence.isRendered(content)) return false;
        const card = content.closest(newsSelectors.storyShelfItems);
        return !card || !post.contains(card);
      })
  )
    return false;
  if (
    evidence.select(newsSelectors.storyShelfAuthors).some((author) => {
      const url = facebookUrl(author);
      return (
        evidence.isRendered(author) &&
        !author.closest(newsSelectors.storyShelfItems) &&
        (!url || !url.pathname.startsWith("/stories/"))
      );
    })
  )
    return false;
  const cards = new Set<Element>();
  for (const link of evidence.select('a[href*="/stories/"]')) {
    const url = facebookUrl(link);
    if (!url) continue;
    if (/^\/stories\/create\/?$/.test(url.pathname)) return false;
    if (!/^\/stories\/[^/]+(?:\/[^/]+)?\/?$/.test(url.pathname)) continue;
    const card = link.closest(newsSelectors.storyShelfItems);
    if (
      !card ||
      !post.contains(card) ||
      !ownsPostElement(link, post) ||
      !evidence.isRendered(link) ||
      !link.querySelector(newsSelectors.storyShelfMedia)
    )
      continue;
    cards.add(card);
  }
  return cards.size >= 2;
}

/**
 * Add article-less story shelves occurring after independent feed posts; the initial stories tray stays outside post processing.
 * @param posts Ordinary roots from the existing concrete or fallback discovery pass, in document order.
 * @returns Distinct virtualized story shelves outside those roots and below an earlier independent post in the same main surface.
 */
export function getInlineNewsStoryShelves(posts: readonly Element[]): Element[] {
  if (!posts.length) return [];
  const candidates = new Set<Element>();
  for (const link of document.querySelectorAll(newsSelectors.storyShelfCandidates)) {
    const shelf = link.closest(newsSelectors.virtualizedContainer);
    if (shelf) candidates.add(shelf);
  }
  return Array.from(candidates).filter((shelf) => {
    if (posts.some((post) => post === shelf || post.contains(shelf) || shelf.contains(post)))
      return false;
    const main = shelf.closest('[role="main"]');
    return (
      posts.some(
        (post) =>
          post.closest('[role="main"]') === main &&
          Boolean(post.compareDocumentPosition(shelf) & Node.DOCUMENT_POSITION_FOLLOWING)
      ) && isNewsStoryShelf(shelf)
    );
  });
}
