// SPDX-License-Identifier: GPL-3.0-only

import { buildFilters } from "../../src/core/options/build-filters";
import type { HydratedOptions } from "../../src/core/options/types";
import { classifyRoute } from "../../src/core/routing/routes";
import { restoreReelsPresentation } from "../../src/feeds/reels-presentation";
import { clearMarketplaceListingTracking } from "../../src/feeds/marketplace-discovery";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import type { FeedContext } from "../../src/feeds/types";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

export { requireElement } from "../feeds/news-fixtures";

/**
 * Disable unrelated filters and use real route classification and keyword materialization.
 * @param route Synthetic Facebook path and query, resolved locally without browser navigation.
 * @param options Explicit preferences to overlay on otherwise-disabled feed classifiers.
 * @returns Independent mutable context with real locale labels and compiled keyword lists.
 */
export function routeContext(route: string, options: Partial<HydratedOptions> = {}): FeedContext {
  const context = createNewsContext({
    options: {
      GF_SPONSORED: false,
      GF_PAID_PARTNERSHIP: false,
      GF_SUGGESTIONS: false,
      GF_SHORT_REEL_VIDEO: false,
      GF_ANIMATED_GIFS_POSTS: false,
      GF_ANIMATED_GIFS_PAUSE: false,
      GF_SHARES: false,
      GF_BLOCKED_ENABLED: false,
      VF_SPONSORED: false,
      VF_LIVE: false,
      VF_INSTAGRAM: false,
      VF_DUPLICATE_VIDEOS: false,
      VF_ANIMATED_GIFS_PAUSE: false,
      VF_BLOCKED_ENABLED: false,
      MP_SPONSORED: false,
      MP_BLOCKED_ENABLED: false,
      PP_BLOCKED_ENABLED: false,
      PP_ANIMATED_GIFS_POSTS: false,
      PP_ANIMATED_GIFS_PAUSE: false,
      REELS_CONTROLS: false,
      REELS_DISABLE_LOOPING: false,
      ...options,
    },
  });
  const url = new URL(route, "https://www.facebook.com");
  Object.assign(context.state, classifyRoute(url.pathname, url.search, context.options));
  context.filters = buildFilters(context.options);
  return context;
}

/** Release observers and test doubles before another synthetic Facebook document is installed. */
export function cleanRouteDocument(): void {
  restoreReelsPresentation();
  clearMarketplaceListingTracking();
  clearDirtyTracking();
  jest.restoreAllMocks();
  jest.useRealTimers();
  document.body.replaceChildren();
}

/** Compress only repetitive Facebook wrappers; supplied content remains literal and inspectable. */
export function nested(content: string, depth: number): string {
  return `${"<div>".repeat(depth)}${content}${"</div>".repeat(depth)}`;
}

/** Build the supported eight-level content blocks with separate header, body and footer. */
export function textPost(id: string, body: string, header = "Person", footer = "Comment"): string {
  return `<div id="${id}" aria-posinset="1">${nested(`<div><span>${header}</span></div><div><span>${body}</span></div><div><span>${footer}</span></div>`, 7)}</div>`;
}

/** Attach the actual feed container shape for the group route, returning the owned main root. */
export function mountGroups(route: string, posts: string): Element {
  const context = routeContext(route);
  if (context.state.gfType === "groups-recent") {
    document.body.innerHTML = `<div role="navigation"></div><div role="main"><h2 dir="auto">Recent activity</h2><div>${posts}</div></div>`;
  } else if (context.state.gfType === "group") {
    document.body.innerHTML = `<div role="main"><div role="feed">${posts}</div></div>`;
  } else {
    document.body.innerHTML = `<div role="navigation"></div><div role="main"><div role="feed">${posts}</div></div>`;
  }
  return requireElement(document.querySelector('div[role="main"]'));
}

/**
 * Preserve route-specific video selectors; a stable main-root ID avoids jsdom/NWSAPI
 * broadening :scope on anonymous, deeply nested classless divs.
 */
export function mountVideos(route: string, posts: string): Element {
  const context = routeContext(route);
  let content = nested(posts, 2);
  if (context.state.vfType === "search") content = `<div role="feed">${posts}</div>`;
  if (context.state.vfType === "item") {
    content = `<div id="watch_feed"><div><div>Header</div><div><div><div><div><div>Actions</div><div>${nested(posts, 3)}</div></div></div></div></div></div></div>`;
  }
  document.body.innerHTML = `<div role="dialog"><div role="main" id="video-root">${content}</div></div>`;
  return requireElement(document.querySelector('div[role="main"]'));
}

/** Build content blocks selected by both normal and item video routes. */
export function videoPost(id: string, body: string, extra = ""): string {
  return `<div id="${id}">${nested(`<div>Header</div><div><div><span>${body}</span></div><div class="actions">Comment</div></div>`, 4)}${extra}</div>`;
}

/** Build the deeper article shape used exclusively by video-search text extraction. */
export function videoSearchPost(id: string, body: string, extra = ""): string {
  return `<div role="article" id="${id}">${nested(`<div>Header</div><div><span>${body}</span></div>`, 6)}${extra}</div>`;
}

/** Supply a real GIF toggle and invisible overlay so integration can assert clicks, not only selectors. */
export function gifControl(id = "gif"): string {
  return `<div><a style="opacity:0">Media overlay</a><div id="${id}" role="button" aria-label="Pause GIF"><i></i></div></div>`;
}

/** Fail immediately on missing IDs rather than allowing an absent test fixture to look unmodified. */
export function element(id: string): HTMLElement {
  return requireElement(document.getElementById(id));
}
