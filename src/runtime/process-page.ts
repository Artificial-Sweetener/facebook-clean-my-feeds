// SPDX-License-Identifier: GPL-3.0-only
import { pruneDirtyObservers } from "../dom/dirty-check";
import { mopGroupsFeed } from "../feeds/groups";
import { mopMarketplaceFeed } from "../feeds/marketplace";
import { mopNewsFeed } from "../feeds/news";
import { mopProfileFeed } from "../feeds/profile";
import { mopReelsFeed } from "../feeds/reels";
import { mopSearchFeed } from "../feeds/search";
import type { FeedContext } from "../feeds/types";
import { mopVideosFeed } from "../feeds/videos";

/** Dispatch one active feed; an inactive page must not consume its pending forced scan. */
export function processPage(context: FeedContext, eventType = "timing"): void {
  pruneDirtyObservers();
  const { state } = context;
  if (!state.isAF) return;
  if (state.isNF) mopNewsFeed(context);
  else if (state.isGF) mopGroupsFeed(context);
  else if (state.isVF) mopVideosFeed(context);
  else if (state.isMF) mopMarketplaceFeed(context);
  else if (state.isSF) mopSearchFeed(context);
  else if (state.isRF) mopReelsFeed(context, eventType === "timing" ? "sleeping" : eventType);
  else if (state.isPP) mopProfileFeed(context);
  state.forceProcess = false;
}
