// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../../core/options/types";
import type { OptionDefaults } from "../../core/options/defaults";
import type { StyleContext } from "./builder";
import { addToSS } from "./builder";

/**
 * Append location-dependent button/footer rules after base styles and theme changes.
 * @param state Existing style mount and generated marker names.
 * @param options Current button/dialog placement settings.
 * @param defaults Fallback placements for missing historical settings.
 * @returns The existing style element, or null when base styles are not mounted.
 */
export function addExtraCSS(
  state: StyleContext,
  options: Options,
  defaults: OptionDefaults
): HTMLElement | null {
  if (!state || !options || !defaults) {
    return null;
  }

  let cmfBtnLocation = defaults.CMF_BTN_OPTION;
  let cmfDlgLocation = defaults.CMF_DIALOG_OPTION;

  if (Object.prototype.hasOwnProperty.call(options, "CMF_BTN_OPTION")) {
    if (options.CMF_BTN_OPTION?.toString() !== "") {
      cmfBtnLocation = options.CMF_BTN_OPTION ?? cmfBtnLocation;
    }
  }
  if (Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_OPTION")) {
    if (options.CMF_DIALOG_OPTION?.toString() !== "") {
      cmfDlgLocation = options.CMF_DIALOG_OPTION ?? cmfDlgLocation;
    }
  }

  cmfBtnLocation = cmfBtnLocation.toString();
  cmfDlgLocation = cmfDlgLocation.toString();

  const styleTag = document.getElementById(state.cssID);
  if (!styleTag) {
    return null;
  }

  state.tempStyleSheetCode = "";
  let styles = "";

  if (cmfBtnLocation === "1") {
    styles = "display:none;";
  } else if (cmfBtnLocation === "2") {
    styles = "display: none !important;";
  } else {
    styles = "position: fixed; bottom: 3rem; left: 1rem; display:none; z-index: 999;";
    styles +=
      "background: var(--secondary-button-background-floating); padding: 0.5rem; width: 3rem; height: 3rem; border: 0; border-radius: 1.5rem;";
    styles += "box-shadow: 0 2px 4px var(--shadow-1), 0 12px 28px var(--shadow-2);";
  }
  if (styles.length > 0) {
    addToSS(state, ".fb-cmf-toggle", styles);
    addToSS(state, ".fb-cmf-toggle svg", "height: 95%; aspect-ratio : 1 / 1;");
    addToSS(state, ".fb-cmf-toggle .cmf-icon", "height: 95%; aspect-ratio : 1 / 1;");
    addToSS(state, ".fb-cmf-toggle:hover", "cursor:pointer;");
    addToSS(state, ".fb-cmf-toggle", "overflow: hidden;");
    addToSS(
      state,
      ".fb-cmf-toggle:not(.fb-cmf-toggle-topbar)::after",
      'content: ""; position: absolute; inset: 0; border-radius: inherit;' +
        "background-color: rgba(255, 255, 255, 0.1); opacity: 0; pointer-events: none;"
    );
    addToSS(state, ".fb-cmf-toggle:not(.fb-cmf-toggle-topbar):hover::after", "opacity: 1;");
    addToSS(
      state,
      `.fb-cmf-toggle[${state.showAtt}]`,
      "display:flex; align-items:center; justify-content:center;"
    );
    if (cmfDlgLocation !== "1") {
      addToSS(
        state,
        '.fb-cmf-toggle:not(.fb-cmf-toggle-topbar)[data-cmf-open="true"]',
        "display:none;"
      );
    }
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar",
      "border:none; outline:none; position: relative; overflow: hidden;" +
        "color: var(--cmf-icon-color, var(--secondary-icon));" +
        "background-color: var(--cmf-btn-bg, var(--secondary-button-background-floating));" +
        "transition: background-color 100ms cubic-bezier(0, 0, 1, 1), color 100ms cubic-bezier(0, 0, 1, 1);"
    );
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar::after",
      'content: ""; position: absolute; inset: 0; border-radius: inherit;' +
        "background-color: var(--cmf-btn-hover, var(--hover-overlay)); opacity: 0; pointer-events: none;" +
        "transition: none;"
    );
    addToSS(state, ".fb-cmf-toggle.fb-cmf-toggle-topbar:hover::after", "opacity: 1;");
    addToSS(
      state,
      ".fb-cmf-toggle.fb-cmf-toggle-topbar:active::after",
      "background-color: var(--cmf-btn-press, var(--press-overlay)); opacity: 1;"
    );
    addToSS(state, ".fb-cmf-toggle.fb-cmf-toggle-topbar:active", "color: var(--accent);");
    addToSS(
      state,
      '.fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-open="true"]',
      "color: var(--cmf-active-icon, var(--accent)); background-color: var(--cmf-active-bg, var(--primary-button-background));"
    );
    addToSS(state, '.fb-cmf-toggle[data-cmf-page-dimmed="true"]', "pointer-events:none;");
    addToSS(
      state,
      '.fb-cmf-toggle[data-cmf-page-dimmed="true"]::after, .fb-cmf-toggle[data-cmf-page-dimmed="true"]:hover::after, .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after, .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]:hover::after',
      "background-color:rgba(11,11,11,0.66); opacity:1;"
    );
    addToSS(
      state,
      '.__fb-light-mode .fb-cmf-toggle[data-cmf-page-dimmed="true"]::after, .__fb-light-mode .fb-cmf-toggle[data-cmf-page-dimmed="true"]:hover::after, .__fb-light-mode .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after, .__fb-light-mode .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]:hover::after',
      "background-color:rgba(244,244,244,0.8); opacity:1;"
    );
  }

  if (cmfDlgLocation === "1") {
    styles = "right:16px; left:auto; margin-left:0; margin-right:0;";
  } else {
    styles = "left:16px; right:auto; margin-left:0; margin-right:0;";
  }
  addToSS(state, ".fb-cmf", styles);
  addToSS(
    state,
    "div#fbcmf footer > button",
    "font-family: inherit; cursor: pointer;" +
      "height: 48px; padding: 0 0.5rem;" +
      "border: none; border-radius: 8px;" +
      "background-color: transparent;" +
      "display:flex; align-items:center; gap:0.5rem; justify-content:flex-start;" +
      "font-size: .9375rem; font-weight: 600;" +
      "color: var(--primary-text); position:relative; overflow:hidden;"
  );
  addToSS(
    state,
    "#fbcmf footer > button",
    "transition: color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;"
  );
  addToSS(state, "#fbcmf footer > button.cmf-action--dirty", "color:#d93025;");
  addToSS(state, "#fbcmf footer > button.cmf-action--dirty .cmf-action-icon", "color:#d93025;");
  addToSS(
    state,
    "#fbcmf footer > button.cmf-action--confirm-blue",
    "color:#1877f2; animation: cmf-pulse-blue 0.6s ease-out;"
  );
  addToSS(
    state,
    "#fbcmf footer > button.cmf-action--confirm-blue .cmf-action-icon",
    "color:#1877f2;"
  );
  addToSS(
    state,
    "#fbcmf footer > button.cmf-action--confirm-green",
    "color:#2e7d32; animation: cmf-pulse-green 0.6s ease-out;"
  );
  addToSS(
    state,
    "#fbcmf footer > button.cmf-action--confirm-green .cmf-action-icon",
    "color:#2e7d32;"
  );
  addToSS(state, ".fb-cmf footer .cmf-action-text", "padding-right: 0.5rem;");
  addToSS(state, "#fbcmf footer > button:hover", "font-family: inherit;");
  addToSS(
    state,
    "#fbcmf footer > button::after",
    'content:""; position:absolute; inset:0; border-radius:inherit;' +
      "background-color: var(--hover-overlay); opacity:0; pointer-events:none;" +
      "transition: opacity 0.1s cubic-bezier(0, 0, 1, 1);"
  );
  addToSS(state, "#fbcmf footer > button:hover::after", "opacity:1;");
  addToSS(
    state,
    ".fb-cmf footer .cmf-action-icon",
    "width:36px; height:36px; border-radius:50%; background-color: var(--secondary-button-background);" +
      "display:flex; align-items:center; justify-content:center; color: var(--primary-icon); flex-shrink:0;"
  );
  addToSS(
    state,
    ".fb-cmf footer .cmf-action-icon svg",
    "width:20px; height:20px; fill: currentColor;"
  );
  addToSS(state, ".fb-cmf footer .cmf-action-icon .cmf-icon", "width:32px; height:32px;");

  if (state.tempStyleSheetCode.length > 0) {
    state.tempStyleSheetCode +=
      "@keyframes cmf-pulse-blue {" +
      "0% { color: #1877f2; }" +
      "50% { color: #66a3ff; }" +
      "100% { color: #1877f2; }" +
      "}\n" +
      "@keyframes cmf-pulse-green {" +
      "0% { color: #2e7d32; }" +
      "50% { color: #66bb6a; }" +
      "100% { color: #2e7d32; }" +
      "}\n";
    styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
    state.tempStyleSheetCode = "";
  }

  return styleTag;
}
