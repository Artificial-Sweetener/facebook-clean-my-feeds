// SPDX-License-Identifier: GPL-3.0-only

import type { DialogContext, DialogCapabilities } from "../dialog/types";
import type { TranslationKey } from "../../i18n";
import { updateFieldsetState } from "../dialog/search";

/**
 * Wire report generation, copy feedback, and support navigation using injected read-only report capabilities.
 * @param context UI state and resolved labels supplied by the application.
 * @param capabilities Injected report/persistence effects kept outside the presentation layer.
 */
export function initReportBug(
  context: DialogContext,
  capabilities: Pick<DialogCapabilities, "buildReport" | "getSupportUrl">
) {
  const dialog = document.getElementById("fbcmf");
  if (!dialog) {
    return;
  }

  const btnGenerate = dialog.querySelector<HTMLButtonElement>("#BTNReportGenerate");
  const btnCopy = dialog.querySelector<HTMLButtonElement>("#BTNReportCopy");
  const btnOpenIssues = dialog.querySelector<HTMLButtonElement>("#BTNReportOpenIssues");
  const statusEl = dialog.querySelector(".cmf-report-status");
  const outputEl = dialog.querySelector<HTMLTextAreaElement>(".cmf-report-output");
  if (!btnGenerate || !btnCopy || !btnOpenIssues || !statusEl || !outputEl) {
    return;
  }

  const { state, keyWords } = context;
  if (btnGenerate.dataset.cmfReportInit === "1") return;
  btnGenerate.dataset.cmfReportInit = "1";
  const lifecycle = state.dialogContentLifecycle || state.dialogLifecycle;

  /**
   * Display only string-valued localized report statuses and clear unavailable translations safely.
   * @param key Catalog key requested for a string-valued label.
   */
  const setStatus = (key: TranslationKey) => {
    if (!keyWords || !keyWords[key]) {
      statusEl.textContent = "";
      return;
    }
    const value = keyWords[key];
    statusEl.textContent = typeof value === "string" ? value : "";
  };

  let pending: Promise<string> | null = null;

  /**
   * Share one asynchronous capture across actions and reveal its result only in the owning dialog.
   * @returns Cached or newly captured automatically redacted report text.
   */
  const ensureReport = async (): Promise<string> => {
    if (state && typeof state.cmfReportText === "string" && state.cmfReportText.length > 0) {
      return state.cmfReportText;
    }
    if (pending) return pending;
    pending = Promise.resolve()
      .then(() => capabilities.buildReport())
      .then(({ text }) => {
        if (!outputEl.isConnected || (lifecycle && !lifecycle.active)) return "";
        if (state) {
          state.cmfReportText = text;
        }
        outputEl.value = text;
        outputEl.classList.add("cmf-report-output--visible");
        setStatus("DLG_REPORT_BUG_STATUS_READY");
        const fieldset = outputEl.closest("fieldset");
        if (fieldset && fieldset.classList.contains("cmf-visible")) {
          updateFieldsetState(fieldset, true, { animateHeight: false });
        }
        return text;
      })
      .catch(() => {
        setStatus("DLG_REPORT_BUG_STATUS_FAILED");
        return "";
      })
      .finally(() => {
        pending = null;
        btnGenerate.disabled = false;
      });
    btnGenerate.disabled = true;
    return pending;
  };

  lifecycle?.listen(btnGenerate, "click", () => {
    if (state) {
      state.cmfReportText = "";
    }
    void ensureReport();
  });

  lifecycle?.listen(btnCopy, "click", async () => {
    const reportText = await ensureReport();
    if (!reportText) {
      setStatus("DLG_REPORT_BUG_STATUS_FAILED");
      return;
    }
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(reportText);
      } else {
        outputEl.focus();
        outputEl.select();
        document.execCommand("copy");
      }
      setStatus("DLG_REPORT_BUG_STATUS_COPIED");
    } catch {
      setStatus("DLG_REPORT_BUG_STATUS_FAILED");
    }
  });

  lifecycle?.listen(btnOpenIssues, "click", () => {
    const url = capabilities.getSupportUrl();
    if (url) {
      window.open(url, "_blank");
    }
  });
}
