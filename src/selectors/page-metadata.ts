// SPDX-License-Identifier: GPL-3.0-only

/** Native inert payloads and player ownership hooks; translated captions never enter these queries. */
export const pageMetadataSelectors = {
  payload: 'script[type="application/json"][data-sjs]',
  player: "[data-video-id]",
  video: "video",
  liveToggle: '[role="button"][aria-pressed="true"], [role="button"][aria-pressed="false"]',
  transport: 'button, [role="button"]',
  slider: '[role="slider"]',
  links: "a[href]",
  storyLinks: 'h3 a[href], h4 a[href], h5 a[href], [data-ad-rendering-role="profile_name"] a[href]',
};
