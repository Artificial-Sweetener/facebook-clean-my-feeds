// SPDX-License-Identifier: GPL-3.0-only

import { mopNewsFeed } from "../../src/feeds/news";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopVideosFeed } from "../../src/feeds/videos";
import { mopSearchFeed } from "../../src/feeds/search";
import { mopProfileFeed } from "../../src/feeds/profile";
import { mountNewsPost } from "./news-contract-fixtures";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  mountVideos,
  nested,
  routeContext,
  textPost,
  videoPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

test.each(["/", "/groups/feed", "/watch", "/search/posts/", "/publisher"])(
  "%s honors information-box options independently of text and media filters",
  (route) => {
    const context = routeContext(route, { OTHER_INFO_BOX_CORONAVIRUS: true });
    context.state.hideAnInfoBox = true;
    const component = `<div id="information">${nested('<a href="/coronavirus_info/123/">معلومات</a>', 4)}</div>`;
    if (route === "/") mountNewsPost(component);
    else if (route.startsWith("/groups")) mountGroups(route, textPost("owner", "Community news"));
    else if (route === "/watch")
      mountVideos(route, videoPost("owner", "Community news", component));
    else if (route.startsWith("/search"))
      document.body.innerHTML = `<div role="region"></div><div role="main"><div role="feed"><div>${textPost("owner", "Community news")}</div></div></div>`;
    else
      document.body.innerHTML = `<div role="main">${textPost("owner", "Community news", '<a href="/publisher/posts/100/">Today</a>')}</div>`;
    if (!["/", "/watch"].includes(route))
      element("owner").insertAdjacentHTML("beforeend", component);
    const process =
      route === "/"
        ? mopNewsFeed
        : route.startsWith("/groups")
          ? mopGroupsFeed
          : route === "/watch"
            ? mopVideosFeed
            : route.startsWith("/search")
              ? mopSearchFeed
              : mopProfileFeed;
    process(context);
    expect(element("information").hasAttribute(context.state.cssHideEl)).toBe(true);
    expect(element("information").parentElement?.hasAttribute(context.state.cssHideEl)).toBe(false);
  }
);
