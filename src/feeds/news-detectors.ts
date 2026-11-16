// SPDX-License-Identifier: GPL-3.0-only

import { matchesNewsLabel } from "../core/filters/labels";
import type { Keywords } from "../i18n";
import { matchesDisclosureLabel, containsMetaAiCopy } from "../core/filters/disclosure-labels";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { extractFeedBlockText } from "../dom/walker";
import { getNewsBlocks } from "./shared/blocks";
import { hasPaidPartnershipDisclosure } from "./shared/paid-partnership";
import { hasPaidByDisclosure } from "./shared/paid-disclosure";
import { hasPeopleDiscoveryStructure } from "./news-people-structure";
import { hasDiscoveryShelf } from "./discovery-structure";
import { hasPageSuggestionShelf } from "./page-suggestions";
import { isMetaAiLink } from "./ai-destinations";
import { hasAiMetadata } from "./shared/media-metadata";
import { hasInlineAuthorAction } from "./news-author-action";
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
 * Prefer corroborated group-discovery shelves, then exact rendered recommendation copy; reel shelves retain their separate classification.
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
  if (hasDiscoveryShelf(post, "groups")) return keyWords.NF_SUGGESTIONS;
  if (hasPageSuggestionShelf(post)) return keyWords.NF_SUGGESTIONS;
  const queries = [
    "div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
    "div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
  ];

  const semantic = hasNewsCardHeading(post, "suggested");
  if (semantic) return isNewsReelsAndShortVideos(post, keyWords) ? "" : keyWords.NF_SUGGESTIONS;
  const elSuggestion = getPostEvidence(post).select(queries.join(","));
  if (elSuggestion.length > 0) {
    if (isNewsReelsAndShortVideos(post, keyWords).length > 0) {
      return "";
    }
    if (
      elSuggestion.some(
        (label) =>
          isOwnedNewsElement(label, post) &&
          getPostEvidence(post).isRendered(label) &&
          matchesNewsLabel(getPostEvidence(post).visibleText(label), "suggested")
      )
    )
      return keyWords.NF_SUGGESTIONS;
  }
  if (isGroupsYouMightLike(post)) {
    return keyWords.NF_SUGGESTIONS;
  }
  return "";
}

/** Prefer a complete discovery shelf, retaining the owned heading/destination fallback for smaller group cards. */
export function isGroupsYouMightLike(post: Element) {
  if (hasDiscoveryShelf(post, "groups")) return true;
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

/**
 * Try language-independent friend-discovery tiles before the localized heading/link fallback.
 * Links may live in the header, carousel or footer; ownership still excludes authored
 * content, comments and nested posts without imposing the header's block-position rules.
 */
export function isNewsPeopleYouMayKnow(
  post: Element,
  keyWords: Pick<Keywords, "NF_PEOPLE_YOU_MAY_KNOW">
) {
  if (hasPeopleDiscoveryStructure(post)) return keyWords.NF_PEOPLE_YOU_MAY_KNOW;
  const matches =
    hasNewsCardHeading(post, "people") &&
    getPostEvidence(post)
      .select('a[href][role="link"]')
      .some(
        (link) =>
          /^\/friends(?:\/|$)/.test(facebookPath(link) || "") &&
          isOwnedNewsElement(link, post) &&
          getPostEvidence(post).isRendered(link)
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

/** Apply the paid-by setting to complete disclosures in both legacy leaves and semantic header controls. */
export function isNewsSponsoredPaidBy(
  post: Element,
  keyWords: Pick<Keywords, "NF_SPONSORED_PAID">
) {
  return hasPaidByDisclosure(post) ? keyWords.NF_SPONSORED_PAID : "";
}

/** Recognize separate preview cards before all carousel items load, retaining established labelled and larger-shelf routes. */
export function isNewsReelsAndShortVideos(
  post: Element,
  keyWords: Pick<Keywords, "NF_REELS_SHORT_VIDEOS">
) {
  if (isNewsReelShelf(post) || ownPostReelLinks(post).length > 4)
    return keyWords.NF_REELS_SHORT_VIDEOS;
  const shelf =
    hasNewsCardHeading(post, "reels") &&
    getPostEvidence(post)
      .select("a[href]")
      .some((link) => {
        if (facebookPath(link) !== "/reel/" || !isOwnedNewsMetadata(link, post)) return false;
        return facebookUrl(link)?.searchParams.get("s") === "ifu_see_more";
      });
  return shelf ? keyWords.NF_REELS_SHORT_VIDEOS : "";
}

/** Require exactly one owned reel media preview; an ordinary text link is not enough to classify a post. */
export function isNewsShortReelVideo(
  post: Element,
  keyWords: Pick<Keywords, "NF_SHORT_REEL_VIDEO">
) {
  return ownPostReelLinks(post).length === 1 ? keyWords.NF_SHORT_REEL_VIDEO : "";
}

/** Prefer independent event-discovery tiles before the localized heading routes for older card layouts. */
export function isNewsEventsYouMayLike(
  post: Element,
  keyWords: Pick<Keywords, "NF_EVENTS_YOU_MAY_LIKE">
) {
  if (hasDiscoveryShelf(post, "events")) return keyWords.NF_EVENTS_YOU_MAY_LIKE;
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
  const events = getPostEvidence(post).select(query);
  return events.some(
    (heading) =>
      isOwnedNewsMetadata(heading, post) &&
      matchesNewsLabel(getPostEvidence(post).visibleText(heading), "events")
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

/** Prefer the inline author/action structure, retaining named controls and legacy leaves as lazy fallbacks. */
export function isNewsFollow(post: Element, keyWords: Pick<Keywords, "NF_FOLLOW">) {
  if (hasInlineAuthorAction(post, "follow")) return keyWords.NF_FOLLOW;
  if (hasHeaderAction(post, "follow")) return keyWords.NF_FOLLOW;
  const queries = [
    ":scope h4[id] > span > div > span",
    ":scope h4[id] > span > span > div > span",
    ":scope h4[id] > div > span > span[class] > div[class] > span[class]",
  ];
  const leaves = getPostEvidence(post)
    .select(queries.join(","))
    .filter((leaf) => leaf.childElementCount === 0 && isOwnedNewsMetadata(leaf, post));
  const fallback =
    leaves.length === 1 &&
    leaves.some(
      (leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, post, "follow")
    );
  return fallback ? keyWords.NF_FOLLOW : "";
}

/** Prefer the inline group/action structure, retaining named controls and legacy leaves as lazy fallbacks. */
export function isNewsParticipate(post: Element, keyWords: Pick<Keywords, "NF_PARTICIPATE">) {
  if (hasInlineAuthorAction(post, "join")) return keyWords.NF_PARTICIPATE;
  if (hasHeaderAction(post, "join")) return keyWords.NF_PARTICIPATE;
  const leaves = getPostEvidence(post)
    .select(":scope h4 > span > span[class] > span")
    .filter((leaf) => leaf.childElementCount === 0 && isOwnedNewsMetadata(leaf, post));
  const fallback =
    leaves.length === 1 &&
    leaves.some((leaf) => isOwnedNewsMetadata(leaf, post) && hasNewsActionName(leaf, post, "join"));
  return fallback ? keyWords.NF_PARTICIPATE : "";
}

/** Detect explicit Meta AI promotional controls, verified destination links, or known creation-tool copy in content blocks. */
export function isNewsMetaAICard(post: Element, keyWords: Pick<Keywords, "NF_META_AI">) {
  const evidence = getPostEvidence(post);
  if (
    evidence
      .select("a[href]")
      .some(
        (link) => isOwnedNewsMetadata(link, post) && evidence.isRendered(link) && isMetaAiLink(link)
      )
  )
    return keyWords.NF_META_AI;
  const branding = evidence
    .select("a[aria-label], a[aria-labelledby]")
    .some(
      (link) =>
        isOwnedNewsMetadata(link, post) &&
        evidence.isRendered(link) &&
        evidence.explicitNames(link).some((name) => matchesDisclosureLabel(name, "metaAiBrand"))
    );
  if (branding) return keyWords.NF_META_AI;
  const postTexts = extractFeedBlockText(post, getNewsBlocks(post), 3).join(" ");
  if (containsMetaAiCopy(postTexts)) return keyWords.NF_META_AI;

  return "";
}

/** Prefer explicit owned machine disclosures, then exact AI info labels on owned controls. */
export function isNewsAiInfoPost(post: Element, keyWords: Pick<Keywords, "NF_AI_INFO_POSTS">) {
  if (!post || !keyWords || typeof post.querySelectorAll !== "function") {
    return "";
  }

  if (hasAiMetadata(post)) return keyWords.NF_AI_INFO_POSTS;

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

/** Identify an owned author badge by known geometry first, retaining exact semantic names for other artwork. */
export function isNewsVerifiedBadge(
  post: Element,
  keyWords: Pick<Keywords, "NF_FILTER_VERIFIED_BADGE">
) {
  return ownVerifiedBadges(post).length > 0 ? keyWords.NF_FILTER_VERIFIED_BADGE : "";
}
