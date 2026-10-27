// SPDX-License-Identifier: GPL-3.0-only

import {
  createOptionsService,
  type OptionsContext,
} from "../../../src/application/options-service";
import type { DialogCapabilities } from "../../../src/ui/dialog/types";
import { createState } from "../../../src/runtime/state";
import { SEPARATOR } from "../../../src/core/options/constants";
import { defaults } from "../../../src/core/options/defaults";

/**
 * Construct hydrated-looking settings and icons so integration tests exercise real controls.
 * @returns Runtime state isolated for one mounted-dialog fixture.
 */
export function buildState() {
  const state = createState();
  state.SEP = SEPARATOR;
  state.showAtt = "show";
  state.hideAtt = "hide";
  state.cssHideEl = "hideBlock";
  state.cssHideNumberOfShares = "hideShares";
  state.options = {
    ...defaults,
    NF_BLOCKED_TEXT: "",
    GF_BLOCKED_TEXT: "",
    VF_BLOCKED_TEXT: "",
    MP_BLOCKED_TEXT: "",
    MP_BLOCKED_TEXT_DESCRIPTION: "",
    PP_BLOCKED_TEXT: "",
    NF_LIKES_MAXIMUM_COUNT: "",
    VERBOSITY_MESSAGE_COLOUR: "",
    VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
    VERBOSITY_DEBUG: false,
    CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
    CMF_DIALOG_LANGUAGE: "en",
    CMF_BTN_OPTION: "0",
    CMF_DIALOG_OPTION: "0",
  };
  state.filters = {};
  state.language = "en";
  state.iconDialogHeaderHTML = "<svg></svg>";
  state.iconDialogSearchHTML = "<svg></svg>";
  state.iconDialogFooterHTML = "<svg></svg>";
  state.iconFooterSaveHTML = "<svg></svg>";
  state.iconFooterCheckHTML = "<svg></svg>";
  state.iconClose = "<svg></svg>";
  state.iconLegendHTML = "<svg></svg>";
  state.dialogFooterIcons = {};
  state.dialogSectionIcons = {};
  state.iconToggleHTML = "<svg></svg>";
  return state;
}

/** Compose real hydration/persistence with harmless host effects for UI integration tests. */
export function createCapabilities(
  context: OptionsContext & { state: { isAF: boolean } },
  helpers = { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() }
): DialogCapabilities {
  return {
    ...createOptionsService(context, {
      /** Reproduce host refresh effects without starting a page observer in tests. */
      applyOptions: () => {
        helpers.setFeedSettings(true);
        if (context.state.isAF) helpers.rerunFeeds("saveUserOptions");
      },
    }),
    /** Supply stable report content so dialog tests avoid unrelated feed serialization. */
    buildReport: () => ({ text: "report" }),
    /** Keep test navigation independent of real support destinations and manager metadata. */
    getSupportUrl: () => "https://example.com/support",
  };
}
