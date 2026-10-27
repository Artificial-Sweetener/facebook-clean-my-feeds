// SPDX-License-Identifier: GPL-3.0-only

import type { UiLifecycle } from "./lifecycle";

/** UI-owned DOM references and presentation state; no persistence or feed logic lives here. */
export interface UIState {
  dialogLifecycle: UiLifecycle | null;
  dialogContentLifecycle: UiLifecycle | null;
  destroyDialog: (() => void) | null;
  btnToggleEl: HTMLElement | null;
  destroyToggleButton: (() => void) | null;
  syncToggleButtonTheme: (() => void) | null;
  syncDialogSearch: (() => void) | null;
  iconClose: string;
  iconToggleHTML: string;
  iconDialogHeaderHTML: string;
  iconDialogSearchHTML: string;
  iconDialogFooterHTML: string;
  iconFooterSaveHTML: string;
  iconFooterCheckHTML: string;
  iconLegendHTML: string;
  dialogSectionIcons: Record<string, string>;
  dialogFooterIcons: Record<string, string>;
  iconNewWindow: string;
  iconNewWindowClass: string;
  saveFeedbackTimeoutId: ReturnType<typeof setTimeout> | null;
  cmfReportText?: string;
  cmfOutsideClickInit?: boolean;
  cmfTopbarSyncInit?: boolean;
  cmfTopbarSyncPending?: boolean;
}

/** Allocate presentation state once so event handlers can retain its stable identity. */
export function createUIState(): UIState {
  return {
    dialogLifecycle: null,
    dialogContentLifecycle: null,
    destroyDialog: null,
    btnToggleEl: null,
    destroyToggleButton: null,
    syncToggleButtonTheme: null,
    syncDialogSearch: null,
    iconClose: "",
    iconToggleHTML: "",
    iconDialogHeaderHTML: "",
    iconDialogSearchHTML: "",
    iconDialogFooterHTML: "",
    iconFooterSaveHTML: "",
    iconFooterCheckHTML: "",
    iconLegendHTML: "",
    dialogSectionIcons: {},
    dialogFooterIcons: {},
    iconNewWindow: "",
    iconNewWindowClass: "cmf-link-new",
    saveFeedbackTimeoutId: null,
  };
}
