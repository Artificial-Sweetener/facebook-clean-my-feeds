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
 * Keep one in-place details wrapper per filtered post, preserving its open state across reclassification.
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

  if (!Array.isArray(keyWords.VERBOSITY_MESSAGE)) {
    return;
  }

  if (!post.parentNode) {
    return;
  }

  const parent = post.parentElement;
  const existing = parent?.matches(`details[${attributes.postAtt}]`) ? parent : null;
  const elDetails = existing || document.createElement("details");
  let elSummary = elDetails.querySelector(":scope > summary");
  if (!elSummary) {
    elSummary = document.createElement("summary");
    elDetails.prepend(elSummary);
  }
  const caption = `${keyWords.VERBOSITY_MESSAGE[1]}${reason}`;
  if (elSummary.textContent !== caption) elSummary.textContent = caption;
  const value = marker === false ? "" : String(marker);
  if (elDetails.getAttribute(attributes.postAtt) !== value)
    elDetails.setAttribute(attributes.postAtt, value);
  if (!existing) {
    if (post.classList.length > 0) elDetails.classList.add(...post.classList);
    post.replaceWith(elDetails);
    elDetails.appendChild(post);
  }

  if (options.VERBOSITY_DEBUG) {
    if (!elDetails.hasAttribute("open")) elDetails.setAttribute("open", "");
    if (!post.hasAttribute(state.showAtt)) post.setAttribute(state.showAtt, "");
  }
}

/**
 * Reuse one compact explanation so repeated filtering cannot accumulate captions inside the post.
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

  if (!post.hasAttribute(state.hideAtt)) post.setAttribute(state.hideAtt, "");
  let elTab = post.querySelector(`:scope > h6[${attributes.postAttTab}]`);
  if (!elTab) {
    elTab = document.createElement("h6");
    elTab.setAttribute(attributes.postAttTab, "0");
    post.insertBefore(elTab, post.firstElementChild);
  }
  if (elTab.textContent !== reason) elTab.textContent = reason;
}
