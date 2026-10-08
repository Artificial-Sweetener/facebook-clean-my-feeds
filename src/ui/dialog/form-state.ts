// SPDX-License-Identifier: GPL-3.0-only

import type { DialogState } from "./types";

/** Distinguish imported JSON objects from arrays and null before recursive comparison. */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Compare option trees by value so newly allocated checkbox arrays do not mark settings dirty. */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value: unknown, index) => deepEqual(value, b[index]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keys = Object.keys(a);
    return (
      keys.length === Object.keys(b).length &&
      keys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]))
    );
  }
  return false;
}

/**
 * Collect mounted settings controls, preserving separators and persisted string flags.
 * @param state Current saved options and blocked-keyword separator, or null before startup.
 * @returns A detached draft record, or null when state or the dialog is unavailable.
 */
export function collectDialogOptions(state: DialogState | null): Record<string, unknown> | null {
  const dialog = document.getElementById("fbcmf");
  if (!state || !dialog) return null;
  const options: Record<string, unknown> = { ...state.options };
  dialog
    .querySelectorAll<HTMLInputElement>('input[type="checkbox"][cbtype="T"]')
    .forEach((input) => {
      if (input.name) options[input.name] = input.checked;
    });
  const blockedFeeds = [
    "NF_BLOCKED_FEED",
    "GF_BLOCKED_FEED",
    "VF_BLOCKED_FEED",
    "MP_BLOCKED_FEED",
    "PP_BLOCKED_FEED",
  ];
  blockedFeeds.forEach((name) => {
    const existing = options[name];
    const values: unknown[] = Array.isArray(existing) ? [...existing] : [];
    dialog
      .querySelectorAll<HTMLInputElement>(`input[type="checkbox"][name="${name}"]`)
      .forEach((input) => {
        values[parseInt(input.value, 10)] = input.checked ? "1" : "0";
      });
    options[name] = values;
  });
  dialog
    .querySelectorAll<HTMLInputElement>('input[type="radio"]:checked, input[type="text"]')
    .forEach((input) => {
      if (input.name) options[input.name] = input.value;
    });
  dialog.querySelectorAll("textarea").forEach((input) => {
    if (!input.name) return;
    options[input.name] = input.value
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .join(state.SEP);
  });
  dialog.querySelectorAll("select").forEach((select) => {
    if (select.name) options[select.name] = select.value;
  });
  return pruneDialogOptions(options, dialog);
}

/** Remove obsolete settings using current control names before hydration restores defaults. */
export function pruneDialogOptions(
  options: Record<string, unknown>,
  dialog: HTMLElement | null
): Record<string, unknown> {
  if (!dialog) return options;
  const names = new Set(
    Array.from(
      dialog.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input:not([type="file"]), textarea, select'
      )
    )
      .map((input) => input.name)
      .filter((name) => name.length > 0)
  );
  return Object.fromEntries(Object.entries(options).filter(([key]) => names.has(key)));
}
