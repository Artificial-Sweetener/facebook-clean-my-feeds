// SPDX-License-Identifier: GPL-3.0-only

import { clearDirtyTracking } from "../../src/dom/dirty-check";
import {
  reconcileNewsPresentation,
  restoreNewsPresentation,
} from "../../src/feeds/news-presentation";
import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { startLoop } from "../../src/runtime/loop";
import { setFeedSettings } from "../../src/runtime/routes";
import { createState } from "../../src/runtime/state";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Record route flags through the real classifier while permitting one injected classification failure. */
function setupRouteLoop(beforeUpdate?: () => void) {
  const state = createState();
  const seen: Array<{ pathname: string; isNF: boolean; isGF: boolean }> = [];
  const stop = startLoop(state, {
    /** A throwing precondition must not allow a pass using old route flags. */
    updateRoute: () => {
      beforeUpdate?.();
      setFeedSettings(state, state.options);
    },
    /** Retain only routing evidence; no fixture feed mutations can hide a stale-dispatch failure. */
    process: () => {
      seen.push({ pathname: window.location.pathname, isNF: state.isNF, isGF: state.isGF });
      state.forceProcess = false;
    },
  });
  return { state, seen, stop };
}

beforeEach(() => {
  jest.useFakeTimers({ now: 1000 });
  history.replaceState({}, "", "/");
});
afterEach(() => {
  jest.restoreAllMocks();
  restoreNewsPresentation();
  clearDirtyTracking();
  jest.useRealTimers();
  history.replaceState({}, "", "/");
  document.body.replaceChildren();
});

describe("route transition recovery without stale feed dispatch", () => {
  test("a timing retry completes a failed route update before processing the new URL", () => {
    let fail = false;
    const loop = setupRouteLoop(() => {
      if (fail) {
        fail = false;
        throw new Error("Transient route failure");
      }
    });
    jest.advanceTimersByTime(125);
    history.pushState({}, "", "/groups/feed/");
    fail = true;
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(loop.state.prevURL).toBe("http://localhost/");
    jest.advanceTimersByTime(1000);
    const newRouteScans = loop.seen.filter(({ pathname }) => pathname === "/groups/feed/");
    expect(newRouteScans.length).toBeGreaterThan(0);
    expect(newRouteScans.every(({ isNF, isGF }) => !isNF && isGF)).toBe(true);
    loop.stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("real presentation cleanup failure leaves route identity uncommitted until recovery", () => {
    const badge = document.createElement("span");
    document.body.append(badge);
    const loop = setupRouteLoop();
    reconcileNewsPresentation("badge", new Map([[badge, ["display"]]]), "cmf-badge");
    jest.spyOn(badge, "removeAttribute").mockImplementationOnce(() => {
      throw new Error("Transient badge restoration failure");
    });
    jest.advanceTimersByTime(125);
    const previous = loop.state.prevURL;
    history.pushState({}, "", "/groups/feed/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(loop.state.prevURL).toBe(previous);
    expect(loop.state.prevPathname).toBe("/");
    expect(loop.state.isNF).toBe(true);
    expect(loop.state.isGF).toBe(false);
    jest.advanceTimersByTime(1000);
    expect(loop.state.prevPathname).toBe("/groups/feed/");
    expect(loop.state.isNF).toBe(false);
    expect(loop.state.isGF).toBe(true);
    expect(
      loop.seen.filter(({ pathname }) => pathname === "/groups/feed/").every(({ isGF }) => isGF)
    ).toBe(true);
    expect(badge.hasAttribute("style")).toBe(false);
    loop.stop();
  });

  test("unsupported routes hide controls even while presentation restoration is retrying", () => {
    const state = createState();
    state.showAtt = "cmf-visible";
    state.btnToggleEl = document.createElement("button");
    const dialog = document.createElement("div");
    dialog.id = "fbcmf";
    const badge = document.createElement("span");
    document.body.append(dialog, badge, state.btnToggleEl);
    setFeedSettings(state, {}, false, new URL("https://www.facebook.com/"));
    dialog.setAttribute(state.showAtt, "");
    state.btnToggleEl.setAttribute("data-cmf-open", "true");
    reconcileNewsPresentation("badge", new Map([[badge, ["display"]]]), "cmf-badge");
    jest.spyOn(badge, "removeAttribute").mockImplementationOnce(() => {
      throw new Error("Transient badge restoration failure");
    });
    const next = new URL("https://www.facebook.com/settings/privacy/");
    expect(() => setFeedSettings(state, {}, false, next)).toThrow();
    expect(state.prevPathname).toBe("/");
    expect(state.isNF).toBe(true);
    expect(state.btnToggleEl.hasAttribute(state.showAtt)).toBe(false);
    expect(state.btnToggleEl.hasAttribute("data-cmf-open")).toBe(false);
    expect(dialog.hasAttribute(state.showAtt)).toBe(false);
    expect(setFeedSettings(state, {}, false, next)).toBe(true);
    expect(state.isAF).toBe(false);
  });

  test("Reels cleanup failure preserves old route flags while retiring the old timer", () => {
    const state = createState();
    const options = createNewsContext({ options: { REELS_CONTROLS: true } });
    Object.assign(state, options.state);
    state.options = options.options;
    setFeedSettings(state, options.options, false, {
      href: "https://www.facebook.com/reel/one/",
      pathname: "/reel/one/",
      search: "",
    });
    document.body.innerHTML =
      '<section><div><div data-video-id="one"><video></video><div></div></div></div><div><span>Description</span></div></section>';
    const context = { ...options, state };
    mopReelsFeed(context, "timing");
    const video = requireElement(document.querySelector("video"));
    jest.spyOn(video, "removeAttribute").mockImplementationOnce(() => {
      throw new Error("Transient Reel restoration failure");
    });
    const next = {
      href: "https://www.facebook.com/groups/feed/",
      pathname: "/groups/feed/",
      search: "",
    };
    expect(() => setFeedSettings(state, options.options, false, next)).toThrow(
      "Transient Reel restoration failure"
    );
    expect(state.prevPathname).toBe("/reel/one/");
    expect(state.isRF).toBe(true);
    expect(state.isGF).toBe(false);
    expect(state.isRF_InTimeoutMode).toBe(false);
    expect(state.reelsTimer).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
    expect(setFeedSettings(state, options.options, false, next)).toBe(true);
    expect(state.isRF).toBe(false);
    expect(state.isGF).toBe(true);
    expect(video.controls).toBe(false);
    stopReelsProcessing(state);
  });
});
