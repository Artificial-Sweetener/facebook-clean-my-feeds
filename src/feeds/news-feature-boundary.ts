// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../dom/post-evidence";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";

/**
 * Bound standalone feed controls so an ancestor climb cannot consume an ordinary post or main feed.
 * @param candidate Proposed feature wrapper; no unrelated authored content may occur inside it.
 * @param main Main column containing the wrapper, which can never itself be hidden.
 * @param allowIndependentPost Permit a survey's own empty-author feed root, but never nested posts.
 * @returns Whether the wrapper is rendered and independent of neighboring feed content.
 */
export function isStandaloneNewsFeature(
  candidate: Element | null,
  main: Element | null,
  allowIndependentPost = false
): candidate is Element {
  if (!candidate || !main || candidate === main || !main.contains(candidate)) return false;
  const owner = candidate.closest(sharedSelectors.postOwner);
  if (owner && (!allowIndependentPost || owner !== candidate)) return false;
  if (
    candidate.closest(sharedSelectors.authoredContent) ||
    candidate.querySelector(newsSelectors.featureContentBoundary)
  )
    return false;
  return getPostEvidence(main).isRendered(candidate);
}
