// SPDX-License-Identifier: GPL-3.0-only

import type { SaveSource, SaveResult } from "../../core/options/commands";
import type { Options } from "../../core/options/types";
import type { Keywords, TranslationRegistry } from "../../i18n";
import type { UIState } from "../state";

/** The toggle only needs its own lifecycle and the current placement preference. */
export interface ToggleState extends Pick<
  UIState,
  "btnToggleEl" | "destroyToggleButton" | "syncToggleButtonTheme" | "iconToggleHTML"
> {
  options: Pick<Options, "CMF_BTN_OPTION">;
  showAtt: string;
  isAF: boolean;
}

/** Read-only layout inputs used to build section controls before a dialog is mounted. */
export interface SectionState extends Pick<UIState, "iconLegendHTML" | "dialogSectionIcons"> {
  SEP: string;
  language: string;
}

/** UI-owned inputs; feed internals and persistence are deliberately absent. */
export interface DialogState extends UIState, SectionState {
  options: Options;
  showAtt: string;
  isAF: boolean;
  cmfReportText?: string;
}

/** Catalog and option references are stable while language updates replace their contents. */
export interface DialogContext {
  state: DialogState;
  keyWords: Keywords;
}

/** Section rendering also receives the catalog registry to show language choices and fallbacks. */
export interface SectionContext {
  keyWords: Keywords;
  state: SectionState;
  options: Options;
  translations: TranslationRegistry;
}

export type { SaveSource, SaveResult } from "../../core/options/commands";

/** The application injects effects; settings UI cannot read storage or invoke feed detectors. */
export interface DialogCapabilities {
  saveOptions: (pending: Record<string, unknown> | null, source: SaveSource) => Promise<SaveResult>;
  resetOptions: () => Promise<void>;
  buildReport: () => { text: string };
  getSupportUrl: () => string;
}

/** Public event handlers retain programmatic invocation for tests and settings imports. */
export interface DialogHandlers {
  /** End this mounted generation and release every resource it owns; safe to call repeatedly. */
  destroyDialog: () => void;
  saveUserOptions: (event?: Event | null, source?: SaveSource) => Promise<void>;
  exportUserOptions: () => void;
  importUserOptions: (event: Event) => void;
  resetUserOptions: () => void;
}
