// SPDX-License-Identifier: GPL-3.0-only

/** GIF overlays have an unrealized outer icon containing separately painted sprite layers. */
export const gifSelectors = {
  candidates: 'div[role="button"] > i:not([data-visualcompletion])',
  layers: ':scope > span > i[data-visualcompletion="css-img"]',
  media: "img, video",
  controls: 'button, [role="button"]',
  stateful: "[aria-haspopup], [aria-expanded], [aria-pressed], [aria-controls], [disabled]",
};
