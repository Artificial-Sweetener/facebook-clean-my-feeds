// SPDX-License-Identifier: GPL-3.0-only

/** Feed scanning progress is independent of DOM element handles and stored preferences. */
export interface FeedState {
  scanCountStart: number;
  scanCountMaxLoop: number;
  noChangeCounter: number;
  isNF: boolean;
  isGF: boolean;
  isVF: boolean;
  isMF: boolean;
  isAF: boolean;
  isSF: boolean;
  isRF: boolean;
  isPP: boolean;
  isRF_InTimeoutMode: boolean;
  reelsTimer: ReturnType<typeof setTimeout> | null;
  gfType: string;
  vfType: string;
  mpType: string;
  forceProcess: boolean;
  lastNewsPostSweepAt: number;
}

/** Start with no active feed and the historical fifteen-pass light-dusting budget. */
export function createFeedState(): FeedState {
  return {
    scanCountStart: 0,
    scanCountMaxLoop: 15,
    noChangeCounter: 0,
    isNF: false,
    isGF: false,
    isVF: false,
    isMF: false,
    isAF: false,
    isSF: false,
    isRF: false,
    isPP: false,
    isRF_InTimeoutMode: false,
    reelsTimer: null,
    gfType: "",
    vfType: "",
    mpType: "",
    forceProcess: false,
    lastNewsPostSweepAt: 0,
  };
}
