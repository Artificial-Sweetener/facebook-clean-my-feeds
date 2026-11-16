// SPDX-License-Identifier: GPL-3.0-only

/** Shared ownership, content, and overlay selectors leave classification and mutation to feed code. */
const sharedSelectors = {
  dialog: 'div[role="dialog"]',
  postOwner: 'article, [role="article"], div[aria-posinset]',
  commentContent: '[data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]',
  profileName: '[data-ad-rendering-role="profile_name"]',
  authorMetadata: '[data-ad-rendering-role="profile_name"], h4, h5',
  storyMessage: '[data-ad-rendering-role="story_message"]',
  interactive: 'a, button, [role="button"], [role="link"]',
  adCreativeCta: '[data-ad-rendering-role^="cta-"]',
  adCreativeMedia: '[data-ad-rendering-role="image"] img, [data-ad-rendering-role="image"] video',
  paidMetadataButton: 'button:not([aria-haspopup]), [role="button"]:not([aria-haspopup])',
  statefulDisclosureControl:
    '[aria-pressed], [aria-expanded], [aria-controls], [aria-disabled="true"], [disabled]',
  svgDefinition: "defs, symbol, clipPath, mask, marker, pattern",
  disclosureNonTextContent: 'a, button, [role="button"], [role="link"], svg, img, video',
  avatarMedia: "img, image, video",
  svgLabelGeometry: "svg use, svg text",
  svgShapes: "path, use, image, circle, rect, polygon, polyline, ellipse, line",
  links: "a[href]",
  images: "img",
  authoredContent:
    'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]',
};

export { sharedSelectors };
