// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import { generateRandomString } from "../utils/random";
import { postAtt, postAttCPID, postAttTab } from "./attributes";
import { sanitizeReason, addCaptionForHiddenPost, addMiniCaption } from "./captions";
import type { HideAttributes, HideContext, GroupHideContext } from "./hide-types";
import type { VisibilityState } from "./types";

export { sanitizeReason, addCaptionForHiddenPost, addMiniCaption } from "./captions";
export type { CaptionKeywords, HideAttributes, HideContext, GroupHideContext } from "./hide-types";

/**
 * Mark an informational-box ancestor while recording the explanation on its matched link.
 */
export function hideBlock(
  block: Node | null,
  link: Element | null,
  reason: string,
  state: Pick<VisibilityState, "cssHideEl" | "showAtt">,
  options: Options,
  attributes: Pick<HideAttributes, "postAtt">
): void {
  if (!(block instanceof Element) || !link || !state || !options || !attributes) {
    return;
  }

  block.setAttribute(state.cssHideEl, "");
  link.setAttribute(attributes.postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_DEBUG) {
    block.setAttribute(state.showAtt, "");
  }
}

/**
 * Remove stale debug exposure when verbose inspection is turned off.
 */
export function syncDebugVisibility(
  element: Element | null,
  state: Pick<VisibilityState, "showAtt">,
  options: Options
): void {
  if (!element || !state || !options) {
    return;
  }

  if (options.VERBOSITY_DEBUG) {
    element.setAttribute(state.showAtt, "");
  } else {
    element.removeAttribute(state.showAtt);
  }
}

/**
 * Apply the selected caption policy while retaining reversible page markers.
 * @param post Content element to hide.
 * @param reason Human-readable filtering explanation.
 * @param marker Feed-specific classification marker.
 * @param context Current verbosity, translated caption and owned attributes; omitted attributes preserve a no-op.
 */
export function hidePost(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  context: HideContext | null
): void {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, attributes, state } = context;
  if (!options || !keyWords || !attributes || !state) {
    return;
  }

  post.setAttribute(attributes.postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    addCaptionForHiddenPost(post, reason, marker, keyWords, attributes, state, options);
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(
        post,
        reason,
        {
          postAttTab: attributes.postAttTab,
        },
        state
      );
      post.setAttribute(state.showAtt, "");
    }
  }
}

/**
 * Hide a standalone feature using shared attributes rather than a feed-specific attribute map.
 * @param post Standalone Facebook feature root.
 * @param reason Explanation displayed when caption verbosity is enabled.
 * @param marker Classification stored on the details wrapper.
 * @param context Caption translations and reversible visibility markers.
 */
export function hideFeature(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  context: HideContext | null
): void {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, state } = context;
  if (!options || !keyWords || !state) {
    return;
  }

  post.setAttribute(postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    addCaptionForHiddenPost(post, reason, marker, keyWords, { postAtt }, state, options);
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(post, reason, { postAttTab }, state);
    }
  }
}

/**
 * Suppress a feature row without creating a caption, while preserving debug visibility.
 */
export function hideFeatureNoCaption(
  feature: Element | null,
  reason: string,
  context: {
    options: Options;
    state: Pick<VisibilityState, "hideWithNoCaptionAtt" | "showAtt">;
  } | null
): void {
  if (!feature || !context) {
    return;
  }

  const { options, state } = context;
  if (!options || !state) {
    return;
  }

  feature.setAttribute(postAtt, sanitizeReason(reason));
  feature.setAttribute(state.hideWithNoCaptionAtt, "");
  syncDebugVisibility(feature, state, options);
}

/**
 * Synchronize existing filtered rows and blocks after the debug-visibility preference changes.
 */
export function toggleHiddenElements(
  state: Omit<VisibilityState, "cssHideVerifiedBadge">,
  options: Options
): void {
  if (!state || !options) {
    return;
  }

  const containers = Array.from(document.querySelectorAll(`[${state.hideAtt}]`));
  const noCaptionRows = Array.from(document.querySelectorAll(`[${state.hideWithNoCaptionAtt}]`));
  const blocks = Array.from(document.querySelectorAll(`[${state.cssHideEl}]`));
  const shares = Array.from(document.querySelectorAll(`[${state.cssHideNumberOfShares}]`));
  const elements = [...containers, ...noCaptionRows, ...blocks, ...shares];

  if (options.VERBOSITY_DEBUG) {
    for (const element of elements) {
      element.setAttribute(state.showAtt, "");
    }
  } else {
    for (const element of elements) {
      element.removeAttribute(state.showAtt);
    }
  }
}

/**
 * Reveal or conceal all posts sharing a consecutive-caption identifier from one summary click.
 */
export function toggleConsecutivesElements(
  ev: Pick<Event, "target" | "stopPropagation"> | null,
  state: Pick<VisibilityState, "showAtt">
): void {
  if (!ev || !state) {
    return;
  }

  ev.stopPropagation();
  const elSummary = ev.target;
  if (!(elSummary instanceof Element)) return;
  const elDetails = elSummary.parentElement;
  const elPostContent = elDetails?.querySelector("div");
  if (!elDetails || !elPostContent) return;
  const cpidValue = elPostContent.getAttribute(postAttCPID);

  const collection = document.querySelectorAll(`div[${postAttCPID}="${cpidValue}"]`);

  if (elDetails.hasAttribute("open")) {
    collection.forEach((post) => {
      post.removeAttribute(state.showAtt);
    });
  } else {
    collection.forEach((post) => {
      post.setAttribute(state.showAtt, "");
    });
  }
}

/**
 * Group consecutive filtered posts behind one expandable caption without merging their content nodes.
 * @param post Group-feed post wrapper with an inner content div.
 * @param reason Explanation for this filtering decision.
 * @param marker Classification used by verbose details wrappers.
 * @param context Consecutive-post counters and references shared across the current feed pass.
 */
export function hideGroupPost(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  context: GroupHideContext | null
): void {
  if (!post || !context) {
    return;
  }

  const { options, keyWords, state } = context;
  if (!options || !keyWords || !state) {
    return;
  }

  post.setAttribute(postAtt, sanitizeReason(reason));

  if (options.VERBOSITY_LEVEL !== "0" && reason !== "") {
    const elPostContent = post.querySelector("div");
    if (!elPostContent) {
      return;
    }

    if (options.VERBOSITY_LEVEL === "1") {
      addCaptionForHiddenPost(elPostContent, reason, marker, keyWords, { postAtt }, state, options);
    } else {
      if (state.echoCount === 1) {
        addCaptionForHiddenPost(
          elPostContent,
          reason,
          marker,
          keyWords,
          { postAtt },
          state,
          options
        );
        state.echoCPID = generateRandomString();
        state.echoEl = elPostContent;
        state.echoEl.setAttribute(postAttCPID, state.echoCPID);
      } else {
        const elDetails = state.echoEl ? state.echoEl.closest("details") : null;
        if (!elDetails) {
          return;
        }

        if (state.echoCount === 2) {
          addMiniCaption(state.echoEl, reason, { postAttTab }, state);
          elDetails.addEventListener("click", (event) => toggleConsecutivesElements(event, state));
        }

        const summary = elDetails.querySelector("summary");
        if (summary && summary.lastChild) {
          summary.lastChild.textContent = `${state.echoCount}${keyWords.VERBOSITY_MESSAGE[1]}`;
        }

        addMiniCaption(elPostContent, reason, { postAttTab }, state);
        elPostContent.setAttribute(postAttCPID, state.echoCPID);
      }
    }
  } else {
    post.setAttribute(state.hideAtt, "");
    if (options.VERBOSITY_DEBUG) {
      addMiniCaption(post, reason, { postAttTab }, state);
      post.setAttribute(state.showAtt, "");
    }
  }
}

/**
 * Preserve the video-feed entry point while sharing ordinary post caption behavior.
 */
export function hideVideoPost(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  context: HideContext | null
): void {
  hidePost(post, reason, marker, context);
}

/**
 * Preserve the news-feed entry point while sharing ordinary post caption behavior.
 */
export function hideNewsPost(
  post: Element | null,
  reason: string,
  marker: string | boolean,
  context: HideContext | null
): void {
  hidePost(post, reason, marker, context);
}
