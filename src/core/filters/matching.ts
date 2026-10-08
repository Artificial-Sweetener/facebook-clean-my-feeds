// SPDX-License-Identifier: GPL-3.0-only

/** Return the first substring (text input) or exact token (array input) in configured priority order. */
export function findFirstMatch(
  postFullText: string | readonly string[],
  textValuesToFind: readonly string[]
): string {
  const foundText = textValuesToFind.find((text) => postFullText.includes(text));
  return foundText !== undefined ? foundText : "";
}

/** Match case-insensitive patterns in order. Invalid patterns intentionally raise SyntaxError at the caller boundary. */
export function findFirstMatchRegExp(
  postFullText: string,
  regexpTextValuesToFind: readonly string[]
): string {
  for (const pattern of regexpTextValuesToFind) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(postFullText)) {
      return pattern;
    }
  }

  return "";
}
