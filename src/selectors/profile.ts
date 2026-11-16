// SPDX-License-Identifier: GPL-3.0-only

/** Profile selectors identify page and dialog roots independently of the permalink-based post discovery fallback. */
const profileSelectors = {
  mainColumn: 'div[role="main"]',
  dialog: 'div[role="dialog"]',
  permalinks:
    'a[href*="/posts/"], a[href*="/story.php"], a[href*="/permalink/"], a[href*="permalink.php"]',
};

export { profileSelectors };
