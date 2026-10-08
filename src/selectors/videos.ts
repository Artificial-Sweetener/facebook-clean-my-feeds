// SPDX-License-Identifier: GPL-3.0-only

/** Video route variants pair each post selector with its matching content-block depth. */
const videosSelectors = {
  mainColumn:
    'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div',
  dialog: 'div[role="dialog"] div[role="main"]',
  feedQueries: {
    videos: ":scope > div > div:not([class]) > div",
    search: 'div[role="feed"] > div[role="article"]',
    item: 'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div',
  },
  blockQueries: {
    videos: ":scope > div > div > div > div > div:nth-of-type(2) > div",
    search: ":scope > div > div > div > div > div > div > div:nth-of-type(2)",
    item: ":scope > div > div > div > div > div:nth-of-type(2) > div",
  },
};

export { videosSelectors };
