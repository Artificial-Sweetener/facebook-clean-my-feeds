// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { getProfilePostsFromPermalinks, mopProfileFeed } from "../../src/feeds/profile";
import { cleanRouteDocument, element, routeContext, textPost } from "./routes-fixtures";

afterEach(cleanRouteDocument);

describe("explicit profile roots retain related-post links inside their content", () => {
  test.each([
    '<a href="/other/posts/200/">Related post</a>',
    '<div role="article"><a href="/other/posts/200/">Quoted post</a></div>',
    '<div role="article" aria-label="Comment"><a href="/other/posts/200/">Comment reference</a></div>',
  ])("preserves the full parent when its body includes %s", (reference) => {
    const context = routeContext("/publisher", {
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_TEXT: "unwanted",
    });
    document.body.innerHTML = `<div role="main" id="profile-root">${textPost("target", `Unwanted offer ${reference}`, '<a href="/publisher/posts/100/">Yesterday</a>')}${textPost("ordinary", "Community news", '<a href="/publisher/posts/101/">Today</a>')}</div>`;
    expect(getProfilePostsFromPermalinks(element("profile-root"))).toEqual([
      element("target"),
      element("ordinary"),
    ]);
    mopProfileFeed(context);
    expect(element("target").getAttribute(postAtt)).toBe("unwanted");
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("profile-root").hasAttribute(postAtt)).toBe(false);
    expect(element("target").querySelectorAll(`[${postAtt}]`)).toHaveLength(0);
  });
});
