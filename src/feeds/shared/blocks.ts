// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence, PostEvidence } from "../../dom/post-evidence";
import { sharedSelectors } from "../../selectors/shared";

/** Reject nested post/message signals so shared media and comments cannot define the parent layout. */
function isOwnedLayoutSignal(element: Element, post: Element): boolean {
  if (!getPostEvidence(post).isRendered(element)) return false;
  const owner = element.closest(sharedSelectors.postOwner);
  const authoredParent = element.parentElement?.closest(sharedSelectors.authoredContent);
  return (
    (!owner || owner === post || !post.contains(owner)) &&
    (!authoredParent || authoredParent === post || !post.contains(authoredParent))
  );
}

/**
 * Locate sibling content blocks from the owning profile/message markers instead of wrapper depth.
 * Facebook inserts hidden preambles around the real layout; those preceding siblings are excluded.
 * @param post Current feed root; collection is read-only and does not rely on class names or IDs.
 * @returns A root-scoped structural selector, or null when semantic evidence is incomplete or nested.
 */
function getSemanticBlocksQuery(post: Element): string | null {
  const profile = getPostEvidence(post)
    .select(sharedSelectors.profileName)
    .find((element) => isOwnedLayoutSignal(element, post));
  const message = getPostEvidence(post)
    .select(sharedSelectors.storyMessage)
    .find((element) => isOwnedLayoutSignal(element, post));
  if (!profile || !message || profile.contains(message) || message.contains(profile)) return null;
  let container = profile.parentElement;
  while (container && container !== post && !container.contains(message))
    container = container.parentElement;
  if (!container || !container.contains(message)) return null;
  const children = Array.from(container.children);
  const headerIndex = children.findIndex((child) => child.contains(profile));
  const messageIndex = children.findIndex((child) => child.contains(message));
  if (headerIndex < 0 || messageIndex <= headerIndex) return null;
  const path: number[] = [];
  let ancestor: Element = container;
  while (ancestor !== post) {
    const parent = ancestor.parentElement;
    if (!parent) return null;
    path.unshift(Array.from(parent.children).indexOf(ancestor) + 1);
    ancestor = parent;
  }
  return `:scope${path.map((index) => ` > :nth-child(${index})`).join("")} > :nth-child(n+${headerIndex + 1})`;
}

const cachedQueries = new WeakMap<PostEvidence, string>();

/**
 * Prefer owned semantic blocks, otherwise retain the two legacy depths; collection never mutates posts.
 */
function getNewsBlocksQuery(post: Element) {
  const evidence = getPostEvidence(post);
  const cached = cachedQueries.get(evidence);
  if (cached) return cached;
  const semanticQuery = getSemanticBlocksQuery(post);
  if (semanticQuery) {
    cachedQueries.set(evidence, semanticQuery);
    return semanticQuery;
  }
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  const blocks = evidence.select(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
  }
  cachedQueries.set(evidence, blocksQuery);
  return blocksQuery;
}

/**
 * Resolve owned group content semantically when available, retaining the two legacy wrapper families otherwise.
 */
function getGroupsBlocksQuery(post: Element) {
  return getNewsBlocksQuery(post);
}

export { getNewsBlocksQuery, getGroupsBlocksQuery };
