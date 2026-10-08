// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopVideosFeed } from "../../src/feeds/videos";
import { resetFeedProcessing } from "../../src/feeds/reset";
import {
  cleanRouteDocument,
  element,
  gifControl,
  mountVideos,
  nested,
  routeContext,
  videoPost,
  videoSearchPost,
} from "./routes-fixtures";

const regularRoutes = ["/watch", "/watch/?v=100", "/watch/?ref=seach"];
const allRoutes = [...regularRoutes, "/watch/search"];
const liveMarkup = '<div role="presentation"></div><div><div><span>LIVE</span></div></div>';
const instagramMarkup = nested('<a href="#"><div><svg aria-label="Instagram"></svg></div></a>', 5);

afterEach(cleanRouteDocument);

describe("video route option integration", () => {
  test.each(regularRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route VF_LIVE=$enabled protects ordinary Live prose",
    ({ route, enabled }) => {
      const context = routeContext(route, { VF_LIVE: enabled });
      mountVideos(
        route,
        videoPost("live", "Streaming a concert", liveMarkup) +
          videoPost("ordinary", "Live music from last year")
      );
      mopVideosFeed(context);
      expect(element("live").getAttribute(postAtt)).toBe(enabled ? context.keyWords.VF_LIVE : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(regularRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route VF_INSTAGRAM=$enabled uses attribution structure rather than mentions",
    ({ route, enabled }) => {
      const context = routeContext(route, { VF_INSTAGRAM: enabled });
      mountVideos(
        route,
        videoPost("instagram", "A cross-posted clip", instagramMarkup) +
          videoPost("ordinary", '<a href="https://www.instagram.com/">My Instagram profile</a>')
      );
      mopVideosFeed(context);
      expect(element("instagram").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.VF_INSTAGRAM : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(regularRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route VF_SPONSORED=$enabled filters ad posts without hiding ordinary Sponsored prose",
    ({ route, enabled }) => {
      const context = routeContext(route, { VF_SPONSORED: enabled });
      mountVideos(
        route,
        videoPost("ad", "Ad creative", '<h4><a href="/ads/about/">Sponsored</a></h4>') +
          videoPost("ordinary", "Sponsored a local walk last week") +
          videoPost("body-disclosure", '<a href="/ads/about/">Sponsored</a>')
      );
      mopVideosFeed(context);
      expect(element("ad").getAttribute(postAtt)).toBe(enabled ? context.keyWords.SPONSORED : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("body-disclosure").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(allRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route VF_BLOCKED_ENABLED=$enabled scans its own content-block layout",
    ({ route, enabled }) => {
      const context = routeContext(route, {
        VF_BLOCKED_ENABLED: enabled,
        VF_BLOCKED_TEXT: "unwanted",
      });
      const post = context.state.vfType === "search" ? videoSearchPost : videoPost;
      mountVideos(route, post("blocked", "Unwanted video") + post("ordinary", "Community concert"));
      mopVideosFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "unwanted" : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("video search intentionally omits non-text feed filters", () => {
    const context = routeContext("/watch/search", {
      VF_SPONSORED: true,
      VF_LIVE: true,
      VF_INSTAGRAM: true,
      VF_DUPLICATE_VIDEOS: true,
      VF_ANIMATED_GIFS_PAUSE: true,
    });
    mountVideos(
      "/watch/search",
      videoSearchPost(
        "post",
        '<a href="/ads/about/">Sponsored</a>',
        liveMarkup + instagramMarkup + gifControl()
      )
    );
    const click = jest.spyOn(element("gif"), "click");
    mopVideosFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(click).not.toHaveBeenCalled();
  });

  test.each([true, false])(
    "VF_ANIMATED_GIFS_PAUSE=%s activates only visible GIF controls",
    (enabled) => {
      const context = routeContext("/watch", { VF_ANIMATED_GIFS_PAUSE: enabled });
      mountVideos(
        "/watch",
        videoPost("post", gifControl()) + videoPost("ordinary", "GIF is a file format")
      );
      const click = jest.spyOn(element("gif"), "click");
      mopVideosFeed(context);
      context.state.forceProcess = true;
      mopVideosFeed(context);
      expect(click).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(element("post").hasAttribute(postAtt)).toBe(false);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("hidden videos do not activate GIF controls", () => {
    const context = routeContext("/watch", { VF_LIVE: true, VF_ANIMATED_GIFS_PAUSE: true });
    mountVideos("/watch", videoPost("post", gifControl(), liveMarkup));
    const click = jest.spyOn(element("gif"), "click");
    mopVideosFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe(context.keyWords.VF_LIVE);
    expect(click).not.toHaveBeenCalled();
  });

  test("VF_DUPLICATE_VIDEOS disabled leaves repeated and distinct video links unchanged", () => {
    const context = routeContext("/watch", { VF_DUPLICATE_VIDEOS: false });
    mountVideos(
      "/watch",
      ["100", "100", "200"]
        .map((id, index) =>
          videoPost(
            `post-${index}`,
            `<div><span><a href="/watch/?v=${id}&ref=feed">Video</a></span></div>`
          )
        )
        .join("")
    );
    mopVideosFeed(context);
    for (let index = 0; index < 3; index += 1)
      expect(element(`post-${index}`).hasAttribute(postAtt)).toBe(false);
  });

  test("too-shallow video placeholders and standalone anchors are protected", () => {
    const context = routeContext("/watch", {
      VF_SPONSORED: true,
      VF_LIVE: true,
      VF_INSTAGRAM: true,
    });
    mountVideos(
      "/watch",
      '<div id="placeholder"><a href="/ads/about/">Loading Sponsored content</a></div>' +
        videoPost("ordinary", "Loading complete")
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      '<a id="outside" href="/ads/about/">Advertising information</a>'
    );
    mopVideosFeed(context);
    expect(element("placeholder").hasAttribute(postAtt)).toBe(false);
    expect(element("outside").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  });

  test.each(allRoutes)("%s recycled identity is reclassified and unhidden", (route) => {
    const context = routeContext(route, { VF_BLOCKED_ENABLED: true, VF_BLOCKED_TEXT: "unwanted" });
    const post = context.state.vfType === "search" ? videoSearchPost : videoPost;
    mountVideos(route, post("post", "Unwanted concert"));
    mopVideosFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
    element("post").innerHTML = post("replacement", "A new community event");
    context.state.forceProcess = true;
    mopVideosFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test("saved settings remove existing video hide markers before the next pass", () => {
    const context = routeContext("/watch", { VF_LIVE: true });
    mountVideos("/watch", videoPost("post", "A concert", liveMarkup));
    mopVideosFeed(context);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(true);
    context.options.VF_LIVE = false;
    resetFeedProcessing(context.state);
    mopVideosFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
  });
  test.each(allRoutes)("%s supports the standalone video main-column layout", (route) => {
    const context = routeContext(route, { VF_BLOCKED_ENABLED: true, VF_BLOCKED_TEXT: "unwanted" });
    const post = context.state.vfType === "search" ? videoSearchPost : videoPost;
    const dialogMain = mountVideos(route, post("post", "Unwanted video"));
    const content = dialogMain.innerHTML;
    document.body.innerHTML = `<div role="navigation"></div><div role="main"><div role="main">${nested(`<div id="video-root">${content}</div>`, 4)}</div></div>`;
    expect(mopVideosFeed(context)?.mainColumn?.id).toBe("video-root");
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
  });

  test.each([true, false])("VF_BLOCKED_RE=%s reaches the video matching mode", (enabled) => {
    const context = routeContext("/watch/search", {
      VF_BLOCKED_ENABLED: true,
      VF_BLOCKED_RE: enabled,
      VF_BLOCKED_TEXT: "offer[0-9]+",
    });
    mountVideos("/watch/search", videoSearchPost("post", "offer123"));
    mopVideosFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe(enabled ? "offer[0-9]+" : null);
  });

  test.each(["1", "0"])(
    "GF_BLOCKED_FEED video destination=%s controls imported text rules",
    (destination) => {
      const context = routeContext("/watch", {
        VF_BLOCKED_ENABLED: true,
        GF_BLOCKED_ENABLED: true,
        GF_BLOCKED_TEXT: "unwanted",
        GF_BLOCKED_FEED: ["0", "1", destination],
      });
      mountVideos("/watch", videoPost("post", "Unwanted offer"));
      mopVideosFeed(context);
      expect(element("post").getAttribute(postAtt)).toBe(destination === "1" ? "unwanted" : null);
    }
  );
});
