// SPDX-License-Identifier: GPL-3.0-only

import { rvAtt } from "../../src/dom/attributes";
import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { resetFeedProcessing, restoreFeedPresentation } from "../../src/feeds/reset";
import { cleanRouteDocument, element, requireElement, routeContext } from "./routes-fixtures";

/** Supply native video defaults and unrelated inline style properties for ownership restoration. */
function setupReel(): HTMLVideoElement {
  document.body.innerHTML =
    '<section id="holder"><div><div data-video-id="1"><video id="video" loop></video><div id="overlay" style="opacity:0.5;"></div></div></div><div><div id="description" style="color:red;">Original description</div></div></section><aside id="outside" style="color:blue;">Unrelated content</aside>';
  return requireElement(document.querySelector("video"));
}

afterEach(cleanRouteDocument);

describe("Reels reversible native-media ownership", () => {
  test("loop preference disables native looping and restores original media attributes on exit", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true });
    const video = setupReel();
    const pause = jest.spyOn(video, "pause").mockImplementation(() => undefined);
    mopReelsFeed(context);
    expect(video.loop).toBe(false);
    expect(video.controls).toBe(true);
    video.dispatchEvent(new Event("ended"));
    expect(pause).toHaveBeenCalledTimes(1);
    stopReelsProcessing(context.state);
    expect(video.loop).toBe(true);
    expect(video.controls).toBe(false);
    expect(video.hasAttribute(rvAtt)).toBe(false);
    expect(element("overlay").getAttribute("style")).toBe("opacity:0.5;");
    expect(element("description").getAttribute("style")).toBe("color:red;");
    expect(element("outside").getAttribute("style")).toBe("color:blue;");
    video.dispatchEvent(new Event("ended"));
    expect(pause).toHaveBeenCalledTimes(1);
  });

  test("settings changes reconcile existing media without accumulating ended listeners", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true });
    const video = setupReel();
    const pause = jest.spyOn(video, "pause").mockImplementation(() => undefined);
    mopReelsFeed(context);
    context.options.REELS_CONTROLS = false;
    context.options.REELS_DISABLE_LOOPING = false;
    resetFeedProcessing(context.state);
    jest.advanceTimersByTime(1000);
    expect(video.controls).toBe(false);
    expect(video.loop).toBe(true);
    video.dispatchEvent(new Event("ended"));
    expect(pause).not.toHaveBeenCalled();
    context.options.REELS_DISABLE_LOOPING = true;
    resetFeedProcessing(context.state);
    jest.advanceTimersByTime(3000);
    expect(video.loop).toBe(false);
    video.dispatchEvent(new Event("ended"));
    expect(pause).toHaveBeenCalledTimes(1);
    stopReelsProcessing(context.state);
  });

  test("already-native controls and non-looping playback survive CMF teardown", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true });
    const video = setupReel();
    video.setAttribute("controls", "");
    video.removeAttribute("loop");
    mopReelsFeed(context);
    restoreFeedPresentation(context.state);
    expect(video.getAttribute("controls")).toBe("");
    expect(video.loop).toBe(false);
    stopReelsProcessing(context.state);
  });

  test("later page edits to styles are not overwritten while CMF restores its changes", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
    setupReel();
    mopReelsFeed(context);
    element("description").setAttribute("style", "color:green;");
    element("overlay").setAttribute("style", "opacity:0.8;");
    stopReelsProcessing(context.state);
    expect(element("description").getAttribute("style")).toBe("color:green;");
    expect(element("overlay").getAttribute("style")).toBe("opacity:0.8;");
  });

  test("polling restores replaced overlay nodes and modifies their replacements independently", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
    setupReel();
    mopReelsFeed(context);
    const previousOverlay = element("overlay");
    const nextOverlay = document.createElement("div");
    nextOverlay.id = "replacement-overlay";
    nextOverlay.setAttribute("style", "opacity:0.2;");
    previousOverlay.replaceWith(nextOverlay);
    jest.advanceTimersByTime(1000);
    expect(previousOverlay.getAttribute("style")).toBe("opacity:0.5;");
    expect(nextOverlay.style.display).toBe("none");
    expect(nextOverlay.style.opacity).toBe("0.2");
    stopReelsProcessing(context.state);
    expect(nextOverlay.getAttribute("style")).toBe("opacity:0.2;");
  });

  test("detached media is restored and its listener released on the next poll", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true });
    const video = setupReel();
    const pause = jest.spyOn(video, "pause").mockImplementation(() => undefined);
    mopReelsFeed(context);
    element("holder").remove();
    jest.advanceTimersByTime(1000);
    expect(video.controls).toBe(false);
    expect(video.loop).toBe(true);
    expect(video.hasAttribute(rvAtt)).toBe(false);
    video.dispatchEvent(new Event("ended"));
    expect(pause).not.toHaveBeenCalled();
    stopReelsProcessing(context.state);
  });

  test("missing description remains retryable without disturbing unrelated content", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
    const video = setupReel();
    const description = element("description");
    requireElement(description.parentElement).remove();
    mopReelsFeed(context);
    expect(video.controls).toBe(false);
    element("holder").insertAdjacentHTML(
      "beforeend",
      '<div><div id="late-description" style="font-size:12px;">Arrived</div></div>'
    );
    jest.advanceTimersByTime(1000);
    expect(video.controls).toBe(true);
    expect(element("outside").getAttribute("style")).toBe("color:blue;");
    stopReelsProcessing(context.state);
    expect(element("late-description").getAttribute("style")).toBe("font-size:12px;");
  });
  test.each([false, true])(
    "unrelated page property edits survive restoration after extra polling=%s",
    (pollAgain) => {
      jest.useFakeTimers();
      const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
      setupReel();
      element("overlay").style.display = "flex";
      element("description").style.marginBottom = "1rem";
      mopReelsFeed(context);
      element("overlay").style.opacity = "0.8";
      element("description").style.color = "green";
      if (pollAgain) jest.advanceTimersByTime(1000);
      expect(element("overlay").style.opacity).toBe("0.8");
      expect(element("description").style.color).toBe("green");
      expect(element("overlay").style.display).toBe("none");
      expect(element("description").style.marginBottom).toBe("2.25rem");
      stopReelsProcessing(context.state);
      expect(element("overlay").style.display).toBe("flex");
      expect(element("description").style.marginBottom).toBe("1rem");
      expect(element("overlay").style.opacity).toBe("0.8");
      expect(element("description").style.color).toBe("green");
    }
  );

  test.each([false, true])(
    "native edits to owned CSS declarations survive restoration after extra polling=%s",
    (pollAgain) => {
      jest.useFakeTimers();
      const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
      setupReel();
      mopReelsFeed(context);
      element("overlay").style.setProperty("display", "grid", "important");
      element("description").style.setProperty("margin-bottom", "3rem", "important");
      if (pollAgain) jest.advanceTimersByTime(1000);
      stopReelsProcessing(context.state);
      expect(element("overlay").style.display).toBe("grid");
      expect(element("overlay").style.getPropertyPriority("display")).toBe("important");
      expect(element("description").style.marginBottom).toBe("3rem");
      expect(element("description").style.getPropertyPriority("margin-bottom")).toBe("important");
      expect(element("overlay").style.opacity).toBe("0.5");
      expect(element("description").style.color).toBe("red");
    }
  );
});
