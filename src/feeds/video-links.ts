// SPDX-License-Identifier: GPL-3.0-only

import type { FeedProcessingState } from "./types";
import { facebookUrl, getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { climbUpTheTree } from "../utils/dom";

/**
 * Resolve one canonical video identity from owned, rendered header links, independent of URL parameter order and UI language.
 * Authored links and nested posts cannot suppress another video. Ambiguous headers supply no identity.
 * @param post Current video root; no other document or feed is searched.
 * @param queryBlocks Route-specific body and action blocks excluded from header evidence.
 * @returns Numeric Facebook video identifier, or null when no unambiguous owned permalink exists.
 */
export function getVideoIdentity(post: Element, queryBlocks: string): string | null {
  const evidence = getPostEvidence(post);
  const bodies = evidence.select(queryBlocks);
  const identities = new Set<string>();
  for (const link of evidence.select("a[href]")) {
    if (
      (!link.closest("h4, h5") && !link.matches("div > span > a")) ||
      !ownsPostElement(link, post, { bodies }) ||
      !evidence.isRendered(link)
    )
      continue;
    const url = facebookUrl(link);
    if (!url) continue;
    const id = /^\/watch\/?$/.test(url.pathname)
      ? url.searchParams.get("v")
      : /^\/(?:[^/]+\/)?videos\/(\d+)\/?$/.exec(url.pathname)?.[1];
    if (id && /^\d+$/.test(id)) identities.add(id);
  }
  return identities.size === 1 ? (identities.values().next().value ?? null) : null;
}

/** Derive a publisher base from a watch URL, returning an empty string for unsupported paths. */
export function getVideoPublisherPathFromURL(videoURL: string) {
  const beginURL = videoURL.split("?")[0];
  if (!beginURL) {
    return "";
  }
  if (beginURL.includes("/watch/")) {
    return beginURL.replace("/watch/", "/");
  }
  return "";
}

/**
 * Add one new-window permalink icon beside a video's header controls when both its watch identifier and publisher watch link are available.
 * The icon class prevents duplicate insertion. URL parsing and DOM failures are contained so a malformed post cannot interrupt the feed loop.
 * @param post Video post containing the watch link and the header insertion point.
 * @param state iconNewWindowClass marks the inserted control, and iconNewWindow supplies the application's icon HTML.
 */
export function setPostLinkToOpenInNewTab(
  post: Element,
  state: Pick<FeedProcessingState, "iconNewWindowClass" | "iconNewWindow">
) {
  try {
    if (post.querySelector(`.${state.iconNewWindowClass}`)) {
      return;
    }

    const postLinks = post.querySelectorAll('div > span > a[href*="/watch/?v="][role="link"]');
    if (postLinks.length > 0) {
      const postLink = postLinks[0];
      if (!(postLink instanceof HTMLAnchorElement)) return;
      const elHeader = climbUpTheTree(postLink, 3);
      if (!(elHeader instanceof Element)) {
        return;
      }
      const blockOfIcons = elHeader.querySelector(":scope > div:nth-of-type(2) > span");
      let newLink = "";

      if (blockOfIcons) {
        const videoId = new URL(postLink.href).searchParams.get("v");
        if (videoId !== null) {
          const watchLink = post.querySelector('a[href*="/watch/"]');
          if (!(watchLink instanceof HTMLAnchorElement)) {
            return;
          }
          const publisherLink = getVideoPublisherPathFromURL(watchLink.href);
          if (publisherLink === "") {
            return;
          }
          newLink = `${publisherLink}videos/${videoId}/`;
        } else {
          return;
        }
      } else {
        return;
      }

      const spanSpacer = document.createElement("span");
      spanSpacer.innerHTML =
        '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> ú </span></span>';
      blockOfIcons.appendChild(spanSpacer);

      const container = document.createElement("span");
      container.className = state.iconNewWindowClass;
      const span2 = document.createElement("span");
      const linkNew = document.createElement("a");
      linkNew.setAttribute("href", newLink);
      linkNew.innerHTML = state.iconNewWindow;
      linkNew.setAttribute("target", "_blank");
      span2.appendChild(linkNew);
      container.appendChild(span2);

      blockOfIcons.appendChild(container);
    }
  } catch {
    return;
  }
}
