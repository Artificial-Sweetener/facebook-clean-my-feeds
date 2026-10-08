// SPDX-License-Identifier: GPL-3.0-only

/**
 * Produce a CSS-safe identifier whose first character is always alphabetic.
 * This is collision avoidance for DOM markers, not a cryptographic secret.
 *
 * @param length - Requested character count; historical zero/negative inputs still yield one letter.
 * @returns An ASCII identifier suitable for CSS classes and HTML attributes.
 */
export function generateRandomString(length = 13): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const strArray = [chars.charAt(Math.floor(Math.random() * 52))];
  for (let i = 1; i < length; i += 1) {
    strArray.push(chars.charAt(Math.floor(Math.random() * chars.length)));
  }
  return strArray.join("");
}
