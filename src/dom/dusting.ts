// SPDX-License-Identifier: GPL-3.0-only
import { postPropDS } from "./attributes";

/** Only this marker is added to page elements; unrelated custom properties stay untyped. */
export type DustedElement = Element & { cmfDusted?: string | number };

/**
 * Limit removal of transient data-0 placeholders to the configured number of scans.
 * @param post Facebook post whose owned dusting marker survives virtualized passes.
 * @param state Minimum starting scan and maximum cleanup pass counters.
 */
export function doLightDusting(
  post: DustedElement | null,
  state: { scanCountStart: number; scanCountMaxLoop: number } | null
) {
  if (!post || !state) {
    return;
  }

  let scanCount = state.scanCountStart;
  if (post[postPropDS] !== undefined) {
    scanCount = parseInt(String(post[postPropDS]), 10);
    scanCount = scanCount < state.scanCountStart ? state.scanCountStart : scanCount;
  }
  if (scanCount < state.scanCountMaxLoop) {
    const dustySpots = post.querySelectorAll('[data-0="0"]');
    if (dustySpots) {
      dustySpots.forEach((element) => {
        element.remove();
      });
    }
    scanCount += 1;
    post[postPropDS] = scanCount;
  }
}

/** Read only CMF's owned marker without granting arbitrary properties on page elements. */
export function getDustingCount(post: Element): string | number | undefined {
  return (post as DustedElement).cmfDusted;
}
