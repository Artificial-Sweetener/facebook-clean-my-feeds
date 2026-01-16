function getNewsBlocksQuery(post) {
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  const blocks = post.querySelectorAll(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
  }
  return blocksQuery;
}

function getGroupsBlocksQuery(post) {
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  const blocks = post.querySelectorAll(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
  }
  return blocksQuery;
}

module.exports = {
  getNewsBlocksQuery,
  getGroupsBlocksQuery,
};
