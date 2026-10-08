// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { mopGroupsFeed } from "../../src/feeds/groups";
import {
  cleanRouteDocument,
  element,
  gifControl,
  mountGroups,
  nested,
  routeContext,
  textPost,
} from "./routes-fixtures";

const routes = ["/groups/feed", "/home.php?filter=groups", "/groups/search", "/groups/gardening"];

afterEach(cleanRouteDocument);

describe("group route option integration", () => {
  test.each(routes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route GF_SHORT_REEL_VIDEO=$enabled preserves ordinary label prose and outside links",
    ({ route, enabled }) => {
      const context = routeContext(route, { GF_SHORT_REEL_VIDEO: enabled });
      mountGroups(
        route,
        textPost("reel", '<a href="/reel/100/"><video></video></a>') +
          textPost("ordinary", "I discussed Reels, Sponsored, Suggested groups, GIF and Live today")
      );
      document.body.insertAdjacentHTML(
        "beforeend",
        '<aside id="outside"><a href="/reel/99/">Saved reel</a></aside>'
      );
      mopGroupsFeed(context);
      expect(element("reel").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.GF_SHORT_REEL_VIDEO : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("outside").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(
    ["/groups/feed", "/home.php?filter=groups", "/groups/search"].flatMap((route) =>
      [true, false].map((enabled) => ({ route, enabled }))
    )
  )(
    "$route GF_SPONSORED=$enabled uses the sponsored detector without matching label prose",
    ({ route, enabled }) => {
      const context = routeContext(route, { GF_SPONSORED: enabled });
      mountGroups(
        route,
        textPost("ad", "Ad creative", '<a href="/ads/about/">Sponsored</a>') +
          textPost("ordinary", "Sponsored is a word in my story") +
          textPost("body-disclosure", '<a href="/ads/about/">Sponsored</a>')
      );
      mopGroupsFeed(context);
      expect(element("ad").getAttribute(postAtt)).toBe(enabled ? context.keyWords.SPONSORED : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("body-disclosure").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(
    ["icon", "heading"].flatMap((layout) => [true, false].map((enabled) => ({ layout, enabled })))
  )(
    "GF_SUGGESTIONS=$enabled recognizes $layout structure without matching ordinary prose",
    ({ layout, enabled }) => {
      const context = routeContext("/groups/feed", { GF_SUGGESTIONS: enabled });
      const icon =
        '<i data-visualcompletion="css-img" style="background-image:url(icon.png)" aria-label="Suggested for you"></i>';
      const heading =
        "<h3><div><span>Group</span><span><span><div><div>Suggested groups</div></div></span></span></div></h3>";
      mountGroups(
        "/groups/feed",
        textPost(
          "suggestion",
          layout === "heading" ? heading : "Group post",
          layout === "icon" ? icon : "Group"
        ) + textPost("ordinary", "Suggested groups helped me find friends")
      );
      mopGroupsFeed(context);
      expect(element("suggestion").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.GF_SUGGESTIONS : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("individual group pages intentionally omit sponsored and group-suggestion filters", () => {
    const context = routeContext("/groups/gardening", { GF_SPONSORED: true, GF_SUGGESTIONS: true });
    mountGroups(
      "/groups/gardening",
      textPost(
        "post",
        '<a href="/ads/about/">Sponsored</a>',
        '<i data-visualcompletion="css-img" style="display:block"></i>'
      )
    );
    mopGroupsFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
  });

  test.each(routes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route GF_BLOCKED_ENABLED=$enabled gates real content extraction",
    ({ route, enabled }) => {
      const context = routeContext(route, {
        GF_BLOCKED_ENABLED: enabled,
        GF_BLOCKED_TEXT: "unwanted",
      });
      mountGroups(
        route,
        textPost("blocked", "Unwanted group offer") + textPost("ordinary", "Community gardening")
      );
      mopGroupsFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "unwanted" : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([true, false])(
    "GF_ANIMATED_GIFS_POSTS=%s hides the post only for a real body GIF",
    (enabled) => {
      const context = routeContext("/groups/feed", { GF_ANIMATED_GIFS_POSTS: enabled });
      mountGroups(
        "/groups/feed",
        textPost("gif-post", gifControl()) +
          textPost("ordinary", "This article explains the GIF format")
      );
      mopGroupsFeed(context);
      expect(element("gif-post").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.GF_ANIMATED_GIFS_POSTS : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([true, false])(
    "GF_ANIMATED_GIFS_PAUSE=%s pauses visible post and dialog GIFs once",
    (enabled) => {
      const context = routeContext("/groups/gardening", { GF_ANIMATED_GIFS_PAUSE: enabled });
      mountGroups("/groups/gardening", textPost("post", gifControl()));
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div role="dialog">${gifControl("dialog-gif")}</div>`
      );
      const click = jest.spyOn(element("gif"), "click");
      const dialogClick = jest.spyOn(element("dialog-gif"), "click");
      mopGroupsFeed(context);
      context.state.forceProcess = true;
      mopGroupsFeed(context);
      expect(click).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(dialogClick).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(element("post").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([true, false])("GF_SHARES=%s hides only the supported share-count span", (enabled) => {
    const context = routeContext("/groups/feed", { GF_SHARES: enabled });
    const shares =
      '<div data-visualcompletion="ignore-dynamic"><div><div><div><div class="counts"><div><div><div><span><div><span id="shares" dir="auto">5 shares</span></div></span></div></div></div></div></div></div></div></div>';
    mountGroups(
      "/groups/feed",
      textPost("post", `Ordinary post ${shares}<p id="prose">I own 5 shares</p>`)
    );
    mopGroupsFeed(context);
    expect(element("shares").hasAttribute(context.state.cssHideNumberOfShares)).toBe(enabled);
    expect(element("prose").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
  });

  test("multiple reel links are intentionally outside the exactly-one short-reel policy", () => {
    const context = routeContext("/groups/feed", { GF_SHORT_REEL_VIDEO: true });
    mountGroups(
      "/groups/feed",
      textPost(
        "shelf",
        '<a href="/reel/1/"><video></video></a><a href="/reel/2/"><img alt="Clip"></a>'
      )
    );
    mopGroupsFeed(context);
    expect(element("shelf").hasAttribute(postAtt)).toBe(false);
  });

  test("new virtualized post identity clears old hide markers and leaves siblings intact", () => {
    const context = routeContext("/groups/feed", { GF_SHORT_REEL_VIDEO: true });
    mountGroups(
      "/groups/feed",
      textPost("post", '<a href="/reel/1/"><video></video></a>') +
        textPost("sibling", "Keep this visible")
    );
    mopGroupsFeed(context);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(true);
    element("post").innerHTML = "A newly loaded community announcement";
    element("post").setAttribute("aria-posinset", "2");
    context.state.forceProcess = true;
    mopGroupsFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("sibling").textContent).toContain("Keep this visible");
  });

  test("saved settings invalidate hidden group markers before disabled filters rescan", () => {
    const context = routeContext("/groups/feed", { GF_SHORT_REEL_VIDEO: true });
    mountGroups("/groups/feed", textPost("post", '<a href="/reel/1/"><video></video></a>'));
    mopGroupsFeed(context);
    context.options.GF_SHORT_REEL_VIDEO = false;
    expect(resetFeedProcessing(context.state)).toBe(true);
    mopGroupsFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("post").querySelector('a[href="/reel/1/"]')).not.toBeNull();
  });

  test("aggregated groups intentionally scan only the latest 25 posts", () => {
    const context = routeContext("/groups/feed", { GF_SHORT_REEL_VIDEO: true });
    mountGroups(
      "/groups/feed",
      Array.from({ length: 26 }, (_, index) =>
        textPost(`post-${index}`, `<a href="/reel/${index}/"><video></video></a>`)
      ).join("")
    );
    mopGroupsFeed(context);
    expect(element("post-0").hasAttribute(postAtt)).toBe(false);
    expect(element("post-1").hasAttribute(postAtt)).toBe(true);
    expect(element("post-25").hasAttribute(postAtt)).toBe(true);
  });
  test.each([true, false])(
    "GF_SUGGESTIONS=%s applies to the separate suggestion rail",
    (enabled) => {
      const context = routeContext("/groups/feed", { GF_SUGGESTIONS: enabled });
      mountGroups("/groups/feed", textPost("ordinary", "Community gardening"));
      document.body.insertAdjacentHTML(
        "beforeend",
        `<section id="suggestion-rail">${nested(`<div role="complementary">${nested("<span>Suggested groups</span>", 5)}</div>`, 15)}</section><section id="other-rail">Friends online</section>`
      );
      mopGroupsFeed(context);
      expect(element("suggestion-rail").hasAttribute(context.state.hideAtt)).toBe(false);
      expect(element("suggestion-rail").querySelector(`[${context.state.hideAtt}]`) !== null).toBe(
        enabled
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("other-rail").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([true, false])("GF_BLOCKED_RE=%s reaches the group matching mode", (enabled) => {
    const context = routeContext("/groups/search", {
      GF_BLOCKED_ENABLED: true,
      GF_BLOCKED_RE: enabled,
      GF_BLOCKED_TEXT: "offer[0-9]+",
    });
    mountGroups("/groups/search", textPost("post", "offer123"));
    mopGroupsFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe(enabled ? "offer[0-9]+" : null);
  });

  test.each(["1", "0"])(
    "NF_BLOCKED_FEED group destination=%s controls imported text rules",
    (destination) => {
      const context = routeContext("/groups/feed", {
        GF_BLOCKED_ENABLED: true,
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "unwanted",
        NF_BLOCKED_FEED: ["1", destination, "0"],
      });
      mountGroups("/groups/feed", textPost("post", "Unwanted offer"));
      mopGroupsFeed(context);
      expect(element("post").getAttribute(postAtt)).toBe(destination === "1" ? "unwanted" : null);
    }
  );
});
