// SPDX-License-Identifier: GPL-3.0-only
import { SEPARATOR } from "../core/options/constants";
import { createDomState, type DomState } from "../dom/types";
import { createFeedState, type FeedState } from "../feeds/state";
import { createUIState, type UIState } from "../ui/state";
import type { OptionsState } from "./load-options";

/** Application-owned hydration and route history remain independent of DOM representation. */
export interface ApplicationState extends OptionsState {
  SEP: string;
  prevURL: string;
  prevPathname: string;
  prevQuery: string;
  isChromium: boolean;
  cmfReportText?: string;
}

/** The composition root joins concern-owned contracts while consumers select narrow subsets. */
export interface RuntimeState extends ApplicationState, FeedState, DomState, UIState {}

/** Allocate one state object; captured event handlers keep this identity during option changes. */
export function createState(): RuntimeState {
  return {
    ...createDomState(),
    ...createFeedState(),
    ...createUIState(),
    SEP: SEPARATOR,
    options: {},
    optionsReady: false,
    language: "",
    filters: {},
    hideAnInfoBox: false,
    prevURL: "",
    prevPathname: "",
    prevQuery: "",
    isChromium: false,
  };
}

export { SEPARATOR };
