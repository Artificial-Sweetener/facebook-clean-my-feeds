// SPDX-License-Identifier: GPL-3.0-only

/** Persistence source controls language rebuilding and action-button feedback. */
export type SaveSource = "dialog" | "file" | "reset";

/** Application returns only presentation consequences after options are persisted. */
export interface SaveResult {
  languageChanged: boolean;
  buttonLocationChanged: boolean;
}
