// SPDX-License-Identifier: GPL-3.0-only

/**
 * Parse only complete positive integer counts with uniform comma, dot, or nonbreaking-space
 * thousands groups. Reject ambiguous/malformed grouping so legacy fallback parsing remains unchanged.
 * @param value Unsuffixed rendered count; callers decide whether surrounding whitespace is allowed.
 * @returns Expanded grouped integer, or undefined when no exact supported grouping is present.
 */
function getGroupedInteger(value: string): number | undefined {
  const match = /^[1-9]\d{0,2}([,.\u00a0\u202f])\d{3}(?:\1\d{3})*$/.exec(value);
  // The explicit equality rejects final newlines, which JavaScript's $ anchor otherwise allows.
  return match && match[0] === value ? Number(value.replace(/[,.\u00a0\u202f]/g, "")) : undefined;
}

/**
 * Expand Facebook K/M abbreviations and complete uniform thousands groups.
 * K/M decimal separators retain their existing meaning; unsupported unsuffixed formats retain parseInt fallback behavior.
 * @param value Rendered count, including K/M decimal suffixes or consistently grouped integers.
 * @returns Expanded count; an empty string means zero and nonnumeric leading text returns NaN.
 */
export function getFullNumber(value: string): number {
  let numericValue = 0;
  if (value !== "") {
    const upperValue = value.toUpperCase();
    if (upperValue.endsWith("K") || upperValue.endsWith("M")) {
      let multiplier = 1;
      let powY = 0;
      if (upperValue.endsWith("K")) {
        multiplier = 1000;
        powY = 3;
      } else if (upperValue.endsWith("M")) {
        multiplier = 1000000;
        powY = 6;
      }

      const bits = upperValue.replace(/[KM]/g, "").replace(",", ".").split(".");

      numericValue = parseInt(bits[0] ?? "", 10) * multiplier;

      if (bits[1] !== undefined) {
        numericValue += parseInt(bits[1], 10) * Math.pow(10, powY - bits[1].length);
      }
    } else {
      numericValue = getGroupedInteger(upperValue) ?? parseInt(upperValue, 10);
    }
  }

  return numericValue;
}

/** Treat the configured threshold inclusively; an unset/zero limit and nontext counts do not match. */
export function isAboveMaximumLikes(value: unknown, maxLikes: number | undefined): boolean {
  if (!maxLikes || typeof value !== "string") {
    return false;
  }

  return getFullNumber(value.trim()) >= maxLikes;
}
