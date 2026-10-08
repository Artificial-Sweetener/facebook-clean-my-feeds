// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopSearchFeed } from "../../src/feeds/search";
import { getProfilePostsFromPermalinks, mopProfileFeed } from "../../src/feeds/profile";
import { resetFeedProcessing } from "../../src/feeds/reset";
import {
  cleanRouteDocument,
  element,
  gifControl,
  requireElement,
  routeContext,
  textPost,
} from "./routes-fixtures";

const searchRoutes = [
  "/search/top/",
  "/search/top",
  "/search/posts/",
  "/search/posts",
  "/search/pages/",
];
const profileRoutes = ["/profile.php?id=100", "/example.publisher"];

/** Keep search result containers separate from the surrounding page and sidebar. */
function mountSearch(posts: string): void {
  document.body.innerHTML = `<div role="region"></div><div role="main" id="search-root"><div role="feed"><div>${posts}</div></div></div><aside id="outside">Unwanted sidebar text</aside>`;
}

/** Place a recognized permalink in each profile post's header so discovery selects its content root. */
function profilePost(id: string, body: string, permalink = `/publisher/posts/${id}/`): string {
  return textPost(id, body, `<a href="${permalink}">Yesterday</a>`);
}

/** Use two posts when testing isolation so discovery cannot mistake their shared ancestor for one post. */
function mountProfile(posts: string): void {
  document.body.innerHTML = `<div role="main" id="profile-root">${posts}</div><aside id="outside">Unwanted sidebar text</aside>`;
}

afterEach(cleanRouteDocument);

describe("global search route integration", () => {
  test.each(searchRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route NF_BLOCKED_ENABLED=$enabled filters result content only",
    ({ route, enabled }) => {
      const context = routeContext(route, {
        NF_BLOCKED_ENABLED: enabled,
        NF_BLOCKED_TEXT: "unwanted",
      });
      mountSearch(textPost("blocked", "Unwanted advert") + textPost("ordinary", "Local news"));
      mopSearchFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "unwanted" : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("outside").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(
    [true, false].flatMap((blockedEnabled) =>
      [true, false].map((sponsoredEnabled) => ({ blockedEnabled, sponsoredEnabled }))
    )
  )(
    "NF_SPONSORED=$sponsoredEnabled respects the historical search blocked gate=$blockedEnabled",
    ({ blockedEnabled, sponsoredEnabled }) => {
      const context = routeContext("/search/posts/", {
        NF_BLOCKED_ENABLED: blockedEnabled,
        NF_SPONSORED: sponsoredEnabled,
      });
      mountSearch(
        textPost("ad", "Ad creative", '<a href="/ads/about/">Sponsored</a>') +
          textPost("ordinary", "Our club sponsored this event") +
          textPost("body-disclosure", '<a href="/ads/about/">Sponsored</a>')
      );
      mopSearchFeed(context);
      expect(element("ad").getAttribute(postAtt)).toBe(
        blockedEnabled && sponsoredEnabled ? context.keyWords.SPONSORED : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("body-disclosure").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(
    [true, false].flatMap((blockedEnabled) =>
      [true, false].map((pauseEnabled) => ({ blockedEnabled, pauseEnabled }))
    )
  )(
    "search GIF pause=$pauseEnabled respects blocked gate=$blockedEnabled",
    ({ blockedEnabled, pauseEnabled }) => {
      const context = routeContext("/search/posts/", {
        NF_BLOCKED_ENABLED: blockedEnabled,
        NF_ANIMATED_GIFS_PAUSE: pauseEnabled,
      });
      mountSearch(textPost("post", gifControl()));
      const click = jest.spyOn(element("gif"), "click");
      mopSearchFeed(context);
      expect(click).toHaveBeenCalledTimes(blockedEnabled && pauseEnabled ? 1 : 0);
      expect(element("post").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("recycled search results lose prior blocked-text markers", () => {
    const context = routeContext("/search/posts/", {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "unwanted",
    });
    mountSearch(textPost("post", "Unwanted content"));
    mopSearchFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
    element("post").innerHTML = textPost("replacement", "A fresh local report");
    context.state.forceProcess = true;
    mopSearchFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test("settings invalidation restores search results when the entire filtering gate is disabled", () => {
    const context = routeContext("/search/posts/", {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "unwanted",
    });
    mountSearch(textPost("post", "Unwanted content"));
    mopSearchFeed(context);
    context.options.NF_BLOCKED_ENABLED = false;
    resetFeedProcessing(context.state);
    mopSearchFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    expect(element("post").hasAttribute(context.state.hideAtt)).toBe(false);
  });
});

test.each(["1", "0"])(
  "VF_BLOCKED_FEED news destination=%s controls imported global-search rules",
  (destination) => {
    const context = routeContext("/search/posts/", {
      NF_BLOCKED_ENABLED: true,
      VF_BLOCKED_ENABLED: true,
      VF_BLOCKED_TEXT: "unwanted",
      VF_BLOCKED_FEED: [destination, "0", "1"],
    });
    mountSearch(textPost("post", "Unwanted offer"));
    mopSearchFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe(destination === "1" ? "unwanted" : null);
  }
);

test("global-search regex preserves uppercase escape semantics through the NF consumer", () => {
  const context = routeContext("/search/posts/", {
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_RE: true,
    NF_BLOCKED_TEXT: "^\\D+$",
  });
  mountSearch(
    textPost("letters", "alphabetic", "Header", "Footer") +
      textPost("digits", "12345", "67890", "54321")
  );
  mopSearchFeed(context);
  expect(element("letters").getAttribute(postAtt)).toBe("^\\D+$");
  expect(element("digits").hasAttribute(postAtt)).toBe(false);
});

describe("profile route option integration", () => {
  test.each(profileRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route PP_BLOCKED_ENABLED=$enabled applies only profile text filters",
    ({ route, enabled }) => {
      const context = routeContext(route, {
        PP_BLOCKED_ENABLED: enabled,
        PP_BLOCKED_TEXT: "unwanted",
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "local",
      });
      mountProfile(
        profilePost("blocked", "Unwanted offer") + profilePost("ordinary", "Local news")
      );
      mopProfileFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "unwanted" : null);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("outside").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([
    "/publisher/posts/100/",
    "/story.php?story_fbid=100",
    "/permalink/100/",
    "/permalink.php?story_fbid=100",
  ])("profile discovery supports %s permalink shape", (permalink) => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    mountProfile(
      profilePost("blocked", "Unwanted offer", permalink) +
        profilePost("ordinary", "Community news")
    );
    mopProfileFeed(context);
    expect(element("blocked").getAttribute(postAtt)).toBe("unwanted");
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("profile-root").hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test.each([true, false])(
    "PP_ANIMATED_GIFS_POSTS=%s uses supported GIF structure and legacy reason",
    (enabled) => {
      const context = routeContext("/example.publisher", { PP_ANIMATED_GIFS_POSTS: enabled });
      mountProfile(
        profilePost("gif-post", gifControl()) + profilePost("ordinary", "GIF creation workshop")
      );
      mopProfileFeed(context);
      expect(element("gif-post").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.GF_ANIMATED_GIFS_POSTS : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each([true, false])(
    "PP_ANIMATED_GIFS_PAUSE=%s pauses post and dialog without hiding either",
    (enabled) => {
      const context = routeContext("/example.publisher", { PP_ANIMATED_GIFS_PAUSE: enabled });
      mountProfile(profilePost("post", gifControl()) + profilePost("ordinary", "Community news"));
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div role="dialog">${gifControl("dialog-gif")}</div>`
      );
      const click = jest.spyOn(element("gif"), "click");
      const dialogClick = jest.spyOn(element("dialog-gif"), "click");
      mopProfileFeed(context);
      expect(click).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(dialogClick).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(element("post").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("standalone permalinks, composer prose, and ordinary anchors do not define posts", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    mountProfile(
      '<a id="standalone" href="/publisher/posts/100/">Unwanted standalone link</a><section id="composer"><div>Unwanted draft</div></section><a id="ordinary-link" href="/publisher/about">About</a>'
    );
    expect(getProfilePostsFromPermalinks(element("profile-root"))).toEqual([]);
    mopProfileFeed(context);
    for (const id of ["standalone", "composer", "ordinary-link", "profile-root"])
      expect(element(id).hasAttribute(postAtt)).toBe(false);
  });

  test("unsupported profile structure is retried when a valid post appears later", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    mountProfile('<section id="composer">Write something</section>');
    expect(mopProfileFeed(context)).not.toBeNull();
    element("profile-root").insertAdjacentHTML(
      "beforeend",
      profilePost("post", "Unwanted content")
    );
    mopProfileFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
    expect(element("composer").hasAttribute(postAtt)).toBe(false);
  });

  test("recycled profile content and saved-option reset each remove stale presentation", () => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    mountProfile(profilePost("post", "Unwanted offer") + profilePost("ordinary", "News"));
    mopProfileFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe("unwanted");
    const replacement = document.createElement("div");
    replacement.innerHTML = profilePost("replacement", "A useful local story");
    element("post").innerHTML = requireElement(replacement.firstElementChild).innerHTML;
    context.state.forceProcess = true;
    mopProfileFeed(context);
    expect(element("post").hasAttribute(postAtt)).toBe(false);
    context.options.PP_BLOCKED_ENABLED = false;
    resetFeedProcessing(context.state);
    expect(mopProfileFeed(context)).toBeNull();
    expect(document.querySelector(`[${context.state.hideAtt}]`)).toBeNull();
  });
  test.each([true, false])("PP_BLOCKED_RE=%s reaches the profile matching mode", (enabled) => {
    const context = routeContext("/example.publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_RE: enabled,
      PP_BLOCKED_TEXT: "offer[0-9]+",
    });
    mountProfile(profilePost("post", "offer123") + profilePost("ordinary", "Community news"));
    mopProfileFeed(context);
    expect(element("post").getAttribute(postAtt)).toBe(enabled ? "offer[0-9]+" : null);
  });
});
