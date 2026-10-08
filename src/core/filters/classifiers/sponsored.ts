// SPDX-License-Identifier: GPL-3.0-only

/** Compare a trimmed lowercase label against the provided exact labels; malformed inputs do not match. */
export function isSponsoredLabel(text: unknown, dictionary: unknown): boolean {
  if (!text || typeof text !== "string" || !Array.isArray(dictionary)) {
    return false;
  }

  return dictionary.includes(text.trim().toLowerCase());
}
