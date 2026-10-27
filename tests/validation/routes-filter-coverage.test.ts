// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopSearchFeed } from "../../src/feeds/search";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  routeContext,
  textPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

const groupRoutes = [
  "/groups/feed",
  "/home.php?filter=groups",
  "/groups/search",
  "/groups/gardening",
];
const partnership =
  '<span dir="auto"><span id="disclosure"><a href="/business/help/123">Paid partnership with Example</a></span></span>';

test.each(groupRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
  "$route paid partnership filtering obeys its own option: $enabled",
  ({ route, enabled }) => {
    const context = routeContext(route, { GF_PAID_PARTNERSHIP: enabled });
    mountGroups(
      route,
      textPost("paid", "A promotion", partnership) +
        textPost("ordinary", "Community news") +
        textPost("body", partnership)
    );
    mopGroupsFeed(context);
    expect(element("paid").getAttribute(postAtt)).toBe(
      enabled ? context.keyWords.GF_PAID_PARTNERSHIP : null
    );
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("body").hasAttribute(postAtt)).toBe(false);
  }
);

test.each(groupRoutes.slice(0, 3))(
  "%s filters earlier loaded posts even when more than 25 posts are mounted",
  (route) => {
    const context = routeContext(route, { GF_SPONSORED: true });
    mountGroups(
      route,
      textPost("first-ad", "Ad creative", '<a href="/ads/about/">Sponsored</a>') +
        Array.from({ length: 30 }, (_, index) =>
          textPost(`ordinary-${index}`, "Community news")
        ).join("")
    );
    mopGroupsFeed(context);
    expect(element("first-ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    expect(element("ordinary-0").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary-29").hasAttribute(postAtt)).toBe(false);
  }
);

test.each(["/search/top/", "/search/posts/", "/search/pages/"])(
  "%s sponsored filtering works while keyword filtering is disabled",
  (route) => {
    const context = routeContext(route, { NF_SPONSORED: true, NF_BLOCKED_ENABLED: false });
    document.body.innerHTML = `<div role="region"></div><div role="main"><div role="feed"><div>${textPost("ad", "Promotion", '<a href="/ads/about/">Sponsored</a>')}${textPost("ordinary", "Community news")}</div></div></div>`;
    mopSearchFeed(context);
    expect(element("ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  }
);
