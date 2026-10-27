// SPDX-License-Identifier: GPL-3.0-only

/** Marketplace item dialogs and navigation pages require separate roots to avoid processing background listings. */
const marketplaceSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  dialogItem: 'div[hidden] ~ div[class*="__"] div[role="dialog"]',
};

export { marketplaceSelectors };

/** Distinct legacy listing families must be combined because virtualized pages may mix them. */
export const marketplaceListingQueries = [
  'div[style] > div > div > span > div > div > div > div > a[href*="/marketplace/item/"]',
  'div[style] > div > div > span > div > div > div > div > a[href*="/marketplace/np/item/"]',
  'div[style] > div > span > div > div > a[href*="/marketplace/item/"]',
  'div[style] > div > span > div > div > a[href*="/marketplace/np/item/"]',
  'div[style] > div > div > span > div > div > a[href*="/marketplace/item/"]',
  'div[style] > div > div > span > div > div > a[href*="/marketplace/np/item/"]',
];

/** Current cards have a named listing anchor inside their own virtualized cell, without inline sizing. */
export const marketplaceVirtualizedAnchorQuery =
  'a[role="link"][aria-label][href*="/marketplace/"]';
export const marketplaceVirtualizedListingQuery = `[data-virtualized] ${marketplaceVirtualizedAnchorQuery}`;

/** Caption rows follow the media region in either the legacy wrapper or current direct-child layout. */
export const marketplaceTextBlockQuery = ":scope > div > div:nth-of-type(2) > div";
export const marketplaceVirtualizedTextBlockQuery = ":scope > div:nth-of-type(2) > div";

/** Explicit ad-disclosure headings own only adjacent independently styled tiles. */
export const marketplaceSponsoredHeadingQuery =
  'div > a[href*="/ads/about/"], div > object > a[href*="/ads/about/"]';

/** Item recommendations expose standalone ad headings instead of adjacent listing tiles. */
export const marketplaceItemSponsoredHeadingQuery = 'span h2 a[href*="/ads/about/"]';

/** Legacy inline listings still require an exact rendered sponsorship label inside this slot. */
export const marketplaceLegacySponsoredQuery =
  ":scope > div > div > div > div > div > div[style] > span";

/** Supported ad bodies differ by one wrapper; neither shape alone establishes sponsorship. */
export const marketplaceSponsoredTileQuery =
  ':scope > span > div:first-of-type > a:not([href*="marketplace"]), :scope > span > div:first-of-type > div > a:not([href*="marketplace"])';
