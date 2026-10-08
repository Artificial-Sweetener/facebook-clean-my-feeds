// SPDX-License-Identifier: GPL-3.0-only

import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { restoreReelsPresentation } from "../../src/feeds/reels-presentation";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Mount one isolated Reel using production media controls and a separate description overlay. */
function setupReels() {
  document.body.innerHTML =
    '<section><div><div data-video-id="one"><video></video><div></div></div></div><div><span>Description</span></div></section>';
  const context = createNewsContext({
    options: { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true },
  });
  context.state.isRF = true;
  const video = requireElement(document.querySelector("video"));
  return { context, video };
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.restoreAllMocks();
  restoreReelsPresentation();
  jest.useRealTimers();
  document.body.replaceChildren();
});

describe("Reels self-timer failure recovery", () => {
  test("a throwing self tick owns one retry and recovers without an uncaught timer error", () => {
    const { context, video } = setupReels();
    mopReelsFeed(context, "timing");
    const query = jest.spyOn(document, "querySelectorAll").mockImplementationOnce(() => {
      throw new Error("Transient host query failure");
    });
    expect(() => jest.advanceTimersByTime(1000)).not.toThrow();
    expect(query).toHaveBeenCalledTimes(1);
    expect(context.state.isRF_InTimeoutMode).toBe(true);
    expect(context.state.reelsTimer).not.toBeNull();
    expect(jest.getTimerCount()).toBe(1);
    for (let index = 0; index < 10; index += 1) mopReelsFeed(context, "timing");
    expect(query).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(1000);
    expect(query).toHaveBeenCalledTimes(2);
    expect(video.controls).toBe(true);
    expect(jest.getTimerCount()).toBe(1);
    stopReelsProcessing(context.state);
    expect(context.state.isRF_InTimeoutMode).toBe(false);
    expect(context.state.reelsTimer).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("persistent query failures back off and outside calls cannot create another chain", () => {
    const { context } = setupReels();
    const query = jest.spyOn(document, "querySelectorAll").mockImplementation(() => {
      throw new Error("Unavailable Reels layout");
    });
    mopReelsFeed(context, "timing");
    for (let index = 0; index < 100; index += 1) mopReelsFeed(context);
    expect(query).toHaveBeenCalledTimes(1);
    expect(() => jest.advanceTimersByTime(60_000)).not.toThrow();
    expect(query.mock.calls.length).toBeLessThanOrEqual(6);
    expect(jest.getTimerCount()).toBe(1);
    stopReelsProcessing(context.state);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("stopping during a scan cannot reapply presentation or reschedule its finally block", () => {
    const { context, video } = setupReels();
    const original = document.querySelectorAll.bind(document);
    jest.spyOn(document, "querySelectorAll").mockImplementationOnce((selector) => {
      stopReelsProcessing(context.state);
      return original(selector);
    });
    mopReelsFeed(context, "timing");
    expect(video.controls).toBe(false);
    expect(context.state.isRF).toBe(false);
    expect(context.state.isRF_InTimeoutMode).toBe(false);
    expect(context.state.reelsTimer).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("restoration failure still clears ownership before stop exits", () => {
    const { context, video } = setupReels();
    mopReelsFeed(context, "timing");
    jest.spyOn(video, "removeAttribute").mockImplementationOnce(() => {
      throw new Error("Transient restoration failure");
    });
    expect(() => stopReelsProcessing(context.state)).toThrow("Transient restoration failure");
    expect(context.state.isRF).toBe(false);
    expect(context.state.isRF_InTimeoutMode).toBe(false);
    expect(context.state.reelsTimer).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
    jest.advanceTimersByTime(60_000);
    expect(jest.getTimerCount()).toBe(0);
    stopReelsProcessing(context.state);
    expect(video.controls).toBe(false);
  });
});
