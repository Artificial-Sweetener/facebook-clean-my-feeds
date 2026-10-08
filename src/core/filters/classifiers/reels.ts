// SPDX-License-Identifier: GPL-3.0-only

/** Recognize reel detail links while treating absent or non-string DOM attributes as non-matches. */
export function isReelLink(href: unknown): boolean {
  return typeof href === "string" && href.includes("/reel/");
}

/** Match only the feed module link; individual reels use a different classifier. */
export function isReelsAndShortVideosLink(href: unknown): boolean {
  return href === "/reel/?s=ifu_see_more";
}
