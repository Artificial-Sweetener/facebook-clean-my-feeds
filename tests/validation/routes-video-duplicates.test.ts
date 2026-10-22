// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopVideosFeed } from "../../src/feeds/videos";
import { resetFeedProcessing } from "../../src/feeds/reset";
import {
  cleanRouteDocument,
  element,
  mountVideos,
  routeContext,
  videoPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

/** Keep the identity in the video's own header, separate from authored body links. */
function clip(id: string, href: string, extra = ""): string {
  return videoPost(id, "Community clip", `<h4><a href="${href}">Video</a></h4>${extra}`);
}

describe("video duplicate ownership and lifecycle", () => {
  test.each(["/watch", "/watch/?v=100"])("%s hides later copies by canonical ID", (route) => {
    const context = routeContext(route, { VF_DUPLICATE_VIDEOS: true });
    mountVideos(
      route,
      clip("first", "/watch/?v=100") +
        clip("copy", "/creator/videos/100/") +
        clip("other", "/watch/?v=1000")
    );
    mopVideosFeed(context);
    expect(element("first").hasAttribute(postAtt)).toBe(false);
    expect(element("copy").getAttribute(postAtt)).toBe(context.keyWords.VF_DUPLICATE_VIDEOS);
    expect(element("copy").hasAttribute(context.state.hideAtt)).toBe(true);
    expect(element("other").hasAttribute(postAtt)).toBe(false);
  });

  test.each(["0", "1", "2"])(
    "verbosity %s restores the survivor when its first copy disappears",
    (verbosity) => {
      const context = routeContext("/watch", {
        VF_DUPLICATE_VIDEOS: true,
        VERBOSITY_LEVEL: verbosity,
      });
      mountVideos(
        "/watch",
        clip("first", "/watch/?v=100") + clip("copy", "/watch/?ref=feed&v=100")
      );
      mopVideosFeed(context);
      expect(element("copy").getAttribute(postAtt)).toBe(context.keyWords.VF_DUPLICATE_VIDEOS);
      context.state.forceProcess = true;
      const observer = new MutationObserver(() => undefined);
      observer.observe(element("copy"), { attributes: true });
      mopVideosFeed(context);
      expect(observer.takeRecords()).toHaveLength(0);
      observer.disconnect();
      element("first").remove();
      mopVideosFeed(context);
      expect(element("copy").hasAttribute(postAtt)).toBe(false);
      expect(element("copy").hasAttribute(context.state.hideAtt)).toBe(false);
      expect(element("copy").closest(`details[${postAtt}]`)).toBeNull();
    }
  );

  test("authored, concealed, nested and external links cannot duplicate another video", () => {
    const context = routeContext("/watch", { VF_DUPLICATE_VIDEOS: true });
    mountVideos(
      "/watch",
      clip("first", "/watch/?v=100") +
        videoPost("body", '<div><span><a href="/watch/?v=100">My favorite clip</a></span></div>') +
        clip("external", "https://example.com/watch/?v=100") +
        videoPost("hidden", "Loading", '<h4 hidden><a href="/watch/?v=100">Video</a></h4>') +
        videoPost(
          "nested",
          "Shared clip",
          '<div role="article"><h4><a href="/watch/?v=100">Video</a></h4></div>'
        ) +
        clip("multiple-links", "/watch/?v=200", '<h4><a href="/watch/?v=200">Open video</a></h4>')
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      '<h4><a href="/watch/?v=200">Outside feed</a></h4>'
    );
    mopVideosFeed(context);
    for (const id of ["first", "body", "external", "hidden", "nested", "multiple-links"])
      expect(element(id).hasAttribute(postAtt)).toBe(false);
  });

  test("a copy hidden by another filter does not suppress the first eligible video", () => {
    const context = routeContext("/watch", {
      VF_DUPLICATE_VIDEOS: true,
      VF_SPONSORED: true,
    });
    mountVideos(
      "/watch",
      clip("ad", "/watch/?v=100", '<h4><a href="/ads/about/">Sponsored</a></h4>') +
        clip("organic", "/watch/?v=100") +
        clip("copy", "/watch/?v=100")
    );
    mopVideosFeed(context);
    expect(element("ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    expect(element("organic").hasAttribute(postAtt)).toBe(false);
    expect(element("copy").getAttribute(postAtt)).toBe(context.keyWords.VF_DUPLICATE_VIDEOS);
  });

  test("late identities and reused slots are reclassified before duplicate decisions", () => {
    const context = routeContext("/watch", { VF_DUPLICATE_VIDEOS: true });
    mountVideos("/watch", clip("first", "/watch/?v=100") + videoPost("copy", "Loading"));
    mopVideosFeed(context);
    element("copy").insertAdjacentHTML("beforeend", '<h4><a href="/watch/?v=100">Video</a></h4>');
    context.state.forceProcess = true;
    mopVideosFeed(context);
    expect(element("copy").getAttribute(postAtt)).toBe(context.keyWords.VF_DUPLICATE_VIDEOS);
    element("copy").querySelector("h4 a")?.setAttribute("href", "/watch/?v=200");
    mopVideosFeed(context);
    expect(element("copy").hasAttribute(postAtt)).toBe(false);
    context.options.VF_DUPLICATE_VIDEOS = false;
    resetFeedProcessing(context.state);
    element("copy").querySelector("h4 a")?.setAttribute("href", "/watch/?v=100");
    mopVideosFeed(context);
    expect(element("copy").hasAttribute(postAtt)).toBe(false);
  });
});
