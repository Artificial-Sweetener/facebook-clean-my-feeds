// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState } from "./types";
import {
  pruneReelPresentations,
  reconcileReelPresentation,
  restoreReelsPresentation,
} from "./reels-presentation";

/**
 * Reconcile native controls and playback preferences for new and previously discovered Reels videos.
 * A feed-owned one-second poll observes asynchronously inserted videos; outside callers cannot
 * spawn a second chain, and runtime teardown explicitly cancels the retained timer.
 * @param context Hydrated settings, locale, filters, and shared scan state; null leaves the page untouched.
 * @param caller The self timer bypasses the reentrancy guard; other callers respect the active timer.
 * @returns The inspected video collection, or null when the feed or timer guard prevents a pass.
 */
function mopReelsFeed(context: FeedContext | null, caller = "self") {
  if (!context) {
    return null;
  }

  const { state, options } = context;
  if (!state || !options) {
    return null;
  }

  if (!state.isRF) {
    stopReelsProcessing(state);
    return null;
  }
  if (caller !== "self" && state.isRF_InTimeoutMode === true) {
    return null;
  }

  const videos = document.querySelectorAll<HTMLVideoElement>("[data-video-id] video");
  const active = new Set<HTMLVideoElement>();
  for (const video of videos) {
    if (!(video instanceof HTMLVideoElement)) continue;
    active.add(video);
    reconcileReelPresentation(video, options, state.isChromium);
  }
  pruneReelPresentations(active);

  state.isRF_InTimeoutMode = true;
  if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
  state.reelsTimer = setTimeout(() => {
    state.reelsTimer = null;
    mopReelsFeed(context, "self");
  }, 1000);

  return videos;
}

export { mopReelsFeed };

/** Cancel the feed-owned polling chain before page teardown or a later startup can replace it. */
export function stopReelsProcessing(
  state: Pick<FeedProcessingState, "reelsTimer" | "isRF" | "isRF_InTimeoutMode">
): void {
  if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
  restoreReelsPresentation();
  state.reelsTimer = null;
  state.isRF = false;
  state.isRF_InTimeoutMode = false;
}
