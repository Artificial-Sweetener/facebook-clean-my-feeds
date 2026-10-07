// SPDX-License-Identifier: GPL-3.0-only

/**
 * Try the shallower news content-block structure first and choose the one-level-deeper fallback when it yields at most one block; return a selector without mutating the post.
 */
function getNewsBlocksQuery(post: Element) {
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  const blocks = post.querySelectorAll(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
  }
  return blocksQuery;
}

/**
 * Resolve group post content depth from the shallow block count, retaining the same aria-posinset/aria-describedby alternatives used by the deeper fallback.
 */
function getGroupsBlocksQuery(post: Element) {
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  const blocks = post.querySelectorAll(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
  }
  return blocksQuery;
}

export { getNewsBlocksQuery, getGroupsBlocksQuery };
