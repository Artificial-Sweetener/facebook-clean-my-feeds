// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttTab } from "../dom/attributes";
import type { FeedProcessingState } from "./types";

const hiddenNewsContent = new WeakMap<Element, string>();

/** Record the rendered content after CMF's own mutation so a later replacement can be distinguished from its hide markers. */
export function rememberHiddenNewsContent(post: Element): void {
  if (post.hasAttribute(postAtt)) hiddenNewsContent.set(post, post.innerHTML);
  else hiddenNewsContent.delete(post);
}

/**
 * Invalidate a previously classified news root when Facebook reuses it with changed contents, including equal-length replacements.
 * Only roots remembered by the news processor are restored; nested independently hidden features retain their markers.
 * CMF mini captions are removed and a directly owning details wrapper is unwrapped before reclassification.
 * @param root Main feed boundary containing concrete posts and orphan virtualized ads.
 * @param state Current randomized visibility markers; no unrelated attributes or child content are removed.
 */
export function resetChangedNewsPosts(root: Element | null, state: FeedProcessingState): void {
  if (!root) return;
  for (const post of root.querySelectorAll(`[${postAtt}]`)) {
    const previous = hiddenNewsContent.get(post);
    if (previous === undefined || previous === post.innerHTML) continue;
    hiddenNewsContent.delete(post);
    for (const caption of post.querySelectorAll(`:scope > h6[${postAttTab}]`)) caption.remove();
    post.removeAttribute(postAtt);
    post.removeAttribute(state.hideAtt);
    post.removeAttribute(state.showAtt);
    const wrapper = post.parentElement;
    if (wrapper?.matches(`details[${postAtt}]`)) wrapper.replaceWith(post);
  }
}
