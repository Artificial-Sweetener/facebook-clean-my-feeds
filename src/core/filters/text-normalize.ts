// SPDX-License-Identifier: GPL-3.0-only

/** Fold compatibility Unicode characters before matching feed text, without changing case. */
export function cleanText(text: string): string {
  return text.normalize("NFKC");
}
