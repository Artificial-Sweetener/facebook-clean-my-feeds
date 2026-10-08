// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopVideosFeed } from "../../src/feeds/videos";
import { mopSearchFeed } from "../../src/feeds/search";
import { mopProfileFeed } from "../../src/feeds/profile";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  mountVideos,
  routeContext,
  textPost,
  videoPost,
  videoSearchPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

describe("blocked text never collides with processing state", () => {
  test.each(["/groups/feed", "/groups/example/"])(
    "%s accepts the literal keyword hidden",
    (route) => {
      const context = routeContext(route, { GF_BLOCKED_ENABLED: true, GF_BLOCKED_TEXT: "hidden" });
      mountGroups(
        route,
        textPost("target", "A hidden treasure") + textPost("ordinary", "Community news")
      );
      mopGroupsFeed(context);
      expect(element("target").getAttribute(postAtt)).toBe("hidden");
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      context.state.forceProcess = true;
      mopGroupsFeed(context);
      expect(element("target").getAttribute(postAtt)).toBe("hidden");
    }
  );

  test.each(["/watch/", "/watch/?v=123", "/watch/search"])(
    "%s accepts the literal keyword hidden",
    (route) => {
      const context = routeContext(route, { VF_BLOCKED_ENABLED: true, VF_BLOCKED_TEXT: "hidden" });
      const fixture = context.state.vfType === "search" ? videoSearchPost : videoPost;
      mountVideos(
        route,
        fixture("target", "A hidden treasure") + fixture("ordinary", "Community news")
      );
      mopVideosFeed(context);
      expect(element("target").getAttribute(postAtt)).toBe("hidden");
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("global search accepts the literal keyword hidden", () => {
    const context = routeContext("/search/posts/", {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "hidden",
    });
    document.body.innerHTML = `<div role="region"></div><div role="main" id="search-root"><div role="feed"><div>${textPost("target", "A hidden treasure")}${textPost("ordinary", "Community news")}</div></div></div>`;
    mopSearchFeed(context);
    expect(element("target").getAttribute(postAtt)).toBe("hidden");
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  });

  test("profiles accept the literal keyword hidden", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "hidden",
    });
    document.body.innerHTML = `<div role="main" id="profile-root">${textPost("target", "A hidden treasure", '<a href="/publisher/posts/123/">Yesterday</a>')}${textPost("ordinary", "Community news", '<a href="/publisher/posts/124/">Yesterday</a>')}</div>`;
    mopProfileFeed(context);
    expect(element("target").getAttribute(postAtt)).toBe("hidden");
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  });
});
