// SPDX-License-Identifier: GPL-3.0-only
import { cleaningDelay, startLoop, type LoopState } from "../../src/runtime/loop";

/** A real observer-shaped test double exposes callbacks without depending on jsdom batching. */
class ControlledObserver implements MutationObserver {
  static latest: ControlledObserver | undefined;
  readonly observe = jest.fn<void, [Node, MutationObserverInit?]>();
  readonly disconnect = jest.fn<void, []>();
  readonly takeRecords = jest.fn<MutationRecord[], []>(() => []);

  /** Capture the callback so tests can deliver deterministic synthetic mutation batches. */
  constructor(readonly callback: MutationCallback) {
    ControlledObserver.latest = this;
  }
}

/**
 * Start an isolated lifecycle while retaining mutable counters and observable processing calls.
 * @returns The running test lifecycle, retained state, spies and idempotent cleanup function.
 */
function setupLoop() {
  const state: LoopState = {
    isAF: true,
    forceProcess: false,
    noChangeCounter: 0,
    prevURL: window.location.href,
  };
  const process = jest.fn(() => {
    state.forceProcess = false;
  });
  const updateRoute = jest.fn(() => {
    state.prevURL = window.location.href;
  });
  const stop = startLoop(
    state,
    { process, updateRoute },
    {
      window,
      document,
      /** Read the Jest-controlled clock instead of real elapsed time. */
      now: () => Date.now(),
      /** Expose the observer callback to deliver deterministic mutation batches. */
      createObserver: (callback) => new ControlledObserver(callback),
    }
  );
  return { state, process, updateRoute, stop };
}

describe("runtime scheduling ownership", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test.each([
    [0, 50],
    [15, 50],
    [16, 75],
    [31, 100],
    [46, 150],
    [61, 1000],
  ])("counter %s yields %s ms", (count, delay) => {
    expect(cleaningDelay(count ?? 0)).toBe(delay);
  });

  test("document-start observation survives a body that arrives after startup", () => {
    const earlyPage = document.implementation.createHTMLDocument("early startup");
    earlyPage.body.remove();
    const state: LoopState = {
      isAF: true,
      forceProcess: false,
      noChangeCounter: 0,
      prevURL: window.location.href,
    };
    const stop = startLoop(
      state,
      { updateRoute: jest.fn(), process: jest.fn() },
      {
        window,
        document: earlyPage,
        /** Use the controlled clock while the fixture has no body element. */
        now: () => Date.now(),
        /** Retain bootstrap observation without introducing a second observer generation. */
        createObserver: (callback) => new ControlledObserver(callback),
      }
    );
    const observer = ControlledObserver.latest;
    expect(observer?.observe).toHaveBeenCalledWith(earlyPage, { childList: true, subtree: true });
    stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("forced scrolling replaces the timer rather than duplicating recurring chains", () => {
    const loop = setupLoop();
    expect(jest.getTimerCount()).toBe(2);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 100 });
    window.dispatchEvent(new Event("scroll"));
    expect(loop.process).toHaveBeenCalledTimes(2);
    expect(jest.getTimerCount()).toBe(2);
    jest.advanceTimersByTime(50);
    expect(loop.process).toHaveBeenCalledTimes(3);
    loop.stop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("mutation batches coalesce and cleanup prevents pending callbacks", () => {
    const loop = setupLoop();
    const observer = ControlledObserver.latest;
    if (!observer) throw new Error("Expected the lifecycle observer");
    observer.callback([], observer);
    observer.callback([], observer);
    expect(jest.getTimerCount()).toBe(3);
    jest.advanceTimersByTime(75);
    expect(loop.process).toHaveBeenCalledWith("mutations");
    loop.stop();
    loop.stop();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("history and SPA polling reclassify routes while repeated lifecycles clean up", () => {
    const first = setupLoop();
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(first.updateRoute).toHaveBeenCalledTimes(2);
    first.state.prevURL = "https://www.facebook.com/old";
    jest.advanceTimersByTime(500);
    expect(first.updateRoute).toHaveBeenCalledTimes(3);
    first.stop();
    const second = setupLoop();
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(first.updateRoute).toHaveBeenCalledTimes(3);
    expect(second.updateRoute).toHaveBeenCalledTimes(2);
    second.stop();
  });

  test("inactive pages ignore mutation processing and tiny scroll movements", () => {
    const loop = setupLoop();
    loop.state.isAF = false;
    const observer = ControlledObserver.latest;
    if (!observer) throw new Error("Expected the lifecycle observer");
    observer.callback([], observer);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 20 });
    window.dispatchEvent(new Event("scroll"));
    expect(loop.process).toHaveBeenCalledTimes(1);
    expect(jest.getTimerCount()).toBe(2);
    loop.stop();
  });
});
