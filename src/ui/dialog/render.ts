// SPDX-License-Identifier: GPL-3.0-only

import { UiLifecycle } from "../lifecycle";
import type { DialogContext, DialogHandlers } from "./types";
import { translations, getTranslation } from "../../i18n";
import { readValue } from "./value-helpers";
import { postAtt } from "../../dom/attributes";
import { buildDialogSections } from "./sections";
import { toggleDialog, updateHeaderCloseVisibility } from "./topbar";
import { addLegendEvents, addSearchEvents, updateLegendWidths } from "./search";
import { syncSaveButtonState } from "./action-feedback";

/**
 * Build or relocalize the settings shell while preserving footer actions, control names, and host visibility state.
 * @param context UI state and resolved localized labels rendered by this dialog.
 * @param handlers Stable action callbacks owned by dialog initialization.
 * @param languageChanged Rebuild content in place instead of mounting a second settings shell.
 * @returns The mounted dialog, or null when its required structure is unavailable.
 */
export function buildDialog(
  { state, keyWords }: DialogContext,
  handlers: DialogHandlers,
  languageChanged = false
): HTMLElement | null {
  if (!state || !keyWords || !document.body) {
    return null;
  }

  state.dialogContentLifecycle?.dispose();
  const contentLifecycle = new UiLifecycle();
  state.dialogContentLifecycle = contentLifecycle;
  state.dialogLifecycle?.add(() => contentLifecycle.dispose());
  const langEntry = getTranslation(state.language);
  const localizedSearch = langEntry ? readValue(langEntry, "DLG_SEARCH_SETTINGS") : undefined;
  const searchLabel =
    typeof localizedSearch === "string" && localizedSearch
      ? localizedSearch
      : "Search Clean My Feeds";
  const direction = langEntry ? langEntry.LANGUAGE_DIRECTION : "ltr";
  let dlg: HTMLElement;
  let cnt: HTMLElement;

  if (!languageChanged) {
    dlg = document.createElement("div");
    dlg.id = "fbcmf";
    dlg.className = "fb-cmf";

    const hdr = document.createElement("header");
    const hdr1 = document.createElement("div");
    hdr1.className = "fb-cmf-icon";
    hdr1.innerHTML = state.iconDialogHeaderHTML;

    const hdr2 = document.createElement("div");
    hdr2.className = "fb-cmf-title";

    const hdr3 = document.createElement("div");
    hdr3.className = "fb-cmf-close";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = state.iconClose;
    state.dialogLifecycle?.listen(btn, "click", () => toggleDialog(state), false);
    hdr3.appendChild(btn);

    hdr.appendChild(hdr1);
    hdr.appendChild(hdr2);
    hdr.appendChild(hdr3);
    dlg.appendChild(hdr);
    updateHeaderCloseVisibility(dlg, state);

    cnt = document.createElement("div");
    cnt.classList.add("content");
  } else {
    const existingDialog = document.getElementById("fbcmf");
    if (!existingDialog) return null;
    dlg = existingDialog;
    const hdr2 = dlg.querySelector("header .fb-cmf-title");
    if (!hdr2) return null;
    while (hdr2.firstChild) {
      hdr2.removeChild(hdr2.firstChild);
    }
    hdr2.classList.remove("fb-cmf-lang-1");
    hdr2.classList.remove("fb-cmf-lang-2");

    const existingContent = dlg.querySelector<HTMLElement>(".content");
    if (!existingContent) return null;
    cnt = existingContent;
    while (cnt.firstChild) {
      cnt.removeChild(cnt.firstChild);
    }
    updateHeaderCloseVisibility(dlg, state);
  }

  dlg.setAttribute("dir", direction);
  const closeButton = dlg.querySelector<HTMLButtonElement>(".fb-cmf-close button");
  if (closeButton) {
    const closeLabel = keyWords.DLG_BUTTONS[1] || "Close";
    closeButton.setAttribute("aria-label", closeLabel);
    closeButton.title = closeLabel;
  }

  const hdr2 = dlg.querySelector(".fb-cmf-title");
  if (!hdr2) return null;
  const htxt = document.createElement("div");
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  const scriptVersion =
    gm && gm.info && gm.info.script && gm.info.script.version ? gm.info.script.version : "";
  htxt.textContent = `${translations.en.DLG_TITLE}${scriptVersion ? ` version ${scriptVersion}` : ""}`;
  hdr2.appendChild(htxt);
  if (state.language !== "en") {
    const stxt = document.createElement("small");
    stxt.textContent = `(${keyWords.DLG_TITLE})`;
    hdr2.appendChild(stxt);
    hdr2.classList.add("fb-cmf-lang-2");
  } else {
    hdr2.classList.add("fb-cmf-lang-1");
  }

  const sections = buildDialogSections({
    state,
    options: state.options,
    keyWords,
    translations,
  });
  const searchRow = document.createElement("div");
  searchRow.className = "fb-cmf-search";
  const searchIcon = document.createElement("div");
  searchIcon.className = "fb-cmf-search-icon";
  searchIcon.innerHTML = state.iconDialogSearchHTML;
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.setAttribute("aria-label", searchLabel);
  searchInput.setAttribute("placeholder", searchLabel);
  searchRow.appendChild(searchIcon);
  searchRow.appendChild(searchInput);
  cnt.appendChild(searchRow);
  sections.forEach((section) => cnt.appendChild(section));

  if (!languageChanged) {
    const body = document.createElement("div");
    body.className = "fb-cmf-body";
    const mainColumn = document.createElement("div");
    mainColumn.className = "fb-cmf-main";
    mainColumn.appendChild(cnt);

    const footer = document.createElement("footer");
    const dialogFooterIcons = state.dialogFooterIcons || {};
    const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS)
      ? keyWords.DLG_BUTTON_TOOLTIPS
      : translations.en.DLG_BUTTON_TOOLTIPS;
    const tooltips =
      Array.isArray(baseTooltips) && baseTooltips.length >= 4
        ? baseTooltips
        : translations.en.DLG_BUTTON_TOOLTIPS;
    const buttonDefinitions = [
      {
        id: "BTNSave",
        text: keyWords.DLG_BUTTONS[0],
        handler: handlers.saveUserOptions,
        tooltipIndex: 0,
      },
      {
        id: "BTNExport",
        text: keyWords.DLG_BUTTONS[2],
        handler: handlers.exportUserOptions,
        tooltipIndex: 1,
      },
      { id: "BTNImport", text: keyWords.DLG_BUTTONS[3], handler: null, tooltipIndex: 2 },
      {
        id: "BTNReset",
        text: keyWords.DLG_BUTTONS[4],
        handler: handlers.resetUserOptions,
        tooltipIndex: 3,
      },
    ];

    buttonDefinitions.forEach((def) => {
      const buttonEl = document.createElement("button");
      buttonEl.type = "button";
      buttonEl.setAttribute("id", def.id);
      buttonEl.classList.add("cmf-action");
      const iconWrap = document.createElement("span");
      iconWrap.className = "cmf-action-icon";
      iconWrap.innerHTML = dialogFooterIcons[def.id] || state.iconDialogFooterHTML;
      const textWrap = document.createElement("span");
      textWrap.className = "cmf-action-text";
      textWrap.textContent = def.text;
      buttonEl.appendChild(iconWrap);
      buttonEl.appendChild(textWrap);
      if (tooltips[def.tooltipIndex]) {
        buttonEl.title = tooltips[def.tooltipIndex] || "";
      }
      if (typeof def.handler === "function") {
        state.dialogLifecycle?.listen(
          buttonEl,
          "click",
          (event) => {
            const pending = def.handler?.(event);
            if (pending)
              void pending.catch(() => {
                // Event dispatch cannot await failures; direct programmatic handlers still reject.
              });
          },
          false
        );
      }
      footer.appendChild(buttonEl);
    });

    const fileImport = document.createElement("input");
    fileImport.setAttribute("type", "file");
    fileImport.setAttribute("id", `FI${postAtt}`);
    fileImport.classList.add("fileInput");
    footer.appendChild(fileImport);
    const sideColumn = document.createElement("div");
    sideColumn.className = "fb-cmf-side";
    sideColumn.appendChild(footer);

    body.appendChild(mainColumn);
    body.appendChild(sideColumn);
    dlg.appendChild(body);
    document.body.appendChild(dlg);

    const fileInput = fileImport;
    state.dialogLifecycle?.listen(fileInput, "change", handlers.importUserOptions, false);
    const btnImport = document.getElementById("BTNImport");
    if (btnImport)
      state.dialogLifecycle?.listen(
        btnImport,
        "click",
        () => {
          fileInput.click();
        },
        false
      );
  } else {
    const footer = dlg.querySelector("footer");
    if (!footer) return null;
    const baseTooltips = Array.isArray(keyWords.DLG_BUTTON_TOOLTIPS)
      ? keyWords.DLG_BUTTON_TOOLTIPS
      : translations.en.DLG_BUTTON_TOOLTIPS;
    const tooltips =
      Array.isArray(baseTooltips) && baseTooltips.length >= 4
        ? baseTooltips
        : translations.en.DLG_BUTTON_TOOLTIPS;
    let btn = footer.querySelector<HTMLButtonElement>("#BTNSave");
    let textEl = btn ? btn.querySelector(".cmf-action-text") : null;
    if (textEl) {
      textEl.textContent = keyWords.DLG_BUTTONS[0];
    } else if (btn) {
      btn.textContent = keyWords.DLG_BUTTONS[0];
    }
    if (btn && tooltips[0]) {
      btn.title = tooltips[0];
    }
    btn = footer.querySelector<HTMLButtonElement>("#BTNExport");
    textEl = btn ? btn.querySelector(".cmf-action-text") : null;
    if (textEl) {
      textEl.textContent = keyWords.DLG_BUTTONS[2];
    } else if (btn) {
      btn.textContent = keyWords.DLG_BUTTONS[2];
    }
    if (btn && tooltips[1]) {
      btn.title = tooltips[1];
    }
    btn = footer.querySelector<HTMLButtonElement>("#BTNImport");
    textEl = btn ? btn.querySelector(".cmf-action-text") : null;
    if (textEl) {
      textEl.textContent = keyWords.DLG_BUTTONS[3];
    } else if (btn) {
      btn.textContent = keyWords.DLG_BUTTONS[3];
    }
    if (btn && tooltips[2]) {
      btn.title = tooltips[2];
    }
    btn = footer.querySelector<HTMLButtonElement>("#BTNReset");
    textEl = btn ? btn.querySelector(".cmf-action-text") : null;
    if (textEl) {
      textEl.textContent = keyWords.DLG_BUTTONS[4];
    } else if (btn) {
      btn.textContent = keyWords.DLG_BUTTONS[4];
    }
    if (btn && tooltips[3]) {
      btn.title = tooltips[3];
    }
    addLegendEvents();
  }

  addLegendEvents();
  updateLegendWidths(dlg);
  addSearchEvents(state);
  const content = dlg.querySelector<HTMLElement>(".content");
  if (content && !content.dataset.cmfDirtyWatch) {
    content.dataset.cmfDirtyWatch = "1";
    state.dialogLifecycle?.listen(content, "input", () => syncSaveButtonState(state), true);
    state.dialogLifecycle?.listen(content, "change", () => syncSaveButtonState(state), true);
  }
  syncSaveButtonState(state);
  return dlg;
}
