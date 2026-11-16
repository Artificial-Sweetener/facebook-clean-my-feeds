// SPDX-License-Identifier: GPL-3.0-only

/** Independent native ad slots pair a disclosure heading with a separate advertiser creative. */
export const adSlotSelectors = {
  disclosures: 'h2 a[href*="/ads/about/"], h3 a[href*="/ads/about/"]',
  headings: "h2, h3",
  links: "a[href]",
  controls: 'button, [role="button"]',
  menu: '[aria-haspopup="dialog"], [aria-haspopup="menu"]',
  media: "img, video",
  input: 'input, textarea, select, [contenteditable="true"]',
};
