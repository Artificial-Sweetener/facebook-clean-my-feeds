// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  routeContext,
  textPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

describe("Groups short reels require their own media preview", () => {
  test.each([
    '<p>An explanation with <a href="/reel/100/">a reel link</a></p>',
    '<div data-commentid="comment"><a href="/reel/100/"><img alt="Shared preview"></a></div>',
    '<div role="article"><a href="/reel/100/"><img alt="Nested post preview"></a></div>',
    '<a href="https://facebook.com.example.test/reel/100/"><img alt="Outside site"></a>',
    '<a href="/reel/100/">A text-only reference</a>',
  ])("keeps ordinary authored or foreign content visible: %s", (body) => {
    const context = routeContext("/groups/feed", { GF_SHORT_REEL_VIDEO: true });
    mountGroups("/groups/feed", textPost("ordinary", body));
    mopGroupsFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  });

  test.each(["/groups/feed", "/groups/example/", "/groups/search/", "/home.php?filter=groups"])(
    "%s still hides one owned reel preview, preserving its sibling",
    (route) => {
      const context = routeContext(route, { GF_SHORT_REEL_VIDEO: true });
      mountGroups(
        route,
        textPost("target", '<a href="/reel/100/"><video></video></a>') +
          textPost("ordinary", "Community news")
      );
      mopGroupsFeed(context);
      expect(element("target").getAttribute(postAtt)).toBe(context.keyWords.GF_SHORT_REEL_VIDEO);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );
});
