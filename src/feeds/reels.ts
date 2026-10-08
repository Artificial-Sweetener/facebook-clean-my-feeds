// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState } from "./types";
import {
  pruneReelPresentations,
  reconcileReelPresentation,
  restoreReelsPresentation,
} from "./reels-presentation";

/** Timer ownership remains independent from route flags so failed route cleanup can be retried. */
type ReelLoopState = Pick<FeedProcessingState, "reelsTimer" | "isRF" | "isRF_InTimeoutMode">;

/** A weak lifecycle token prevents a retired or reentrant pass from starting another timer chain. */
interface ReelLoop {
  failures: number;
  processing: boolean;
}

const loops = new WeakMap<ReelLoopState, ReelLoop>();

/**
 * Own exactly one next pass, with one-to-thirty-second failure backoff and stale-callback checks.
 * @param context Live options and state retained only until its timer is cleared or fires.
 * @param loop Identity of the current polling lifecycle; stop/restart replaces this weak record.
 */
function scheduleReels(context: FeedContext, loop: ReelLoop): void {
  const { state } = context;
  if (!state.isRF || loops.get(state) !== loop) return;
  const delay = loop.failures === 0 ? 1000 : Math.min(1000 * 2 ** (loop.failures - 1), 30000);
  const timer = setTimeout(() => {
    if (loops.get(state) !== loop || state.reelsTimer !== timer) return;
    state.reelsTimer = null;
    state.isRF_InTimeoutMode = false;
    try {
      mopReelsFeed(context, "self");
    } catch {
      // Only inactive-route restoration can escape the scanner boundary; stop has already retired it.
    }
  }, delay);
  state.reelsTimer = timer;
  state.isRF_InTimeoutMode = true;
}

/**
 * Reconcile native controls and playback preferences for new and previously discovered Reels videos.
 * A feed-owned one-second poll observes asynchronously inserted videos. Host query/presentation
 * failures back off without escaping the timer or latching its reentrancy flag. Stop invalidates
 * in-flight work before restoration, so a retired pass cannot schedule another timer.
 * @param context Hydrated settings, locale, filters, and shared scan state; null leaves the page untouched.
 * @param caller The self timer can refresh an existing successful chain; callers cannot bypass failure backoff.
 * @returns The inspected video collection, or null when inactive, already scheduled, reentrant, or failed.
 */
function mopReelsFeed(context: FeedContext | null, caller = "self") {
  if (!context) return null;
  const { state, options } = context;
  if (!state || !options) return null;
  if (!state.isRF) {
    stopReelsProcessing(state);
    return null;
  }
  let loop = loops.get(state);
  if (!loop) {
    loop = { failures: 0, processing: false };
    loops.set(state, loop);
  }
  if (loop.processing || (state.reelsTimer !== null && (caller !== "self" || loop.failures > 0)))
    return null;
  if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
  state.reelsTimer = null;
  state.isRF_InTimeoutMode = false;
  loop.processing = true;
  try {
    const videos = document.querySelectorAll<HTMLVideoElement>("[data-video-id] video");
    if (!state.isRF || loops.get(state) !== loop) return null;
    const active = new Set<HTMLVideoElement>();
    for (const video of videos) {
      if (!(video instanceof HTMLVideoElement)) continue;
      active.add(video);
      reconcileReelPresentation(video, options, state.isChromium);
    }
    pruneReelPresentations(active);
    loop.failures = 0;
    return videos;
  } catch {
    loop.failures = Math.min(loop.failures + 1, 6);
    return null;
  } finally {
    loop.processing = false;
    scheduleReels(context, loop);
  }
}

export { mopReelsFeed };

/**
 * Retire timer ownership before fallible DOM cleanup without publishing a different route.
 * @param state The old Reels lifecycle; route flags remain unchanged until its caller commits navigation.
 * @throws Native restoration errors after timers and reentrancy state have already been cleared.
 */
export function releaseReelsProcessing(state: ReelLoopState): void {
  loops.delete(state);
  if (state.reelsTimer !== null) clearTimeout(state.reelsTimer);
  state.reelsTimer = null;
  state.isRF_InTimeoutMode = false;
  restoreReelsPresentation();
}

/** Cancel polling before teardown and prevent a pass already on the stack from rescheduling itself. */
export function stopReelsProcessing(state: ReelLoopState): void {
  state.isRF = false;
  releaseReelsProcessing(state);
}
