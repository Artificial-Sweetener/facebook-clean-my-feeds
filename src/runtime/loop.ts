// SPDX-License-Identifier: GPL-3.0-only
import type { FeedState } from "../feeds/state";

/** The scheduler only needs mutable activity counters and route history. */
export type LoopState = Pick<FeedState, "isAF" | "forceProcess" | "noChangeCounter"> & {
  prevURL: string;
};

/** Browser effects are injected so controlled clocks can test scheduling and cleanup. */
export interface LoopEnvironment {
  window: Window;
  document: Document;
  now: () => number;
  createObserver: ((callback: MutationCallback) => MutationObserver) | undefined;
}

/** Hooks keep the lifecycle independent of concrete feed and route modules. */
export interface LoopHooks {
  updateRoute: () => void;
  process: (reason: string) => void;
}

/** Preserve the historical adaptive delay in milliseconds as idle scans accumulate. */
export function cleaningDelay(noChangeCounter: number): number {
  if (noChangeCounter < 16) return 50;
  if (noChangeCounter < 31) return 75;
  if (noChangeCounter < 46) return 100;
  if (noChangeCounter < 61) return 150;
  return 1000;
}

/**
 * Own one timer, one route poll and one observer for a page-processing lifecycle.
 *
 * Event-triggered runs replace the pending timer rather than growing duplicate loops.
 * Mutation notifications coalesce for 75 ms, and scroll movement must exceed 20 px.
 * Unexpected host DOM failures back off from one to thirty seconds without losing the loop;
 * a changed URL retries immediately so a broken old layout cannot disable the next feed.
 * A failed route transition stays pending and must succeed before any feed can process again.
 *
 * @param state - Shared mutable scan counters; option changes may force a pass in place.
 * @param hooks - Route classification and feed dispatch owned by the composition root.
 * @param environment - Browser capabilities, replaceable by test clocks and observers.
 * @returns An idempotent teardown that removes listeners and cancels all pending work.
 */
export function startLoop(
  state: LoopState,
  hooks: LoopHooks,
  environment: LoopEnvironment = {
    window,
    document,
    /** Use monotonic elapsed milliseconds so system-clock corrections cannot stall processing. */
    now: () => performance.now(),
    createObserver:
      typeof MutationObserver === "undefined"
        ? undefined
        : (callback) => new MutationObserver(callback),
  }
): () => void {
  const { window: browser, document: page, now, createObserver } = environment;
  let previousScroll = browser.scrollY;
  let lastAttemptedURL = state.prevURL;
  let routeUpdatePending = true;
  let lastCleaningTime = 0;
  let sleepDuration = 50;
  let timer: number | undefined;
  let mutationTimer: number | undefined;
  let stopped = false;
  let retryAt = 0;
  let consecutiveFailures = 0;

  /** Keep the next tick unique when a scroll, navigation or mutation preempts it. */
  function schedule(): void {
    if (stopped) return;
    if (timer !== undefined) browser.clearTimeout(timer);
    timer = browser.setTimeout(() => run("timing"), sleepDuration);
  }

  /**
   * Enforce adaptive throttling while bounding failures and preserving one retry timer.
   * @param reason Event origin; URL changes can bypass a failed old route's cooldown.
   */
  function run(reason: string): void {
    if (stopped) return;
    const currentTime = now();
    const force = state.forceProcess;
    const changedRoute = lastAttemptedURL !== browser.location.href;
    if (reason === "url-changed" || changedRoute) routeUpdatePending = true;
    if (currentTime < retryAt && !changedRoute) {
      if (reason === "timing") schedule();
      return;
    }
    if (reason === "scrolling") {
      if (sleepDuration < 151 && !force) return;
    } else if (
      reason !== "url-changed" &&
      currentTime - lastCleaningTime < sleepDuration &&
      !force
    ) {
      // A coarse/adjusted clock must not consume the only pending timer without replacing it.
      if (reason === "timing") schedule();
      return;
    }
    try {
      if (routeUpdatePending) {
        lastAttemptedURL = browser.location.href;
        hooks.updateRoute();
        routeUpdatePending = false;
      }
      if (!stopped) hooks.process(reason);
      consecutiveFailures = 0;
      retryAt = 0;
      sleepDuration = state.isAF ? cleaningDelay(state.noChangeCounter) : 1000;
    } catch {
      consecutiveFailures = Math.min(consecutiveFailures + 1, 6);
      sleepDuration = Math.min(1000 * 2 ** (consecutiveFailures - 1), 30000);
      retryAt = currentTime + sleepDuration;
      state.forceProcess = true;
    } finally {
      lastCleaningTime = currentTime;
      schedule();
    }
  }

  /** Ignore subpixel/short scroll motion to avoid scans while controls animate. */
  function onScroll(): void {
    const distance = Math.abs(browser.scrollY - previousScroll);
    previousScroll = browser.scrollY;
    if (distance > 20) {
      state.forceProcess = true;
      run("scrolling");
    }
  }

  /** Browser history navigation and SPA polling share the same reclassification path. */
  function onNavigation(): void {
    run("url-changed");
  }

  browser.addEventListener("scroll", onScroll);
  browser.addEventListener("popstate", onNavigation);
  const routePoll = browser.setInterval(() => {
    if (state.prevURL !== browser.location.href) run("url-changed");
  }, 500);
  const observer = createObserver?.(() => {
    if (!state.isAF || mutationTimer !== undefined || stopped) return;
    mutationTimer = browser.setTimeout(() => {
      mutationTimer = undefined;
      state.forceProcess = true;
      run("mutations");
    }, 75);
  });
  // Observe the document so replacing the entire body cannot strand the lifecycle on an old tree.
  observer?.observe(page, { childList: true, subtree: true });
  run("url-changed");

  return () => {
    if (stopped) return;
    stopped = true;
    if (timer !== undefined) browser.clearTimeout(timer);
    if (mutationTimer !== undefined) browser.clearTimeout(mutationTimer);
    browser.clearInterval(routePoll);
    observer?.disconnect();
    browser.removeEventListener("scroll", onScroll);
    browser.removeEventListener("popstate", onNavigation);
  };
}
