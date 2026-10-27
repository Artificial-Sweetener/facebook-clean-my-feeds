// SPDX-License-Identifier: GPL-3.0-only

/** Search results use a region-adjacent main root and their own nested feed wrapper. */
const searchSelectors = {
  mainColumn: 'div[role="region"] ~ div[role="main"]',
  postsQuery: 'div[role="feed"] > div > div',
};

export { searchSelectors };
