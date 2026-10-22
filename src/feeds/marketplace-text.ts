// SPDX-License-Identifier: GPL-3.0-only

import type { Filters } from "../core/filters/types";
import { findFirstMatch, findFirstMatchRegExp } from "../core/filters/matching";
import { mpScanTreeForText } from "../dom/walker";
import type { MarketplaceListing } from "./marketplace-discovery";

/**
 * Match each independent price token so literal rules stay exact and regex anchors retain their meaning.
 * @param listing Production card ownership and its ordered rendered caption rows.
 * @param filters Original patterns and normalized literal tokens in configured priority order.
 * @param regex Whether validated expressions replace literal exact-token matching.
 * @returns The first matching configured token or pattern; an empty result leaves the card visible.
 * @throws SyntaxError if an unvalidated invalid expression bypasses the options boundary.
 */
export function findMarketplacePriceMatch(
  listing: MarketplaceListing,
  filters: Filters,
  regex: boolean
): string {
  const price = listing.textBlocks[0];
  if (!price) return "";
  const tokens = mpScanTreeForText(price, listing.box, listing.visualText);
  return regex
    ? findFirstMatchRegExp(tokens, filters.MP_BLOCKED_TEXT)
    : findFirstMatch(tokens, filters.MP_BLOCKED_TEXT_LC);
}

/**
 * Match rendered title/location rows separately, keeping price text out of description rules.
 * @param listing Production card ownership and the accessibility policy for its actual layout.
 * @param filters Original expressions and normalized literal substrings in configured priority order.
 * @param regex Whether validated expressions replace case-insensitive literal substring matching.
 * @returns A configured matching pattern or substring, or an empty result.
 * @throws SyntaxError if invalid syntax bypasses startup/save/import validation.
 */
export function findMarketplaceDescriptionMatch(
  listing: MarketplaceListing,
  filters: Filters,
  regex: boolean
): string {
  for (const block of listing.textBlocks.slice(1)) {
    const text = mpScanTreeForText(block, listing.box, listing.visualText).join(" ");
    if (!text) continue;
    const match = regex
      ? findFirstMatchRegExp(text, filters.MP_BLOCKED_TEXT_DESCRIPTION)
      : findFirstMatch(text, filters.MP_BLOCKED_TEXT_DESCRIPTION_LC);
    if (match) return match;
  }
  return "";
}
