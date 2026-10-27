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
 * Locate owned header and message/media siblings even when wrapper depths or text-message markers change.
 * @param post Feed root whose own profile and content signals establish boundaries independently of hidden preambles.
 * @returns Rendered header-first blocks, or null when no ordered owned signal pair establishes a reliable layout.
 */
function getSemanticBlocks(post: Element): Element[] | null {
  const evidence = getPostEvidence(post);
  const profile = evidence
    .select(sharedSelectors.profileName)
    .find((element) => isOwnedLayoutSignal(element, post));
  if (!profile) return null;
  const message = evidence
    .select(sharedSelectors.storyMessage)
    .find((element) => isOwnedLayoutSignal(element, post));
  const contents = message
    ? [message]
    : evidence
        .select("img, video")
        .filter(
          (media) =>
            isOwnedLayoutSignal(media, post) &&
            !media.closest(
              'h4, h5, button, [role="button"], [data-ad-rendering-role="profile_name"]'
            )
        );
  for (const content of contents) {
    const blocks = semanticBlocks(post, profile, content);
    if (blocks) return blocks;
  }
  return null;
}

/** Resolve only following content siblings; an author avatar before the name cannot establish the message boundary. */
function semanticBlocks(post: Element, profile: Element, message: Element): Element[] | null {
  if (profile.contains(message) || message.contains(profile)) return null;
  let container = profile.parentElement;
  while (container && container !== post && !container.contains(message))
    container = container.parentElement;
  if (!container || !container.contains(message)) return null;
  const children = Array.from(container.children);
  const headerIndex = children.findIndex((child) => child.contains(profile));
  const messageIndex = children.findIndex((child) => child.contains(message));
  if (headerIndex < 0 || messageIndex <= headerIndex) return null;
  return children.slice(headerIndex).filter((block) => getPostEvidence(post).isRendered(block));
}

const cachedBlocks = new WeakMap<PostEvidence, Element[]>();

/**
 * Share ordered content blocks across metadata and text filters for one post version.
 * Complete rendered legacy families exclude hidden preambles; incomplete layouts retain conservative body boundaries.
 * @param post Owning post or legacy wrapper, read without DOM mutation.
 * @returns Header-first block references in document order, invalidated with the post's content evidence.
 */
function getNewsBlocks(post: Element): Element[] {
  const evidence = getPostEvidence(post);
  const cached = cachedBlocks.get(evidence);
  if (cached) return cached;
  const semantic = getSemanticBlocks(post);
  if (semantic) {
    cachedBlocks.set(evidence, semantic);
    return semantic;
  }
  let query =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  let blocks = evidence.select(query).filter((block) => evidence.isRendered(block));
  if (blocks.length <= 1) {
    query =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
    blocks = evidence.select(query).filter((block) => evidence.isRendered(block));
  }
  const selected = blocks.length > 1 ? blocks : evidence.select(query);
  cachedBlocks.set(evidence, selected);
  return selected;
}

/** Use the same owned content boundaries for group posts and their metadata guards. */
function getGroupsBlocks(post: Element): Element[] {
  return getNewsBlocks(post);
}

export { getNewsBlocks, getGroupsBlocks };
