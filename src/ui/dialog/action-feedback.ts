// SPDX-License-Identifier: GPL-3.0-only

import type { DialogState } from "./types";
import { collectDialogOptions, deepEqual } from "./form-state";

/**
 * Find a footer action without touching similarly named controls elsewhere on the page.
 * @param buttonId Stable footer control identifier.
 * @returns The owned footer button, or null before the dialog/footer exists.
 */
export function getFooterButton(buttonId: string): HTMLButtonElement | null {
  if (!buttonId) {
    return null;
  }
  const dialog = document.getElementById("fbcmf");
  if (!dialog) {
    return null;
  }
  const footer = dialog.querySelector("footer");
  if (!footer) {
    return null;
  }
  return footer.querySelector<HTMLButtonElement>(`#${buttonId}`);
}

/**
 * Replace the decorative action glyph while preserving the button label and event listeners.
 * @param state Shared presentation state retained by mounted listeners.
 * @param button Mounted action button whose label/listeners must be retained.
 * @param iconHtml Trusted decorative markup built from bundled assets.
 */
export function setActionButtonIcon(
  state: DialogState,
  button: HTMLElement | null,
  iconHtml: string
) {
  if (!state || !button || !iconHtml) {
    return;
  }
  const iconWrap = button.querySelector(".cmf-action-icon");
  if (!iconWrap) {
    return;
  }
  iconWrap.innerHTML = iconHtml;
}

/**
 * Compare current controls with saved values and clear stale confirmation feedback when edits become dirty.
 * @param state Shared presentation state retained by mounted listeners.
 */
export function syncSaveButtonState(state: DialogState) {
  const pendingOptions = collectDialogOptions(state);
  if (!pendingOptions) {
    return;
  }
  const button = getFooterButton("BTNSave");
  if (!button) {
    return;
  }
  const isDirty = !deepEqual(pendingOptions, state.options);
  if (isDirty) {
    button.classList.add("cmf-action--dirty");
    button.classList.remove("cmf-action--confirm-blue");
    button.classList.remove("cmf-action--confirm-green");
    if (state.saveFeedbackTimeoutId) {
      clearTimeout(state.saveFeedbackTimeoutId);
      state.saveFeedbackTimeoutId = null;
    }
    setActionButtonIcon(state, button, state.iconFooterSaveHTML || state.iconDialogFooterHTML);
    return;
  }

  button.classList.remove("cmf-action--dirty");
  if (!button.classList.contains("cmf-action--confirm-blue")) {
    setActionButtonIcon(state, button, state.iconFooterSaveHTML || state.iconDialogFooterHTML);
  }
}

/**
 * Show a temporary confirmation glyph and restore the action-specific icon after 600 milliseconds.
 * @param state Shared presentation state retained by mounted listeners.
 * @param buttonId Stable footer control identifier.
 * @param className Confirmation class removed after the feedback interval.
 */
export function triggerActionFeedback(state: DialogState, buttonId: string, className: string) {
  const button = getFooterButton(buttonId);
  if (!button) {
    return;
  }
  if (state.saveFeedbackTimeoutId) {
    clearTimeout(state.saveFeedbackTimeoutId);
  }
  button.classList.add(className);
  button.classList.remove("cmf-action--dirty");
  setActionButtonIcon(
    state,
    button,
    state.iconFooterCheckHTML || state.iconFooterSaveHTML || state.iconDialogFooterHTML
  );
  state.saveFeedbackTimeoutId = setTimeout(() => {
    const currentButton = getFooterButton(buttonId);
    if (!currentButton) {
      return;
    }
    currentButton.classList.remove(className);
    const footerIcons = state.dialogFooterIcons || {};
    const defaultIcon =
      buttonId === "BTNSave"
        ? state.iconFooterSaveHTML || footerIcons.BTNSave || state.iconDialogFooterHTML
        : footerIcons[buttonId] || state.iconDialogFooterHTML;
    setActionButtonIcon(state, currentButton, defaultIcon);
    state.saveFeedbackTimeoutId = null;
  }, 600);
}
