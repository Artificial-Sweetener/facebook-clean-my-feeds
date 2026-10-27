// SPDX-License-Identifier: GPL-3.0-only

/** Profile selectors identify page and dialog roots independently of the permalink-based post discovery fallback. */
const profileSelectors = {
  mainColumn: 'div[role="main"]',
  dialog: 'div[role="dialog"]',
  postsQuery:
    'div[role="main"] > div > div > div > div:nth-of-type(2) > div:not([class]) > div > div[class]',
};

export { profileSelectors };
