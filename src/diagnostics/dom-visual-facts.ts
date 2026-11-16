// SPDX-License-Identifier: GPL-3.0-only

import { facebookImageRendition } from "../dom/media-rendition";

/**
 * Retain static Facebook sprite identities and placement without copying private images or arbitrary CSS.
 * Facts are inert data attributes in exported fixtures, never resource-loading styles.
 * @param style Already sampled computed style, so collecting icon evidence adds no style read.
 * @returns Bounded static resource and numeric sprite facts; personal media and foreign URLs are omitted.
 */
export function snapshotVisualFacts(
  style: CSSStyleDeclaration | undefined
): Record<string, string> {
  const facts: Record<string, string> = {};
  if (!style) return facts;
  for (const kind of ["background", "mask"] as const) {
    const image = style.getPropertyValue(`${kind}-image`);
    const match = /^url\(["']?(https:\/\/[^\s"')]+)["']?\)$/.exec(image);
    if (!match?.[1]) continue;
    try {
      const url = new URL(match[1]);
      if (
        !/^static(?:\.[a-z0-9-]+)+\.fbcdn\.net$/i.test(url.hostname) ||
        !/^\/rsrc\.php\/[a-zA-Z0-9_./-]+\.(?:png|webp|svg)$/.test(url.pathname) ||
        url.username ||
        url.password ||
        url.pathname.length > 256
      )
        continue;
      facts[`data-cmf-${kind}-sprite`] = `${url.origin}${url.pathname}`;
      for (const property of ["position", "size"] as const) {
        const value = style.getPropertyValue(`${kind}-${property}`);
        if (
          value.length <= 80 &&
          /^(?:-?[\d.]+(?:px|%)?|auto|contain|cover)(?:\s+(?:-?[\d.]+(?:px|%)?|auto)){0,3}$/.test(
            value
          )
        )
          facts[`data-cmf-${kind}-${property}`] = value;
      }
    } catch {
      // Malformed CSS supplies no structural evidence.
    }
  }
  return facts;
}

/**
 * Preserve media-state evidence without exporting source URLs or content or starting playback.
 * @param element Image rendition or video whose loaded metadata and seekable window are sampled.
 * @returns Inert format tokens or bounded player facts, distinguishing unavailable and unbounded durations.
 */
export function snapshotMediaFacts(element: Element): Record<string, string> {
  if (element instanceof HTMLImageElement) {
    const rendition = facebookImageRendition(element.currentSrc || element.src);
    return rendition ? { "data-cmf-image-rendition": rendition } : {};
  }
  if (!(element instanceof HTMLVideoElement)) return {};
  const duration = element.duration;
  const facts: Record<string, string> = {
    "data-cmf-video-duration":
      duration === Infinity
        ? "unbounded"
        : Number.isFinite(duration)
          ? String(Math.max(0, Math.min(604800, Math.round(duration))))
          : "unavailable",
    "data-cmf-video-ready-state": String(element.readyState),
    "data-cmf-video-paused": String(element.paused),
    "data-cmf-video-controls": String(element.controls),
  };
  const ranges: number[][] = [];
  const seekable = element.seekable;
  for (let index = 0; index < Math.min(2, seekable.length); index++) {
    const start = seekable.start(index);
    const end = seekable.end(index);
    if (Number.isFinite(start) && Number.isFinite(end))
      ranges.push([
        Math.round(Math.max(0, Math.min(604800, start))),
        Math.round(Math.max(0, Math.min(604800, end))),
      ]);
  }
  facts["data-cmf-video-seekable"] = JSON.stringify(ranges);
  return facts;
}
