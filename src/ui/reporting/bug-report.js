const { postAtt } = require("../../dom/attributes");
const { newsSelectors } = require("../../selectors/news");
const { groupsSelectors } = require("../../selectors/groups");
const { videosSelectors } = require("../../selectors/videos");
const { marketplaceSelectors } = require("../../selectors/marketplace");
const { profileSelectors } = require("../../selectors/profile");
const { searchSelectors } = require("../../selectors/search");
const { isSponsored } = require("../../feeds/shared/sponsored");
const {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
} = require("../../feeds/shared/blocked-text");
const {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
} = require("../../feeds/shared/animated-gifs");
const { findNumberOfShares } = require("../../feeds/shared/shares");
const {
  isNewsEventsYouMayLike,
  isNewsFollow,
  isNewsMetaAICard,
  isNewsPaidPartnership,
  isNewsParticipate,
  isNewsPeopleYouMayKnow,
  isNewsReelsAndShortVideos,
  isNewsShortReelVideo,
  isNewsSponsoredPaidBy,
  isNewsStoriesPost,
  isNewsSuggested,
  postExceedsLikeCount,
} = require("../../feeds/news");
const { isGroupsShortReelVideo, isGroupsSuggested } = require("../../feeds/groups");
const { isInstagram, isVideoLive } = require("../../feeds/videos");
const { mpGetBlockedPrices, mpGetBlockedTextDescription } = require("../../feeds/marketplace");

const SUPPORT_URL_FALLBACK =
  "https://github.com/Artificial-Sweetener/facebook-clean-my-feeds/issues";

const BLOCKED_TEXT_OPTION_KEYS = [
  "NF_BLOCKED_TEXT",
  "GF_BLOCKED_TEXT",
  "VF_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT_DESCRIPTION",
  "PP_BLOCKED_TEXT",
];

const BLOCKED_TEXT_FILTER_KEYS = [
  "NF_BLOCKED_TEXT_LC",
  "GF_BLOCKED_TEXT_LC",
  "VF_BLOCKED_TEXT_LC",
  "MP_BLOCKED_TEXT_LC",
  "MP_BLOCKED_TEXT_DESCRIPTION_LC",
  "PP_BLOCKED_TEXT_LC",
];

function hashText(value) {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `fnv1a:${(hash >>> 0).toString(16)}`;
}

function getSupportUrl() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  if (gm && gm.info && gm.info.script && gm.info.script.supportURL) {
    return gm.info.script.supportURL;
  }
  return SUPPORT_URL_FALLBACK;
}

function getScriptInfo() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  const script = gm && gm.info && gm.info.script ? gm.info.script : null;
  return {
    name: script && script.name ? script.name : "FB - Clean my feeds",
    version: script && script.version ? script.version : "unknown",
    supportURL: script && script.supportURL ? script.supportURL : getSupportUrl(),
    handler: gm && gm.info && gm.info.scriptHandler ? gm.info.scriptHandler : "unknown",
  };
}

function summarizeList(list, limit = 20) {
  if (!Array.isArray(list)) {
    return { count: 0, hashes: [], truncated: false };
  }
  const hashes = list.slice(0, limit).map((value) => hashText(String(value)));
  return {
    count: list.length,
    hashes,
    truncated: list.length > limit,
  };
}

function redactOptions(options) {
  const redacted = { ...options };
  for (const key of BLOCKED_TEXT_OPTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(redacted, key)) {
      redacted[key] = "[redacted]";
    }
  }
  Object.keys(redacted).forEach((key) => {
    if (!key || key.trim() === "") {
      delete redacted[key];
    }
  });
  return redacted;
}

function redactFilters(filters) {
  const redacted = { ...filters };
  for (const key of BLOCKED_TEXT_FILTER_KEYS) {
    if (Object.prototype.hasOwnProperty.call(redacted, key)) {
      redacted[key] = "[redacted]";
    }
  }
  return redacted;
}

function summarizeBlockedFilters(filters) {
  if (!filters || typeof filters !== "object") {
    return {};
  }
  return {
    NF_BLOCKED_TEXT_LC: summarizeList(filters.NF_BLOCKED_TEXT_LC),
    GF_BLOCKED_TEXT_LC: summarizeList(filters.GF_BLOCKED_TEXT_LC),
    VF_BLOCKED_TEXT_LC: summarizeList(filters.VF_BLOCKED_TEXT_LC),
    MP_BLOCKED_TEXT_LC: summarizeList(filters.MP_BLOCKED_TEXT_LC),
    MP_BLOCKED_TEXT_DESCRIPTION_LC: summarizeList(filters.MP_BLOCKED_TEXT_DESCRIPTION_LC),
    PP_BLOCKED_TEXT_LC: summarizeList(filters.PP_BLOCKED_TEXT_LC),
  };
}

function collectSafeReasons(keyWords) {
  const safe = new Set([
    "",
    "hidden",
    "Sponsored Content",
    "Survey",
    "Shares",
    "Stories | Reels | Rooms tabs list box",
  ]);
  if (!keyWords || typeof keyWords !== "object") {
    return safe;
  }
  Object.values(keyWords).forEach((value) => {
    if (typeof value === "string") {
      safe.add(value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === "string") {
          safe.add(item);
        }
      });
    }
  });
  return safe;
}

function collectSignalCounts() {
  const signals = [
    "Sponsored",
    "Suggested",
    "Follow",
    "Reels",
    "Stories",
    "People you may know",
    "Paid partnership",
    "Try Meta AI",
    "Events you may like",
  ];
  const counts = {};
  for (const signal of signals) {
    counts[signal] = 0;
  }
  const spans = Array.from(document.querySelectorAll("span[dir], span, div")).filter(
    (el) => typeof el.textContent === "string" && el.textContent.trim() !== ""
  );
  for (const el of spans) {
    const text = el.textContent;
    for (const signal of signals) {
      if (text.includes(signal)) {
        counts[signal] += 1;
      }
    }
  }
  return counts;
}

function getSanitizedReason(reason, safeReasons) {
  if (!reason || reason.trim() === "") {
    return "unlabeled";
  }
  return safeReasons.has(reason) ? reason : `hash:${hashText(reason)}`;
}

function collectReasonCounts(keyWords) {
  const safeReasons = collectSafeReasons(keyWords);
  const counts = {};
  const nodes = document.querySelectorAll(`[${postAtt}]`);
  nodes.forEach((node) => {
    const reason = node.getAttribute(postAtt) || "";
    const key = getSanitizedReason(reason, safeReasons);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function collectHiddenSample(keyWords, limit = 3) {
  const sample = [];
  const safeReasons = collectSafeReasons(keyWords);
  const nodes = document.querySelectorAll(`[${postAtt}]`);
  for (const node of nodes) {
    if (sample.length >= limit) {
      break;
    }
    const reason = node.getAttribute(postAtt) || "";
    sample.push({
      reason: getSanitizedReason(reason, safeReasons),
      signature: buildDomSignature(node),
    });
  }
  return sample;
}

function countSelectorMatches(selectors) {
  return selectors.map((query) => ({
    query,
    count: document.querySelectorAll(query).length,
  }));
}

function getNewsPostCollection() {
  const results = newsSelectors.postQueries.map((query) => {
    const posts = document.querySelectorAll(query);
    return { query, posts: Array.from(posts) };
  });
  const combined = [];
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

function getGroupsPostCollection(state) {
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
  return { query, posts: Array.from(document.querySelectorAll(query)) };
}

function getVideosPostCollection(state) {
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
      ? Array.from(document.querySelectorAll(query))
      : Array.from(container.querySelectorAll(query));
  return { query, queryBlocks, posts };
}

function getMarketplaceItems() {
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
    const items = document.querySelectorAll(query);
    if (items.length > 0) {
      return { query, items: Array.from(items) };
    }
  }
  return { query: "", items: [] };
}

function getProfilePostCollection() {
  const posts = document.querySelectorAll(profileSelectors.postsQuery);
  return { query: profileSelectors.postsQuery, posts: Array.from(posts) };
}

function getSearchPostCollection() {
  const posts = document.querySelectorAll(searchSelectors.postsQuery);
  return { query: searchSelectors.postsQuery, posts: Array.from(posts) };
}

function buildDomSignature(post) {
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

function addMatch(matches, key, value) {
  if (value) {
    matches[key] = true;
  }
}

function buildNewsMatches(post, context) {
  const { options, filters, keyWords, state } = context;
  const matches = {};
  addMatch(matches, "NF_SPONSORED", options.NF_SPONSORED && isSponsored(post, state));
  addMatch(
    matches,
    "NF_SUGGESTIONS",
    options.NF_SUGGESTIONS && isNewsSuggested(post, state, keyWords)
  );
  addMatch(
    matches,
    "NF_REELS_SHORT_VIDEOS",
    options.NF_REELS_SHORT_VIDEOS && isNewsReelsAndShortVideos(post, state, keyWords)
  );
  addMatch(
    matches,
    "NF_SHORT_REEL_VIDEO",
    options.NF_SHORT_REEL_VIDEO && isNewsShortReelVideo(post, keyWords)
  );
  addMatch(matches, "NF_META_AI", options.NF_META_AI && isNewsMetaAICard(post, keyWords));
  addMatch(
    matches,
    "NF_PAID_PARTNERSHIP",
    options.NF_PAID_PARTNERSHIP && isNewsPaidPartnership(post, keyWords)
  );
  addMatch(
    matches,
    "NF_PEOPLE_YOU_MAY_KNOW",
    options.NF_PEOPLE_YOU_MAY_KNOW && isNewsPeopleYouMayKnow(post, keyWords)
  );
  addMatch(matches, "NF_FOLLOW", options.NF_FOLLOW && isNewsFollow(post, state, keyWords));
  addMatch(matches, "NF_PARTICIPATE", options.NF_PARTICIPATE && isNewsParticipate(post, keyWords));
  addMatch(
    matches,
    "NF_SPONSORED_PAID",
    options.NF_SPONSORED_PAID && isNewsSponsoredPaidBy(post, keyWords)
  );
  addMatch(
    matches,
    "NF_EVENTS_YOU_MAY_LIKE",
    options.NF_EVENTS_YOU_MAY_LIKE && isNewsEventsYouMayLike(post, keyWords)
  );
  addMatch(matches, "NF_STORIES", options.NF_STORIES && isNewsStoriesPost(post, keyWords));
  addMatch(
    matches,
    "NF_ANIMATED_GIFS_POSTS",
    options.NF_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
  );

  if (options.NF_BLOCKED_ENABLED) {
    const blockedText = findNewsBlockedText(post, options, filters);
    if (blockedText) {
      matches.NF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  if (options.NF_LIKES_MAXIMUM && options.NF_LIKES_MAXIMUM !== "") {
    const likesMatch = postExceedsLikeCount(post, options, keyWords);
    if (likesMatch) {
      matches.NF_LIKES_MAXIMUM = true;
    }
  }

  if (options.NF_SHARES) {
    const shareMatches = findNumberOfShares(post);
    if (shareMatches > 0) {
      matches.NF_SHARES = true;
    }
  }

  return matches;
}

function buildGroupsMatches(post, context) {
  const { options, filters, keyWords, state } = context;
  const matches = {};
  addMatch(matches, "GF_SPONSORED", options.GF_SPONSORED && isSponsored(post, state));
  addMatch(matches, "GF_SUGGESTIONS", options.GF_SUGGESTIONS && isGroupsSuggested(post, keyWords));
  addMatch(
    matches,
    "GF_SHORT_REEL_VIDEO",
    options.GF_SHORT_REEL_VIDEO && isGroupsShortReelVideo(post, keyWords)
  );
  addMatch(
    matches,
    "GF_ANIMATED_GIFS_POSTS",
    options.GF_ANIMATED_GIFS_POSTS && hasGroupsAnimatedGifContent(post, keyWords)
  );

  if (options.GF_BLOCKED_ENABLED) {
    const blockedText = findGroupsBlockedText(post, options, filters);
    if (blockedText) {
      matches.GF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  if (options.GF_SHARES) {
    const shareMatches = findNumberOfShares(post);
    if (shareMatches > 0) {
      matches.GF_SHARES = true;
    }
  }

  return matches;
}

function buildVideosMatches(post, queryBlocks, context) {
  const { options, filters, keyWords, state } = context;
  const matches = {};
  addMatch(matches, "VF_SPONSORED", options.VF_SPONSORED && isSponsored(post, state));
  addMatch(matches, "VF_LIVE", options.VF_LIVE && isVideoLive(post, keyWords));
  addMatch(matches, "VF_INSTAGRAM", options.VF_INSTAGRAM && isInstagram(post, keyWords));

  if (options.VF_BLOCKED_ENABLED && queryBlocks) {
    const blockedText = findVideosBlockedText(post, options, filters, queryBlocks);
    if (blockedText) {
      matches.VF_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }

  return matches;
}

function buildProfileMatches(post, context) {
  const { options, filters, keyWords } = context;
  const matches = {};
  addMatch(
    matches,
    "PP_ANIMATED_GIFS_POSTS",
    options.PP_ANIMATED_GIFS_POSTS && hasNewsAnimatedGifContent(post, keyWords)
  );
  if (options.PP_BLOCKED_ENABLED) {
    const blockedText = findProfileBlockedText(post, options, filters);
    if (blockedText) {
      matches.PP_BLOCKED_TEXT_HASH = hashText(blockedText);
    }
  }
  return matches;
}

function buildMarketplaceMatches(item, filters) {
  const matches = {};
  const queryTextBlock = ":scope > div > div:nth-of-type(2) > div";
  const blocksOfText = item.querySelectorAll(queryTextBlock);
  if (blocksOfText.length > 0) {
    const blockedPrices = mpGetBlockedPrices(blocksOfText[0], filters);
    if (blockedPrices) {
      matches.MP_BLOCKED_TEXT_HASH = hashText(blockedPrices);
    }
    const blockedDesc = mpGetBlockedTextDescription(blocksOfText, filters, true);
    if (blockedDesc) {
      matches.MP_BLOCKED_TEXT_DESCRIPTION_HASH = hashText(blockedDesc);
    }
  }
  return matches;
}

function isInViewport(element) {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return false;
  }
  const rect = element.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    return false;
  }
  return rect.bottom >= 0 && rect.top <= window.innerHeight;
}

function samplePosts(posts, maxSamples) {
  const samples = [];
  const inView = [];
  const outOfView = [];
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

function buildSamples(context, maxSamples = 20) {
  const { state, filters } = context;
  if (state.isNF) {
    const { query, queries, posts } = getNewsPostCollection();
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildNewsMatches(post, context),
    }));
    return { feed: "news", query, queries, samples };
  }
  if (state.isGF) {
    const { query, posts } = getGroupsPostCollection(state);
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildGroupsMatches(post, context),
    }));
    return { feed: "groups", query, samples };
  }
  if (state.isVF) {
    const { query, queryBlocks, posts } = getVideosPostCollection(state);
    const samples = samplePosts(posts, maxSamples).map((post) => ({
      signature: buildDomSignature(post),
      matches: buildVideosMatches(post, queryBlocks, context),
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

function buildMatchSummary(samples) {
  const summary = {};
  samples.forEach((sample) => {
    const matches = sample.matches || {};
    Object.keys(matches).forEach((key) => {
      const value = matches[key];
      if (value === true || (typeof value === "string" && value.trim() !== "")) {
        summary[key] = (summary[key] || 0) + 1;
      }
    });
  });
  return summary;
}

function buildSelectorDiagnostics(state) {
  return {
    news: {
      mainColumn: countSelectorMatches([newsSelectors.mainColumn])[0].count,
      dialog: countSelectorMatches([newsSelectors.dialog])[0].count,
      postQueries: countSelectorMatches(newsSelectors.postQueries),
    },
    groups: {
      mainColumn: countSelectorMatches([groupsSelectors.mainColumn])[0].count,
      dialog: countSelectorMatches([groupsSelectors.dialog])[0].count,
      groupPageMainColumn: countSelectorMatches([groupsSelectors.groupPageMainColumn])[0].count,
      feedQueries: countSelectorMatches([
        groupsSelectors.feedQueryRecent,
        groupsSelectors.feedQueryMultiple,
        groupsSelectors.feedQuerySingle,
      ]),
    },
    videos: {
      mainColumn: countSelectorMatches([videosSelectors.mainColumn])[0].count,
      dialog: countSelectorMatches([videosSelectors.dialog])[0].count,
      feedQueries: countSelectorMatches(Object.values(videosSelectors.feedQueries)),
      vfType: state.vfType || "",
    },
    marketplace: {
      mainColumn: countSelectorMatches([marketplaceSelectors.mainColumn])[0].count,
      dialogItem: countSelectorMatches([marketplaceSelectors.dialogItem])[0].count,
    },
    search: {
      mainColumn: countSelectorMatches([searchSelectors.mainColumn])[0].count,
      postsQuery: countSelectorMatches([searchSelectors.postsQuery])[0].count,
    },
    profile: {
      mainColumn: countSelectorMatches([profileSelectors.mainColumn])[0].count,
      postsQuery: countSelectorMatches([profileSelectors.postsQuery])[0].count,
    },
  };
}

function buildHiddenCounts(state) {
  if (!state) {
    return {};
  }
  return {
    hiddenContainers: document.querySelectorAll(`[${state.hideAtt}]`).length,
    hiddenBlocks: document.querySelectorAll(`[${state.cssHideEl}]`).length,
    hiddenShares: document.querySelectorAll(`[${state.cssHideNumberOfShares}]`).length,
  };
}

function buildEnvironmentSnapshot() {
  const gm = typeof globalThis !== "undefined" ? globalThis.GM : undefined;
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    hasGM: !!gm,
    hasGMInfo: !!(gm && gm.info),
    readyState: document.readyState,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
    },
  };
}

function getScriptsSample(limit = 20) {
  const scripts = Array.from(document.scripts || []);
  const samples = [];
  for (const script of scripts) {
    if (samples.length >= limit) {
      break;
    }
    if (script && script.src) {
      try {
        const url = new URL(script.src, window.location.href);
        samples.push(`${url.origin}${url.pathname}`);
      } catch (error) {
        samples.push(script.src);
      }
      continue;
    }
    samples.push("inline-script");
  }
  return samples;
}

function buildFeedDomSnapshot() {
  const feedNodes = Array.from(document.querySelectorAll('[role="feed"]'));
  const pageletSample = Array.from(document.querySelectorAll('[role="feed"] [data-pagelet]'))
    .slice(0, 5)
    .map((el) => el.getAttribute("data-pagelet"));
  const mainNode = document.querySelector('div[role="main"]');
  const feedRoot = feedNodes[0] || null;
  const feedRootParent = feedRoot && feedRoot.parentElement ? feedRoot.parentElement : null;
  const mainRootParent = mainNode && mainNode.parentElement ? mainNode.parentElement : null;
  return {
    feedCount: feedNodes.length,
    pageletSample,
    mainCount: document.querySelectorAll('div[role="main"]').length,
    feedRoot: buildDomSignature(feedRoot),
    feedRootParent: buildDomSignature(feedRootParent),
    mainRoot: buildDomSignature(mainNode),
    mainRootParent: buildDomSignature(mainRootParent),
  };
}

function buildFeedSnapshot(state) {
  return {
    isNF: !!state.isNF,
    isGF: !!state.isGF,
    isVF: !!state.isVF,
    isMF: !!state.isMF,
    isSF: !!state.isSF,
    isRF: !!state.isRF,
    isPP: !!state.isPP,
    gfType: state.gfType || "",
    vfType: state.vfType || "",
    mpType: state.mpType || "",
  };
}

function buildSafeLocation() {
  const location = window.location || {};
  const origin = location.origin || "";
  const pathname = location.pathname || "";
  const href = location.href || "";
  const url = origin && pathname ? `${origin}${pathname}` : href;
  return { url, pathname, search: "" };
}

function buildBugReport(context) {
  if (!context) {
    return { data: { error: "No context available." }, text: "" };
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  const now = new Date();
  const scriptInfo = getScriptInfo();
  const safeLocation = buildSafeLocation();
  const data = {
    generatedAt: now.toISOString(),
    script: scriptInfo,
    page: {
      url: safeLocation.url,
      pathname: safeLocation.pathname,
      search: safeLocation.search,
      scriptsSample: getScriptsSample(),
      feedDom: buildFeedDomSnapshot(),
    },
    feed: buildFeedSnapshot(state),
    environment: buildEnvironmentSnapshot(),
    options: redactOptions(options || {}),
    filters: redactFilters(filters || {}),
    blockedFilters: summarizeBlockedFilters(filters || {}),
    pathInfo: pathInfo || {},
    selectors: buildSelectorDiagnostics(state),
    hidden: {
      reasonCounts: collectReasonCounts(keyWords),
      hiddenElements: buildHiddenCounts(state),
      sample: collectHiddenSample(keyWords),
    },
    signals: collectSignalCounts(),
    samples: buildSamples(context),
    notes: {
      redaction: "Post text, names, and IDs are not included. Blocked keywords are hashed.",
    },
  };

  data.samples.summary = buildMatchSummary(data.samples.samples || []);

  return { data, text: JSON.stringify(data, null, 2) };
}

module.exports = {
  buildBugReport,
  getSupportUrl,
};
