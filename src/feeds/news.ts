// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext } from "./types";
import { mainColumnAtt, postAtt, postAttTab } from "../dom/attributes";
import { swatTheMosquitos } from "../dom/animated-gifs";
import {
  ensureDirtyObserver,
  getDirtyToken,
  markElementCleanIfUnchanged,
} from "../dom/dirty-check";
import { doLightDusting } from "../dom/dusting";
import { hideNewsPost } from "../dom/hide";
import { scrubInfoBoxes } from "../dom/info-boxes";
import { newsSelectors } from "../selectors/news";
import { findNewsBlockedText } from "./shared/blocked-text";
import { hasNewsAnimatedGifContent } from "./shared/animated-gifs";
import { isSponsored } from "./shared/sponsored";
import { hideNumberOfShares } from "./shared/shares";
import {
  isNewsDirty,
  getCollectionOfNewsPosts,
  scrubOrphanSponsoredNewsPosts,
  shouldSweepNewsPosts,
} from "./news-discovery";
export * from "./news-discovery";
import {
  isNewsSuggested,
  isNewsPeopleYouMayKnow,
  isNewsPaidPartnership,
  isNewsSponsoredPaidBy,
  isNewsReelsAndShortVideos,
  isNewsShortReelVideo,
  isNewsEventsYouMayLike,
  isNewsFollow,
  isNewsParticipate,
  isNewsMetaAICard,
  isNewsAiInfoPost,
  isNewsStoriesPost,
  isNewsVerifiedBadge,
  postExceedsLikeCount,
} from "./news-detectors";
export * from "./news-detectors";
import { scrubRightRailSponsored, scrubRightRailSuggestions } from "./news-right-rail";
export * from "./news-right-rail";
import {
  scrubTabbies,
  scrubSurvey,
  scrubTopCardsForPages,
  scrubVerifiedBadges,
  scrubSidePanelAi,
} from "./news-features";
export * from "./news-features";
import { scrubMetaAiPromptSuggestions } from "./news-meta-ai";
import { rememberHiddenNewsContent, resetChangedNewsPosts } from "./news-revalidation";
import { restoreNewsPresentation } from "./news-presentation";
export * from "./news-meta-ai";

/**
 * Separate page-layout cleanup from periodic post discovery so late-rendered ads and AI prompt rows can be found without an HTML-length change.
 * Dirty main roots trigger top-card and suggestion cleanup; either dirty root triggers badge cleanup. Eligible sweeps process AI sidebars, right-rail/orphan ads, and posts using the first enabled matching reason.
 * Unchanged already-marked posts are retained; recycled content is reclassified; visible posts may have GIFs paused, info boxes scrubbed, and share counts hidden. Dialog handling also pauses GIFs when enabled.
 * The pass records the sweep timestamp and acknowledges only roots that were dirty when the pass began.
 * @param context News options, localized reasons, and blocked-text filters supply classification; shared state receives presentation markers, sweep timing, and idle-counter updates. Null skips all discovery.
 * @returns The current main/dialog roots, or null when neither root is dirty and no periodic sweep is due.
 */
export function mopNewsFeed(context: FeedContext | null) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  if (!options.NF_HIDE_VERIFIED_BADGE) restoreNewsPresentation("badge");
  if (!options.NF_AI_SIDE_PANELS) restoreNewsPresentation("sidebar");

  const [dirtyMainColumn, dirtyDialog] = isNewsDirty(state);
  const mainColumn = dirtyMainColumn || document.querySelector(newsSelectors.mainColumn);
  const elDialog = dirtyDialog || document.querySelector(newsSelectors.dialog);
  const shouldSweepPosts = shouldSweepNewsPosts(state, mainColumn, !!dirtyMainColumn);

  if (!dirtyMainColumn && !dirtyDialog && !shouldSweepPosts) {
    return null;
  }

  const mainToken = getDirtyToken(dirtyMainColumn);
  const dialogToken = getDirtyToken(dirtyDialog);
  if (shouldSweepPosts) resetChangedNewsPosts(mainColumn, state);

  if (dirtyMainColumn) {
    if (options.NF_TABLIST_STORIES_REELS_ROOMS) {
      scrubTabbies(context);
    }
    if (options.NF_SURVEY) {
      scrubSurvey(context);
    }
    if (options.NF_TOP_CARDS_PAGES) {
      scrubTopCardsForPages(context);
    }
    if (options.NF_SUGGESTIONS) {
      scrubRightRailSuggestions(context);
    }
  }

  if (options.NF_HIDE_VERIFIED_BADGE && (dirtyMainColumn || dirtyDialog)) {
    scrubVerifiedBadges(context);
  }
  if (options.NF_AI_SIDE_PANELS && shouldSweepPosts) {
    scrubSidePanelAi(context);
  }

  if (options.NF_SPONSORED && shouldSweepPosts) {
    scrubRightRailSponsored(context);
    scrubOrphanSponsoredNewsPosts(context, mainColumn);
  }

  if (mainColumn && options.NF_META_AI_PROMPTS && shouldSweepPosts) {
    scrubMetaAiPromptSuggestions(context, mainColumn);
  }

  if (mainColumn && shouldSweepPosts) {
    const posts = getCollectionOfNewsPosts();
    for (const post of posts) {
      if (!post.hasChildNodes()) {
        continue;
      }

      let hideReason = "";
      let isSponsoredPost = false;

      const alreadyProcessed = post.hasAttribute(postAtt);
      if (!alreadyProcessed) {
        doLightDusting(post, state);

        if (hideReason === "" && options.NF_REELS_SHORT_VIDEOS) {
          hideReason = isNewsReelsAndShortVideos(post, keyWords);
        }
        if (hideReason === "" && options.NF_SHORT_REEL_VIDEO) {
          hideReason = isNewsShortReelVideo(post, keyWords);
        }
        if (hideReason === "" && options.NF_META_AI) {
          hideReason = isNewsMetaAICard(post, keyWords);
        }
        if (hideReason === "" && options.NF_AI_INFO_POSTS) {
          hideReason = isNewsAiInfoPost(post, keyWords);
        }
        if (hideReason === "" && options.NF_PAID_PARTNERSHIP) {
          hideReason = isNewsPaidPartnership(post, keyWords);
        }
        if (hideReason === "" && options.NF_PEOPLE_YOU_MAY_KNOW) {
          hideReason = isNewsPeopleYouMayKnow(post, keyWords);
        }
        if (hideReason === "" && options.NF_SUGGESTIONS) {
          hideReason = isNewsSuggested(post, state, keyWords);
        }
        if (hideReason === "" && options.NF_FOLLOW) {
          hideReason = isNewsFollow(post, keyWords);
        }
        if (hideReason === "" && options.NF_PARTICIPATE) {
          hideReason = isNewsParticipate(post, keyWords);
        }
        if (hideReason === "" && options.NF_SPONSORED_PAID) {
          hideReason = isNewsSponsoredPaidBy(post, keyWords);
        }
        if (hideReason === "" && options.NF_EVENTS_YOU_MAY_LIKE) {
          hideReason = isNewsEventsYouMayLike(post, keyWords);
        }
        if (hideReason === "" && options.NF_FILTER_VERIFIED_BADGE) {
          hideReason = isNewsVerifiedBadge(post, keyWords);
        }
        if (hideReason === "" && options.NF_STORIES) {
          hideReason = isNewsStoriesPost(post, keyWords);
        }
        if (hideReason === "" && options.NF_ANIMATED_GIFS_POSTS) {
          hideReason = hasNewsAnimatedGifContent(post, keyWords);
        }
        if (hideReason === "" && options.NF_SPONSORED && isSponsored(post, state)) {
          isSponsoredPost = true;
          hideReason = keyWords.SPONSORED;
        }
        if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
          hideReason = findNewsBlockedText(post, options, filters);
        }
        if (hideReason === "" && options.NF_LIKES_MAXIMUM) {
          hideReason = postExceedsLikeCount(post, options, keyWords) || "";
        }
      }

      if (hideReason.length > 0) {
        hideNewsPost(post, hideReason, isSponsoredPost, {
          options,
          keyWords,
          attributes: {
            postAtt,
            postAttTab,
          },
          state,
        });
      } else if (!alreadyProcessed) {
        if (options.NF_ANIMATED_GIFS_PAUSE) {
          swatTheMosquitos(post);
        }
        if (state.hideAnInfoBox) {
          scrubInfoBoxes(post, options, keyWords, pathInfo, state);
        }
        if (options.NF_SHARES) {
          hideNumberOfShares(post, state, options);
        }
      }
      rememberHiddenNewsContent(post);
    }

    state.lastNewsPostSweepAt = Date.now();
  }

  if (dirtyMainColumn && mainColumn) {
    acknowledgeNewsRoot(mainColumn, mainToken);
    state.noChangeCounter = 0;
  }

  if (dirtyDialog && elDialog) {
    if (options.NF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    acknowledgeNewsRoot(elDialog, dialogToken);
    state.noChangeCounter = 0;
  }

  return { mainColumn, elDialog };
}

/**
 * Mark observer-owned roots without serializing their descendants; retain size fallback otherwise.
 * Mutations produced by this scan remain queued and can request one reconciliation pass.
 */
function acknowledgeNewsRoot(root: Element, token: number): void {
  if (ensureDirtyObserver(root)) {
    if (!root.hasAttribute(mainColumnAtt)) root.setAttribute(mainColumnAtt, "1");
    markElementCleanIfUnchanged(root, token);
  } else {
    root.setAttribute(mainColumnAtt, root.innerHTML.length.toString());
  }
}
