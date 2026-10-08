// SPDX-License-Identifier: GPL-3.0-only
import {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
} from "../feeds/shared/blocked-text";
import {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
} from "../feeds/shared/animated-gifs";
import { findNumberOfShares } from "../feeds/shared/shares";
import {
  isNewsEventsYouMayLike,
  isNewsAiInfoPost,
  isNewsFollow,
  isNewsMetaAICard,
  hasMetaAiPromptSuggestionRow,
  isNewsPaidPartnership,
  isNewsParticipate,
  isNewsPeopleYouMayKnow,
  isNewsReelsAndShortVideos,
  isNewsShortReelVideo,
  isNewsSponsoredPaidBy,
  isNewsStoriesPost,
  isNewsSuggested,
  postExceedsLikeCount,
} from "../feeds/news";
import { isGroupsShortReelVideo, isGroupsSuggested } from "../feeds/groups";
import { isInstagram, isVideoLive } from "../feeds/videos";
import { mpGetBlockedPrices, mpGetBlockedTextDescription } from "../feeds/marketplace";

import { isSponsored } from "../feeds/shared/sponsored";
import { hashText } from "./redaction";
import type { BugReportContext, MatchEvidence, DiagnosticCounts } from "./types";
import type { Filters } from "../core/filters/types";

/**
 * Record positive enabled-filter evidence and omit negative results to keep reports compact.
 * @param matches Mutable output map of positive, privacy-safe diagnostic evidence.
 * @param key Option or hashed-match name to add when evidence is positive.
 * @param value Text to hash; non-string or empty inputs intentionally yield no identifier.
 * @returns Nothing; positive evidence is stored in the supplied output map.
 */
export function addMatch(matches: MatchEvidence, key: string, value: unknown) {
  if (value) {
    matches[key] = true;
  }
}

/**
 * Run read-only news detectors and hash configured text matches without changing post state.
 * @param post Existing post root inspected read-only; no post content is serialized.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns Enabled news-filter flags and hashes of blocked-text matches.
 */
export function buildNewsMatches(post: HTMLElement, context: BugReportContext) {
  const { options, filters, keyWords, state } = context;
  const matches: MatchEvidence = {};
  addMatch(matches, "NF_SPONSORED", options.NF_SPONSORED && isSponsored(post, state));
  addMatch(
    matches,
    "NF_SUGGESTIONS",
    options.NF_SUGGESTIONS && isNewsSuggested(post, state, keyWords)
  );
  addMatch(
    matches,
    "NF_REELS_SHORT_VIDEOS",
    options.NF_REELS_SHORT_VIDEOS && isNewsReelsAndShortVideos(post, keyWords)
  );
  addMatch(
    matches,
    "NF_SHORT_REEL_VIDEO",
    options.NF_SHORT_REEL_VIDEO && isNewsShortReelVideo(post, keyWords)
  );
  addMatch(matches, "NF_META_AI", options.NF_META_AI && isNewsMetaAICard(post, keyWords));
  addMatch(
    matches,
    "NF_AI_INFO_POSTS",
    options.NF_AI_INFO_POSTS && isNewsAiInfoPost(post, keyWords)
  );
  addMatch(
    matches,
    "NF_META_AI_PROMPTS",
    options.NF_META_AI_PROMPTS && hasMetaAiPromptSuggestionRow(post)
  );
  addMatch(
    matches,
    "NF_PAID_PARTNERSHIP",
    options.NF_PAID_PARTNERSHIP && isNewsPaidPartnership(post, keyWords)
  );
  addMatch(
    matches,
    "NF_PEOPLE_YOU_MAY_KNOW",
    options.NF_PEOPLE_YOU_MAY_KNOW && isNewsPeopleYouMayKnow(post, keyWords)
  );
  addMatch(matches, "NF_FOLLOW", options.NF_FOLLOW && isNewsFollow(post, keyWords));
  addMatch(matches, "NF_PARTICIPATE", options.NF_PARTICIPATE && isNewsParticipate(post, keyWords));
  addMatch(
    matches,
    "NF_SPONSORED_PAID",
    options.NF_SPONSORED_PAID && isNewsSponsoredPaidBy(post, keyWords)
  );
  addMatch(
    matches,
    "NF_EVENTS_YOU_MAY_LIKE",
    options.NF_EVENTS_YOU_MAY_LIKE && isNewsEventsYouMayLike(post, keyWords)
  );
  addMatch(matches, "NF_STORIES", options.NF_STORIES && isNewsStoriesPost(post, keyWords));
  addMatch(
    matches,
    "NF_ANIMATED_GIFS_POSTS",
    options.NF_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
  );

  if (options.NF_BLOCKED_ENABLED) {
    const blockedText = findNewsBlockedText(post, options, filters);
    if (blockedText) {
      matches.NF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  if (options.NF_LIKES_MAXIMUM) {
    const likesMatch = postExceedsLikeCount(post, options, keyWords);
    if (likesMatch) {
      matches.NF_LIKES_MAXIMUM = true;
    }
  }

  if (options.NF_SHARES) {
    const shareMatches = findNumberOfShares(post);
    if (shareMatches > 0) {
      matches.NF_SHARES = true;
    }
  }

  return matches;
}

/**
 * Run enabled group detectors while keeping blocked text out of the report.
 * @param post Existing post root inspected read-only; no post content is serialized.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns Enabled group-filter flags and hashes of blocked-text matches.
 */
export function buildGroupsMatches(post: HTMLElement, context: BugReportContext) {
  const { options, filters, keyWords, state } = context;
  const matches: MatchEvidence = {};
  addMatch(matches, "GF_SPONSORED", options.GF_SPONSORED && isSponsored(post, state));
  addMatch(matches, "GF_SUGGESTIONS", options.GF_SUGGESTIONS && isGroupsSuggested(post, keyWords));
  addMatch(
    matches,
    "GF_SHORT_REEL_VIDEO",
    options.GF_SHORT_REEL_VIDEO && isGroupsShortReelVideo(post, keyWords)
  );
  addMatch(
    matches,
    "GF_ANIMATED_GIFS_POSTS",
    options.GF_ANIMATED_GIFS_POSTS && hasGroupsAnimatedGifContent(post, keyWords)
  );

  if (options.GF_BLOCKED_ENABLED) {
    const blockedText = findGroupsBlockedText(post, options, filters);
    if (blockedText) {
      matches.GF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  if (options.GF_SHARES) {
    const shareMatches = findNumberOfShares(post);
    if (shareMatches > 0) {
      matches.GF_SHARES = true;
    }
  }

  return matches;
}

/**
 * Collect enabled video-filter evidence from the active layout without modifying playback.
 * @param post Existing post root inspected read-only; no post content is serialized.
 * @param queryBlocks Layout-specific selector used to find video content blocks.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns Enabled video-filter flags and hashes of blocked-text matches.
 */
export function buildVideosMatches(
  post: HTMLElement,
  queryBlocks: string,
  context: BugReportContext
) {
  const { options, filters, keyWords, state } = context;
  const matches: MatchEvidence = {};
  addMatch(matches, "VF_SPONSORED", options.VF_SPONSORED && isSponsored(post, state));
  addMatch(matches, "VF_LIVE", options.VF_LIVE && isVideoLive(post, keyWords));
  addMatch(matches, "VF_INSTAGRAM", options.VF_INSTAGRAM && isInstagram(post, keyWords));

  if (options.VF_BLOCKED_ENABLED && queryBlocks) {
    const blockedText = findVideosBlockedText(post, options, filters, queryBlocks);
    if (blockedText) {
      matches.VF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  return matches;
}

/**
 * Collect profile GIF and blocked-text evidence without exposing matching keywords.
 * @param post Existing post root inspected read-only; no post content is serialized.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @returns Enabled profile-filter flags and hashes of blocked-text matches.
 */
export function buildProfileMatches(post: HTMLElement, context: BugReportContext) {
  const { options, filters, keyWords } = context;
  const matches: MatchEvidence = {};
  addMatch(
    matches,
    "PP_ANIMATED_GIFS_POSTS",
    options.PP_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
  );
  if (options.PP_BLOCKED_ENABLED) {
    const blockedText = findProfileBlockedText(post, options, filters);
    if (blockedText) {
      matches.PP_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }
  return matches;
}

/**
 * Hash price and description matches from the marketplace item text blocks.
 * @param item Marketplace item whose price and description blocks are inspected.
 * @param filters Materialized keyword lists used by the active filtering pass.
 * @returns Hashes of matched price and description filters, with no item content.
 */
export function buildMarketplaceMatches(item: HTMLElement, filters: Filters) {
  const matches: MatchEvidence = {};
  const queryTextBlock = ":scope > div > div:nth-of-type(2) > div";
  const blocksOfText = item.querySelectorAll<HTMLElement>(queryTextBlock);
  const priceBlock = blocksOfText[0];
  if (priceBlock) {
    const blockedPrices = mpGetBlockedPrices(priceBlock, filters);
    if (blockedPrices) {
      matches.MP_BLOCKED_TEXT_HASH = hashText(blockedPrices);
    }
    const blockedDesc = mpGetBlockedTextDescription(blocksOfText, filters, true);
    if (blockedDesc) {
      matches.MP_BLOCKED_TEXT_DESCRIPTION_HASH = hashText(blockedDesc);
    }
  }
  return matches;
}

/**
 * Count positive sample evidence so reports expose which enabled filters would match.
 * @param samples Previously collected per-post match maps to aggregate.
 * @returns Counts keyed by each positive flag or hashed-match category.
 */
export function buildMatchSummary(samples: readonly { matches: MatchEvidence }[]) {
  const summary: DiagnosticCounts = {};
  samples.forEach((sample) => {
    const matches = sample.matches || {};
    Object.keys(matches).forEach((key) => {
      const value = matches[key];
      if (value === true || (typeof value === "string" && value.trim() !== "")) {
        summary[key] = (summary[key] || 0) + 1;
      }
    });
  });
  return summary;
}
