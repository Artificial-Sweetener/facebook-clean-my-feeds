// SPDX-License-Identifier: GPL-3.0-only

import type { Keywords } from "../../i18n";
import { getMosquitosQuery } from "../../dom/animated-gifs";

import { getGroupsBlocksQuery, getNewsBlocksQuery } from "./blocks";

/**
 * Inspect only the second news-layout content block for an unprocessed GIF control; preserve the historical GF_ANIMATED_GIFS_POSTS reason used by news and profile callers.
 */
function hasNewsAnimatedGifContent(
  post: Element,
  keyWords: Pick<Keywords, "GF_ANIMATED_GIFS_POSTS">
) {
  if (!post || !keyWords) {
    return "";
  }

  const postBlocks = post.querySelectorAll(getNewsBlocksQuery(post));
  if (postBlocks.length >= 2) {
    const contentBlock = postBlocks[1];
    if (!contentBlock) return "";
    const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
    return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
  }

  return "";
}

/**
 * Use group-layout block discovery and inspect its second block for an unprocessed GIF control; absent blocks return no reason and no media is clicked.
 */
function hasGroupsAnimatedGifContent(
  post: Element,
  keyWords: Pick<Keywords, "GF_ANIMATED_GIFS_POSTS">
) {
  if (!post || !keyWords) {
    return "";
  }

  const postBlocks = post.querySelectorAll(getGroupsBlocksQuery(post));
  if (postBlocks.length >= 2) {
    const contentBlock = postBlocks[1];
    if (!contentBlock) return "";
    const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
    return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
  }

  return "";
}

export { hasGroupsAnimatedGifContent, hasNewsAnimatedGifContent };
