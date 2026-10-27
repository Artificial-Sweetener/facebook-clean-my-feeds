// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../dom/post-evidence";
import { groupsSelectors } from "../selectors/groups";
import { sharedSelectors } from "../selectors/shared";

/**
 * Select concrete timeline posts inside anonymous transport wrappers without promoting quoted posts.
 * An outer post with its own author or message keeps ownership of its nested articles.
 * @param root Active group main column or feed; background and nested feeds remain outside this scan.
 * @param recent Whether the route uses recent-activity siblings instead of a role=feed boundary.
 * @returns Independent post roots in document order, deduplicated across nested selector matches.
 */
export function collectGroupsPosts(root: Element, recent: boolean): Element[] {
  const query = recent ? groupsSelectors.feedQueryRecent : groupsSelectors.feedQueryMultiple;
  const posts = new Set<Element>();
  for (const wrapper of root.querySelectorAll(query)) {
    const enclosingPost = wrapper.parentElement?.closest(
      `${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}`
    );
    if (enclosingPost && root.contains(enclosingPost)) continue;
    if (wrapper.matches(sharedSelectors.postOwner)) {
      posts.add(wrapper);
      continue;
    }
    const evidence = getPostEvidence(wrapper);
    const hasOwnContent = evidence
      .select(`h4, h5, ${sharedSelectors.profileName}, ${sharedSelectors.authoredContent}`)
      .some((signal) => {
        const owner = signal.closest(sharedSelectors.postOwner);
        return (!owner || !wrapper.contains(owner)) && evidence.isRendered(signal);
      });
    const concrete = hasOwnContent
      ? []
      : evidence.select(sharedSelectors.postOwner).filter((post) => {
          const parentOwner = post.parentElement?.closest(sharedSelectors.postOwner);
          const authored = post.parentElement?.closest(sharedSelectors.authoredContent);
          return (
            (!parentOwner || !wrapper.contains(parentOwner)) &&
            (!authored || !wrapper.contains(authored)) &&
            evidence.isRendered(post)
          );
        });
    if (concrete.length) for (const post of concrete) posts.add(post);
    else posts.add(wrapper);
  }
  return Array.from(posts);
}
