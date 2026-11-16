// SPDX-License-Identifier: GPL-3.0-only

import { sharedSelectors } from "./shared";

/** Sensitive-region signals do not depend on known disclosure words or detector results. */
export const diagnosticSelectors = {
  authored: `${sharedSelectors.authoredContent}, [role="log"], [role="paragraph"], [data-ad-rendering-role^="title"], [data-ad-rendering-role^="description"]`,
  filterCaption: "details[cmfr] > summary, h6[cmftsb]",
  editable:
    'textarea, input, [role="textbox"], [contenteditable]:not([contenteditable="false"]), [data-lexical-editor]',
  personalIdentity:
    '[data-hovercard], [data-profileid], [data-userid], a[href*="/events/birthdays"] b, a[href*="/events/birthdays"] strong',
  control:
    'a, button, [role="button"], [role="link"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="switch"], [role="option"]',
  heading: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  excluded: "script, style, noscript, template, iframe, embed, canvas, foreignObject",
  post: '[aria-posinset], [role="article"]',
  profile: sharedSelectors.profileName,
  labelReference: "[aria-labelledby], [aria-describedby], svg use",
};
