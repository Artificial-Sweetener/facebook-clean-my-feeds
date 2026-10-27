// SPDX-License-Identifier: GPL-3.0-only

import { matchesNewsLabel } from "../core/filters/labels";
import type { NewsLabelKind } from "../core/filters/labels";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { getNewsBlocks } from "./shared/blocks";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";

/** Reject user-authored message blocks, paragraphs/quotes, nested posts/comments, and independently hidden child features. */
export function isOwnedNewsElement(element: Element, post: Element): boolean {
  return ownsPostElement(element, post);
}

/** Require rendered metadata outside legacy body/footer blocks, even when message annotations are absent. */
export function isOwnedNewsMetadata(element: Element, post: Element): boolean {
  return (
    isOwnedNewsElement(element, post) &&
    getPostEvidence(post).isRendered(element) &&
    !getNewsBlocks(post)
      .slice(1)
      .some((body) => body.contains(element))
  );
}

/** Resolve only Facebook-owned ordinary HTTP destinations; external lookalike paths and redirect query text cannot identify a feature. */
export function facebookPath(link: Element): string | null {
  return facebookUrl(link)?.pathname ?? null;
}

/** Return header-local controls and badges only from this post's own rendered author headings. */
export function ownNewsHeaders(post: Element): Element[] {
  return getPostEvidence(post)
    .select("h4, h5")
    .filter((header) => isOwnedNewsMetadata(header, post));
}

/** Read the highest-priority explicit accessible name, never unrelated ancestor copy or a conflicting fallback title. */
export function explicitNewsNames(element: Element, post: Element): string[] {
  return getPostEvidence(post).explicitNames(element);
}

/** Recognize a card's own semantic heading rather than a user's body/comment mention of the same words. */
export function hasNewsCardHeading(post: Element, kind: NewsLabelKind): boolean {
  return getPostEvidence(post)
    .select('h2, h3, [role="heading"]')
    .some(
      (heading) =>
        isOwnedNewsMetadata(heading, post) &&
        getPostEvidence(post).isRendered(heading) &&
        matchesNewsLabel(getPostEvidence(post).visibleText(heading), kind)
    );
}

/** Require the exact action name from visible control copy or its explicit accessible name. */
export function hasNewsActionName(
  element: Element,
  post: Element,
  kind: "follow" | "join"
): boolean {
  if (!getPostEvidence(post).isRendered(element)) return false;
  const names = explicitNewsNames(element, post);
  return (names.length > 0 ? names : [getPostEvidence(post).visibleText(element)]).some((name) =>
    matchesNewsLabel(name, kind)
  );
}

/** Find verified icons only in the owning author header; an unrelated SVG or author name is not verification. */
export function ownVerifiedBadges(post: Element): Element[] {
  return ownNewsHeaders(post).flatMap((header) =>
    getPostEvidence(post)
      .select("svg", header)
      .filter((icon) => {
        if (!isOwnedNewsElement(icon, post)) return false;
        const iconNames = explicitNewsNames(icon, post);
        if (iconNames.length > 0)
          return iconNames.some((name) => matchesNewsLabel(name, "verified"));
        let wrapper = icon.parentElement;
        while (wrapper && wrapper !== header && wrapper.tagName === "SPAN") {
          if (!isBadgeOnlyWrapper(wrapper, icon)) return false;
          if (explicitNewsNames(wrapper, post).some((name) => matchesNewsLabel(name, "verified")))
            return true;
          wrapper = wrapper.parentElement;
        }
        return false;
      })
  );
}

/** Keep author copy and neighboring icons visible when collapsing a badge's otherwise empty span wrappers. */
export function isBadgeOnlyWrapper(wrapper: Element, icon: Element): boolean {
  if (
    wrapper.matches('a, button, [role="button"]') ||
    wrapper.querySelector('a, button, [role="button"], img, video')
  )
    return false;
  if (wrapper.querySelectorAll("svg").length !== 1 || !wrapper.contains(icon)) return false;
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.textContent?.trim() && !icon.contains(node)) return false;
  }
  return true;
}

/** Restrict reels to owned media previews so pasted links and comment mentions cannot identify the parent post. */
export function ownPostReelLinks(post: Element): Element[] {
  const evidence = getPostEvidence(post);
  return evidence.select("a[href]").filter((link) => {
    const path = facebookPath(link);
    return (
      path !== null &&
      /^\/reel\/[^/]+\/?$/.test(path) &&
      isOwnedNewsElement(link, post) &&
      evidence.isRendered(link) &&
      evidence.select('video, img, [role="img"]', link).some((media) => evidence.isRendered(media))
    );
  });
}

/**
 * Recognize a standalone carousel as soon as two media cards load, without depending on translated headings or a see-more link.
 * @param post Independent feed root; visible authored content and author headings outside cards disqualify it.
 * @returns Whether at least two separately rendered horizontal cards own real Facebook reel media previews.
 */
export function isNewsReelShelf(post: Element): boolean {
  if (
    !post.matches(newsSelectors.standardPost) ||
    post.closest(sharedSelectors.authoredContent) ||
    post.parentElement?.closest(newsSelectors.standardPost) ||
    post.querySelector(newsSelectors.standardPost)
  )
    return false;
  const evidence = getPostEvidence(post);
  if (
    evidence
      .select(
        `${newsSelectors.reelShelfContent}, ${sharedSelectors.authoredContent}, ${newsSelectors.reelShelfAuthors}`
      )
      .some(
        (element) => evidence.isRendered(element) && !element.closest(newsSelectors.reelShelfItems)
      )
  )
    return false;
  const cards = new Set<Element>();
  for (const link of ownPostReelLinks(post)) {
    const card = link.closest(newsSelectors.reelShelfItems);
    if (card && post.contains(card) && evidence.isRendered(link)) cards.add(card);
    if (cards.size >= 2) return true;
  }
  return false;
}
