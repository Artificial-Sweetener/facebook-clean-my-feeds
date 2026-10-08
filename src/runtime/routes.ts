// SPDX-License-Identifier: GPL-3.0-only
import type { Options } from "../core/options/types";
import { releaseDirtyObservers } from "../dom/dirty-check";
import { releaseReelsProcessing } from "../feeds/reels";
import { restoreNewsPresentation } from "../feeds/news-presentation";
import { classifyRoute } from "../core/routing/routes";
import type { RuntimeState } from "./state";

/**
 * Reset navigation-sensitive scan state while preserving the shared object identity.
 * Old root subscriptions are released even when Facebook keeps cached routes connected.
 * Leaving News or Reels restores owned presentation before the next route can reuse those nodes.
 *
 * @param state - Runtime state retained by UI actions and event listeners.
 * @param options - Current settings; used to decide whether Reels needs processing.
 * @param forceUpdate - Reclassify even when the URL is unchanged, such as after saving settings.
 * @param location - Browser location or a deterministic test location.
 * @returns Whether a route transition or forced refresh was applied.
 * @throws Host DOM restoration errors without publishing new route identity or flags; the scheduler retries.
 */
export function setFeedSettings(
  state: RuntimeState,
  options: Options,
  forceUpdate = false,
  location: Pick<Location, "href" | "pathname" | "search"> = window.location
): boolean {
  if (state.prevURL === location.href && !forceUpdate) return false;
  const { href, pathname, search } = location;
  const route = classifyRoute(pathname, search, options);
  if (state.prevURL !== href) releaseDirtyObservers();
  if (state.isNF && !route.isNF) restoreNewsPresentation();
  if (state.isRF && !route.isRF) releaseReelsProcessing(state);
  if (route.isAF) state.btnToggleEl?.setAttribute(state.showAtt, "");
  else state.btnToggleEl?.removeAttribute(state.showAtt);
  // Publish route identity only after fallible page restoration has completed successfully.
  Object.assign(state, route);
  state.prevURL = href;
  state.prevPathname = pathname;
  state.prevQuery = search;
  state.forceProcess = true;
  state.lastNewsPostSweepAt = 0;
  state.echoCount = 0;
  state.echoEl = null;
  state.echoCPID = "";
  state.noChangeCounter = 0;
  return true;
}
