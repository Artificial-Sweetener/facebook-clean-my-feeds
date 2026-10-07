// SPDX-License-Identifier: GPL-3.0-only

import { findFirstMatch, findFirstMatchRegExp } from "../matching";

/** Use the chosen matching mode; absent or empty configured lists never hide a post. */
export function findBlockedText(
  postText: string,
  patterns: readonly string[] | null | undefined,
  useRegExp: boolean | undefined
): string {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return "";
  }

  if (useRegExp) {
    return findFirstMatchRegExp(postText, patterns);
  }

  return findFirstMatch(postText, patterns);
}
