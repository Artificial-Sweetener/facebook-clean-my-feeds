// SPDX-License-Identifier: GPL-3.0-only

/** Group routes share stable page/dialog boundaries while recent and ordinary feeds expose different post wrappers. */
const groupsSelectors = {
  mainColumn: 'div[role="navigation"] ~ div[role="main"]',
  groupPageMainColumn: 'div[role="main"] div[role="feed"]',
  dialog: 'div[role="dialog"]',
  feedQueryRecent: 'h2[dir="auto"] + div > div',
  feedQueryMultiple: 'div[role="feed"] > div',
  feedQuerySingle: 'div[role="feed"] > div',
};

export { groupsSelectors };
