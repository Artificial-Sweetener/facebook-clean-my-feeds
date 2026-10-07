// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../../core/options/types";
import type { OptionDefaults } from "../../core/options/defaults";
import type { StyleContext } from "./builder";
import { addToSS } from "./builder";
import { postAtt, postAttTab } from "../attributes";

/**
 * Generate reversible hide/debug rules before presentation rules, retaining cascade order.
 * @param state Per-page markers and output buffer.
 * @param options Current caption colors and debug border preference.
 * @param defaults Fallback caption background color.
 */
export function appendFeedStyles(
  state: StyleContext,
  options: Options,
  defaults: OptionDefaults
): void {
  addToSS(
    state,
    'body > div[style*="position: absolute"], body > div[style*="position:absolute"]',
    "top: -1000000px !important;"
  );

  addToSS(
    state,
    `div[${state.hideAtt}]`,
    "display:none !important; max-height: 0 !important; height: 0 !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; border: 0 !important; overflow: hidden !important; opacity: 0 !important; pointer-events: none !important;"
  );

  addToSS(
    state,
    `details[${postAtt}][open] > div, details[${postAtt}][open] > span > div, div[${state.showAtt}]:not([id="fbcmf"]):not(.fb-cmf-toggle):not(.fb-cmf-toggle-wrapper)`,
    "display:block !important; height: auto !important; min-height: auto !important; max-height: 10000px; overflow: auto; margin-bottom:1rem !important; opacity: 1 !important; pointer-events: auto !important;" +
      `border:3px dotted ${options.CMF_BORDER_COLOUR} !important; border-radius:8px; padding:0.2rem 0.1rem 0.1rem 0.1rem;`
  );

  addToSS(
    state,
    `details[${postAtt}] > summary`,
    "cursor: pointer; list-style: none; position: relative; margin:1.5rem auto; padding:0.5rem 1rem; border-radius:0.55rem; width:85%; font-style:italic;" +
      (options.VERBOSITY_MESSAGE_COLOUR === ""
        ? ""
        : ` color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
      `background-color:${
        options.VERBOSITY_MESSAGE_BG_COLOUR === ""
          ? defaults.VERBOSITY_MESSAGE_BG_COLOUR
          : options.VERBOSITY_MESSAGE_BG_COLOUR
      };`
  );
  addToSS(
    state,
    `details[${postAtt}] > summary:hover`,
    "text-decoration: underline; background-color:white; color:black;"
  );
  addToSS(
    state,
    `details[${postAtt}] > summary::after`,
    "background: darkgrey; color: white; border-radius: 50%; width: 24px; height: 24px; line-height: 20px; font-size: 1rem; font-weight: bold; transform: translateY(-50%); text-align: center; position: absolute; top: 1rem; right: 0.25rem;"
  );
  addToSS(state, `details[${postAtt}] > summary::after`, 'content:"\\002B";');
  addToSS(state, `details[${postAtt}][open] > summary::after`, 'content: "\\2212";');

  addToSS(state, `details[${postAtt}][open]`, "margin-bottom: 1rem;");
  addToSS(state, `details[${postAtt}][open] > summary`, "margin-bottom: 0.5rem;");

  addToSS(
    state,
    `div[${state.hideWithNoCaptionAtt}],span[${state.hideWithNoCaptionAtt}]`,
    "display: none;"
  );
  addToSS(
    state,
    `div[${state.hideWithNoCaptionAtt}][${state.showAtt}], span[${state.hideWithNoCaptionAtt}][${state.showAtt}]`,
    "display: block;"
  );

  addToSS(
    state,
    `h6[${postAttTab}]`,
    "border-radius: 0.55rem 0.55rem 0 0; width:75%; margin:0 auto; padding: 0.45rem 0.25rem; font-style:italic; text-align:center; font-weight:normal;" +
      (options.VERBOSITY_MESSAGE_COLOUR === ""
        ? ""
        : `  color: ${options.VERBOSITY_MESSAGE_COLOUR}; `) +
      `background-color:${
        options.VERBOSITY_MESSAGE_BG_COLOUR === ""
          ? defaults.VERBOSITY_MESSAGE_BG_COLOUR
          : options.VERBOSITY_MESSAGE_BG_COLOUR
      }; `
  );

  addToSS(state, `[${state.cssHideNumberOfShares}]`, "display:none !important;");
  addToSS(state, `[${state.cssHideVerifiedBadge}]`, "display:none !important;");
  addToSS(
    state,
    `h4 [${state.cssHideVerifiedBadge}]`,
    "margin:0 !important; padding:0 !important; width:0 !important; height:0 !important;"
  );
}
