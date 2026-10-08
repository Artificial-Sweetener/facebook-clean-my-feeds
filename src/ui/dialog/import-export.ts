// SPDX-License-Identifier: GPL-3.0-only

import { updateDialog } from "./update-controls";
import type { UiLifecycle } from "../lifecycle";
import type { DialogState } from "./types";
import { triggerActionFeedback } from "./action-feedback";
import { isPlainObject } from "./form-state";

/**
 * Preserve the download format and release its Blob URL after initiation or dialog teardown.
 * @param state Committed options, mounted ownership, and successful-export feedback presentation.
 */
export function exportUserOptions(state: DialogState): void {
  const lifecycle = state.dialogLifecycle;
  if (lifecycle && !lifecycle.active) return;
  const link = document.createElement("a");
  const url = window.URL.createObjectURL(
    new Blob([JSON.stringify(state.options)], { type: "text/plain" })
  );
  let released = false;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  /** Revoke once and drop both ownership records, whichever completion path runs first. */
  const release = (): void => {
    if (released) return;
    released = true;
    if (timeout !== undefined) clearTimeout(timeout);
    lifecycle?.remove(release);
    window.URL.revokeObjectURL(url);
  };
  lifecycle?.add(release);
  try {
    link.href = url;
    link.download = "fb - clean my feeds - settings.json";
    link.click();
  } finally {
    link.remove();
    // Let the browser initiate the download before releasing its URL on the next task.
    if (!released) timeout = setTimeout(release, 0);
  }
  triggerActionFeedback(state, "BTNExport", "cmf-action--confirm-green");
}

/**
 * Read user-selected JSON without allowing malformed files or stale readers to change settings.
 * @param event File-input change event whose first selected file supplies the JSON document.
 * @param save Application persistence callback invoked only after required keys are present.
 * @param state Presentation state used to refresh controls and show successful import feedback.
 * @param lifecycle Optional mounted generation that aborts the reader and suppresses stale results.
 */
export function importUserOptions(
  event: Event,
  save: (pending: Record<string, unknown>) => Promise<void>,
  state: DialogState,
  lifecycle?: UiLifecycle
): void {
  const target = event.target;
  const file = target instanceof HTMLInputElement ? target.files?.[0] : undefined;
  if (!file || (lifecycle && !lifecycle.active)) return;
  const reader = new FileReader();
  let settled = false;
  /** Detach terminal handlers and ownership promptly; only unfinished reads need cancellation. */
  const release = (): void => {
    if (settled) return;
    settled = true;
    reader.onload = null;
    reader.onerror = null;
    reader.onabort = null;
    lifecycle?.remove(release);
    if (reader.readyState === FileReader.LOADING) reader.abort();
  };
  lifecycle?.add(release);
  reader.onload = () => {
    if (settled) return;
    const result = reader.result;
    release();
    if (lifecycle && !lifecycle.active) return;
    try {
      if (typeof result !== "string") return;
      const parsed: unknown = JSON.parse(result);
      if (!isPlainObject(parsed)) return;
      const required = ["NF_SPONSORED", "GF_SPONSORED", "VF_SPONSORED", "MP_SPONSORED"];
      if (!required.every((key) => Object.prototype.hasOwnProperty.call(parsed, key))) return;
      void save(parsed)
        .then(() => {
          if (lifecycle && !lifecycle.active) return;
          updateDialog(state);
          triggerActionFeedback(state, "BTNImport", "cmf-action--confirm-green");
        })
        .catch(() => {
          // Validation and storage failures are asynchronous; neither means a successful import.
        });
    } catch {
      // Malformed user-selected files must not interrupt Facebook or change active options.
    }
  };
  reader.onerror = release;
  reader.onabort = release;
  try {
    reader.readAsText(file);
  } catch {
    // A host read failure still releases the reader without changing active settings.
    release();
  }
}
