// SPDX-License-Identifier: GPL-3.0-only

import { contentStamp, ignoreContentAttributes } from "../dom/content-version";
import { postAtt, postAttTab } from "../dom/attributes";
import type { FeedProcessingState } from "./types";

const hiddenNewsContent = new WeakMap<Element, number | string>();

/**
 * Distinguish Facebook's unloaded virtualized spacer from an ordinary replacement post.
 * Facebook nests empty spacers inside anonymous layout wrappers. A bounded traversal accepts
 * only empty div/span layout nodes with an explicit virtualization flag; real copy, media and
 * named or interactive controls remain eligible for immediate evaluation.
 * @param post Previously classified root whose visibility can make Facebook unload its contents.
 * @returns Whether the root contains no new classification evidence beyond its retained CMF mini caption.
 */
function isUnloadedNewsPost(post: Element): boolean {
  const pending: Node[] = [post];
  let visited = 0;
  let virtualized = false;
  while (pending.length) {
    const node = pending.pop();
    if (!node || ++visited > 64) return false;
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return false;
    if (!(node instanceof Element)) continue;
    if (node.parentElement === post && node.matches(`h6[${postAttTab}]`)) continue;
    if (!node.matches("div, span") || node.hasAttribute("aria-label")) return false;
    const role = node.getAttribute("role");
    if (node !== post && role && role !== "none" && role !== "presentation") return false;
    if (node.matches('div[data-virtualized="true"]')) virtualized = true;
    if (visited + pending.length + node.childNodes.length > 64) return false;
    pending.push(...Array.from(node.childNodes));
  }
  return virtualized;
}

/** Record the rendered content after CMF's own mutation so a later replacement can be distinguished from its hide markers. */
export function rememberHiddenNewsContent(post: Element): void {
  if (post.hasAttribute(postAtt)) hiddenNewsContent.set(post, contentStamp(post));
  else hiddenNewsContent.delete(post);
}

/**
 * Find changed classified roots without exposing their content or moving their caption wrappers.
 * Reclassification must decide whether content still matches before removing its presentation;
 * routine metadata updates must preserve the user's expanded/collapsed caption state.
 * @param root Main feed boundary containing concrete posts and orphan virtualized ads.
 * @param state Randomized visibility attributes excluded from Facebook content identity.
 * @returns Tracked changed roots, including roots omitted by discovery while wrapped or empty.
 */
export function findChangedNewsPosts(
  root: Element | null,
  state: FeedProcessingState
): Set<Element> {
  ignoreContentAttributes([state.hideAtt, state.showAtt, state.hideWithNoCaptionAtt]);
  const changed = new Set<Element>();
  if (!root) return changed;
  for (const post of root.querySelectorAll(`[${postAtt}]`)) {
    const previous = hiddenNewsContent.get(post);
    if (previous !== undefined && previous !== contentStamp(post) && !isUnloadedNewsPost(post))
      changed.add(post);
  }
  return changed;
}

/** Restore a confirmed nonmatching root in place while retaining independently filtered descendant features. */
export function restoreNewsPost(post: Element, state: FeedProcessingState): void {
  hiddenNewsContent.delete(post);
  for (const caption of post.querySelectorAll(`:scope > h6[${postAttTab}]`)) caption.remove();
  post.removeAttribute(postAtt);
  post.removeAttribute(state.hideAtt);
  post.removeAttribute(state.showAtt);
  const wrapper = post.parentElement;
  if (wrapper?.matches(`details[${postAtt}]`)) wrapper.replaceWith(post);
}
