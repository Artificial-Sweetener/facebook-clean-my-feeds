// SPDX-License-Identifier: GPL-3.0-only

import { matchesNewsLabel, matchesNewsPaidBy } from "../core/filters/labels";
import { isNewsFeatureCollapsed } from "./news-presentation";
import type { Keywords } from "../i18n";
import type { HydratedOptions } from "../core/options/types";
import { matchesDisclosureLabel, containsMetaAiCopy } from "../core/filters/disclosure-labels";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { getFullNumber } from "../core/filters/classifiers/shares-likes";
import { extractFeedBlockText } from "../dom/walker";
import { querySelectorAllNoChildren } from "../utils/dom";
import { getNewsBlocks } from "./shared/blocks";
import { hasPaidPartnershipDisclosure } from "./shared/paid-partnership";
import { isNewsStoryShelf } from "./news-stories";
import {
  facebookPath,
  hasNewsActionName,
  hasNewsCardHeading,
  isOwnedNewsElement,
  isOwnedNewsMetadata,
  isNewsReelShelf,
  ownNewsHeaders,
  ownPostReelLinks,
  ownVerifiedBadges,
} from "./news-identity";

/**
 * Treat an exactly labelled supported leaf header as a suggestion, except when that post is a reel shelf; group-discovery cards are a separate fallback signal.
 * @param post News post whose header structure and discovery links are inspected without mutation.
 * @param state Unused compatibility argument retained for existing callers; it must not be forwarded as reel keyword copy.
 * @param keyWords NF_SUGGESTIONS is the returned reason; NF_REELS_SHORT_VIDEOS lets the exclusion check recognize a reel shelf.
 * @returns The suggestion label on a match, otherwise an empty string.
 */
export function isNewsSuggested(
  post: Element,
  state: unknown,
  keyWords: Pick<Keywords, "NF_REELS_SHORT_VIDEOS" | "NF_SUGGESTIONS">
) {
  const queries = [
    "div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
    "div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
  ];

  const semantic = hasNewsCardHeading(post, "suggested");
  if (semantic) return isNewsReelsAndShortVideos(post, keyWords) ? "" : keyWords.NF_SUGGESTIONS;
  const elSuggestion = querySelectorAllNoChildren(post, queries, 1);
  if (elSuggestion.length > 0) {
    if (isNewsReelsAndShortVideos(post, keyWords).length > 0) {
      return "";
    }
    const label = elSuggestion[0];
    return label &&
      isOwnedNewsElement(label, post) &&
      matchesNewsLabel(label.textContent || "", "suggested")
      ? keyWords.NF_SUGGESTIONS
      : "";
  }
  if (isGroupsYouMightLike(post)) {
    return keyWords.NF_SUGGESTIONS;
  }
  return "";
}

/** Require a recommendation heading and an owned Facebook discovery destination, never a body link alone. */
export function isGroupsYouMightLike(post: Element) {
  return (
    hasNewsCardHeading(post, "groups") &&
    getPostEvidence(post)
      .select("a[href]")
      .some(
        (link) =>
          /^\/groups\/discover\/?$/.test(facebookPath(link) || "") &&
          isOwnedNewsMetadata(link, post)
      )
  );
}

/** Require this card's people-discovery heading and link rather than a friend's ordinary profile or comment link. */
export function isNewsPeopleYouMayKnow(
  post: Element,
  keyWords: Pick<Keywords, "NF_PEOPLE_YOU_MAY_KNOW">
) {
  const matches =
    hasNewsCardHeading(post, "people") &&
    getPostEvidence(post)
      .select('a[href][role="link"]')
      .some(
        (link) =>
          /^\/friends(?:\/|$)/.test(facebookPath(link) || "") && isOwnedNewsMetadata(link, post)
      );
  return matches ? keyWords.NF_PEOPLE_YOU_MAY_KNOW : "";
}

/** Require a rendered business-help disclosure in this post's metadata, excluding authored and nested content. */
export function isNewsPaidPartnership(
  post: Element,
  keyWords: Pick<Keywords, "NF_PAID_PARTNERSHIP">
) {
  return hasPaidPartnershipDisclosure(post) ? keyWords.NF_PAID_PARTNERSHIP : "";
}

/** Require the owned disclosure layout and a localized paid-by statement with a nonempty payer. */
export function isNewsSponsoredPaidBy(
  post: Element,
  keyWords: Pick<Keywords, "NF_SPONSORED_PAID">
) {
  const querySPB =
    "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)";
  const sponsoredPaidBy = querySelectorAllNoChildren(post, querySPB, 1);
  return sponsoredPaidBy.some(
    (label) => isOwnedNewsMetadata(label, post) && matchesNewsPaidBy(label.textContent || "")
  )
    ? keyWords.NF_SPONSORED_PAID
    : "";
}

/** Recognize separate preview cards before all carousel items load, retaining established labelled and larger-shelf routes. */
export function isNewsReelsAndShortVideos(
  post: Element,
  keyWords: Pick<Keywords, "NF_REELS_SHORT_VIDEOS">
) {
  if (isNewsReelShelf(post)) return keyWords.NF_REELS_SHORT_VIDEOS;
  const shelf =
    hasNewsCardHeading(post, "reels") &&
    getPostEvidence(post)
      .select("a[href]")
      .some((link) => {
        if (facebookPath(link) !== "/reel/" || !isOwnedNewsMetadata(link, post)) return false;
        return facebookUrl(link)?.searchParams.get("s") === "ifu_see_more";
      });
  return shelf || ownPostReelLinks(post).length > 4 ? keyWords.NF_REELS_SHORT_VIDEOS : "";
}

/** Require exactly one owned reel media preview; an ordinary text link is not enough to classify a post. */
export function isNewsShortReelVideo(
  post: Element,
  keyWords: Pick<Keywords, "NF_SHORT_REEL_VIDEO">
) {
  return ownPostReelLinks(post).length === 1 ? keyWords.NF_SHORT_REEL_VIDEO : "";
}

/** Require an exact localized event-recommendation heading in the owned card layout. */
export function isNewsEventsYouMayLike(
  post: Element,
  keyWords: Pick<Keywords, "NF_EVENTS_YOU_MAY_LIKE">
) {
  const query = ":scope div > div:nth-of-type(2) > div > div >  h3 > span";
  if (
    hasNewsCardHeading(post, "events") &&
    getPostEvidence(post)
      .select("a[href]")
      .some(
        (link) =>
          isOwnedNewsMetadata(link, post) && /^\/events(?:\/|$)/.test(facebookPath(link) || "")
      )
  )
    return keyWords.NF_EVENTS_YOU_MAY_LIKE;
  const events = querySelectorAllNoChildren(post, query, 0);
  return events.some(
    (heading) =>
      isOwnedNewsMetadata(heading, post) && matchesNewsLabel(heading.textContent || "", "events")
  )
    ? keyWords.NF_EVENTS_YOU_MAY_LIKE
    : "";
}

/** Match a named action in an owned author header, requiring a compatible Facebook author or group link. */
function hasHeaderAction(post: Element, kind: "follow" | "join"): boolean {
  return ownNewsHeaders(post).some((header) => {
    const paths = getPostEvidence(post)
      .select("a[href]", header)
      .map(facebookPath)
      .filter((path): path is string => path !== null);
    const hasGroup = paths.some((path) => /^\/groups\/[^/]+/.test(path));
    const hasAuthor = paths.some((path) => path !== "/" && !/^\/groups(?:\/|$)/.test(path));
    if (kind === "join" ? !hasGroup : !hasAuthor || hasGroup) return false;
    return getPostEvidence(post)
      .select('button, [role="button"]', header)
      .some(
        (control) => isOwnedNewsElement(control, post) && hasNewsActionName(control, post, kind)
      );
  });
}

/** Preserve the supported leaf-header layouts only when their exact localized action label identifies Follow. */
export function isNewsFollow(post: Element, keyWords: Pick<Keywords, "NF_FOLLOW">) {
  const queries = [
    ":scope h4[id] > span > div > span",
    ":scope h4[id] > span > span > div > span",
    ":scope h4[id] > div > span > span[class] > div[class] > span[class]",
  ];
  const leaves = querySelectorAllNoChildren(post, queries, 0, false);
  const fallback =
    leaves.length === 1 &&
    leaves.some(
      (leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, post, "follow")
    );
  return hasHeaderAction(post, "follow") || fallback ? keyWords.NF_FOLLOW : "";
}

/** Preserve exact localized Join controls and the supported named leaf-header fallback, rejecting arbitrary group actions. */
export function isNewsParticipate(post: Element, keyWords: Pick<Keywords, "NF_PARTICIPATE">) {
  const leaves = querySelectorAllNoChildren(post, ":scope h4 > span > span[class] > span", 0);
  const fallback =
    leaves.length === 1 &&
    leaves.some((leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, post, "join"));
  return hasHeaderAction(post, "join") || fallback ? keyWords.NF_PARTICIPATE : "";
}

/** Accept the actual Meta AI host or its subdomains, including a destination carried by Facebook's known outbound redirect. */
export function isMetaAiLink(link: Element): boolean {
  const href = link.getAttribute("href");
  if (!href) return false;
  try {
    let url = new URL(href, document.baseURI);
    if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
      const destination = url.searchParams.get("u");
      if (!destination) return false;
      url = new URL(destination);
    }
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      (url.hostname === "meta.ai" || url.hostname.endsWith(".meta.ai"))
    );
  } catch {
    return false;
  }
}

/** Detect explicit Meta AI promotional controls, verified destination links, or known creation-tool copy in content blocks. */
export function isNewsMetaAICard(post: Element, keyWords: Pick<Keywords, "NF_META_AI">) {
  const evidence = getPostEvidence(post);
  const branding = evidence
    .select("a[aria-label], a[aria-labelledby]")
    .some(
      (link) =>
        isOwnedNewsMetadata(link, post) &&
        evidence.isRendered(link) &&
        evidence.explicitNames(link).some((name) => matchesDisclosureLabel(name, "metaAiBrand"))
    );
  if (
    branding ||
    evidence
      .select("a[href]")
      .some(
        (link) => isOwnedNewsMetadata(link, post) && evidence.isRendered(link) && isMetaAiLink(link)
      )
  )
    return keyWords.NF_META_AI;
  const postTexts = extractFeedBlockText(post, getNewsBlocks(post), 3).join(" ");
  if (containsMetaAiCopy(postTexts)) return keyWords.NF_META_AI;

  return "";
}

/** Match only an exact normalized AI info label on a button-like control, never ordinary body text. */
export function isNewsAiInfoPost(post: Element, keyWords: Pick<Keywords, "NF_AI_INFO_POSTS">) {
  if (!post || !keyWords || typeof post.querySelectorAll !== "function") {
    return "";
  }

  const evidence = getPostEvidence(post);
  const hasAiInfoLabel = evidence.select('button, [role="button"]').some((control) => {
    if (!isOwnedNewsElement(control, post) || !evidence.isRendered(control)) return false;
    const names = evidence.explicitNames(control);
    return (names.length ? names : [evidence.visibleText(control)]).some((name) =>
      matchesDisclosureLabel(name, "aiInfo")
    );
  });

  return hasAiInfoLabel && typeof keyWords.NF_AI_INFO_POSTS === "string"
    ? keyWords.NF_AI_INFO_POSTS
    : "";
}

/** Recognize independent story shelves structurally, retaining the exact feed-origin requirement for ordinary single-story posts. */
export function isNewsStoriesPost(post: Element, keyWords: Pick<Keywords, "NF_STORIES">) {
  if (isNewsStoryShelf(post)) return keyWords.NF_STORIES;
  const evidence = getPostEvidence(post);
  const matched = evidence.select("a[href]").some((link) => {
    const url = facebookUrl(link);
    return (
      url !== null &&
      url.pathname.startsWith("/stories/") &&
      url.searchParams.get("source") === "from_feed" &&
      isOwnedNewsMetadata(link, post) &&
      evidence.isRendered(link)
    );
  });
  return matched ? keyWords.NF_STORIES : "";
}

/** Identify a verified author by an exact semantic badge name in this post's own header, never by SVG presence alone. */
export function isNewsVerifiedBadge(
  post: Element,
  keyWords: Pick<Keywords, "NF_FILTER_VERIFIED_BADGE">
) {
  return ownVerifiedBadges(post).some(
    (icon) => getPostEvidence(post).isRendered(icon) || isNewsFeatureCollapsed(icon, "badge")
  )
    ? keyWords.NF_FILTER_VERIFIED_BADGE
    : "";
}

/** Compare rendered likes against the configured threshold and preserve the legacy false result when absent. */
export function postExceedsLikeCount(
  post: Element,
  options: Pick<HydratedOptions, "NF_LIKES_MAXIMUM_COUNT">,
  keyWords: Pick<Keywords, "NF_LIKES_MAXIMUM">
) {
  const queryLikes =
    'span[role="toolbar"] ~ div div[role="button"] > span[class][aria-hidden] > span:not([class]) > span[class]';
  const elLikes = getPostEvidence(post).select(queryLikes);
  if (elLikes.length > 0) {
    const maxLikes = parseInt(options.NF_LIKES_MAXIMUM_COUNT, 10);
    const postLikesCount = getFullNumber((elLikes[0]?.textContent ?? "").trim());
    return postLikesCount >= maxLikes ? keyWords.NF_LIKES_MAXIMUM : "";
  }
  return false;
}
