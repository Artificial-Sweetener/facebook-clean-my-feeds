// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState, DirtyFeedRoots } from "./types";
import { mainColumnAtt, postAtt, postAttTab } from "../dom/attributes";
import {
  ensureDirtyObserver,
  flushDirtyRecords,
  hasSizeChanged,
  isElementDirty,
} from "../dom/dirty-check";
import { hideNewsPost } from "../dom/hide";
import { newsSelectors } from "../selectors/news";
import { isSponsored } from "./shared/sponsored";
import { rememberHiddenNewsContent } from "./news-revalidation";

const newsPostSweepIntervalMs = 750;
const prioritizedNewsPostQueries = Array.from(
  new Set([
    'div[role="main"] div[aria-posinset]',
    'div[role="main"] div[role="article"]',
    ...newsSelectors.postQueries,
  ])
);

/**
 * Use observed content versions instead of serializing the complete feed on every idle tick.
 * Pending records are consumed before isElementDirty so same-turn and equal-length changes cannot
 * be missed. Hosts without observers retain the historical serialized-length fallback.
 * @param root Current feed/dialog boundary; missing roots never require processing.
 * @param force Explicit option/navigation invalidation bypasses normal idle suppression.
 * @returns Whether this root needs a scan; this helper never acknowledges pending work.
 */
function isNewsRootDirty(root: Element | null, force: boolean): boolean {
  if (!root) return false;
  const observer = ensureDirtyObserver(root);
  flushDirtyRecords(root);
  if (force || !root.hasAttribute(mainColumnAtt)) return true;
  return observer
    ? isElementDirty(root)
    : hasSizeChanged(root.getAttribute(mainColumnAtt), root.innerHTML.length);
}

/**
 * Discover dirty main/dialog roots independently without serializing unchanged descendants.
 * The independent 750 ms sweep still finds late external labels and virtualized post replacements.
 * @param state Explicit invalidation includes existing roots; the idle counter advances once per call.
 * @returns Dirty main and dialog roots in fixed positions; absent or unchanged roots are null.
 */
export function isNewsDirty(
  state: Pick<FeedProcessingState, "forceProcess" | "noChangeCounter"> | null
): DirtyFeedRoots {
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  const elDialog = document.querySelector(newsSelectors.dialog);
  const force = state?.forceProcess === true;
  if (state) state.noChangeCounter += 1;
  return [
    isNewsRootDirty(mainColumn, force) ? mainColumn : null,
    isNewsRootDirty(elDialog, force) ? elDialog : null,
  ];
}

/**
 * Merge independent concrete post layouts in document order, excluding nested comment/article roots; use the first populated fallback only when no concrete roots exist.
 */
export function getNewsPostDiscovery() {
  const concreteQuery = 'div[role="main"] div[aria-posinset], div[role="main"] div[role="article"]';
  const concretePosts = Array.from(document.querySelectorAll(concreteQuery)).filter((post) => {
    const parentPost = post.parentElement?.closest(newsSelectors.standardPost);
    return !parentPost || !parentPost.closest('div[role="main"]');
  });
  if (concretePosts.length > 0) {
    const query = concretePosts.every((post) => post.hasAttribute("aria-posinset"))
      ? 'div[role="main"] div[aria-posinset]'
      : concretePosts.every((post) => post.getAttribute("role") === "article")
        ? 'div[role="main"] div[role="article"]'
        : concreteQuery;
    return { query, posts: concretePosts };
  }
  for (const query of prioritizedNewsPostQueries) {
    const nodeList = document.querySelectorAll(query);
    if (nodeList.length > 0) {
      return { query, posts: Array.from(nodeList) };
    }
  }

  return { query: "", posts: [] };
}

/**
 * Discard the diagnostic selector string and return independent news roots in document order.
 */
export function getCollectionOfNewsPosts() {
  return getNewsPostDiscovery().posts;
}

/** Find virtualized sponsored roots that are outside ordinary article containers without crossing the feed boundary. */
export function getOrphanSponsoredNewsPosts(mainColumn: Element | null) {
  if (!mainColumn || typeof mainColumn.querySelectorAll !== "function") {
    return [];
  }

  const posts = new Set<Element>();
  const sponsoredLinks = mainColumn.querySelectorAll(newsSelectors.sponsoredLink);
  sponsoredLinks.forEach((link) => {
    if (link.closest(newsSelectors.standardPost)) {
      return;
    }

    const virtualizedPost = link.closest(newsSelectors.virtualizedContainer);
    if (virtualizedPost && virtualizedPost !== mainColumn && mainColumn.contains(virtualizedPost)) {
      posts.add(virtualizedPost);
    }
  });

  return Array.from(posts);
}

/**
 * Hide unprocessed virtualized ads with ordinary news caption/debug rules and retain their rendered content for safe root recycling.
 * @param context Current hydrated news options and presentation markers; null leaves the document unchanged.
 * @param mainColumn Feed boundary used to discover orphan ads without selecting standard article roots or the main container itself.
 */
export function scrubOrphanSponsoredNewsPosts(
  context: FeedContext | null,
  mainColumn: Element | null
) {
  if (!context) {
    return;
  }

  const { state, options, keyWords } = context;
  if (!state || !options || !keyWords) {
    return;
  }

  const posts = getOrphanSponsoredNewsPosts(mainColumn);

  posts.forEach((post) => {
    if (post.hasAttribute(postAtt) || !isSponsored(post, { isNF: true })) {
      return;
    }

    hideNewsPost(post, keyWords.SPONSORED, true, {
      options,
      keyWords,
      attributes: {
        postAtt,
        postAttTab,
      },
      state,
    });
    rememberHiddenNewsContent(post);
  });
}

/** Allow dirty roots immediately and otherwise throttle post discovery to a 750 millisecond interval. */
export function shouldSweepNewsPosts(
  state: Pick<FeedProcessingState, "lastNewsPostSweepAt"> | null,
  mainColumn: Element | null,
  isMainColumnDirty: boolean
) {
  if (!mainColumn) {
    return false;
  }

  if (isMainColumnDirty) {
    return true;
  }

  if (!state || typeof state.lastNewsPostSweepAt !== "number") {
    return true;
  }

  return Date.now() - state.lastNewsPostSweepAt >= newsPostSweepIntervalMs;
}
