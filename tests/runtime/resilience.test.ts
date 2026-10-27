// SPDX-License-Identifier: GPL-3.0-only

import {
  clearDirtyTracking,
  ensureDirtyObserver,
  hasPostChanged,
  trackPostSignature,
} from "../../src/dom/dirty-check";
import { startLoop, type LoopState } from "../../src/runtime/loop";
import { setFeedSettings } from "../../src/runtime/routes";
import { createState } from "../../src/runtime/state";
import { processPage } from "../../src/runtime/process-page";
import { restoreFeedPresentation } from "../../src/feeds/reset";
import { createNewsContext } from "../feeds/news-fixtures";

/** Run the production scheduler against controllable wall time and native isolated mutation delivery. */
function createLoop(process: (reason: string) => void, now: () => number = () => Date.now()) {
  const state: LoopState = { isAF: true, forceProcess: false, noChangeCounter: 0, prevURL: "" };
  const stop = startLoop(
    state,
    {
      /** Acknowledge URL changes exactly as the real route classifier does. */
      updateRoute: () => {
        state.prevURL = window.location.href;
      },
      process,
    },
    {
      window,
      document,
      now,
      /** Preserve native microtask delivery so body replacement and churn exercise real observation. */
      createObserver: (callback) => new MutationObserver(callback),
    }
  );
  return { state, stop };
}

describe("runtime failure recovery and resource ownership", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1000 });
  });
  afterEach(() => {
    clearDirtyTracking();
    jest.useRealTimers();
    history.replaceState({}, "", "/");
    document.body.replaceChildren();
  });

  test("one throwing feed pass recovers without orphaning the recurring timer", () => {
    const process = jest.fn().mockImplementationOnce(() => {
      throw new Error("Detached host layout");
    });
    const loop = createLoop(process);
    expect(process).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(2);
    jest.advanceTimersByTime(1000);
    expect(process).toHaveBeenCalledTimes(2);
    loop.stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("teardown during a pass cannot reinstall work from the scheduler's finally block", () => {
    const cleanup: { stop?: () => void } = {};
    const loop = createLoop(() => cleanup.stop?.());
    cleanup.stop = loop.stop;
    jest.advanceTimersByTime(50);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("persistent failures back off despite forced scroll and mutation churn", async () => {
    const process = jest.fn(() => {
      throw new Error("Unavailable host API");
    });
    const loop = createLoop(process);
    for (let index = 0; index < 100; index += 1) {
      loop.state.forceProcess = true;
      Object.defineProperty(window, "scrollY", { configurable: true, value: index * 30 });
      window.dispatchEvent(new Event("scroll"));
      document.body.append(document.createElement("span"));
    }
    await Promise.resolve();
    jest.advanceTimersByTime(60000);
    expect(process.mock.calls.length).toBeLessThanOrEqual(6);
    expect(jest.getTimerCount()).toBe(2);
    loop.stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("route-classification exceptions obey backoff even before prevURL can be updated", () => {
    const state: LoopState = { isAF: true, forceProcess: false, noChangeCounter: 0, prevURL: "" };
    const updateRoute = jest.fn(() => {
      throw new Error("Unavailable route DOM");
    });
    const stop = startLoop(state, { updateRoute, process: jest.fn() });
    jest.advanceTimersByTime(60_000);
    expect(updateRoute.mock.calls.length).toBeLessThanOrEqual(6);
    stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("new navigation can recover immediately during an old route's backoff", () => {
    const process = jest.fn().mockImplementationOnce(() => {
      throw new Error("Old route failure");
    });
    const loop = createLoop(process);
    history.pushState({}, "", "/groups/feed/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(process).toHaveBeenCalledTimes(2);
    loop.stop();
  });

  test("a coarse clock cannot consume the only scheduled tick", () => {
    let now = 1000;
    const process = jest.fn();
    const loop = createLoop(process, () => now);
    jest.advanceTimersByTime(50);
    expect(process).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(2);
    now += 50;
    jest.advanceTimersByTime(50);
    expect(process).toHaveBeenCalledTimes(2);
    loop.stop();
  });

  test("body replacement retains mutation wakeups and teardown leaves no timers", async () => {
    const process = jest.fn();
    const loop = createLoop(process);
    const body = document.createElement("body");
    document.body.replaceWith(body);
    await Promise.resolve();
    jest.advanceTimersByTime(75);
    expect(process).toHaveBeenCalledWith("mutations");
    loop.stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("removed caption roots cannot retain a detached feed through state", () => {
    const context = createNewsContext();
    const root = document.createElement("div");
    const caption = document.createElement("div");
    root.append(caption);
    document.body.append(root);
    context.state.echoEl = caption;
    context.state.echoCount = 2;
    context.state.echoCPID = "old-posts";
    root.remove();
    context.state.isAF = false;
    processPage(context);
    expect(context.state.echoEl).toBeNull();
    expect(context.state.echoCount).toBe(0);
    expect(context.state.echoCPID).toBe("");
    context.state.echoEl = caption;
    restoreFeedPresentation(context.state);
    expect(context.state.echoEl).toBeNull();
  });

  test("cached SPA roots lose observers on every navigation but retain weak post identity", () => {
    const state = createState();
    const retainedRoots: Element[] = [];
    const disconnects: jest.SpyInstance[] = [];
    for (let index = 0; index < 40; index += 1) {
      setFeedSettings(state, {}, false, {
        href: `https://www.facebook.com/groups/${index}/`,
        pathname: `/groups/${index}/`,
        search: "",
      });
      const root = document.createElement("div");
      root.textContent = "Old content";
      document.body.append(root);
      retainedRoots.push(root);
      expect(state.echoEl).toBeNull();
      state.echoEl = root;
      trackPostSignature(root);
      const observer = ensureDirtyObserver(root);
      if (!observer) throw new Error("Expected root observation");
      disconnects.push(jest.spyOn(observer, "disconnect"));
    }
    expect(disconnects.slice(0, -1).every((spy) => spy.mock.calls.length === 1)).toBe(true);
    expect(disconnects.at(-1)).not.toHaveBeenCalled();
    const first = retainedRoots[0];
    if (!first) throw new Error("Expected retained Facebook cache fixture");
    first.textContent = "New content";
    expect(hasPostChanged(first)).toBe(true);
    clearDirtyTracking();
    expect(disconnects.every((spy) => spy.mock.calls.length === 1)).toBe(true);
  });
});
