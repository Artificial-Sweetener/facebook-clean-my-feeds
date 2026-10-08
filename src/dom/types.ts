// SPDX-License-Identifier: GPL-3.0-only

/** DOM markers are generated per page so unrelated Facebook classes cannot collide. */
export interface VisibilityState {
  hideAtt: string;
  showAtt: string;
  hideWithNoCaptionAtt: string;
  cssHideEl: string;
  cssHideNumberOfShares: string;
  cssHideVerifiedBadge: string;
}

/** Consecutive-post captions retain their first content element across feed passes. */
export interface EchoState {
  echoEl: Element | null;
  echoElFirstNote: Element | null;
  echoElCreatedCount: number;
  echoELFirstPost: Element | null;
  echoCount: number;
  echoCPID: string;
}

/** Style mounting state is separate from filtering and options persistence. */
export interface StyleState {
  isDarkMode: boolean | null;
  cssID: string;
  cssOID: string;
  tempStyleSheetCode: string;
  cssEcho: string;
}

/** Composes DOM-owned concerns without introducing UI or feed dependencies. */
export interface DomState extends VisibilityState, EchoState, StyleState {}

/** Initialize stable DOM bookkeeping before any page element is discovered. */
export function createDomState(): DomState {
  return {
    hideAtt: "",
    showAtt: "",
    hideWithNoCaptionAtt: "",
    cssHideEl: "",
    cssHideNumberOfShares: "",
    cssHideVerifiedBadge: "",
    echoEl: null,
    echoElFirstNote: null,
    echoElCreatedCount: 0,
    echoELFirstPost: null,
    echoCount: 0,
    echoCPID: "",
    isDarkMode: null,
    cssID: "",
    cssOID: "",
    tempStyleSheetCode: "",
    cssEcho: "",
  };
}
