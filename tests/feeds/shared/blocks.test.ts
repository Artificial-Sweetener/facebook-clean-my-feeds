// SPDX-License-Identifier: GPL-3.0-only

import { getGroupsBlocks, getNewsBlocks } from "../../../src/feeds/shared/blocks";

/** Exercise actual legacy wrapper depths without mocking the DOM selectors being verified. */
function mountLegacyBlocks(depth: number): Element {
  document.body.innerHTML = `<div aria-posinset="1">${"<div>".repeat(depth)}<div id="header">Author</div><div id="body">Message</div><div id="footer">Reactions</div>${"</div>".repeat(depth)}</div>`;
  const post = document.querySelector("[aria-posinset]");
  if (!post) throw new Error("Missing legacy post fixture");
  return post;
}

afterEach(() => document.body.replaceChildren());

describe.each([getNewsBlocks, getGroupsBlocks])("legacy block ownership", (getQuery) => {
  test.each([7, 8])("selects header, body and footer at wrapper depth %s", (depth) => {
    const post = mountLegacyBlocks(depth);
    expect(Array.from(getQuery(post), (block) => block.id)).toEqual(["header", "body", "footer"]);
  });

  test("an empty post produces no content blocks", () => {
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    expect(getQuery(post)).toHaveLength(0);
  });

  test("hidden siblings do not shift the first authored metadata block", () => {
    const post = mountLegacyBlocks(7);
    document
      .getElementById("header")
      ?.insertAdjacentHTML("beforebegin", '<div aria-hidden="true">Private decoy</div>');
    expect(Array.from(getQuery(post), (block) => block.id)).toEqual(["header", "body", "footer"]);
  });
});
