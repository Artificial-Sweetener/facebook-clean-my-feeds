// SPDX-License-Identifier: GPL-3.0-only
import { postAtt } from "../dom/attributes";
import { newsSelectors } from "../selectors/news";
import { groupsSelectors } from "../selectors/groups";
import { videosSelectors } from "../selectors/videos";
import { profileSelectors } from "../selectors/profile";
import { searchSelectors } from "../selectors/search";
import { getNewsPostDiscovery, getOrphanSponsoredNewsPosts } from "../feeds/news";
import { hashText } from "./redaction";
import type { DiagnosticsState } from "./types";

/**
 * Union every known news selector without changing runtime discovery or processing posts twice.
 * @returns The complete selector list and identity-deduplicated post roots.
 */
export function getNewsPostCollection() {
  const results = newsSelectors.postQueries.map((query) => {
    const posts = document.querySelectorAll<HTMLElement>(query);
    return { query, posts: Array.from(posts) };
  });
  const combined: HTMLElement[] = [];
  results.forEach((entry) => {
    entry.posts.forEach((post) => {
      if (!combined.includes(post)) {
        combined.push(post);
      }
    });
  });
  return {
    query: results.length > 0 ? "combined" : "",
    queries: results.map((entry) => entry.query),
    posts: combined,
  };
}

/**
 * Constrain virtualized attribute values to known states without exposing arbitrary attributes.
 * @param container Candidate Facebook container inspected without mutation.
 * @returns A known attribute state, missing sentinel, or other-value sentinel.
 */
export function normalizeVirtualizedValue(container: Element) {
  const value = container.getAttribute("data-virtualized");
  if (value === "true" || value === "false" || value === "") {
    return value;
  }
  return value === null ? "missing" : "other";
}

/**
 * Compare runtime discovery with orphan sponsored containers using counts and structural samples.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @param maxSamples Maximum structural examples to include in DOM order, preferring visible posts.
 * @returns Runtime selector evidence, orphan counts, and bounded structural examples.
 */
export function buildNewsDiscoveryDiagnostics(state: DiagnosticsState, maxSamples = 5) {
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  const runtimeDiscovery = getNewsPostDiscovery();
  const runtime = {
    selectedQuery: runtimeDiscovery.query,
    selectedCount: runtimeDiscovery.posts.length,
  };
  const emptyVirtualized = {
    containerCount: 0,
    containersWithAdsAboutLink: 0,
    containersWithAdRenderingRole: 0,
    containersWithAdRenderingRoleOnly: 0,
    adsAboutLinkCount: 0,
    orphanAdsAboutLinkCount: 0,
    orphanWithoutVirtualizedContainerCount: 0,
    orphanContainerCount: 0,
    orphanSamples: [],
  };

  if (!mainColumn) {
    return { runtime, virtualized: emptyVirtualized };
  }

  const virtualizedContainers = Array.from(
    mainColumn.querySelectorAll(newsSelectors.virtualizedContainer)
  );
  const adsAboutLinks = Array.from(mainColumn.querySelectorAll(newsSelectors.sponsoredLink));
  const orphanAdsAboutLinks = adsAboutLinks.filter(
    (link) => !link.closest(newsSelectors.standardPost)
  );
  const orphanContainers = getOrphanSponsoredNewsPosts(mainColumn);
  const containersWithAdsAboutLink = virtualizedContainers.filter((container) =>
    container.querySelector(newsSelectors.sponsoredLink)
  );
  const containersWithAdRenderingRole = virtualizedContainers.filter((container) =>
    container.querySelector("[data-ad-rendering-role]")
  );
  const containersWithAdRenderingRoleOnly = containersWithAdRenderingRole.filter(
    (container) => !container.querySelector(newsSelectors.sponsoredLink)
  );
  const orphanWithoutVirtualizedContainerCount = orphanAdsAboutLinks.filter((link) => {
    const container = link.closest(newsSelectors.virtualizedContainer);
    return !container || !mainColumn.contains(container);
  }).length;
  const orphanSamples = samplePosts(orphanContainers, maxSamples).map((container) => ({
    signature: buildDomSignature(container),
    dataVirtualized: normalizeVirtualizedValue(container),
    adsAboutLinkCount: container.querySelectorAll(newsSelectors.sponsoredLink).length,
    adRenderingRoleCount: container.querySelectorAll("[data-ad-rendering-role]").length,
    roleArticleDescendantCount: container.querySelectorAll('div[role="article"]').length,
    ariaPosinsetDescendantCount: container.querySelectorAll("div[aria-posinset]").length,
    inViewport: isInViewport(container),
    hasPostMarker: container.hasAttribute(postAtt),
    hasHideMarker: !!(state && state.hideAtt && container.hasAttribute(state.hideAtt)),
  }));

  return {
    runtime,
    virtualized: {
      containerCount: virtualizedContainers.length,
      containersWithAdsAboutLink: containersWithAdsAboutLink.length,
      containersWithAdRenderingRole: containersWithAdRenderingRole.length,
      containersWithAdRenderingRoleOnly: containersWithAdRenderingRoleOnly.length,
      adsAboutLinkCount: adsAboutLinks.length,
      orphanAdsAboutLinkCount: orphanAdsAboutLinks.length,
      orphanWithoutVirtualizedContainerCount,
      orphanContainerCount: orphanContainers.length,
      orphanSamples,
    },
  };
}

/**
 * Choose the active group-feed layout without mutating its discovered posts.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @returns The selected group-feed query and its post roots.
 */
export function getGroupsPostCollection(state: DiagnosticsState) {
  let query = groupsSelectors.feedQuerySingle;
  if (
    state &&
    (state.gfType === "groups" || state.gfType === "groups-recent" || state.gfType === "search")
  ) {
    query =
      state.gfType === "groups-recent"
        ? groupsSelectors.feedQueryRecent
        : groupsSelectors.feedQueryMultiple;
  }
  return { query, posts: Array.from(document.querySelectorAll<HTMLElement>(query)) };
}

/**
 * Locate video posts and their content-block query for the active watch or search layout.
 * @param state Active feed flags, subtypes, and hide-marker names.
 * @returns The selected video and content queries plus the discovered post roots.
 */
export function getVideosPostCollection(state: DiagnosticsState) {
  let query = "";
  let queryBlocks = "";
  if (state && state.vfType === "videos") {
    query = ":scope > div > div:not([class]) > div";
    queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
  } else if (state && state.vfType === "search") {
    query = 'div[role="feed"] > div[role="article"]';
    queryBlocks = ":scope > div > div > div > div > div > div > div:nth-of-type(2)";
  } else if (state && state.vfType === "item") {
    query =
      'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div';
    queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
  }

  let container = document.querySelector(videosSelectors.dialog);
  if (!container) {
    container = document.querySelector(videosSelectors.mainColumn);
  }

  if (!container || query === "") {
    return { query, queryBlocks, posts: [] };
  }

  const posts =
    state && state.vfType === "search"
      ? Array.from(document.querySelectorAll<HTMLElement>(query))
      : Array.from(container.querySelectorAll<HTMLElement>(query));
  return { query, queryBlocks, posts };
}

/**
 * Use the first supported marketplace layout, preserving the runtime query order.
 * @returns The first successful marketplace query and matching item links.
 */
export function getMarketplaceItems() {
  const queries = [
    `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > div > span > div > div > a[href*="/marketplace/np/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/item/"]`,
    `div[style]:not([${postAtt}]) > div > span > div > div > a[href*="/marketplace/np/item/"]`,
  ];
  for (const query of queries) {
    const items = document.querySelectorAll<HTMLElement>(query);
    if (items.length > 0) {
      return { query, items: Array.from(items) };
    }
  }
  return { query: "", items: [] };
}

/**
 * Collect profile posts using the shared production selector.
 * @returns The profile post query and all current matching roots.
 */
export function getProfilePostCollection() {
  const posts = document.querySelectorAll<HTMLElement>(profileSelectors.postsQuery);
  return { query: profileSelectors.postsQuery, posts: Array.from(posts) };
}

/**
 * Collect search results using the shared production selector.
 * @returns The search-result post query and all current matching roots.
 */
export function getSearchPostCollection() {
  const posts = document.querySelectorAll<HTMLElement>(searchSelectors.postsQuery);
  return { query: searchSelectors.postsQuery, posts: Array.from(posts) };
}

/**
 * Describe element structure without preserving class names, IDs, or text content.
 * @param post Existing post root inspected read-only; no post content is serialized.
 * @returns A text-free structural descriptor, or null for an absent element.
 */
export function buildDomSignature(post: Element | null) {
  if (!post) {
    return null;
  }
  const className = typeof post.className === "string" ? post.className : "";
  return {
    tag: post.tagName,
    role: post.getAttribute("role") || "",
    classHash: className ? hashText(className) : "",
    childCount: post.children ? post.children.length : 0,
    hasReason: post.hasAttribute(postAtt),
  };
}

/**
 * Prefer visible examples while excluding zero-sized or unavailable layout boxes.
 * @param element Candidate layout element; missing or zero-sized boxes count as offscreen.
 * @returns Whether a nonzero-size box intersects the viewport vertically.
 */
export function isInViewport(element: Element | null) {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return false;
  }
  const rect = element.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    return false;
  }
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
}

/**
 * Preserve DOM order within visible and offscreen groups and cap the combined sample size.
 * @param posts Candidate post roots in discovery order.
 * @param maxSamples Maximum structural examples to include in DOM order, preferring visible posts.
 * @returns A new bounded list with visible posts before offscreen posts.
 */
export function samplePosts<T extends Element>(posts: readonly T[], maxSamples: number) {
  const samples: T[] = [];
  const inView: T[] = [];
  const outOfView: T[] = [];
  for (const post of posts) {
    if (!post) {
      continue;
    }
    if (isInViewport(post)) {
      inView.push(post);
    } else {
      outOfView.push(post);
    }
  }
  for (const post of inView) {
    if (samples.length >= maxSamples) {
      break;
    }
    samples.push(post);
  }
  for (const post of outOfView) {
    if (samples.length >= maxSamples) {
      break;
    }
    samples.push(post);
  }
  return samples;
}
