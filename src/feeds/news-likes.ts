// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../core/options/types";
import { getFullNumber } from "../core/filters/classifiers/shares-likes";
import { getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import type { Keywords } from "../i18n";

/** Retain only the reaction component's own accessibility-hidden visual count, excluding concealed ancestors. */
function isRenderedCount(counter: Element, post: Element): boolean {
  const evidence = getPostEvidence(post);
  const visualCounter = counter.closest("span[class][aria-hidden]");
  let ancestor: Element | null = counter;
  while (ancestor && ancestor !== post) {
    if (!(ancestor === visualCounter ? evidence.isPainted(ancestor) : evidence.isVisible(ancestor)))
      return false;
    ancestor = ancestor.parentElement;
  }
  return ancestor === post;
}

/**
 * Compare the owning post's first rendered reaction count against the inclusive configured threshold.
 * @param post News root; authored, nested, inaccessible and visually concealed counters cannot supply its count.
 * @param options Configured maximum; nonnumeric input leaves the post visible.
 * @param keyWords Localized explanation returned when the rendered count meets the maximum.
 * @returns The hiding reason, an empty string for a lower count, or false when no eligible counter exists.
 */
export function postExceedsLikeCount(
  post: Element,
  options: Pick<HydratedOptions, "NF_LIKES_MAXIMUM_COUNT">,
  keyWords: Pick<Keywords, "NF_LIKES_MAXIMUM">
): string | false {
  const evidence = getPostEvidence(post);
  const counters = evidence.select(
    'span[role="toolbar"] ~ div div[role="button"] > span[class][aria-hidden] > span:not([class]) > span[class]'
  );
  for (const counter of counters) {
    if (!ownsPostElement(counter, post) || !isRenderedCount(counter, post)) continue;
    const count = getFullNumber(
      evidence.visibleText(counter).trim(),
      post.ownerDocument.documentElement.lang
    );
    if (!Number.isFinite(count)) continue;
    return count >= parseInt(options.NF_LIKES_MAXIMUM_COUNT, 10) ? keyWords.NF_LIKES_MAXIMUM : "";
  }
  return false;
}
