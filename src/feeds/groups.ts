// SPDX-License-Identifier: GPL-3.0-only

import { cleanGroupsSuggestions, setPostLinkToOpenInNewTab } from "./groups-features";
import type { Keywords } from "../i18n";
import type { FeedContext, FeedProcessingState, DirtyFeedRoots } from "./types";
import { mainColumnAtt, postAtt } from "../dom/attributes";
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
import { hideGroupPost } from "../dom/hide";
import { scrubInfoBoxes } from "../dom/info-boxes";
import { isOwnedNewsElement, matchesNewsLabel, ownPostReelLinks } from "./news-identity";

import { findGroupsBlockedText } from "./shared/blocked-text";
import { hasGroupsAnimatedGifContent } from "./shared/animated-gifs";
import { getGroupsBlocksQuery } from "./shared/blocks";
import { isSponsored } from "./shared/sponsored";
import { hideNumberOfShares } from "./shared/shares";

/**
 * Observe the navigation-adjacent groups root, falling back to an individual group's feed, and inspect the dialog independently.
 * Newly discovered roots receive the main-column marker and are immediately dirty. This helper never marks a root clean.
 * @param state forceProcess dirties every available root; noChangeCounter advances once even when a dirty root is returned.
 * @returns Page and dialog roots requiring work, respectively; a null entry means absent or already clean.
 */
function isGroupsColumnDirty(state: FeedProcessingState): DirtyFeedRoots {
  const arrReturn: DirtyFeedRoots = [null, null];
  const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"]';
  const mainColumn = document.querySelector(mainColumnQuery);
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
  } else {
    const mainColumnQueryGP = 'div[role="main"] div[role="feed"]';
    const mainColumnGP = document.querySelector(mainColumnQueryGP);
    if (mainColumnGP) {
      ensureDirtyObserver(mainColumnGP);
      if (!mainColumnGP.hasAttribute(mainColumnAtt)) {
        mainColumnGP.setAttribute(mainColumnAtt, "1");
        markElementDirty(mainColumnGP);
      }
      if (state && state.forceProcess) {
        markElementDirty(mainColumnGP);
      }
      if (state && state.forceProcess) {
        arrReturn[0] = mainColumnGP;
      } else if (isElementDirty(mainColumnGP)) {
        arrReturn[0] = mainColumnGP;
      }
    }
  }

  const elDialog = document.querySelector('div[role="dialog"]');
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

/** Require a complete localized recommendation label whose text and accessible name belong to this post. */
function hasGroupsSuggestionLabel(element: Element, post: Element): boolean {
  if (
    !isOwnedNewsElement(element, post) ||
    element.closest('[hidden], [aria-hidden="true"]') ||
    element.querySelector('[hidden], [aria-hidden="true"]') ||
    Array.from(element.querySelectorAll("*")).some((child) => !isOwnedNewsElement(child, post))
  ) {
    return false;
  }
  const label =
    element.getAttribute("aria-label") ||
    element.getAttribute("title") ||
    element.textContent ||
    "";
  return matchesNewsLabel(label, "suggested") || matchesNewsLabel(label, "groups");
}

/** Retain both supported layouts, but require owned recommendation text instead of treating every styled privacy icon or nested heading as a suggestion. */
function isGroupsSuggested(post: Element, keyWords: Pick<Keywords, "GF_SUGGESTIONS">) {
  const blocks = post.querySelectorAll(getGroupsBlocksQuery(post));
  if (blocks.length <= 1) return "";
  const icons = blocks[0]?.querySelectorAll('i[data-visualcompletion="css-img"][style]') || [];
  const hasSuggestionIcon = Array.from(icons).some(
    (icon) =>
      isOwnedNewsElement(icon, post) &&
      (hasGroupsSuggestionLabel(icon, post) ||
        (icon.parentElement !== null && hasGroupsSuggestionLabel(icon.parentElement, post)))
  );
  const headings = blocks[1]?.querySelectorAll("h3 > div > span ~ span > span > div > div") || [];
  const hasSuggestionHeading = Array.from(headings).some((heading) =>
    hasGroupsSuggestionLabel(heading, post)
  );
  return hasSuggestionIcon || hasSuggestionHeading ? keyWords.GF_SUGGESTIONS : "";
}

/** Preserve the exactly-one policy for owned reel media previews, excluding text links, comments, nested posts, and lookalike destinations. */
function isGroupsShortReelVideo(post: Element, keyWords: Pick<Keywords, "GF_SHORT_REEL_VIDEO">) {
  return ownPostReelLinks(post).length === 1 ? keyWords.GF_SHORT_REEL_VIDEO : "";
}

/**
 * Apply group filters to dirty roots, distinguishing the aggregated/recent/search feed from an individual group's page.
 * Aggregated routes inspect only the last 25 posts and enable sponsored/suggestion filtering; individual group pages use the smaller filter set.
 * Recycled posts have old presentation reset before classification. Consecutive hidden posts share caption state, while visible posts reset that run.
 * Mutation tokens prevent a root changed during processing from being marked clean.
 * @param context gfType selects the layout; group options and text filters determine reasons, and state receives scan and consecutive-caption updates. Null skips the pass.
 * @returns The dirty roots considered by the pass, or null when neither page nor dialog needs work.
 */
function mopGroupsFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const [mainColumn, elDialog] = isGroupsColumnDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
  const dialogToken = elDialog ? getDirtyToken(elDialog) : null;

  if (mainColumn) {
    revalidateTrackedPosts(mainColumn, state);
    if (
      state.gfType === "groups" ||
      state.gfType === "groups-recent" ||
      state.gfType === "search"
    ) {
      if (options.GF_SUGGESTIONS) {
        cleanGroupsSuggestions(context);
      }

      const query =
        state.gfType === "groups-recent" ? 'h2[dir="auto"] + div > div' : 'div[role="feed"] > div';
      const posts = Array.from(document.querySelectorAll(query));
      if (posts.length > 0) {
        const count = posts.length;
        const start = count < 25 ? 0 : count - 25;

        for (let i = start; i < count; i += 1) {
          const post = posts[i];
          if (!post) continue;
          if (post.innerHTML.length === 0) {
            continue;
          }

          let hideReason = "";
          let alreadyHidden = false;

          const postChanged = hasPostChanged(post);
          if (postChanged) {
            resetPostState(post, state);
          }

          if (state.gfType === "groups" && getDustingCount(post) === undefined) {
            setPostLinkToOpenInNewTab(post, state);
          }

          if (post.hasAttribute(postAtt)) {
            alreadyHidden = true;
          } else {
            doLightDusting(post, state);

            if (hideReason === "" && options.GF_SPONSORED && isSponsored(post, state)) {
              hideReason = keyWords.SPONSORED;
            }
            if (hideReason === "" && options.GF_SUGGESTIONS) {
              hideReason = isGroupsSuggested(post, keyWords);
            }
            if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
              hideReason = isGroupsShortReelVideo(post, keyWords);
            }
            if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
              hideReason = findGroupsBlockedText(post, options, filters);
            }
            if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
              hideReason = hasGroupsAnimatedGifContent(post, keyWords);
            }
          }

          if (alreadyHidden || hideReason.length > 0) {
            state.echoCount += 1;
            if (!alreadyHidden) {
              hideGroupPost(post, hideReason, "", {
                options,
                keyWords,
                state,
              });
            }
          } else {
            state.echoCount = 0;
            if (options.GF_ANIMATED_GIFS_PAUSE) {
              swatTheMosquitos(post);
            }
            if (state.hideAnInfoBox) {
              scrubInfoBoxes(post, options, keyWords, pathInfo, state);
            }
            if (options.GF_SHARES) {
              hideNumberOfShares(post, state, options);
            }
          }

          trackPostSignature(post);
        }
      }
    } else {
      const query = 'div[role="feed"] > div';
      const posts = Array.from(document.querySelectorAll(query));
      if (posts.length) {
        for (const post of posts) {
          if (post.innerHTML.length === 0) {
            continue;
          }

          let hideReason = "";
          let alreadyHidden = false;

          const postChanged = hasPostChanged(post);
          if (postChanged) {
            resetPostState(post, state);
          }

          if (post.hasAttribute(postAtt)) {
            alreadyHidden = true;
          } else {
            doLightDusting(post, state);
            if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
              hideReason = isGroupsShortReelVideo(post, keyWords);
            }
            if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
              hideReason = findGroupsBlockedText(post, options, filters);
            }
            if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
              hideReason = hasGroupsAnimatedGifContent(post, keyWords);
            }
          }

          if (alreadyHidden || hideReason.length > 0) {
            state.echoCount += 1;
            if (!alreadyHidden) {
              hideGroupPost(post, hideReason, "", {
                options,
                keyWords,
                state,
              });
            }
          } else {
            state.echoCount = 0;
            if (options.GF_ANIMATED_GIFS_PAUSE) {
              swatTheMosquitos(post);
            }
            if (state.hideAnInfoBox) {
              scrubInfoBoxes(post, options, keyWords, pathInfo, state);
            }
            if (options.GF_SHARES) {
              hideNumberOfShares(post, state, options);
            }
          }

          trackPostSignature(post);
        }
      }
    }

    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
    }
    if (mainColumnToken !== null) {
      markElementCleanIfUnchanged(mainColumn, mainColumnToken);
    }
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.GF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    if (!elDialog.hasAttribute(mainColumnAtt)) {
      elDialog.setAttribute(mainColumnAtt, "1");
    }
    if (dialogToken !== null) {
      markElementCleanIfUnchanged(elDialog, dialogToken);
    }
    state.noChangeCounter = 0;
  }

  return { mainColumn, elDialog };
}

export { isGroupsShortReelVideo, isGroupsSuggested, mopGroupsFeed };
