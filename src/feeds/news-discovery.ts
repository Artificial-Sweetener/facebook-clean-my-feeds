// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext, FeedProcessingState, DirtyFeedRoots } from "./types";
import { mainColumnAtt, postAtt, postAttTab } from "../dom/attributes";
import { hasSizeChanged } from "../dom/dirty-check";
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
 * Compare main-column and dialog HTML lengths with their stored markers; unlike observer-based feeds, equal-length changes are not detected here.
 * The independent periodic sweep covers later post discovery. This helper reads DOM markers but does not update them.
 * @param state forceProcess includes all existing roots; when state exists, noChangeCounter increments once regardless of the result.
 * @returns Changed main and dialog roots in fixed positions, with null for absent roots or unchanged lengths.
 */
export function isNewsDirty(
  state: Pick<FeedProcessingState, "forceProcess" | "noChangeCounter"> | null
): DirtyFeedRoots {
  const arrReturn: DirtyFeedRoots = [null, null];
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  if (mainColumn) {
    if (state && state.forceProcess) {
      arrReturn[0] = mainColumn;
    } else if (!mainColumn.hasAttribute(mainColumnAtt)) {
      arrReturn[0] = mainColumn;
    } else if (
      hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)
    ) {
      arrReturn[0] = mainColumn;
    }
  }

  const elDialog = document.querySelector(newsSelectors.dialog);
  if (elDialog) {
    if (state && state.forceProcess) {
      arrReturn[1] = elDialog;
    } else if (!elDialog.hasAttribute(mainColumnAtt)) {
      arrReturn[1] = elDialog;
    } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
      arrReturn[1] = elDialog;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return arrReturn;
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
