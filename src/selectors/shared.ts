// SPDX-License-Identifier: GPL-3.0-only

/** Shared ownership, content, and overlay selectors leave classification and mutation to feed code. */
const sharedSelectors = {
  dialog: 'div[role="dialog"]',
  postOwner: 'div[role="article"], div[aria-posinset]',
  profileName: '[data-ad-rendering-role="profile_name"]',
  storyMessage: '[data-ad-rendering-role="story_message"]',
  authoredContent:
    'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]',
};

export { sharedSelectors };
