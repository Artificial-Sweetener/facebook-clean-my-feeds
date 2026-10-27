// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { restoreFeedPresentation } from "../../src/feeds/reset";
import {
  contextForOption,
  mountNewsPost,
  ordinaryDiscussion,
  postCases,
} from "./news-contract-fixtures";

describe.each(postCases)("news stress contract $option", ({ option, markup }) => {
  afterEach(() => clearDirtyTracking());

  test.each([
    ["nested article", '<div role="article">'],
    ["nested comment", '<div data-commentid="fixture">'],
    ["quotation", "<blockquote>"],
    ["hidden child", '<div style="display:none">'],
    ["invisible child", '<div style="visibility:hidden">'],
    ["inaccessible child", '<div aria-hidden="true">'],
    ["native hidden child", "<div hidden>"],
  ])("keeps the parent visible around %s", (_name, opening) => {
    const tag = opening.startsWith("<blockquote") ? "blockquote" : "div";
    const { post, neighbor, main } = mountNewsPost(
      `<h4><a href="/ordinary-author">Ordinary author</a></h4>${opening}${markup}</${tag}>`
    );
    mopNewsFeed(contextForOption(option));
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
    expect(main.hasAttribute(postAtt)).toBe(false);
  });

  test("reclassifies evidence as a child becomes visible and concealed again", () => {
    const content = option === "NF_SUGGESTIONS" ? "<h3>Suggested for you</h3>" : markup;
    const { post } = mountNewsPost(`<div id="evidence" style="display:none">${content}</div>`);
    const context = contextForOption(option);
    const child = post.querySelector("#evidence");
    if (!(child instanceof HTMLElement)) throw new Error("Missing visibility fixture");
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    child.style.display = "block";
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    child.style.display = "none";
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test("restores a hidden root recycled into ordinary content, then filters its next reuse", () => {
    const { post, neighbor } = mountNewsPost(markup);
    const context = contextForOption(option);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    post.innerHTML = ordinaryDiscussion();
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
    post.innerHTML = markup;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });

  test("releases presentation on option changes and resumes filtering when re-enabled", () => {
    const { post, neighbor } = mountNewsPost(markup);
    const context = contextForOption(option);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    context.options[option] = false;
    restoreFeedPresentation(context.state);
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    context.options[option] = true;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });
});

test.each(["display:none", "visibility:hidden"])(
  "does not promote concealed media into an ordinary reel link: %s",
  (style) => {
    const { post } = mountNewsPost(
      `<h4><a href="/ordinary-author">Ordinary author</a></h4><a href="/reel/123456/">A discussion link<img style="${style}" alt=""></a>`
    );
    mopNewsFeed(contextForOption("NF_SHORT_REEL_VIDEO"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  }
);
