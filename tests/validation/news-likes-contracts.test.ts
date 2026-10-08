// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopNewsFeed, postExceedsLikeCount } from "../../src/feeds/news";
import { createNewsContext } from "../feeds/news-fixtures";
import { mountNewsPost } from "./news-contract-fixtures";

/** Render the supported reaction-toolbar count layout; words in body/comments deliberately use different markup. */
function likesMarkup(count: string) {
  return `<h4>Alice</h4><span role="toolbar"></span><div><div role="button"><span class="reaction-count" aria-hidden="true"><span><span class="number">${count}</span></span></span></div></div>`;
}

describe("news maximum-likes option contract", () => {
  test.each([
    ["1,234", "1000", true],
    ["1,234", "1235", false],
    ["1.234", "1000", true],
    ["1\u00a0234", "1000", true],
    ["1\u202f234", "1235", false],
    ["99", "100", false],
    ["100", "100", true],
    ["101", "100", true],
    ["1.2K", "1200", true],
    ["1.2K", "1201", false],
    ["1,2K", "1200", true],
    ["2M", "2000000", true],
    ["0", "1", false],
    ["0", "0", true],
  ])("compares displayed %s with inclusive maximum %s", (count, maximum, hidden) => {
    const { post, neighbor } = mountNewsPost(likesMarkup(count));
    const context = createNewsContext({
      options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: maximum },
    });
    expect(postExceedsLikeCount(post, context.options, context.keyWords)).toBe(
      hidden ? context.keyWords.NF_LIKES_MAXIMUM : ""
    );
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(hidden);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });

  test("does not hide a high-like post when the option is disabled", () => {
    const { post } = mountNewsPost(likesMarkup("10000"));
    mopNewsFeed(
      createNewsContext({ options: { NF_LIKES_MAXIMUM: false, NF_LIKES_MAXIMUM_COUNT: "100" } })
    );
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("ignores large numbers in body and comments without reaction-count structure", () => {
    const { post } = mountNewsPost(
      '<h4>Alice</h4><p>This article mentions 100000 likes.</p><div aria-label="Comment">Someone claimed 2000000 reactions.</div>'
    );
    const context = createNewsContext({
      options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "100" },
    });
    expect(postExceedsLikeCount(post, context.options, context.keyWords)).toBe(false);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("keeps a post visible when the maximum is not a number", () => {
    const { post } = mountNewsPost(likesMarkup("1200"));
    mopNewsFeed(
      createNewsContext({ options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "unknown" } })
    );
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("rechecks a late-rendered like count on an eligible sweep", () => {
    const { post } = mountNewsPost("<p>Ordinary post loading its reactions</p>");
    const context = createNewsContext({
      options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "100" },
    });
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    post.innerHTML = likesMarkup("100");
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
  });
});
