// SPDX-License-Identifier: GPL-3.0-only

/** News discovery selectors retain their fallback order; processors prioritize concrete post roots before broad wrappers. */
const newsSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  dialog: 'div[role="dialog"]',
  rightRail: '[role="complementary"]',
  featureContentBoundary:
    'article, [role="article"], div[aria-posinset], [role="main"], [role="feed"], [role="navigation"], h4, h5, p, blockquote, [data-ad-rendering-role="profile_name"], [data-ad-rendering-role="story_message"], [data-ad-preview="message"], [data-ad-comet-preview="message"]',
  mainSurface: '[role="main"]',
  authorActions: 'button, [role="button"]',
  authorLinks: "a[href]",
  inlineAuthorAction: 'div[role="button"][tabindex="0"]',
  statefulAuthorAction:
    '[aria-haspopup], [aria-expanded], [aria-pressed], [aria-disabled="true"], [disabled], [aria-controls]',
  actionCaption: ":scope > span",
  actionNonCaption:
    'a, button, [role="button"], svg, img, i, input, [role="img"], [role="switch"], [role="checkbox"]',
  authorSeparator: 'span[aria-hidden="true"]',
  advertisingRailHeadings: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  attributedAdLinks: "a[attributionsrc][href]",
  railHeadings: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  railFriendLinks: 'a[href*="/friends"]',
  railRequestLinks: 'a[href*="/friends/requests"]',
  railActions: 'button, [role="button"]',
  railContentBoundary:
    'article, [role="article"], [role="feed"], [role="navigation"], [role="dialog"]',
  surveyButton: 'a[href*="/survey/?session="] > div[role="none"]',
  standardPost: 'article, [role="article"], div[aria-posinset]',
  sponsoredLink: 'a[href*="/ads/about/"]',
  paidDisclosureLegacy:
    "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)",
  paidDisclosureControls: 'button, [role="button"], a[href], [role="link"]',
  paidDisclosureIdentity: '[data-ad-rendering-role="profile_name"], h4, h5',
  peopleTiles: '[data-type="hscroll-child"]',
  discoveryListItems: "ul > li",
  discoveryCaption: "span",
  discoveryActionMedia: 'svg, img, i, input, a, [role="img"]',
  peopleLinks: 'a[href][role="link"]',
  peopleActions: 'button, [role="button"]',
  promptButtons: '[data-type="hscroll-child"] button, [data-type="hscroll-child"] [role="button"]',
  promptIcons: "i, img, svg",
  peoplePostContent:
    '[data-ad-rendering-role="profile_name"], [data-ad-rendering-role="story_message"], [data-ad-preview="message"], [data-ad-comet-preview="message"], h4, h5, p, blockquote',
  virtualizedContainer: "div[data-virtualized]",
  storyShelfCandidates:
    'div[role="main"] div[data-virtualized] [data-type="hscroll-child"] a[href*="/stories/"]',
  storyShelfItems: '[data-type="hscroll-child"]',
  storyShelfAuthors: "h4 a[href], h5 a[href]",
  storyShelfMedia: 'img, video, [role="img"]',
  reelShelfItems: '[data-type="hscroll-child"]',
  reelShelfContent:
    '[data-ad-rendering-role="profile_name"], [data-ad-rendering-role="story_message"]',
  reelShelfAuthors: "h4 a[href], h5 a[href]",
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
