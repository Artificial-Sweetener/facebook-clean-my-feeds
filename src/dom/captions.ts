// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import type { VisibilityState } from "./types";
import type { CaptionKeywords, HideAttributes } from "./hide-types";

/**
 * Remove quotation marks before a reason is stored in HTML attributes.
 */
export function sanitizeReason(reason: unknown): string {
  if (typeof reason !== "string") {
    return "";
  }

  return reason.replaceAll('"', "");
}

/**
 * Move the original post inside a details wrapper so users can inspect filtered content.
 * @param post Original content node; detached nodes are left untouched.
 * @param reason Human-readable filtering explanation.
 * @param marker Classification marker, with false preserving the empty-marker convention.
 * @param keyWords Caption prefix in the active locale.
 * @param attributes Feed-provided classification attribute.
 * @param state Debug visibility marker for this page.
 * @param options Debug mode opens the wrapper and exposes its content.
 */
export function addCaptionForHiddenPost(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  keyWords: CaptionKeywords,
  attributes: Pick<HideAttributes, "postAtt">,
  state: Pick<VisibilityState, "showAtt">,
  options: Options
): void {
  if (!post || !keyWords || !attributes || !state || !options) {
    return;
  }

  const elDetails = document.createElement("details");
  const elSummary = document.createElement("summary");
  if (!Array.isArray(keyWords.VERBOSITY_MESSAGE)) {
    return;
  }

  if (!post.parentNode) {
    return;
  }

  const elText = document.createTextNode(`${keyWords.VERBOSITY_MESSAGE[1]}${reason}`);

  elSummary.appendChild(elText);
  elDetails.appendChild(elSummary);
  elDetails.setAttribute(attributes.postAtt, marker === false ? "" : String(marker));

  if (post.classList.length > 0) {
    elDetails.classList.add(...post.classList);
  }

  post.parentNode.appendChild(elDetails);
  elDetails.appendChild(post);

  if (options.VERBOSITY_DEBUG) {
    elDetails.setAttribute("open", "");
    post.setAttribute(state.showAtt, "");
  }
}

/**
 * Attach a compact explanation inside a hidden post without introducing another wrapper.
 */
export function addMiniCaption(
  post: Element | null,
  reason: string,
  attributes: Pick<HideAttributes, "postAttTab">,
  state: Pick<VisibilityState, "hideAtt">
): void {
  if (!post || !attributes || !state) {
    return;
  }

  post.setAttribute(state.hideAtt, "");
  const elTab = document.createElement("h6");
  elTab.setAttribute(attributes.postAttTab, "0");
  elTab.textContent = reason;

  post.insertBefore(elTab, post.firstElementChild);
}
