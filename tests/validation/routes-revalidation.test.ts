// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttMPSkip } from "../../src/dom/attributes";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { getProfilePostsFromPermalinks, mopProfileFeed } from "../../src/feeds/profile";
import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { resetFeedProcessing } from "../../src/feeds/reset";
import {
  cleanRouteDocument,
  element,
  requireElement,
  routeContext,
  textPost,
} from "./routes-fixtures";
import { listing, mountMarketplace } from "./routes-marketplace-fixtures";

afterEach(cleanRouteDocument);

describe("approved route marker, identity and settings regressions", () => {
  test("Marketplace recycled visible card is hidden after new blocked description arrives", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("post", "$50", "Perfect chair"));
    mopMarketplaceFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("");
    requireElement(
      element("post").querySelector("a > div > div:nth-of-type(2) > div:nth-of-type(2)")
    ).textContent = "Damaged chair";
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("damaged");
  });

  test("Marketplace recycled hidden card restores visibility for a new safe listing", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("post", "$50", "Damaged chair"));
    mopMarketplaceFeed(context);
    expect(element("post").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    requireElement(
      element("post").querySelector("a > div > div:nth-of-type(2) > div:nth-of-type(2)")
    ).textContent = "Perfect chair";
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("post").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });

  test("mixed Marketplace layout families filter every matching card", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      listing("deep", "$50", "Damaged chair", "deep") +
        listing("shallow", "$50", "Damaged table", "shallow")
    );
    mopMarketplaceFeed(context);
    expect(element("deep").getAttribute(postAtt)).toBe("damaged");
    expect(element("shallow").getAttribute(postAtt)).toBe("damaged");
  });

  test("profile post with duplicate same-post permalink references still filters its body", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    document.body.innerHTML = `<div role="main" id="profile-root">${textPost("post", 'Unwanted content <a href="/publisher/posts/100/">Comment permalink</a>', '<a href="/publisher/posts/100/">Timestamp permalink</a>')}${textPost("ordinary", "News", '<a href="/publisher/posts/200/">Timestamp</a>')}</div>`;
    mopProfileFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
  });

  test("Reels option enable after first pass applies controls to an already marked video", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", {
      REELS_CONTROLS: false,
      REELS_DISABLE_LOOPING: true,
    });
    document.body.innerHTML =
      '<section><div><div data-video-id="1"><video></video><div></div></div></div><div><div>Description</div></div></section>';
    const video = requireElement(document.querySelector("video"));
    mopReelsFeed(context);
    context.options.REELS_CONTROLS = true;
    resetFeedProcessing(context.state);
    jest.advanceTimersByTime(1000);
    expect(video.controls).toBe(true);
    stopReelsProcessing(context.state);
  });

  test("Reels option disable after first pass stops pausing ended videos", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true, REELS_DISABLE_LOOPING: true });
    document.body.innerHTML =
      '<section><div><div data-video-id="1"><video></video><div></div></div></div><div><div>Description</div></div></section>';
    const video = requireElement(document.querySelector("video"));
    const pause = jest.spyOn(video, "pause").mockImplementation(() => undefined);
    mopReelsFeed(context);
    context.options.REELS_DISABLE_LOOPING = false;
    resetFeedProcessing(context.state);
    jest.advanceTimersByTime(1000);
    video.dispatchEvent(new Event("ended"));
    stopReelsProcessing(context.state);
    expect(pause).not.toHaveBeenCalled();
  });

  test("Reels controls become available when a late description overlay arrives", () => {
    jest.useFakeTimers();
    const context = routeContext("/reel/1/", { REELS_CONTROLS: true });
    document.body.innerHTML =
      '<section id="reel-holder"><div><div data-video-id="1"><video></video><div></div></div></div></section>';
    const video = requireElement(document.querySelector("video"));
    mopReelsFeed(context);
    element("reel-holder").insertAdjacentHTML(
      "beforeend",
      "<div><div>Description arrives later</div></div>"
    );
    jest.advanceTimersByTime(1000);
    expect(video.controls).toBe(true);
    stopReelsProcessing(context.state);
  });
  test("same-length Marketplace edits invalidate a manual skip only when content changes", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("post", "$50", "Perfect chair"));
    element("post").setAttribute(postAttMPSkip, String(element("post").innerHTML.length));
    mopMarketplaceFeed(context);
    expect(element("post").hasAttribute(postAttMPSkip)).toBe(true);
    const originalLength = element("post").innerHTML.length;
    requireElement(
      element("post").querySelector("a > div > div:nth-of-type(2) > div:nth-of-type(2)")
    ).textContent = "Damaged chair";
    expect(element("post").innerHTML.length).toBe(originalLength);
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("post").hasAttribute(postAttMPSkip)).toBe(false);
    expect(element("post").getAttribute(postAtt)).toBe("damaged");
  });

  test("duplicate matching anchors within one Marketplace box produce one classification", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      listing("post", "$50", "Damaged chair") + listing("safe", "$50", "Perfect chair", "deep")
    );
    const anchor = requireElement(element("post").querySelector("a"));
    requireElement(anchor.parentElement).appendChild(anchor.cloneNode(true));
    const setAttribute = jest.spyOn(element("post"), "setAttribute");
    mopMarketplaceFeed(context);
    expect(setAttribute.mock.calls.filter(([name]) => name === postAtt)).toHaveLength(1);
    expect(element("post").getAttribute(postAtt)).toBe("damaged");
    expect(element("safe").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(element("marketplace-root").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(
      false
    );
  });

  test("separate profile cards linking to the same post retain independent roots", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    document.body.innerHTML = `<div role="main" id="profile-root"><div id="wrapper">${textPost("blocked", "Unwanted offer", '<a href="/publisher/posts/100/?ref=first">Timestamp</a>')}${textPost("safe", "Ordinary content", '<a href="/publisher/posts/100/?ref=second">Timestamp</a>')}<aside id="protected">Unrelated profile details</aside></div></div>`;
    mopProfileFeed(context);
    expect(element("blocked").getAttribute(postAtt)).toBe("unwanted");
    expect(element("safe").hasAttribute(postAtt)).toBe(false);
    expect(element("wrapper").hasAttribute(postAtt)).toBe(false);
    expect(element("protected").hasAttribute(postAtt)).toBe(false);
  });

  test("different post destinations cannot merge a profile wrapper into one hidden item", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    document.body.innerHTML = `<div role="main" id="profile-root"><div id="wrapper">${textPost("blocked", "Unwanted offer", '<a href="/publisher/posts/100/">Timestamp</a>')}${textPost("safe", "Ordinary content", '<a href="/publisher/posts/200/">Timestamp</a>')}</div></div>`;
    mopProfileFeed(context);
    expect(element("blocked").getAttribute(postAtt)).toBe("unwanted");
    expect(element("safe").hasAttribute(postAtt)).toBe(false);
    expect(element("wrapper").hasAttribute(postAtt)).toBe(false);
  });
  test("timestamp aria-describedby headers cannot truncate a genuine profile post", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    document.body.innerHTML = `<div role="main" id="profile-root">${textPost("post", "Unwanted offer", '<div id="timestamp-header" aria-describedby="timestamp-tooltip"><a href="/publisher/posts/100/">Yesterday</a></div>')}${textPost("ordinary", "Community news", '<a href="/publisher/posts/200/">Yesterday</a>')}</div>`;
    expect(getProfilePostsFromPermalinks(element("profile-root"))).toEqual([
      element("post"),
      element("ordinary"),
    ]);
    mopProfileFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
    expect(element("timestamp-header").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("profile-root").hasAttribute(postAtt)).toBe(false);
  });

  test("article post boundaries take precedence over described timestamp tooltips", () => {
    document.body.innerHTML =
      '<div role="main" id="profile-root"><div role="article" id="post"><div aria-describedby="timestamp-tooltip"><a href="/publisher/posts/100/">Yesterday</a></div><div>Post body</div></div><div role="article" id="ordinary"><a href="/publisher/posts/200/">Today</a></div></div>';
    expect(getProfilePostsFromPermalinks(element("profile-root"))).toEqual([
      element("post"),
      element("ordinary"),
    ]);
  });
});
