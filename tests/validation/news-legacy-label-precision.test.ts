// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext } from "../feeds/news-fixtures";
import { cleanRouteDocument } from "./routes-fixtures";
import {
  contextForOption,
  mountNewsPost,
  postCases,
  suggestionHeader,
} from "./news-contract-fixtures";

afterEach(cleanRouteDocument);

test("an unrelated legacy leaf cannot veto an independent group recommendation", () => {
  const { post } = mountNewsPost(
    suggestionHeader("Community") +
      '<h3>Groups you might like</h3><a href="/groups/discover/">Browse</a>'
  );
  mopNewsFeed(contextForOption("NF_SUGGESTIONS"));
  expect(post.hasAttribute(postAtt)).toBe(true);
});

test.each([
  [
    "NF_FOLLOW",
    '<h4 id="first" hidden><span><div><span>Other copy</span></div></span></h4><h4 id="second"><span><div><span>Follow</span></div></span></h4>',
  ],
  [
    "NF_PARTICIPATE",
    '<h4 hidden><span><span class="action"><span>Other copy</span></span></span></h4><h4><span><span class="action"><span>Join</span></span></span></h4>',
  ],
] as const)("concealed legacy leaves cannot veto the owning %s action", (option, markup) => {
  const { post } = mountNewsPost(markup);
  mopNewsFeed(contextForOption(option));
  expect(post.hasAttribute(postAtt)).toBe(true);
});

test.each(["display:none", "visibility:hidden"])(
  "a concealed legacy suggestion cannot hide its post: %s",
  (style) => {
    const { post } = mountNewsPost(suggestionHeader("Suggested for you"));
    const leaf = Array.from(post.querySelectorAll("span")).find(
      (element) => element.childElementCount === 0 && element.textContent === "Suggested for you"
    );
    if (!leaf) throw new Error("Missing suggestion label");
    leaf.setAttribute("style", style);
    mopNewsFeed(contextForOption("NF_SUGGESTIONS"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  }
);

test("a concealed suggestion cannot veto the later rendered header", () => {
  const { post } = mountNewsPost(
    `${suggestionHeader("Other copy")}${suggestionHeader("Suggested for you")}`
  );
  const leaf = Array.from(post.querySelectorAll("span")).find(
    (element) => element.childElementCount === 0 && element.textContent === "Other copy"
  );
  if (!leaf) throw new Error("Missing decoy label");
  leaf.setAttribute("hidden", "");
  mopNewsFeed(contextForOption("NF_SUGGESTIONS"));
  expect(post.hasAttribute(postAtt)).toBe(true);
});

test("fragmented paid-by copy ignores concealed decoys", () => {
  const markup = postCases.find(({ option }) => option === "NF_SPONSORED_PAID")?.markup;
  if (!markup) throw new Error("Missing paid-by fixture");
  const { post } = mountNewsPost(
    markup.replace("Paid for by Example", "Paid for <span hidden>decoy</span>by Example")
  );
  mopNewsFeed(contextForOption("NF_SPONSORED_PAID"));
  expect(post.hasAttribute(postAtt)).toBe(true);
});

/** Retain the visually rendered reaction counter that Facebook intentionally excludes from accessibility text. */
function likes(count: string): string {
  return `<span role="toolbar"></span><div><div role="button"><span class="reaction-count" aria-hidden="true"><span><span class="number">${count}</span></span></span></div></div>`;
}

test.each([
  "<div hidden>",
  '<div style="display:none">',
  '<div role="comment">',
  '<div role="article">',
  '<div data-ad-preview="message">',
])("a non-owning or concealed reaction counter cannot hide the parent: %s", (opening) => {
  const { post } = mountNewsPost(`<h4>Author</h4>${opening}${likes("9999")}</div>${likes("5")}`);
  mopNewsFeed(
    createNewsContext({ options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "100" } })
  );
  expect(post.hasAttribute(postAtt)).toBe(false);
});

test("rendered numeric fragments exclude hidden text without rejecting the aria-hidden visual count", () => {
  const { post } = mountNewsPost(likes("1<span hidden>0</span>0"));
  mopNewsFeed(
    createNewsContext({ options: { NF_LIKES_MAXIMUM: true, NF_LIKES_MAXIMUM_COUNT: "50" } })
  );
  expect(post.hasAttribute(postAtt)).toBe(false);
});
