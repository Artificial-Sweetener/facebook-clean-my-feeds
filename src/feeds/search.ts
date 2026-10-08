// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState } from "./types";
import { mainColumnAtt, postAtt, postAttTab } from "../dom/attributes";
import { swatTheMosquitos } from "../dom/animated-gifs";
import {
  ensureDirtyObserver,
  getDirtyToken,
  hasPostChanged,
  isElementDirty,
  markElementCleanIfUnchanged,
  markElementDirty,
  resetPostState,
  revalidateTrackedPosts,
  trackPostSignature,
} from "../dom/dirty-check";
import { hidePost } from "../dom/hide";
import { scrubInfoBoxes } from "../dom/info-boxes";
import { searchSelectors } from "../selectors/search";

import { findNewsBlockedText } from "./shared/blocked-text";
import { isSponsored } from "./shared/sponsored";

/**
 * Observe the region-adjacent search main column and mark a newly discovered root immediately dirty; increment noChangeCounter only when there is nothing to return.
 */
function isSearchColumnDirty(state: FeedProcessingState) {
  const mainColumn = document.querySelector(searchSelectors.mainColumn);
  if (mainColumn) {
    ensureDirtyObserver(mainColumn);
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
      markElementDirty(mainColumn);
    }
    if (state && state.forceProcess) {
      markElementDirty(mainColumn);
    }
    if (state && state.forceProcess) {
      return mainColumn;
    }
    if (isElementDirty(mainColumn)) {
      return mainColumn;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return null;
}

/**
 * Filter dirty search results under the historical NF_BLOCKED_ENABLED gate, which also controls sponsored detection on this route.
 * Reset recycled posts before checking sponsorship and news blocked-text rules. Track consecutive hidden results, and pause GIFs or scrub info boxes only in visible results.
 * Even when the gate is disabled, acknowledge an unchanged dirty token and reset the idle counter after locating the root.
 * @param context News filtering preferences and text terms are reused for search; state holds sponsorship route flags, caption counters, and visibility markers. Null skips discovery.
 * @returns The inspected search main column, or null when it is absent or unchanged.
 */
function mopSearchFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const mainColumn = isSearchColumnDirty(state);
  if (!mainColumn) {
    return null;
  }

  const mainColumnToken = getDirtyToken(mainColumn);
  revalidateTrackedPosts(mainColumn, state);

  if (options.NF_BLOCKED_ENABLED) {
    const posts = Array.from(document.querySelectorAll(searchSelectors.postsQuery));

    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      let alreadyHidden = false;
      let isSponsoredPost = false;

      const postChanged = hasPostChanged(post);
      if (postChanged) {
        resetPostState(post, state);
      }

      if (post.hasAttribute(postAtt)) {
        alreadyHidden = true;
      } else {
        if (options.NF_SPONSORED && isSponsored(post, state)) {
          hideReason = keyWords.SPONSORED;
          isSponsoredPost = true;
        }
        if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
          hideReason = findNewsBlockedText(post, options, filters);
        }
      }

      if (alreadyHidden || hideReason.length > 0) {
        state.echoCount += 1;
        if (!alreadyHidden) {
          hidePost(post, hideReason, isSponsoredPost, {
            options,
            keyWords,
            attributes: {
              postAtt,
              postAttTab,
            },
            state,
          });
        }
      } else {
        state.echoCount = 0;
        if (options.NF_ANIMATED_GIFS_PAUSE) {
          swatTheMosquitos(post);
        }
        if (state.hideAnInfoBox) {
          scrubInfoBoxes(post, options, keyWords, pathInfo, state);
        }
      }

      trackPostSignature(post);
    }
  }

  if (!mainColumn.hasAttribute(mainColumnAtt)) {
    mainColumn.setAttribute(mainColumnAtt, "1");
  }
  markElementCleanIfUnchanged(mainColumn, mainColumnToken);
  state.noChangeCounter = 0;

  return mainColumn;
}

export { mopSearchFeed };
