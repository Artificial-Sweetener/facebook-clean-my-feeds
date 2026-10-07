// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState } from "./types";
import { postAtt } from "../dom/attributes";
import { hideFeature } from "../dom/hide";
import { climbUpTheTree } from "../utils/dom";
import { isOwnedNewsElement, matchesNewsLabel } from "./news-identity";
import {
  hasPostChanged,
  resetPostState,
  revalidateTrackedPosts,
  trackPostSignature,
} from "../dom/dirty-check";

/**
 * Hide only an exactly labeled recommendation block within its complementary rail.
 * The legacy content depth remains a layout guard; no ancestor climb may hide sibling rails, navigation, or the feed.
 * @param context Current translated reason and reversible presentation state; a missing context leaves the page unchanged.
 */
export function cleanGroupsSuggestions(context: FeedContext | null) {
  if (!context) return;
  const { keyWords, state, options } = context;
  if (!keyWords || !state || !options) {
    return;
  }
  for (const rail of document.querySelectorAll('div[role="complementary"]')) {
    revalidateTrackedPosts(rail, state);
  }

  const query =
    'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
  const asideBoxes = document.querySelectorAll(query);
  if (asideBoxes.length === 0) {
    return;
  }

  for (const asideBox of asideBoxes) {
    if (hasPostChanged(asideBox)) resetPostState(asideBox, state);
    const rail = asideBox.closest('[role="complementary"]');
    if (
      !rail ||
      !rail.contains(asideBox) ||
      asideBox.querySelector('[role="main"], [role="feed"], [role="navigation"]')
    ) {
      continue;
    }
    const labels = asideBox.querySelectorAll(
      ':scope > span, :scope > h2, :scope > h3, :scope > [role="heading"]'
    );
    const hasSuggestionLabel = Array.from(labels).some(
      (label) =>
        isOwnedNewsElement(label, asideBox) &&
        !label.closest('[hidden], [aria-hidden="true"]') &&
        !label.querySelector('[hidden], [aria-hidden="true"]') &&
        Array.from(label.querySelectorAll("*")).every((child) =>
          isOwnedNewsElement(child, asideBox)
        ) &&
        (matchesNewsLabel(label.textContent || "", "groups") ||
          matchesNewsLabel(label.textContent || "", "suggested"))
    );
    if (hasSuggestionLabel && !asideBox.hasAttribute(postAtt)) {
      hideFeature(asideBox, keyWords.GF_SUGGESTIONS, true, { options, keyWords, state });
    }
    trackPostSignature(asideBox);
  }
}

/**
 * Append the new-window icon only to classless group posts that do not already contain it.
 * The permalink is derived from multi_permalinks and inserted beside the header controls. Missing structure, malformed URLs, or DOM errors leave that post alone.
 * @param post Group post to enrich; existing classes or an existing icon suppress insertion.
 * @param state iconNewWindowClass identifies the inserted icon for deduplication, and iconNewWindow supplies its trusted application-owned HTML.
 */
export function setPostLinkToOpenInNewTab(
  post: Element,
  state: Pick<FeedProcessingState, "iconNewWindowClass" | "iconNewWindow">
) {
  try {
    if (post.hasAttribute("class") && post.classList.length > 0) {
      return;
    }
    if (post.querySelector(`.${state.iconNewWindowClass}`)) {
      return;
    }

    const postLinks = post.querySelectorAll('div > div > a[href*="/groups/"][role="link"]');
    if (postLinks.length > 0) {
      const postLink = postLinks[0];
      if (!(postLink instanceof HTMLAnchorElement)) return;
      const elHeader = climbUpTheTree(postLink, 4);
      if (!(elHeader instanceof Element)) {
        return;
      }
      const blockOfIcons = elHeader.querySelector(
        ":scope > div:nth-of-type(2) > div > div:nth-of-type(2) > span > span"
      );
      let newLink = "";

      if (blockOfIcons) {
        const postId = new URLSearchParams(postLink.href).get("multi_permalinks");
        if (postId !== null) {
          newLink = `${postLink.href.split("?")[0]}posts/${postId}/`;
        } else {
          return;
        }
      } else {
        return;
      }

      const spanSpacer = document.createElement("span");
      spanSpacer.innerHTML =
        '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> ú </span></span>';
      blockOfIcons.appendChild(spanSpacer);

      const container = document.createElement("span");
      container.className = state.iconNewWindowClass;
      const span2 = document.createElement("span");
      const linkNew = document.createElement("a");
      linkNew.setAttribute("href", newLink);
      linkNew.innerHTML = state.iconNewWindow;
      linkNew.setAttribute("target", "_blank");
      span2.appendChild(linkNew);
      container.appendChild(span2);

      blockOfIcons.appendChild(container);
    }
  } catch {
    return;
  }
}
