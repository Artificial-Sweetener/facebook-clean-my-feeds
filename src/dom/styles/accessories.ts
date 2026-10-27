// SPDX-License-Identifier: GPL-3.0-only
import type { StyleState } from "../types";
import { addToSS } from "./builder";

/**
 * Append shared inline-SVG icon and tooltip rules independently of dialog layout ownership.
 * @param state Current stylesheet buffer; no mounted DOM references are required.
 */
export function appendAccessoryStyles(state: Pick<StyleState, "tempStyleSheetCode">): void {
  addToSS(
    state,
    ".cmf-icon",
    "display:inline-flex; width:20px; height:20px; flex-shrink:0; align-items:center; justify-content:center;" +
      "color:inherit;"
  );
  addToSS(
    state,
    ".cmf-icon > svg",
    "display:block; width:100%; height:100%; color:inherit; overflow:visible; pointer-events:none;"
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
