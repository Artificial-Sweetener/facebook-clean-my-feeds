// SPDX-License-Identifier: GPL-3.0-only

/** Shared ownership, content, and overlay selectors leave classification and mutation to feed code. */
const sharedSelectors = {
  dialog: 'div[role="dialog"]',
  postOwner: 'div[role="article"], div[aria-posinset]',
  profileName: '[data-ad-rendering-role="profile_name"]',
  authorMetadata: '[data-ad-rendering-role="profile_name"], h4, h5',
  storyMessage: '[data-ad-rendering-role="story_message"]',
  interactive: 'a, button, [role="button"], [role="link"]',
  adCreativeCta: '[data-ad-rendering-role^="cta-"]',
  adCreativeMedia: '[data-ad-rendering-role="image"] img, [data-ad-rendering-role="image"] video',
  paidMetadataButton: 'button:not([aria-haspopup]), [role="button"]:not([aria-haspopup])',
  disclosureNonTextContent: 'a, button, [role="button"], [role="link"], svg, img, video',
  avatarMedia: "img, image, video",
  svgLabelGeometry: "svg use, svg text",
  authoredContent:
    'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]',
};

export { sharedSelectors };
