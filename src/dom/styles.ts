// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import type { OptionDefaults } from "../core/options/defaults";
import { generateRandomString } from "../utils/random";
import { ensureStyleTag, type StyleContext } from "./styles/builder";
import { appendFeedStyles } from "./styles/feed-rules";
import { appendDialogStyles } from "./styles/dialog-rules";

export { addToSS, ensureStyleTag } from "./styles/builder";
export { addExtraCSS } from "./styles/extra";

/**
 * Replace one mounted stylesheet atomically after generating deterministic feed and UI rules.
 * @param state Stable mount identifier and per-page filtering markers.
 * @param options Current user-selected colors and visibility preferences.
 * @param defaults Backward-compatible values for unset options.
 * @returns Mounted style element, or null if no page root can host it yet.
 */
export function addCSS(
  state: StyleContext,
  options: Options,
  defaults: OptionDefaults
): HTMLElement | null {
  if (!state || !options || !defaults) {
    return null;
  }

  let styleTag;
  let isNewCSS = true;

  if (state.cssID !== "") {
    styleTag = document.getElementById(state.cssID);
    if (styleTag) {
      styleTag.replaceChildren();
      isNewCSS = false;
    }
  }

  if (isNewCSS) {
    state.cssID = generateRandomString().toUpperCase();
    styleTag = ensureStyleTag(state.cssID);
  }

  if (!styleTag) {
    return null;
  }

  state.tempStyleSheetCode = "";

  appendFeedStyles(state, options, defaults);
  appendDialogStyles(state);
  if (state.tempStyleSheetCode.length > 0) {
    styleTag.appendChild(document.createTextNode(state.tempStyleSheetCode));
    state.tempStyleSheetCode = "";
  }

  return styleTag;
}
