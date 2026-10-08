// SPDX-License-Identifier: GPL-3.0-only
import type { StyleState } from "../types";
import { addToSS } from "./builder";

/**
 * Append shared mask-icon and tooltip rules independently of dialog layout ownership.
 * @param state Current stylesheet buffer; no mounted DOM references are required.
 */
export function appendAccessoryStyles(state: Pick<StyleState, "tempStyleSheetCode">): void {
  addToSS(
    state,
    ".cmf-icon",
    "display:inline-block; width:20px; height:20px; background-color: currentColor;" +
      "mask-image: var(--cmf-icon-url); mask-repeat:no-repeat; mask-position:center; mask-size:contain;" +
      "-webkit-mask-image: var(--cmf-icon-url); -webkit-mask-repeat:no-repeat; -webkit-mask-position:center; -webkit-mask-size:contain;"
  );
  addToSS(
    state,
    ".fb-cmf-tooltip",
    "position:fixed; z-index:9999; pointer-events:none;" +
      "background-color: var(--tooltip-background, rgba(255, 255, 255, 0.8));" +
      "color: var(--primary-text, rgb(28, 30, 33));" +
      "border-radius:12px; padding:12px; font-size:12px; font-weight:400; line-height:16.08px;" +
      "box-shadow: rgba(0, 0, 0, 0.5) 0 2px 4px; max-width:334px; white-space:normal;"
  );
  addToSS(
    state,
    ".__fb-light-mode .fb-cmf-tooltip",
    "background-color: rgba(0, 0, 0, 0.8); color: #f0f2f5;"
  );
  addToSS(
    state,
    ".__fb-dark-mode .fb-cmf-tooltip",
    "background-color: rgba(255, 255, 255, 0.92); color: #1c1e21;"
  );
}
