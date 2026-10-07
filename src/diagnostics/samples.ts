// SPDX-License-Identifier: GPL-3.0-only
import { getSponsoredDiagnostics } from "../feeds/shared/sponsored";
import {
  getNewsPostCollection,
  getGroupsPostCollection,
  getVideosPostCollection,
  getMarketplaceItems,
  getProfilePostCollection,
  getSearchPostCollection,
  samplePosts,
  buildDomSignature,
} from "./collection";
import {
  buildNewsMatches,
  buildGroupsMatches,
  buildVideosMatches,
  buildProfileMatches,
  buildMarketplaceMatches,
} from "./matching";
import type { BugReportContext } from "./types";

/**
 * Collect bounded examples from the active feed and attach only privacy-safe detector evidence.
 * @param context Initialized options, translated labels, filters, and narrow feed state.
 * @param maxSamples Maximum structural examples to include in DOM order, preferring visible posts.
 * @returns Active feed identity, its selectors, and bounded detector samples.
 */
export function buildSamples(context: BugReportContext, maxSamples = 20) {
  const { state, filters } = context;
  if (state.isNF) {
    const { query, queries, posts } = getNewsPostCollection();
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildNewsMatches(post, context),
      sponsoredDiagnostics: getSponsoredDiagnostics(post, state),
    }));
    return { feed: "news", query, queries, samples };
  }
  if (state.isGF) {
    const { query, posts } = getGroupsPostCollection(state);
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildGroupsMatches(post, context),
      sponsoredDiagnostics: getSponsoredDiagnostics(post, state),
    }));
    return { feed: "groups", query, samples };
  }
  if (state.isVF) {
    const { query, queryBlocks, posts } = getVideosPostCollection(state);
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildVideosMatches(post, queryBlocks, context),
      sponsoredDiagnostics: getSponsoredDiagnostics(post, state),
    }));
    return { feed: "videos", query, samples };
  }
  if (state.isMF) {
    const { query, items } = getMarketplaceItems();
    const samples = items
      .filter((item) => item && item.closest && item.closest("div[style]"))
      .slice(0, maxSamples)
      .map((item) => ({
        signature: buildDomSignature(item),
        matches: buildMarketplaceMatches(item, filters),
      }));
    return { feed: "marketplace", query, samples };
  }
  if (state.isSF) {
    const { query, posts } = getSearchPostCollection();
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildNewsMatches(post, context),
      sponsoredDiagnostics: getSponsoredDiagnostics(post, state),
    }));
    return { feed: "search", query, samples };
  }
  if (state.isPP) {
    const { query, posts } = getProfilePostCollection();
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildProfileMatches(post, context),
    }));
    return { feed: "profile", query, samples };
  }
  return { feed: "unknown", query: "", samples: [] };
}
