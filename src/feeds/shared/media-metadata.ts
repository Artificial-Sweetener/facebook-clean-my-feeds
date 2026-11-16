// SPDX-License-Identifier: GPL-3.0-only

import { readPageMediaFacts } from "../../dom/page-media-facts";
import { facebookUrl, getPostEvidence } from "../../dom/post-evidence";
import { ownsPostElement } from "../../dom/ownership";
import { pageMetadataSelectors as selectors } from "../../selectors/page-metadata";
import { isOwnedNewsMetadata } from "../news-identity";

/** Resolve only an exact Facebook video destination; query/body mentions cannot identify a player. */
function videoId(link: Element): string | undefined {
  const url = facebookUrl(link);
  if (!url) return undefined;
  const id = /^\/watch\/?$/.test(url.pathname)
    ? url.searchParams.get("v")
    : /^\/(?:reel|(?:[^/]+\/)?videos)\/(\d+)\/?$/.exec(url.pathname)?.[1];
  return id && /^\d{1,30}$/.test(id) ? id : undefined;
}

/** Require one rendered video owned by this post; shared/comment videos cannot classify their parent. */
function ownedVideo(post: Element): Element | undefined {
  const evidence = getPostEvidence(post);
  const videos = evidence
    .select(selectors.video)
    .filter((video) => ownsPostElement(video, post) && evidence.isRendered(video));
  return videos.length === 1 ? videos[0] : undefined;
}

/** Resolve a machine video ID only from a rendered enclosing player that belongs to this post. */
function playerId(video: Element, post: Element): string | undefined {
  const player = video.closest(selectors.player);
  if (!player || !post.contains(player) || !ownsPostElement(player, post)) return undefined;
  const id = player.getAttribute("data-video-id");
  return id && /^\d{1,30}$/.test(id) ? id : undefined;
}

/**
 * Identify AI disclosures from the owning story's server section or its sole video's attribution.
 * Exact author-header click tokens prevent unrelated/nested stories from lending their AI state.
 * @param post Current post root, with authored and nested content excluded from ownership.
 * @returns True only for an explicit machine disclosure belonging to this post.
 */
export function hasAiMetadata(post: Element): boolean {
  const evidence = getPostEvidence(post);
  const keys = new Set<string>();
  for (const link of evidence.select(selectors.storyLinks)) {
    if (!isOwnedNewsMetadata(link, post)) continue;
    const key = facebookUrl(link)?.searchParams.get("__cft__[0]");
    if (key && key.length <= 2048) keys.add(key);
  }
  if (keys.size === 1) {
    const key = keys.values().next().value;
    if (key && readPageMediaFacts(post, `story:${key}`)?.ai === true) return true;
  }
  const video = ownedVideo(post);
  const id = video && playerId(video, post);
  if (!id) return false;
  const ownsIdentity =
    post.matches(selectors.player) ||
    evidence
      .select(selectors.storyLinks)
      .some((link) => isOwnedNewsMetadata(link, post) && videoId(link) === id);
  return ownsIdentity && readPageMediaFacts(post, `video:${id}`)?.ai === true;
}

/** Require the observed five-control transport with a final toggle and an adjacent seek slider. */
function hasLiveTransport(player: Element, post: Element): boolean {
  const evidence = getPostEvidence(post);
  return evidence.select(selectors.liveToggle, player).some((toggle) => {
    if (!ownsPostElement(toggle, post) || !evidence.isRendered(toggle)) return false;
    let row = toggle.parentElement;
    for (let depth = 0; row && row !== player && depth < 6; depth++, row = row.parentElement) {
      const controls = evidence.select(selectors.transport, row);
      if (controls.length < 5) continue;
      return (
        controls.length === 5 &&
        controls[4] === toggle &&
        controls.slice(0, 4).every((control) => !control.hasAttribute("aria-pressed")) &&
        !!row.parentElement?.querySelector(selectors.slider)
      );
    }
    return false;
  });
}

/**
 * Corroborate an explicit live server flag with the current player's live transport.
 * The transport guards stale payloads after a broadcast ends; a recorded/premiere player, a caption
 * saying Live, or a live video elsewhere on the page cannot supply either half of the match.
 * @param post Owning video post; only its single rendered media player is eligible.
 * @returns Whether the current player and its exact server identity both indicate a live broadcast.
 */
export function hasLiveMetadata(post: Element): boolean {
  const video = ownedVideo(post);
  if (!video) return false;
  const evidence = getPostEvidence(post);
  let player = video.parentElement;
  for (
    let depth = 0;
    player && post.contains(player) && depth < 16;
    depth++, player = player.parentElement
  ) {
    if (evidence.select(selectors.video, player).length !== 1) return false;
    if (!hasLiveTransport(player, post)) continue;
    const ids = new Set<string>();
    const ownedId = playerId(video, post);
    if (ownedId) ids.add(ownedId);
    for (const link of evidence.select(selectors.links, player)) {
      if (!ownsPostElement(link, post) || !evidence.isRendered(link)) continue;
      const id = videoId(link);
      if (id) ids.add(id);
    }
    if (ids.size !== 1) continue;
    const id = ids.values().next().value;
    return !!id && readPageMediaFacts(post, `video:${id}`)?.live === true;
  }
  return false;
}
