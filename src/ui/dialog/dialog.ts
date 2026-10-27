// SPDX-License-Identifier: GPL-3.0-only

import {
  InvalidRegexOptionsError,
  getRegexValidationIssues,
} from "../../core/options/regex-validation";
import { clearRegexErrors, showRegexErrors } from "./regex-errors";
import { UiLifecycle } from "../lifecycle";
import { destroyToggleButton } from "../controls/toggle-button";
import { updateDialog } from "./update-controls";
import type {
  DialogCapabilities,
  DialogContext,
  DialogHandlers,
  SaveSource,
  SaveResult,
} from "./types";
import { collectDialogOptions, deepEqual, pruneDialogOptions } from "./form-state";
import { syncSaveButtonState, triggerActionFeedback } from "./action-feedback";
import { buildDialog } from "./render";
import { addLegendEvents } from "./search";
import {
  mountToggleButton,
  setupOutsideClickClose,
  setupTopbarMenuSync,
  syncToggleButtonOpenState,
  updateHeaderCloseVisibility,
} from "./topbar";
import { initReportBug } from "../reporting/report-controls";
import { exportUserOptions, importUserOptions } from "./import-export";
export { toggleDialog } from "./topbar";
export { updateDialog } from "./update-controls";

/** Return stable handlers when the composition root supplies fully initialized dependencies. */
export function initDialog(
  context: DialogContext,
  capabilities: DialogCapabilities
): DialogHandlers;
/** Preserve the harmless no-op startup boundary for unavailable state or host capabilities. */
export function initDialog(
  context: DialogContext | null,
  capabilities: DialogCapabilities | null
): DialogHandlers | null;

/**
 * Mount settings and wire UI events to application-owned persistence/report capabilities.
 * Missing page body is retried because userscript startup may precede DOM construction.
 * @param context UI presentation state and stable resolved keyword catalog.
 * @param capabilities Application-owned save/reset and privacy-safe diagnostics operations.
 * @returns Stable programmatic handlers also used by the mounted footer controls.
 */
export function initDialog(
  context: DialogContext | null,
  capabilities: DialogCapabilities | null
): DialogHandlers | null {
  if (!context || !capabilities) return null;
  const { state } = context;
  state.destroyDialog?.();
  const lifecycle = new UiLifecycle();
  state.dialogLifecycle = lifecycle;
  let ownedDialog: HTMLElement | null = null;

  /** Release this dialog generation without touching a replacement mounted afterward. */
  const destroyDialog = (): void => {
    if (!lifecycle.active) return;
    lifecycle.dispose();
    ownedDialog?.remove();
    if (state.dialogLifecycle === lifecycle) {
      destroyToggleButton(state);
      if (state.saveFeedbackTimeoutId !== null) clearTimeout(state.saveFeedbackTimeoutId);
      state.saveFeedbackTimeoutId = null;
      state.syncDialogSearch = null;
      state.cmfReportText = "";
      delete state.cmfOutsideClickInit;
      delete state.cmfTopbarSyncInit;
      delete state.cmfTopbarSyncPending;
      state.dialogLifecycle = null;
      state.dialogContentLifecycle = null;
      state.destroyDialog = null;
    }
  };
  state.destroyDialog = destroyDialog;

  /**
   * Apply persisted presentation changes while retaining newer drafts and rejecting stale errors.
   * @param pending Detached submitted options, or null to use the installed model for a reset.
   * @param source Save origin controls validation provenance, locale rebuilding, and button feedback.
   * @param hadChanges Whether this submission differed from the saved settings before persistence.
   * @throws Storage or malformed-value failures; invalid draft regexes are rendered and consumed.
   * Invalid imports and resets reject so their callers cannot show successful completion feedback.
   */
  const save = async (
    pending: Record<string, unknown> | null,
    source: SaveSource,
    hadChanges = false
  ): Promise<void> => {
    if (!lifecycle.active) return;
    const clean = pruneDialogOptions(
      pending ?? { ...state.options },
      document.getElementById("fbcmf")
    );
    clearRegexErrors(document.getElementById("fbcmf"));
    let result: SaveResult;
    try {
      result = await capabilities.saveOptions(clean, source);
    } catch (error: unknown) {
      if (error instanceof InvalidRegexOptionsError) {
        if (lifecycle.active) {
          const newerDraft = source === "dialog" && !deepEqual(collectDialogOptions(state), clean);
          if (!newerDraft)
            showRegexErrors(
              context,
              error.issues,
              source === "file" ? "import" : source === "reset" ? "reset" : "draft"
            );
        }
        if (source === "dialog") return;
      }
      throw error;
    }
    if (!lifecycle.active) return;
    // Storage can finish after another edit; rebuilding must retain that unsubmitted draft.
    const latestDraft = source === "dialog" ? collectDialogOptions(state) : null;
    const hasNewerEdits = latestDraft !== null && !deepEqual(latestDraft, clean);
    if (result.languageChanged) {
      buildDialog(context, handlers, true);
      initReportBug(context, capabilities);
      if (hasNewerEdits && latestDraft) updateDialog(state, latestDraft);
    }
    if (result.buttonLocationChanged) mountToggleButton(state, context.keyWords);
    updateHeaderCloseVisibility(document.getElementById("fbcmf"), state);
    if (source === "dialog") {
      syncSaveButtonState(state);
      if (hadChanges && !hasNewerEdits)
        triggerActionFeedback(state, "BTNSave", "cmf-action--confirm-blue");
    }
  };

  const handlers: DialogHandlers = {
    destroyDialog,
    /** Validate dependent controls before passing draft options to the application service. */
    async saveUserOptions(_event, source = "dialog") {
      if (!lifecycle.active) return;
      if (source !== "dialog") return save(null, source);
      const dialog = document.getElementById("fbcmf");
      if (!dialog) return;
      const limit = dialog.querySelector<HTMLInputElement>('input[name="NF_LIKES_MAXIMUM"]');
      const count = dialog.querySelector<HTMLInputElement>('input[name="NF_LIKES_MAXIMUM_COUNT"]');
      if (limit?.checked && count && count.value.length === 0) {
        alert(`${context.keyWords.NF_LIKES_MAXIMUM}?`);
        count.focus();
        return;
      }
      const pending = collectDialogOptions(state);
      if (pending) await save(pending, source, !deepEqual(pending, state.options));
    },
    /** Download the current live options without persisting an unsubmitted draft. */
    exportUserOptions: () => {
      if (lifecycle.active) exportUserOptions(state);
    },
    /** Route validated imported data through the same save workflow as dialog edits. */
    importUserOptions: (event) => {
      if (lifecycle.active)
        importUserOptions(event, (pending) => save(pending, "file"), state, lifecycle);
    },
    /** Clear stored settings and rehydrate existing supported values with a reset language preference. */
    resetUserOptions: () => {
      if (!lifecycle.active) return;
      void capabilities
        .resetOptions()
        .then(() => save(null, "reset"))
        .then(() => {
          if (lifecycle.active) updateDialog(state);
        })
        .catch((error: unknown) => {
          if (error instanceof InvalidRegexOptionsError && lifecycle.active)
            showRegexErrors(context, error.issues, "reset");
        });
    },
  };

  /** Wait for a mountable document, then establish one-time outside/topbar synchronization. */
  const runInit = (): void => {
    if (!lifecycle.active) return;
    if (!document.body) {
      lifecycle.defer(runInit, 50);
      return;
    }
    mountToggleButton(state, context.keyWords);
    ownedDialog = buildDialog(context, handlers);
    initReportBug(context, capabilities);
    addLegendEvents();
    const dialog = document.getElementById("fbcmf");
    if (dialog && !dialog.dataset.cmfToggleSync) {
      dialog.dataset.cmfToggleSync = "1";
      syncToggleButtonOpenState(state);
      if (typeof MutationObserver !== "undefined") {
        lifecycle.observe(dialog, { attributes: true, attributeFilter: [state.showAtt] }, () =>
          syncToggleButtonOpenState(state)
        );
      }
    }
    setupTopbarMenuSync(state);
    setupOutsideClickClose(state);
    if (dialog) {
      lifecycle.listen(dialog, "input", () => clearRegexErrors(dialog));
      lifecycle.listen(dialog, "change", () => clearRegexErrors(dialog));
    }
    showRegexErrors(context, getRegexValidationIssues(state.options), "stored");
  };
  runInit();
  return handlers;
}
