// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttTab } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopVideosFeed } from "../../src/feeds/videos";
import { mopSearchFeed } from "../../src/feeds/search";
import { mopProfileFeed } from "../../src/feeds/profile";
import type { FeedContext } from "../../src/feeds/types";
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

/**
 * Pair each route with its real processor and content extractor, keeping unrelated filters disabled.
 * @param route Recognized Facebook route whose actual wrappers will be constructed.
 * @param verbosity Caption policy exercised during repeated hide, restore and rehide transitions.
 * @returns Independent context sharing the mounted target and ordinary sibling document.
 */
function recycledFixture(route: string, verbosity: string): FeedContext {
  const context = routeContext(route, {
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_TEXT: "damaged",
    GF_BLOCKED_ENABLED: true,
    GF_BLOCKED_TEXT: "damaged",
    VF_BLOCKED_ENABLED: true,
    VF_BLOCKED_TEXT: "damaged",
    PP_BLOCKED_ENABLED: true,
    PP_BLOCKED_TEXT: "damaged",
    VERBOSITY_LEVEL: verbosity,
  });
  const body = '<span id="changing-body">Damaged chair</span>';
  const post = textPost("target", body, '<a href="/publisher/posts/100/">Yesterday</a>');
  if (context.state.isGF) mountGroups(route, post + textPost("ordinary", "Community news"));
  else if (context.state.isVF) {
    const fixture = context.state.vfType === "search" ? videoSearchPost : videoPost;
    mountVideos(route, fixture("target", body) + fixture("ordinary", "Community news"));
  } else if (context.state.isSF) {
    document.body.innerHTML = `<div role="region"></div><div role="main" id="search-root"><div role="feed"><div>${post}${textPost("ordinary", "Community news")}</div></div></div>`;
  } else {
    document.body.innerHTML = `<div role="main" id="profile-root">${post}${textPost("ordinary", "Community news", '<a href="/publisher/posts/200/">Today</a>')}</div>`;
  }
  return context;
}

/** Force an eligible scan without substituting any route processor, detector, or mutation helper. */
function scan(context: FeedContext): void {
  context.state.forceProcess = true;
  if (context.state.isGF) mopGroupsFeed(context);
  else if (context.state.isVF) mopVideosFeed(context);
  else if (context.state.isSF) mopSearchFeed(context);
  else mopProfileFeed(context);
}

afterEach(cleanRouteDocument);

test.each(
  [
    "/groups/feed",
    "/groups/example/",
    "/watch",
    "/watch/search",
    "/search/posts/",
    "/publisher",
  ].flatMap((route) => ["0", "1", "2"].map((verbosity) => ({ route, verbosity })))
)(
  "$route verbosity=$verbosity reclassifies equal-length content and stabilizes owned captions",
  ({ route, verbosity }) => {
    const context = recycledFixture(route, verbosity);
    scan(context);
    expect(element("target").getAttribute(postAtt)).toBe("damaged");
    const captionCount = document.querySelectorAll(`[${postAttTab}], details[${postAtt}]`).length;
    scan(context);
    scan(context);
    expect(document.querySelectorAll(`[${postAttTab}], details[${postAtt}]`)).toHaveLength(
      captionCount
    );
    element("changing-body").textContent = "Perfect chair";
    scan(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("target").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    element("changing-body").textContent = "Damaged chair";
    scan(context);
    expect(element("target").getAttribute(postAtt)).toBe("damaged");
    const stableMarkup = element("target").innerHTML;
    scan(context);
    expect(element("target").innerHTML).toBe(stableMarkup);
  }
);
