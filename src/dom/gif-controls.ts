// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "./attributes";
import { getPostEvidence } from "./post-evidence";
import { gifSelectors } from "../selectors/gifs";
import { sharedSelectors } from "../selectors/shared";
import { facebookImageRendition } from "./media-rendition";

/** A structural match owns a single image/video; legacy controls retain their overlay-based playback check. */
export interface GifControl {
  control: HTMLElement;
  icon: Element;
  media: HTMLImageElement | HTMLVideoElement | null;
}

/** Match the observed three-layer GIF overlay without depending on captions, classes or a sprite filename. */
function hasGifLayers(icon: Element): boolean {
  const layers = Array.from(icon.querySelectorAll(gifSelectors.layers));
  const dimensions = [
    [72, 72],
    [66, 66],
    [32, 17],
  ];
  if (icon.children.length !== 3 || layers.length !== 3) return false;
  let sprite: string | null = null;
  return layers.every((layer, index) => {
    if (!(layer instanceof HTMLElement) || layer.parentElement?.parentElement !== icon)
      return false;
    const size = dimensions[index];
    if (!size || layer.style.width !== `${size[0]}px` || layer.style.height !== `${size[1]}px`)
      return false;
    const image = layer.style.backgroundImage;
    if (!image || image === "none") return false;
    if (sprite === null) sprite = image;
    return image === sprite;
  });
}

/**
 * Corroborate a GIF overlay with exactly one nearby media element and no independent controls.
 * @param control Candidate playback button; menus, comments, concealed controls and nested posts cannot supply evidence.
 * @param icon Its direct unrealized icon, whose three layers identify the GIF presentation.
 * @param root Caller-owned scan boundary; ancestor inspection never crosses it or a concrete post boundary.
 * @returns The independently controlled media, or null when the layout is incomplete or ambiguous.
 */
function structuralGifMedia(
  control: HTMLElement,
  icon: Element,
  root: ParentNode
): HTMLImageElement | HTMLVideoElement | null {
  if (
    control.matches(gifSelectors.stateful) ||
    control.closest(sharedSelectors.commentContent) ||
    !hasGifLayers(icon)
  )
    return null;
  const boundary = root instanceof Element ? root : control.ownerDocument.documentElement;
  const evidence = getPostEvidence(boundary);
  if (!evidence.isRendered(control)) return null;
  const owner = control.closest(sharedSelectors.postOwner);
  if (owner && owner !== boundary && boundary.contains(owner)) return null;
  for (
    let depth = 0, parent = control.parentElement;
    parent && depth < 3;
    depth++, parent = parent.parentElement
  ) {
    if (!boundary.contains(parent) || parent === owner) break;
    const controls = parent.querySelectorAll(gifSelectors.controls);
    if (controls.length !== 1 || controls[0] !== control) return null;
    const media = parent.querySelectorAll(gifSelectors.media);
    if (media.length > 1) return null;
    const candidate = media[0];
    if (candidate instanceof HTMLImageElement || candidate instanceof HTMLVideoElement) {
      if (!evidence.isRendered(candidate) || candidate.closest(sharedSelectors.postOwner) !== owner)
        return null;
      return candidate;
    }
    if (parent === boundary) break;
  }
  return null;
}

/** Discover each unprocessed playback control once, trying structural media evidence before the legacy GIF caption. */
export function collectGifControls(root: ParentNode): GifControl[] {
  const controls = new Map<HTMLElement, GifControl>();
  for (const icon of root.querySelectorAll(gifSelectors.candidates)) {
    const control = icon.parentElement;
    if (!control || control.hasAttribute(postAtt) || controls.has(control)) continue;
    const media = structuralGifMedia(control, icon, root);
    if (media || control.getAttribute("aria-label")?.includes("GIF"))
      controls.set(control, { control, icon, media });
  }
  return Array.from(controls.values());
}

/** Read actual video state or Facebook's animated-image rendition, never the translated Play/Pause caption. */
export function isGifMediaPlaying(media: HTMLImageElement | HTMLVideoElement): boolean {
  if (media instanceof HTMLVideoElement) return !media.paused && !media.ended;
  return facebookImageRendition(media.currentSrc || media.src) === "gif";
}
