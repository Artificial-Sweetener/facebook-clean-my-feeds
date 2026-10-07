// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopNewsFeed } from "../../src/feeds/news";
import {
  contextForOption,
  mountNewsPost,
  ordinaryDiscussion,
  postCases,
} from "./news-contract-fixtures";

describe.each(postCases)("news option $option", ({ option, markup }) => {
  test("hides the supported feature and leaves the adjacent ordinary post visible", () => {
    const { main, post, neighbor } = mountNewsPost(markup);
    const context = contextForOption(option);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(main.hasAttribute(postAtt)).toBe(false);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });

  test("keeps its positive fixture visible when the option is disabled", () => {
    const { post } = mountNewsPost(markup);
    const context = contextForOption(option, false);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test("does not classify ad or recommendation wording in ordinary body and comments", () => {
    const { post, neighbor } = mountNewsPost(ordinaryDiscussion());
    mopNewsFeed(contextForOption(option));
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });

  test("classifies a late supported signal on the next eligible sweep", () => {
    const { post } = mountNewsPost("<p>Ordinary initial content</p>");
    const context = contextForOption(option);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    post.innerHTML = markup;
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
  });

  test("leaves repeated processing of the same hidden root idempotent", () => {
    const { post } = mountNewsPost(markup);
    const context = contextForOption(option);
    mopNewsFeed(context);
    const hiddenMarkup = post.outerHTML;
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.outerHTML).toBe(hiddenMarkup);
  });
});
