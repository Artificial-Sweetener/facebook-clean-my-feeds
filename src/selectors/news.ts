// SPDX-License-Identifier: GPL-3.0-only

/** News discovery selectors retain their fallback order; processors prioritize concrete post roots before broad wrappers. */
const newsSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  dialog: 'div[role="dialog"]',
  rightRail: '[role="complementary"]',
  railHeadings: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  railFriendLinks: 'a[href*="/friends"]',
  railRequestLinks: 'a[href*="/friends/requests"]',
  railActions: 'button, [role="button"]',
  railContentBoundary: '[role="article"], [role="feed"], [role="navigation"], [role="dialog"]',
  surveyButton: 'a[href*="/survey/?session="] > div[role="none"]',
  standardPost: 'div[role="article"], div[aria-posinset]',
  sponsoredLink: 'a[href*="/ads/about/"]',
  virtualizedContainer: "div[data-virtualized]",
  storyShelfCandidates:
    'div[role="main"] div[data-virtualized] [data-type="hscroll-child"] a[href*="/stories/"]',
  storyShelfItems: '[data-type="hscroll-child"]',
  storyShelfAuthors: "h4 a[href], h5 a[href]",
  storyShelfMedia: 'img, video, [role="img"]',
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
