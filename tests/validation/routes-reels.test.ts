// SPDX-License-Identifier: GPL-3.0-only

import { rvAtt } from "../../src/dom/attributes";
import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { cleanRouteDocument, element, requireElement, routeContext } from "./routes-fixtures";

/** Attach a Reel's playback surface, interaction overlay and separate description container. */
function appendReel(id: string, description = true): HTMLVideoElement {
  const holder = document.createElement("section");
  holder.innerHTML = `<div><div data-video-id="${id}"><video id="${id}" loop></video><div id="${id}-overlay"></div></div></div>${description ? `<div><div id="${id}-description">Description</div></div>` : ""}`;
  document.body.appendChild(holder);
  return requireElement(holder.querySelector("video"));
}

afterEach(cleanRouteDocument);

describe("Reels controls and polling contracts", () => {
  test.each(
    [true, false].flatMap((controls) =>
      [true, false].map((disableLooping) => ({ controls, disableLooping }))
    )
  )(
    "controls=$controls and disable looping=$disableLooping remain independent",
    ({ controls, disableLooping }) => {
      jest.useFakeTimers();
      const context = routeContext("/reel/100/", {
        REELS_CONTROLS: controls,
        REELS_DISABLE_LOOPING: disableLooping,
      });
      const video = appendReel("first");
      const pause = jest.spyOn(video, "pause").mockImplementation(() => undefined);
      document.body.insertAdjacentHTML("beforeend", '<video id="ordinary-video" loop></video>');
      mopReelsFeed(context, "runtime");
      expect(video.controls).toBe(controls);
      expect(video.hasAttribute(rvAtt)).toBe(controls || disableLooping);
      expect(element("first-overlay").getAttribute("style")).toBe(
        controls ? "display:none;" : null
      );
      expect(element("first-description").getAttribute("style")).toBe(
        controls ? "margin-bottom:2.25rem;" : null
      );
      video.dispatchEvent(new Event("ended"));
      expect(pause).toHaveBeenCalledTimes(disableLooping ? 1 : 0);
      expect(element("ordinary-video").hasAttribute(rvAtt)).toBe(false);
      expect(element("ordinary-video").hasAttribute("controls")).toBe(false);
      expect(jest.getTimerCount()).toBe(controls || disableLooping ? 1 : 0);
      stopReelsProcessing(context.state);
    }
  );

  test.each([true, false])(
    "description spacing reflects Chromium=%s without replacing description text",
    (isChromium) => {
      jest.useFakeTimers();
      const context = routeContext("/reel/100/", { REELS_CONTROLS: true });
      context.state.isChromium = isChromium;
      appendReel("first");
      mopReelsFeed(context);
      expect(element("first-description").getAttribute("style")).toBe(
        `margin-bottom:${isChromium ? "4.5" : "2.25"}rem;`
      );
      expect(element("first-description").textContent).toBe("Description");
      stopReelsProcessing(context.state);
    }
  );

  test("late videos get controls without duplicate polling chains or ended listeners", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/100/", {
      REELS_CONTROLS: true,
      REELS_DISABLE_LOOPING: true,
    });
    const first = appendReel("first");
    const pause = jest.spyOn(first, "pause").mockImplementation(() => undefined);
    mopReelsFeed(context, "runtime");
    expect(mopReelsFeed(context, "runtime")).toBeNull();
    const second = appendReel("second");
    jest.advanceTimersByTime(3000);
    expect(second.controls).toBe(true);
    expect(jest.getTimerCount()).toBe(1);
    first.dispatchEvent(new Event("ended"));
    expect(pause).toHaveBeenCalledTimes(1);
    stopReelsProcessing(context.state);
    expect(jest.getTimerCount()).toBe(0);
    const third = appendReel("third");
    jest.advanceTimersByTime(3000);
    expect(third.controls).toBe(false);
  });

  test("missing description or video ID does not hide unrelated page overlays", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/100/", { REELS_CONTROLS: true });
    const video = appendReel("incomplete", false);
    document.body.insertAdjacentHTML(
      "beforeend",
      '<section id="unrelated"><video></video><div id="unrelated-overlay">Do not hide</div></section>'
    );
    expect(() => mopReelsFeed(context)).not.toThrow();
    expect(video.controls).toBe(false);
    expect(element("incomplete-overlay").hasAttribute("style")).toBe(false);
    expect(element("unrelated-overlay").hasAttribute("style")).toBe(false);
    stopReelsProcessing(context.state);
  });

  test("leaving the Reels route cancels the existing timer before another video is inserted", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/100/", { REELS_CONTROLS: true });
    appendReel("first");
    mopReelsFeed(context);
    context.state.isRF = false;
    expect(mopReelsFeed(context, "runtime")).toBeNull();
    expect(context.state.isRF_InTimeoutMode).toBe(false);
    expect(context.state.reelsTimer).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
    expect(appendReel("second").controls).toBe(false);
  });
});
