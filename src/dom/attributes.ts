// SPDX-License-Identifier: GPL-3.0-only
import type { VisibilityState } from "./types";
import { generateRandomString } from "../utils/random";

export const postAtt = "cmfr";
export const postAttCPID = "cmfcpid";
export const postPropDS = "cmfDusted";
export const postAttChildFlag = "cmfcf";
export const postAttTab = "cmftsb";
export const postAttMPSkip = "cmfsmp";
export const rvAtt = "cmfrv";
export const mainColumnAtt = "cmfmc";

/**
 * Allocate per-page marker names so filtering cannot collide with Facebook classes.
 */
export function initializeRuntimeAttributes(state: VisibilityState | null) {
  if (!state) {
    return;
  }

  state.hideAtt = generateRandomString();
  state.hideWithNoCaptionAtt = generateRandomString();
  state.showAtt = generateRandomString();
  state.cssHideEl = generateRandomString();
  state.cssHideNumberOfShares = generateRandomString();
  state.cssHideVerifiedBadge = generateRandomString();
}
