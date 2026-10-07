// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import type { Keywords } from "../i18n";
import type { VisibilityState } from "./types";

/** Legacy callers may provide match objects; production string routes historically do not match. */
export type InfoPaths = Partial<
  Record<
    "OTHER_INFO_BOX_CLIMATE_SCIENCE" | "OTHER_INFO_BOX_CORONAVIRUS" | "OTHER_INFO_BOX_SUBSCRIBE",
    string | { pathMatch: string }
  >
>;
/** Resolve only the object form used by legacy callers, preserving string-route no-op behavior. */
function getMatch(value: string | { pathMatch: string } | undefined): string | undefined {
  return typeof value === "object" ? value.pathMatch : undefined;
}
import { climbUpTheTree } from "../utils/dom";

import { postAtt } from "./attributes";
import { hideBlock } from "./hide";

/**
 * Hide at most one recognized informational box, following the historical priority order.
 * @param post Post content containing potential information links.
 * @param options Per-topic enablement switches.
 * @param keyWords Translated reasons displayed in debugging.
 * @param pathInfo Legacy match descriptors; string values intentionally remain nonmatching.
 * @param state Shared hidden-block and debug markers.
 */
export function scrubInfoBoxes(
  post: Element | null,
  options: Options,
  keyWords: Pick<
    Keywords,
    "OTHER_INFO_BOX_CLIMATE_SCIENCE" | "OTHER_INFO_BOX_CORONAVIRUS" | "OTHER_INFO_BOX_SUBSCRIBE"
  >,
  pathInfo: InfoPaths,
  state: Pick<VisibilityState, "cssHideEl" | "showAtt">
): void {
  if (!post || !options || !keyWords || !pathInfo || !state) {
    return;
  }

  let hiding = false;

  if (
    options.OTHER_INFO_BOX_CLIMATE_SCIENCE &&
    pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE &&
    getMatch(pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE)
  ) {
    const elLink = post.querySelector(
      `a[href*="${getMatch(pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE)}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CLIMATE_SCIENCE, state, options, {
        postAtt,
      });
      hiding = true;
    }
  }

  if (
    !hiding &&
    options.OTHER_INFO_BOX_CORONAVIRUS &&
    pathInfo.OTHER_INFO_BOX_CORONAVIRUS &&
    getMatch(pathInfo.OTHER_INFO_BOX_CORONAVIRUS)
  ) {
    const elLink = post.querySelector(
      `a[href*="${getMatch(pathInfo.OTHER_INFO_BOX_CORONAVIRUS)}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CORONAVIRUS, state, options, {
        postAtt,
      });
      hiding = true;
    }
  }

  if (
    !hiding &&
    options.OTHER_INFO_BOX_SUBSCRIBE &&
    pathInfo.OTHER_INFO_BOX_SUBSCRIBE &&
    getMatch(pathInfo.OTHER_INFO_BOX_SUBSCRIBE)
  ) {
    const elLink = post.querySelector(
      `a[href*="${getMatch(pathInfo.OTHER_INFO_BOX_SUBSCRIBE)}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_SUBSCRIBE, state, options, {
        postAtt,
      });
    }
  }
}
