// SPDX-License-Identifier: GPL-3.0-only

import { sharedSelectors } from "./shared";

/** Capture provenance boundaries are independent of filter vocabulary and positive detector results. */
export const diagnosticSelectors = {
  authored: `${sharedSelectors.authoredContent}, textarea, input, [role="textbox"], [role="log"], [data-lexical-editor]`,
  identity:
    '[data-ad-rendering-role="profile_name"], [data-hovercard], [data-profileid], [data-userid]',
  control:
    'a, button, [role="button"], [role="link"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="switch"], [role="option"]',
  heading: 'h1, h2, h3, h4, h5, h6, [role="heading"]',
  excluded: "script, style, noscript, template, iframe, object, embed, canvas, foreignObject",
  post: '[aria-posinset], [role="article"]',
  legacyPost: "div[aria-describedby], div[data-virtualized]",
  profile: sharedSelectors.profileName,
};
