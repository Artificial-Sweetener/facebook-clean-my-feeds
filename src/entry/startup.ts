// SPDX-License-Identifier: GPL-3.0-only
import { createOptionsService } from "../application/options-service";
import { defaults } from "../core/options/defaults";
import { pathInfo } from "../core/rules/feed-rules";
import { buildBugReport, getSupportUrl } from "../diagnostics/bug-report";
import { clearDirtyTracking } from "../dom/dirty-check";
import { initializeRuntimeAttributes } from "../dom/attributes";
import { addCSS, addExtraCSS } from "../dom/styles";
import { watchDarkMode } from "../dom/theme";
import { resetFeedProcessing, restoreFeedPresentation } from "../feeds/reset";
import { loadOptions } from "../runtime/load-options";
import { startLoop } from "../runtime/loop";
import { processPage } from "../runtime/process-page";
import { setFeedSettings } from "../runtime/routes";
import { createState } from "../runtime/state";
import type { UserscriptManager } from "../runtime/userscript-api";
import { getUserscriptManager } from "../runtime/userscript-api";
import { initDialog, toggleDialog } from "../ui/dialog/dialog";
import * as icons from "../ui/icons";
import { stopReelsProcessing } from "../feeds/reels";

/**
 * Compose optional manager APIs, persistent settings and page effects after one successful startup.
 * Localized settings models retain their identity when the dialog saves a new configuration.
 * @returns Teardown for the processing loop and theme observer, useful for controlled host lifecycles.
 */
async function startSession(): Promise<() => void> {
  let stopped = false;
  const state = createState();
  Object.assign(state, {
    iconClose: icons.ICON_CLOSE,
    iconToggleHTML: icons.ICON_TOGGLE_HTML,
    iconDialogHeaderHTML: icons.ICON_DIALOG_HEADER_HTML,
    iconDialogSearchHTML: icons.ICON_DIALOG_SEARCH_HTML,
    iconDialogFooterHTML: icons.ICON_DIALOG_FOOTER_HTML,
    iconFooterSaveHTML: icons.ICON_FOOTER_SAVE_HTML,
    iconFooterCheckHTML: icons.ICON_FOOTER_CHECK_HTML,
    iconLegendHTML: icons.ICON_LEGEND_HTML,
    iconNewWindow: icons.ICON_NEW_WINDOW,
    dialogSectionIcons: {
      DLG_NF: icons.ICON_LEGEND_NEWS_HTML,
      DLG_GF: icons.ICON_LEGEND_GROUPS_HTML,
      DLG_MP: icons.ICON_LEGEND_MARKETPLACE_HTML,
      DLG_VF: icons.ICON_LEGEND_VIDEOS_HTML,
      DLG_PP: icons.ICON_LEGEND_PROFILE_HTML,
      DLG_OTHER: icons.ICON_LEGEND_OTHER_HTML,
      REELS_TITLE: icons.ICON_LEGEND_REELS_HTML,
      DLG_PREFERENCES: icons.ICON_LEGEND_PREFERENCES_HTML,
      DLG_REPORT_BUG: icons.ICON_LEGEND_REPORT_BUG_HTML,
      DLG_TIPS: icons.ICON_LEGEND_TIPS_HTML,
    },
    dialogFooterIcons: {
      BTNSave: icons.ICON_FOOTER_SAVE_HTML,
      BTNExport: icons.ICON_FOOTER_EXPORT_HTML,
      BTNImport: icons.ICON_FOOTER_IMPORT_HTML,
      BTNReset: icons.ICON_FOOTER_RESET_HTML,
    },
  });
  state.isChromium = !!globalThis.unsafeWindow?.chrome && /Chrome|CriOS/.test(navigator.userAgent);
  initializeRuntimeAttributes(state);
  const { options, filters, keyWords } = await loadOptions(state);
  const context = { state, options, filters, keyWords, pathInfo };
  addCSS(state, options, defaults);
  const extraStylesTimer = window.setTimeout(() => addExtraCSS(state, options, defaults), 150);
  const themeObserver = watchDarkMode(state, () => {
    if (addCSS(state, options, defaults)) addExtraCSS(state, options, defaults);
    state.syncToggleButtonTheme?.();
  });
  setFeedSettings(state, options, true);
  const optionsService = createOptionsService(context, {
    /** Refresh filtered content only after the application service persists its new settings. */
    applyOptions: () => {
      if (stopped) return;
      setFeedSettings(state, context.options, true);
      addCSS(state, context.options, defaults);
      addExtraCSS(state, context.options, defaults);
      if (resetFeedProcessing(state)) processPage(context, "settings-changed");
    },
  });
  const dialog = initDialog(context, {
    ...optionsService,
    /** Collect a fresh privacy-safe report only when the user requests its preview. */
    buildReport: () => buildBugReport(context),
    getSupportUrl,
  });
  openCurrentSettings = () => toggleDialog(state);
  registerSettingsMenu(context.keyWords.GM_MENU_SETTINGS);
  const stopLoop = startLoop(state, {
    /** Reclassify the latest URL using the current in-place options model. */
    updateRoute: () => {
      setFeedSettings(state, context.options);
    },
    /** Route scheduler events through the current feed context rather than captured old settings. */
    process: (reason) => processPage(context, reason),
  });
  return () => {
    if (stopped) return;
    stopped = true;
    stopLoop();
    restoreFeedPresentation(state);
    clearDirtyTracking();
    stopReelsProcessing(state);
    themeObserver?.disconnect();
    window.clearTimeout(extraStylesTimer);
    dialog.destroyDialog();
    openCurrentSettings = null;
    document.getElementById(state.cssID)?.remove();
    running = null;
  };
}

let running: Promise<() => void> | null = null;

/** Reuse one startup promise so concurrent initialization cannot register duplicate page lifecycles. */
export function startUserscript(): Promise<() => void> {
  if (running === null) {
    running = startSession().catch((error: unknown) => {
      running = null;
      throw error;
    });
  }
  return running;
}

let registeredManager: UserscriptManager | undefined;
let openCurrentSettings: (() => void) | null = null;

/** Retain one manager entry across restarts; its callback always targets the current live dialog. */
function registerSettingsMenu(caption: string): void {
  const manager = getUserscriptManager();
  if (!manager?.registerMenuCommand || registeredManager === manager) return;
  try {
    manager.registerMenuCommand(caption, () => openCurrentSettings?.());
    registeredManager = manager;
  } catch {
    // Optional manager menus must not prevent filtering or the in-page settings control.
  }
}
