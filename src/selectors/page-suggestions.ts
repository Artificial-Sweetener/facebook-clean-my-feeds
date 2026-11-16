// SPDX-License-Identifier: GPL-3.0-only

/** Page discovery geometry and ownership selectors; translated labels never enter the structural path. */
export const pageSuggestionSelectors = {
  list: '[role="list"]',
  items: ':scope > [role="listitem"]',
  nestedContent: '[role="list"], [role="listitem"], article, [role="article"], [aria-posinset]',
  icons: "svg",
  portrait: "svg image",
  actions: 'button, [role="button"]',
  statefulAction: "[aria-haspopup], [aria-pressed], [aria-expanded], [aria-controls]",
  disabledAction: '[aria-disabled="true"], [disabled]',
};
