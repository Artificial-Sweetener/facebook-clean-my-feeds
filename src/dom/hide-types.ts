// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import type { VisibilityState, EchoState } from "./types";

/** Minimal translated copy needed by hidden-post captions, also usable by small DOM fixtures. */
export interface CaptionKeywords {
  VERBOSITY_MESSAGE: string[];
}
/** Attribute names supplied by a feed; missing attributes preserve the legacy no-op contract. */
export interface HideAttributes {
  postAtt: string;
  postAttTab: string;
}
/** Ordinary hidden posts need only their visibility markers and verbosity preferences. */
export interface HideContext {
  options: Options;
  keyWords: CaptionKeywords;
  state: Pick<VisibilityState, "hideAtt" | "showAtt">;
  attributes?: HideAttributes;
}
/** Consecutive group captions additionally retain a shared first-post reference and counter. */
export interface GroupHideContext extends HideContext {
  state: HideContext["state"] & Pick<EchoState, "echoCount" | "echoCPID" | "echoEl">;
}
