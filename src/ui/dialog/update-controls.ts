// SPDX-License-Identifier: GPL-3.0-only

import type { Options } from "../../core/options/types";
import type { DialogState } from "./types";
import { readValue } from "./value-helpers";
import { syncSaveButtonState } from "./action-feedback";
import { updateHeaderCloseVisibility } from "./topbar";

/**
 * Refresh mounted controls after import/reset without replacing listeners or DOM identity.
 * @param state Latest application options, or null when startup has not completed.
 * @param values Optional detached draft restored after a rebuild; active saved filters remain unchanged.
 */
export function updateDialog(
  state: DialogState | null,
  values: Options | Readonly<Record<string, unknown>> = state?.options ?? {}
): void {
  const dialog = document.getElementById("fbcmf");
  const content = dialog?.querySelector(".content");
  if (!content || !state) return;
  content
    .querySelectorAll<HTMLInputElement>('input[type="checkbox"][cbtype="T"]')
    .forEach((input) => {
      const value = readValue(values, input.name);
      if (value !== undefined) input.checked = Boolean(value);
    });
  content
    .querySelectorAll<HTMLInputElement>('input[type="checkbox"][cbtype="M"]')
    .forEach((input) => {
      const value = readValue(values, input.name);
      if (Array.isArray(value)) input.checked = value[parseInt(input.value, 10)] === "1";
    });
  content.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((input) => {
    if (input.value === readValue(values, input.name)) input.checked = true;
  });
  content.querySelectorAll("textarea").forEach((input) => {
    const value = readValue(values, input.name);
    if (typeof value === "string") input.value = value.replaceAll(state.SEP, "\n");
  });
  content.querySelectorAll<HTMLInputElement>('input[type="text"]').forEach((input) => {
    const value = readValue(values, input.name);
    if (typeof value === "string") input.value = value;
  });
  content.querySelectorAll("select").forEach((select) => {
    const value = readValue(values, select.name);
    if (value !== undefined)
      Array.from(select.options).forEach((option) => {
        option.selected = option.value === value;
      });
  });
  updateHeaderCloseVisibility(dialog, state);
  syncSaveButtonState(state);
}
