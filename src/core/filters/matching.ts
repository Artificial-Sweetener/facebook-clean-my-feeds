// SPDX-License-Identifier: GPL-3.0-only

/** Return the first substring (text input) or exact token (array input) in configured priority order. */
export function findFirstMatch(
  postFullText: string | readonly string[],
  textValuesToFind: readonly string[]
): string {
  const foundText = textValuesToFind.find((text) => postFullText.includes(text));
  return foundText !== undefined ? foundText : "";
}

/** Match case-insensitive patterns in priority order against text or independent tokens; invalid syntax raises at the caller boundary. */
export function findFirstMatchRegExp(
  postFullText: string | readonly string[],
  regexpTextValuesToFind: readonly string[]
): string {
  for (const pattern of regexpTextValuesToFind) {
    const regex = new RegExp(pattern, "i");
    if (
      typeof postFullText === "string"
        ? regex.test(postFullText)
        : postFullText.some((token) => regex.test(token))
    ) {
      return pattern;
    }
  }

  return "";
}
