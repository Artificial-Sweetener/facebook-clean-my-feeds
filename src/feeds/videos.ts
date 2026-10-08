// SPDX-License-Identifier: GPL-3.0-only

import { hideDuplicateVideos, setPostLinkToOpenInNewTab } from "./video-links";
import type { Keywords } from "../i18n";
import { translations } from "../i18n";
import { cleanText } from "../core/filters/text-normalize";
import type { FeedContext, FeedProcessingState, DirtyFeedRoots } from "./types";
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
import { doLightDusting, getDustingCount } from "../dom/dusting";
import { hideVideoPost } from "../dom/hide";
import { scrubInfoBoxes } from "../dom/info-boxes";
import { countDescendants } from "../dom/walker";
import { explicitNewsNames, isOwnedNewsElement } from "./news-identity";

import { findVideosBlockedText } from "./shared/blocked-text";
import { isSponsored, isSponsoredDisclosure } from "./shared/sponsored";

/**
 * Choose the last main-column candidate in the nested video layout, and observe the dialog's main region separately.
 * New roots and forced scans are marked dirty; the helper does not acknowledge their tokens.
 * @param state forceProcess bypasses observer cleanliness; noChangeCounter increments once per discovery attempt.
 * @returns Dirty video main and dialog roots in fixed positions, or null entries for clean or absent roots.
 */
function isVideosDirty(state: FeedProcessingState): DirtyFeedRoots {
  const arrReturn: DirtyFeedRoots = [null, null];
  const mainColumnQuery =
    'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div';
  const mainColumns = document.querySelectorAll(mainColumnQuery);
  let mainColumn = null;
  if (mainColumns.length > 0) {
    mainColumn = mainColumns.item(mainColumns.length - 1);
  }

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
      arrReturn[0] = mainColumn;
    } else if (isElementDirty(mainColumn)) {
      arrReturn[0] = mainColumn;
    }
  }

  const elDialog = document.querySelector('div[role="dialog"] div[role="main"]');
  if (elDialog) {
    ensureDirtyObserver(elDialog);
    if (!elDialog.hasAttribute(mainColumnAtt)) {
      elDialog.setAttribute(mainColumnAtt, "1");
      markElementDirty(elDialog);
    }
    if (state && state.forceProcess) {
      markElementDirty(elDialog);
    }
    if (state && state.forceProcess) {
      arrReturn[1] = elDialog;
    } else if (isElementDirty(elDialog)) {
      arrReturn[1] = elDialog;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return arrReturn;
}

/** Normalize full status labels without allowing a duration or a longer authored sentence to match. */
function normalizeVideoLabel(label: string): string {
  return cleanText(label)
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

// Catalog values and regional aliases are expected translations, not captured Facebook markup.
// Premiere (including Spanish ESTRENO) is deliberately absent from this live-status vocabulary.
const liveStatusLabels = new Set(
  [...Object.values(translations).map((catalog) => catalog.VF_LIVE), "EN VIVO", "AO VIVO"].map(
    normalizeVideoLabel
  )
);

/**
 * Reject foreign, authored, and hidden status/attribution content, including inaccessible external label references.
 * @param signal Candidate status span or attribution SVG; descendants must share the owning video.
 * @param post Video root whose authored blocks and independently nested content cannot supply metadata.
 * @returns Whether the candidate's visible content and referenced name are safe evidence for this video.
 */
function isOwnedVideoSignal(signal: Element, post: Element): boolean {
  if (
    !isOwnedNewsElement(signal, post) ||
    signal.closest('[hidden], [aria-hidden="true"]') ||
    signal.querySelector('[hidden], [aria-hidden="true"]') ||
    Array.from(signal.querySelectorAll("*")).some((child) => !isOwnedNewsElement(child, post))
  )
    return false;
  const references = signal.getAttribute("aria-labelledby");
  return (
    !references ||
    references
      .trim()
      .split(/\s+/)
      .every((id) => {
        const label = signal.ownerDocument.getElementById(id);
        return (
          !!label &&
          post.contains(label) &&
          !label.contains(signal) &&
          isOwnedNewsElement(label, post)
        );
      })
  );
}

/** Require both the existing player/status structure and an exact localized live label; recorded durations are insufficient. */
function isVideoLive(post: Element, keyWords: Pick<Keywords, "VF_LIVE">) {
  const liveRule = 'div[role="presentation"] ~ div > div:nth-of-type(1) > span';
  return Array.from(post.querySelectorAll(liveRule)).some(
    (status) =>
      isOwnedVideoSignal(status, post) &&
      liveStatusLabels.has(normalizeVideoLabel(status.textContent || ""))
  )
    ? keyWords.VF_LIVE
    : "";
}

/** Require an owned, explicitly named Instagram icon within the retained attribution shape; arbitrary SVGs cannot identify a cross-post. */
function isInstagram(post: Element, keyWords: Pick<Keywords, "VF_INSTAGRAM">) {
  const instagramRule = 'div > div > div > div > div > a[href="#"] > div > svg';
  return Array.from(post.querySelectorAll(instagramRule)).some(
    (icon) =>
      isOwnedVideoSignal(icon, post) &&
      explicitNewsNames(icon).some((name) => normalizeVideoLabel(name) === "instagram")
  )
    ? keyWords.VF_INSTAGRAM
    : "";
}

/**
 * Hide the retained classless third-block ad slot only with an owned exact sponsorship disclosure and its enabled option.
 * @param post Owning video, which remains visible when only its embedded ad is hidden.
 * @param queryBlocks Existing route-specific content-block selector.
 * @param context Filter preference, localized reason, and reversible visibility attributes.
 */
function hideSponsoredBlock(post: Element, queryBlocks: string, context: FeedContext) {
  const { state, options, keyWords } = context;
  if (!options.VF_SPONSORED) return;
  const videoBlocks = post.querySelectorAll(queryBlocks);
  if (videoBlocks.length < 3) {
    return;
  }
  const thirdBlock = videoBlocks[2];
  if (!thirdBlock) return;
  if (thirdBlock.hasAttribute("class")) {
    return;
  }
  if (thirdBlock.hasAttribute(state.hideAtt)) {
    return;
  }
  if (
    !isOwnedNewsElement(thirdBlock, post) ||
    !Array.from(thirdBlock.querySelectorAll("a[href]")).some((link) =>
      isSponsoredDisclosure(link, post)
    )
  )
    return;
  thirdBlock.setAttribute(postAtt, keyWords.SPONSORED);
  thirdBlock.setAttribute(state.hideAtt, keyWords.SPONSORED);
  if (options.VERBOSITY_DEBUG) thirdBlock.setAttribute(state.showAtt, "");
}

/**
 * Hide only explicitly disclosed direct ad anchors in the retained video slot when sponsored filtering is enabled.
 * @param post Owning video; help links, body prose, and neighboring video content remain untouched.
 * @param context Current sponsorship preference, translated reason, and reversible visibility attributes.
 */
function scrubSponsoredBlock(post: Element, context: FeedContext) {
  const { state, options, keyWords } = context;
  if (!options.VF_SPONSORED) return;
  const queryForContainer = ":scope > div > div > div > div > div > div:nth-of-type(2)";
  const blocksContainer = post.querySelector(queryForContainer);
  if (blocksContainer && blocksContainer.childElementCount > 0) {
    for (const adBlock of blocksContainer.querySelectorAll(":scope > a")) {
      if (adBlock.hasAttribute(postAtt) || !isSponsoredDisclosure(adBlock, post)) continue;
      adBlock.setAttribute(state.cssHideEl, "");
      adBlock.setAttribute(postAtt, keyWords.SPONSORED);
      if (options.VERBOSITY_DEBUG) {
        adBlock.setAttribute(state.showAtt, "");
      }
    }
  }
}

/**
 * Prefer a dirty dialog over the dirty main root and select post/content-block selectors from vfType.
 * Ordinary video and item routes apply sponsored, live, Instagram, duplicate, and blocked-text handling, plus embedded-ad cleanup; video-search routes apply blocked text only.
 * Virtualized posts reset stale state before classification. Dirty-token acknowledgement occurs after the chosen container is scanned, so concurrent mutations remain pending.
 * @param context vfType determines the supported route; VF preferences and filter terms select post actions, while state supplies icon markup, hide markers, and scan counters. Null skips the pass.
 * @returns The discovered dirty roots, or null for absent work or an unsupported video route.
 */
function mopVideosFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const [mainColumn, elDialog] = isVideosDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  const container = elDialog || mainColumn;
  const containerToken = container ? getDirtyToken(container) : null;
  if (container) {
    revalidateTrackedPosts(container, state);
    let query;
    let queryBlocks;
    if (state.vfType === "videos") {
      query = ":scope > div > div:not([class]) > div";
      queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
    } else if (state.vfType === "search") {
      query = 'div[role="feed"] > div[role="article"]';
      queryBlocks = ":scope > div > div > div > div > div > div > div:nth-of-type(2)";
    } else if (state.vfType === "item") {
      query =
        'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div';
      queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
    } else {
      return null;
    }

    if (state.vfType !== "search") {
      const posts = container.querySelectorAll(query);
      for (const post of posts) {
        if (countDescendants(post) < 3) {
          continue;
        }

        let hideReason = "";
        let alreadyHidden = false;

        const postChanged = hasPostChanged(post);
        if (postChanged) {
          resetPostState(post, state);
        }

        if (state.vfType === "videos" && getDustingCount(post) === undefined) {
          setPostLinkToOpenInNewTab(post, state);
        }

        if (post.hasAttribute(postAtt)) {
          alreadyHidden = true;
        } else {
          doLightDusting(post, state);

          if (hideReason === "" && options.VF_SPONSORED && isSponsored(post, state)) {
            hideReason = keyWords.SPONSORED;
          }
          if (hideReason === "" && options.VF_LIVE) {
            hideReason = isVideoLive(post, keyWords);
          }
          if (hideReason === "" && options.VF_INSTAGRAM) {
            hideReason = isInstagram(post, keyWords);
          }
          if (hideReason === "" && options.VF_DUPLICATE_VIDEOS) {
            hideDuplicateVideos(post, query, keyWords, context);
            if (post.hasAttribute(postAtt)) {
              alreadyHidden = true;
            }
          }
          if (!alreadyHidden && hideReason === "" && options.VF_BLOCKED_ENABLED) {
            hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
          }
        }

        if (alreadyHidden || hideReason.length > 0) {
          if (!alreadyHidden) {
            hideVideoPost(post, hideReason, "", {
              options,
              keyWords,
              attributes: { postAtt, postAttTab },
              state,
            });
          }
        } else {
          if (options.VF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(post);
          }
          if (state.hideAnInfoBox) {
            scrubInfoBoxes(post, options, keyWords, pathInfo, state);
          }

          scrubSponsoredBlock(post, context);
        }

        hideSponsoredBlock(post, queryBlocks, context);

        trackPostSignature(post);
      }
    } else {
      const posts = document.querySelectorAll(query);
      for (const post of posts) {
        let hideReason = "";
        let alreadyHidden = false;

        const postChanged = hasPostChanged(post);
        if (postChanged) {
          resetPostState(post, state);
        }

        if (post.hasAttribute(postAtt)) {
          alreadyHidden = true;
        } else if (options.VF_BLOCKED_ENABLED) {
          hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
        }

        if (alreadyHidden || hideReason.length > 0) {
          if (!alreadyHidden) {
            hideVideoPost(post, hideReason, "", {
              options,
              keyWords,
              attributes: { postAtt, postAttTab },
              state,
            });
          }
        }

        trackPostSignature(post);
      }
    }

    if (!container.hasAttribute(mainColumnAtt)) {
      container.setAttribute(mainColumnAtt, "1");
    }
    if (containerToken !== null) {
      markElementCleanIfUnchanged(container, containerToken);
    }
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.NF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
  }

  return { mainColumn, elDialog };
}

export { isInstagram, isVideoLive, mopVideosFeed };
