// SPDX-License-Identifier: GPL-3.0-only

import type { Keywords } from "../i18n";
import type { FeedContext, FeedProcessingState } from "./types";
import { hideVideoPost } from "../dom/hide";
import { climbUpTheTree } from "../utils/dom";

/**
 * Skip the first matching video link and forward each later enclosing post to hideVideoPost; actual hiding still requires the caller's hide context to supply its attributes.
 */
export function findDuplicateVideos(
  urlQuery: string,
  postQuery: string,
  keyWords: Pick<Keywords, "VF_DUPLICATE_VIDEOS">,
  context: FeedContext | null
) {
  const watchVideos = document.querySelectorAll(urlQuery);
  if (watchVideos.length < 2) {
    return;
  }

  for (let i = 1; i < watchVideos.length; i += 1) {
    const videoPost = watchVideos[i]?.closest(postQuery);
    if (videoPost) {
      hideVideoPost(videoPost, keyWords.VF_DUPLICATE_VIDEOS, "", context);
    }
  }
}

/**
 * Extract the current video's identifier from a watch query or video permalink, then look for later matching links across the document.
 * This helper forwards the supplied context unchanged; the legacy caller without hide attributes therefore retains hideVideoPost's no-op behavior.
 * @param post Video post whose first supported watch or permalink anchor supplies the identity.
 * @param postQuery Selector used to climb from each duplicate link to its enclosing post.
 * @param keyWords VF_DUPLICATE_VIDEOS supplies the reason passed to the hide helper.
 * @param context Forwarded caption/visibility context; null or missing hide attributes prevents the downstream hide action.
 */
export function hideDuplicateVideos(
  post: Element,
  postQuery: string,
  keyWords: Keywords,
  context: FeedContext | null
) {
  const elWatchVideo = post.querySelector('div > span > a[href*="/watch/?v="]');
  if (elWatchVideo instanceof HTMLAnchorElement) {
    const watchVideoVID = new URL(elWatchVideo.href).searchParams.get("v");
    if (watchVideoVID) {
      findDuplicateVideos(
        `div > span > a[href*="/watch/?v=${watchVideoVID}&"]`,
        postQuery,
        keyWords,
        context
      );
    }
  } else {
    const elUserVideo = post.querySelector('div > span > a[href*="/videos/"]');
    if (elUserVideo instanceof HTMLAnchorElement) {
      const watchVideoVID = elUserVideo.href.split("/videos/")[1]?.split("/")[0];
      if (watchVideoVID) {
        findDuplicateVideos(
          `div > span > a[href*="/videos/${watchVideoVID}/"]`,
          postQuery,
          keyWords,
          context
        );
      }
    }
  }
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
