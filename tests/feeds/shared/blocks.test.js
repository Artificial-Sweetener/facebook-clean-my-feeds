const { getGroupsBlocksQuery, getNewsBlocksQuery } = require("../../../src/feeds/shared/blocks");

const NEWS_QUERY =
  "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
const NEWS_FALLBACK =
  "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";

const GROUPS_QUERY =
  "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
const GROUPS_FALLBACK =
  "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";

describe("feeds/shared/blocks", () => {
  test("getNewsBlocksQuery returns fallback for small block counts", () => {
    const post = { querySelectorAll: jest.fn(() => [1]) };
    expect(getNewsBlocksQuery(post)).toBe(NEWS_FALLBACK);
  });

  test("getNewsBlocksQuery keeps base query for larger block counts", () => {
    const post = { querySelectorAll: jest.fn(() => [1, 2]) };
    expect(getNewsBlocksQuery(post)).toBe(NEWS_QUERY);
  });

  test("getGroupsBlocksQuery returns fallback for small block counts", () => {
    const post = { querySelectorAll: jest.fn(() => [1]) };
    expect(getGroupsBlocksQuery(post)).toBe(GROUPS_FALLBACK);
  });

  test("getGroupsBlocksQuery keeps base query for larger block counts", () => {
    const post = { querySelectorAll: jest.fn(() => [1, 2]) };
    expect(getGroupsBlocksQuery(post)).toBe(GROUPS_QUERY);
  });
});
