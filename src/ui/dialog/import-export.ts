// SPDX-License-Identifier: GPL-3.0-only

import { updateDialog } from "./update-controls";
import type { UiLifecycle } from "../lifecycle";
import type { DialogState } from "./types";
import { triggerActionFeedback } from "./action-feedback";
import { isPlainObject } from "./form-state";

/** Preserve the existing settings filename and JSON download format. */
export function exportUserOptions(state: DialogState): void {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(state.options)], { type: "text/plain" })
  );
  link.download = "fb - clean my feeds - settings.json";
  link.click();
  link.remove();
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
  if (!file) return;
  const reader = new FileReader();
  lifecycle?.add(() => {
    reader.onload = null;
    if (reader.readyState === FileReader.LOADING) reader.abort();
  });
  reader.onload = () => {
    if (lifecycle && !lifecycle.active) return;
    try {
      if (typeof reader.result !== "string") return;
      const parsed: unknown = JSON.parse(reader.result);
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
  reader.readAsText(file);
}
