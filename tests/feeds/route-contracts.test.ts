// SPDX-License-Identifier: GPL-3.0-only

import { buildFilters } from "../../src/core/options/build-filters";
import type { HydratedOptions } from "../../src/core/options/types";
import { classifyRoute } from "../../src/core/routing/routes";
import { mainColumnAtt, postAtt, rvAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { mopReelsFeed, stopReelsProcessing } from "../../src/feeds/reels";
import { mopSearchFeed } from "../../src/feeds/search";
import type { FeedContext } from "../../src/feeds/types";
import { mopVideosFeed } from "../../src/feeds/videos";
import { createNewsContext, requireElement } from "./news-fixtures";

/**
 * Bind actual URL classification and keyword hydration to deterministic feed DOM fixtures.
 * @param route Synthetic Facebook pathname and optional query, never navigated or fetched.
 * @param options Filter switches and keyword text specific to the behavior under test.
 * @returns A context with independent route flags and real materialized keyword lists.
 */
function createRouteContext(route: string, options: Partial<HydratedOptions>): FeedContext {
  const context = createNewsContext({
    options: { GF_SPONSORED: false, VF_SPONSORED: false, MP_SPONSORED: false, ...options },
  });
  const location = new URL(route, "https://www.facebook.com");
  Object.assign(context.state, classifyRoute(location.pathname, location.search, context.options));
  context.filters = buildFilters(context.options);
  return context;
}

/** Build intentionally deep legacy Facebook content wrappers without unreadable repeated markup. */
function nestedDivs(content: string, depth: number): string {
  return `${"<div>".repeat(depth)}${content}${"</div>".repeat(depth)}`;
}

/** Provide two recognized news-like content blocks so text is scanned through real selectors. */
function searchPost(id: string, text: string): string {
  return `<div id="${id}" aria-posinset="1">${nestedDivs(`<div><span>${text}</span></div><div><span>Footer</span></div>`, 7)}</div>`;
}

/** Create a Marketplace listing whose first text block is its price and later blocks its description. */
function marketplaceItem(id: string, description: string): string {
  return `<div id="${id}" style="display:block"><div><span><div><div><a href="/marketplace/item/${id}/"><div><div></div><div><div>50</div><div>${description}</div></div></div></a></div></div></span></div></div>`;
}

/** Attach one Reel with both its legacy overlay and the description sibling required for controls. */
function appendReel(id: string): HTMLVideoElement {
  const holder = document.createElement("section");
  holder.innerHTML = `<div><div data-video-id="${id}"><video></video><div class="video-overlay"></div></div></div><div><div class="description">Reel description</div></div>`;
  document.body.appendChild(holder);
  return requireElement(holder.querySelector("video"));
}

afterEach(() => {
  clearDirtyTracking();
  jest.restoreAllMocks();
  jest.useRealTimers();
  document.body.replaceChildren();
});

describe("feed route DOM contracts", () => {
  test.each([
    ["/groups/feed", "groups"],
    ["/home.php?filter=groups", "groups-recent"],
    ["/groups/example", "group"],
  ])(
    "groups route %s filters one-reel posts without suppressing ordinary posts",
    (route, subtype) => {
      const context = createRouteContext(route, { GF_SHORT_REEL_VIDEO: true });
      expect(context.state.gfType).toBe(subtype);
      const posts =
        '<div id="reel"><div><a href="/reel/1/"><video></video></a></div></div><div id="ordinary"><div>Ordinary group post</div></div>';
      if (subtype === "groups-recent") {
        document.body.innerHTML = `<div role="navigation"></div><div role="main"><h2 dir="auto">Recent</h2><div>${posts}</div></div>`;
      } else if (subtype === "group") {
        document.body.innerHTML = `<div role="main"><div role="feed">${posts}</div></div>`;
      } else {
        document.body.innerHTML = `<div role="navigation"></div><div role="main"><div role="feed">${posts}</div></div>`;
      }

      const result = mopGroupsFeed(context);

      expect(result?.mainColumn?.hasAttribute(mainColumnAtt)).toBe(true);
      expect(requireElement(document.getElementById("reel")).getAttribute(postAtt)).toBe(
        context.keyWords.GF_SHORT_REEL_VIDEO
      );
      expect(
        requireElement(document.getElementById("reel")).hasAttribute(context.state.hideAtt)
      ).toBe(true);
      expect(requireElement(document.getElementById("ordinary")).hasAttribute(postAtt)).toBe(false);
      expect(document.querySelector("details")).toBeNull();
    }
  );

  test.each([true, false])(
    "video feed live filtering respects its enabled option: %s",
    (enabled) => {
      const context = createRouteContext("/watch", { VF_LIVE: enabled });
      const live =
        '<div id="live"><div role="presentation"></div><div><div><span>LIVE</span></div></div></div>';
      const ordinary = '<div id="ordinary"><div><div><span>Recorded video</span></div></div></div>';
      document.body.innerHTML = `<div role="dialog"><div role="main" id="video-root">${nestedDivs(live + ordinary, 2)}</div></div>`;

      const result = mopVideosFeed(context);

      expect(context.state.vfType).toBe("videos");
      expect(result?.elDialog?.hasAttribute(mainColumnAtt)).toBe(true);
      expect(requireElement(document.getElementById("live")).getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.VF_LIVE : null
      );
      expect(requireElement(document.getElementById("ordinary")).hasAttribute(postAtt)).toBe(false);
    }
  );

  test("video-search results apply their distinct content-block selector", () => {
    const context = createRouteContext("/watch/search", {
      VF_BLOCKED_ENABLED: true,
      VF_BLOCKED_TEXT: "unwanted",
    });
    const blockedContent = nestedDivs("<div>Header</div><div><span>Unwanted video</span></div>", 6);
    const safeContent = nestedDivs("<div>Header</div><div><span>Wanted video</span></div>", 6);
    document.body.innerHTML = `<div role="dialog"><div role="main"><div role="feed"><div role="article" id="blocked">${blockedContent}</div><div role="article" id="safe">${safeContent}</div></div></div></div>`;

    mopVideosFeed(context);

    expect(context.state.vfType).toBe("search");
    expect(requireElement(document.getElementById("blocked")).getAttribute(postAtt)).toBe(
      "unwanted"
    );
    expect(requireElement(document.getElementById("safe")).hasAttribute(postAtt)).toBe(false);
  });

  test.each(["/marketplace", "/marketplace/search", "/marketplace/example/category"])(
    "Marketplace route %s filters descriptions independently of its price block",
    (route) => {
      const context = createRouteContext(route, {
        MP_BLOCKED_ENABLED: true,
        MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      });
      document.body.innerHTML = `<div role="navigation"></div><div role="main">${marketplaceItem("blocked", "Damaged chair")}${marketplaceItem("safe", "Good chair")}</div>`;

      const result = mopMarketplaceFeed(context);

      expect(result?.hasAttribute(mainColumnAtt)).toBe(true);
      expect(requireElement(document.getElementById("blocked")).getAttribute(postAtt)).toBe(
        "damaged"
      );
      expect(
        requireElement(document.getElementById("blocked")).hasAttribute(
          context.state.hideWithNoCaptionAtt
        )
      ).toBe(true);
      expect(requireElement(document.getElementById("safe")).getAttribute(postAtt)).toBe("");
      expect(
        requireElement(document.getElementById("safe")).hasAttribute(
          context.state.hideWithNoCaptionAtt
        )
      ).toBe(false);
    }
  );

  test("Marketplace item modal marks only the sponsored heading container", () => {
    const context = createRouteContext("/marketplace/item/1/", { MP_SPONSORED: true });
    document.body.innerHTML =
      '<div hidden></div><div class="modal__root"><div role="dialog"><span id="ad"><h2><a href="/ads/about/">Sponsored</a></h2></span><section id="listing">Actual listing</section></div></div>';

    const result = mopMarketplaceFeed(context);

    expect(context.state.mpType).toBe("item");
    expect(result?.getAttribute("role")).toBe("dialog");
    expect(requireElement(document.getElementById("ad")).getAttribute(postAtt)).toBe(
      context.keyWords.SPONSORED
    );
    expect(requireElement(document.getElementById("listing")).hasAttribute(postAtt)).toBe(false);
  });

  test.each([true, false])(
    "search uses real news-text extraction only when enabled: %s",
    (enabled) => {
      const context = createRouteContext("/search/posts/", {
        NF_BLOCKED_ENABLED: enabled,
        NF_BLOCKED_TEXT: "unwanted",
      });
      document.body.innerHTML = `<div role="region"></div><div role="main"><div role="feed"><div>${searchPost("blocked", "Unwanted search result")}${searchPost("safe", "Ordinary search result")}</div></div></div>`;

      const result = mopSearchFeed(context);

      expect(context.state.isSF).toBe(true);
      expect(result?.hasAttribute(mainColumnAtt)).toBe(true);
      expect(requireElement(document.getElementById("blocked")).getAttribute(postAtt)).toBe(
        enabled ? "unwanted" : null
      );
      expect(requireElement(document.getElementById("safe")).hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([false, true])(
    "Reels controls, pause handler, and polling work with Chromium: %s",
    (isChromium) => {
      jest.useFakeTimers();
      const context = createRouteContext("/reel/1/", {
        REELS_CONTROLS: true,
        REELS_DISABLE_LOOPING: true,
      });
      context.state.isChromium = isChromium;
      const first = appendReel("1");
      const pause = jest.spyOn(first, "pause").mockImplementation(() => undefined);

      expect(mopReelsFeed(context, "runtime")?.length).toBe(1);
      expect(first.controls).toBe(true);
      expect(first.getAttribute(rvAtt)).toBe("1");
      expect(first.nextElementSibling?.getAttribute("style")).toBe("display:none;");
      expect(requireElement(document.querySelector(".description")).getAttribute("style")).toBe(
        `margin-bottom:${isChromium ? "4.5" : "2.25"}rem;`
      );
      expect(mopReelsFeed(context, "runtime")).toBeNull();
      expect(jest.getTimerCount()).toBe(1);
      const second = appendReel("2");
      jest.advanceTimersByTime(1000);
      expect(second.controls).toBe(true);
      expect(jest.getTimerCount()).toBe(1);
      first.dispatchEvent(new Event("ended"));
      expect(pause).toHaveBeenCalledTimes(1);

      Object.assign(context.state, classifyRoute("/settings/privacy", "", context.options));
      expect(mopReelsFeed(context, "runtime")).toBeNull();
      expect(context.state.isRF_InTimeoutMode).toBe(false);
      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(3000);
      expect(jest.getTimerCount()).toBe(0);
      stopReelsProcessing(context.state);
    }
  );
});
