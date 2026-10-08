// SPDX-License-Identifier: GPL-3.0-only
import { climbUpTheTree } from "../utils/dom";

import { postAtt } from "./attributes";

/**
 * Target only unprocessed Facebook GIF controls, excluding already-realized icons.
 */
export function getMosquitosQuery(): string {
  return `div[role="button"][aria-label*="GIF"]:not([${postAtt}]) > i:not([data-visualcompletion])`;
}

/**
 * Pause invisible GIF overlays once per owning Facebook control. Mark each control before
 * clicking so multiple icon children and synchronous rescans cannot toggle playback twice.
 * @param post Search scope, including a missing root during page navigation.
 */
export function swatTheMosquitos(post: ParentNode | null): void {
  if (!post || typeof post.querySelectorAll !== "function") {
    return;
  }

  const animatedGIFs = post.querySelectorAll(getMosquitosQuery());
  for (const gif of animatedGIFs) {
    const control = gif.parentElement;
    if (!control || control.hasAttribute(postAtt)) continue;
    let parent = climbUpTheTree(gif, 2);
    let sibling = parent instanceof Element ? parent.querySelector(":scope > a") : null;
    if (!sibling) {
      parent = climbUpTheTree(gif, 3);
      sibling = parent instanceof Element ? parent.querySelector(":scope > a") : null;
    }

    if (sibling) {
      const siblingCS = window.getComputedStyle(sibling);
      control.setAttribute(postAtt, "1");
      if (siblingCS.opacity === "0") {
        control.click();
      }
    }
  }
}
