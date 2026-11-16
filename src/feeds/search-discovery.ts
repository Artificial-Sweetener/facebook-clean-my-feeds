// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../dom/post-evidence";
import { searchSelectors } from "../selectors/search";
import { sharedSelectors } from "../selectors/shared";

/**
 * Separate search posts from transport wrappers and preserve an authored parent's quoted articles.
 * @param root Active search main column; embedded feeds in comments or posts cannot supply results.
 * @returns Independent concrete or legacy post roots in document order, excluding enclosing wrappers.
 */
export function collectSearchPosts(root: Element): Element[] {
  const posts = new Set<Element>();
  for (const feed of root.querySelectorAll(searchSelectors.feed)) {
    const enclosing = feed.parentElement?.closest(
      `${searchSelectors.feed}, ${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}`
    );
    if (enclosing && root.contains(enclosing)) continue;
    const candidates = new Set([
      ...feed.querySelectorAll(searchSelectors.legacyPosts),
      ...feed.querySelectorAll(sharedSelectors.postOwner),
    ]);
    for (const candidate of candidates) {
      const parent = candidate.parentElement?.closest(
        `${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}`
      );
      if (parent && feed.contains(parent)) continue;
      if (candidate.matches(sharedSelectors.postOwner)) {
        posts.add(candidate);
        continue;
      }
      const evidence = getPostEvidence(candidate);
      const hasOwnContent = evidence
        .select(`${sharedSelectors.authorMetadata}, ${sharedSelectors.authoredContent}`)
        .some((signal) => {
          const owner = signal.closest(sharedSelectors.postOwner);
          return (!owner || !candidate.contains(owner)) && evidence.isRendered(signal);
        });
      if (hasOwnContent || !candidate.querySelector(sharedSelectors.postOwner))
        posts.add(candidate);
    }
  }
  return Array.from(posts)
    .filter((post) => {
      let parent = post.parentElement;
      while (parent && parent !== root) {
        if (posts.has(parent)) return false;
        parent = parent.parentElement;
      }
      return true;
    })
    .sort((left, right) =>
      left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
}
