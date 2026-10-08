// SPDX-License-Identifier: GPL-3.0-only

/** Require an actual fixture value so missing markup fails locally instead of relying on non-null assertions. */
export function required<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Expected fixture value is missing");
  return value;
}
