// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import { restoreNewsPresentation } from "../feeds/news-presentation";
import { classifyRoute } from "../core/routing/routes";
import type { RuntimeState } from "./state";

/**
 * Reset navigation-sensitive scan state while preserving the shared object identity.
 * Leaving News releases its owned badge/sidebar styles before the next route can reuse those nodes.
 *
 * @param state - Runtime state retained by UI actions and event listeners.
 * @param options - Current settings; used to decide whether Reels needs processing.
 * @param forceUpdate - Reclassify even when the URL is unchanged, such as after saving settings.
 * @param location - Browser location or a deterministic test location.
 * @returns Whether a route transition or forced refresh was applied.
 */
export function setFeedSettings(
  state: RuntimeState,
  options: Options,
  forceUpdate = false,
  location: Pick<Location, "href" | "pathname" | "search"> = window.location
): boolean {
  if (state.prevURL === location.href && !forceUpdate) return false;
  state.prevURL = location.href;
  state.prevPathname = location.pathname;
  state.prevQuery = location.search;
  const route = classifyRoute(location.pathname, location.search, options);
  if (state.isNF && !route.isNF) restoreNewsPresentation();
  Object.assign(state, route);
  state.forceProcess = true;
  state.lastNewsPostSweepAt = 0;
  state.echoCount = 0;
  state.noChangeCounter = 0;
  if (state.isAF) state.btnToggleEl?.setAttribute(state.showAtt, "");
  else state.btnToggleEl?.removeAttribute(state.showAtt);
  return true;
}
