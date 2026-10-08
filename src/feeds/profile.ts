// SPDX-License-Identifier: GPL-3.0-only

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
import { hidePost } from "../dom/hide";
import { scrubInfoBoxes } from "../dom/info-boxes";
import { profileSelectors } from "../selectors/profile";

import { findProfileBlockedText } from "./shared/blocked-text";
import { hasNewsAnimatedGifContent } from "./shared/animated-gifs";

/**
 * Register independent observers for the profile's main root and current dialog, marking newly discovered roots for their first pass.
 * Forced processing dirties existing roots; this discovery helper leaves acknowledgement to the profile processor.
 * @param state forceProcess overrides observer cleanliness; noChangeCounter increments once for each discovery attempt.
 * @returns Main and dialog roots requiring work, in that order, with null for clean or missing roots.
 */
function isProfileColumnDirty(state: FeedProcessingState): DirtyFeedRoots {
  const arrReturn: DirtyFeedRoots = [null, null];
  const mainColumn = document.querySelector(profileSelectors.mainColumn);
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

  const elDialog = document.querySelector(profileSelectors.dialog);
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

const profilePermalinkSelectors = [
  'a[href*="/posts/"]',
  'a[href*="/story.php"]',
  'a[href*="/permalink/"]',
  'a[href*="permalink.php"]',
];

/**
 * Normalize a supported post destination without treating tracking fragments as another post.
 * Path-based links retain publisher ownership; query-based story links retain their post ID.
 */
function profilePermalinkIdentity(link: Element): string {
  const href = link.getAttribute("href") ?? "";
  try {
    const url = new URL(href, document.baseURI);
    if (url.pathname.endsWith("story.php") || url.pathname.endsWith("permalink.php")) {
      const story = url.searchParams.get("story_fbid");
      return story
        ? `${url.origin}${url.pathname}?story_fbid=${story}`
        : `${url.origin}${url.pathname}${url.search}`;
    }
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return href;
  }
}

/**
 * Prefer the outer owned post boundary even when its body links to related posts or comments.
 * Without an explicit boundary, climb only through ancestors containing one distinct post destination.
 * The profile root and wrappers combining independent posts are never selected.
 * @param mainColumn Boundary containing profile posts; null or a root without supported permalinks yields an empty list.
 * @returns Deduplicated explicit post roots or single-permalink fallback ancestors, in discovery order.
 */
function getProfilePostsFromPermalinks(mainColumn: Element | null) {
  if (!mainColumn) {
    return [];
  }

  const selector = profilePermalinkSelectors.join(",");
  const permalinks = Array.from(mainColumn.querySelectorAll(selector));
  if (permalinks.length === 0) {
    return [];
  }

  const containers = new Set<Element>();

  for (const link of permalinks) {
    let node = link.parentElement;
    let lastSingle = null;
    const explicitPost = link.closest('div[aria-posinset], div[role="article"]');
    if (explicitPost && explicitPost !== mainColumn && mainColumn.contains(explicitPost)) {
      let ownedPost: Element = explicitPost;
      let enclosing: Element | null | undefined = explicitPost.parentElement?.closest(
        'div[aria-posinset], div[role="article"]'
      );
      while (enclosing && enclosing !== mainColumn && mainColumn.contains(enclosing)) {
        ownedPost = enclosing;
        enclosing = enclosing.parentElement?.closest('div[aria-posinset], div[role="article"]');
      }
      containers.add(ownedPost);
      continue;
    }

    while (node && node !== mainColumn) {
      const identities = new Set(
        Array.from(node.querySelectorAll(selector), profilePermalinkIdentity)
      );
      if (identities.size === 1) {
        lastSingle = node;
      } else {
        break;
      }
      node = node.parentElement;
    }

    if (lastSingle) {
      containers.add(lastSingle);
    }
  }

  return Array.from(containers);
}

/**
 * Run only when a profile blocked-text, animated-post, or GIF-pause option is enabled, then discover posts from their permalinks.
 * Recycled posts lose stale markers before GIF/text classification. Visible posts may pause GIFs or scrub info boxes, and dirty dialogs may pause GIFs.
 * A main root with no discoverable posts returns before clean-token acknowledgement, allowing later markup to be retried.
 * @param context PP options and text filters select profile actions; keyword copy supplies hiding reasons and state tracks observer-driven progress. Null leaves the page untouched.
 * @returns The dirty profile/dialog roots, or null when relevant options are disabled or no root needs processing.
 */
function mopProfileFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const proceed =
    options.PP_BLOCKED_ENABLED || options.PP_ANIMATED_GIFS_POSTS || options.PP_ANIMATED_GIFS_PAUSE;
  if (!proceed) {
    return null;
  }

  const [mainColumn, elDialog] = isProfileColumnDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
  const dialogToken = elDialog ? getDirtyToken(elDialog) : null;
  revalidateTrackedPosts(mainColumn, state);

  if (mainColumn) {
    const posts = getProfilePostsFromPermalinks(mainColumn);
    if (posts.length === 0) {
      return { mainColumn, elDialog };
    }

    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      let alreadyHidden = false;
      const isSponsoredPost = false;

      const postChanged = hasPostChanged(post);
      if (postChanged) {
        resetPostState(post, state);
      }

      if (post.hasAttribute(postAtt)) {
        alreadyHidden = true;
      } else {
        if (hideReason === "" && options.PP_ANIMATED_GIFS_POSTS) {
          hideReason = hasNewsAnimatedGifContent(post, keyWords);
        }
        if (hideReason === "" && options.PP_BLOCKED_ENABLED) {
          hideReason = findProfileBlockedText(post, options, filters);
        }
      }

      if (alreadyHidden || hideReason.length > 0) {
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
        if (options.PP_ANIMATED_GIFS_PAUSE) {
          swatTheMosquitos(post);
        }
        if (state.hideAnInfoBox) {
          scrubInfoBoxes(post, options, keyWords, pathInfo, state);
        }
      }

      trackPostSignature(post);
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
    if (options.PP_ANIMATED_GIFS_PAUSE) {
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

export { getProfilePostsFromPermalinks, mopProfileFeed };
