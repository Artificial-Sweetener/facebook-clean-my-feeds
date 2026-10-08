// SPDX-License-Identifier: GPL-3.0-only

/** News discovery selectors retain their fallback order; processors prioritize concrete post roots before broad wrappers. */
const newsSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  dialog: 'div[role="dialog"]',
  surveyButton: 'a[href*="/survey/?session="] > div[role="none"]',
  standardPost: 'div[role="article"], div[aria-posinset]',
  sponsoredLink: 'a[href*="/ads/about/"]',
  virtualizedContainer: "div[data-virtualized]",
  postQueries: [
    'h3[dir="auto"] ~ div div[aria-posinset]',
    'h2[dir="auto"] ~ div div[aria-posinset]',
    'h3[dir="auto"] ~ div div[role="article"]',
    'h2[dir="auto"] ~ div div[role="article"]',
    'div[role="main"] div[aria-posinset]',
    'div[role="main"] div[role="article"]',
    'div[role="main"] div[data-virtualized] div[role="article"]',
    'h3[dir="auto"] ~ div:not([class]) > div > div > div > div > div',
    'h2[dir="auto"] ~ div:not([class]) > div > div > div > div > div',
    'div[role="feed"] > h3[dir="auto"] ~ div:not([class]) > div[data-pagelet*="FeedUnit_"] > div > div > div > div',
    'div[role="feed"] > h2[dir="auto"] ~ div:not([class]) > div[data-pagelet*="FeedUnit_"] > div > div > div > div',
  ],
};

export { newsSelectors };
