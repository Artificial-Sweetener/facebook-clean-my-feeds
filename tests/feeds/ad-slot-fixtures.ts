// SPDX-License-Identifier: GPL-3.0-only

/** Model the live Marketplace heading/menu and advertiser player, allowing independent wrapper-depth variations. */
export function structuralAdSlot(depth = 0): string {
  return `<div id="ad-slot"><div>${"<div>".repeat(depth)}<h2><a href="/ads/about/?entry_product=ad_preferences">未知</a><button aria-haspopup="dialog"><svg></svg></button></h2>${"</div>".repeat(depth)}</div><div><a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fadvertiser.example%2F&amp;ai=private-ad-token"><img><video></video><button>未知</button></a></div></div>`;
}
