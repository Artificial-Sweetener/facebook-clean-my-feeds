// SPDX-License-Identifier: GPL-3.0-only
import { climbUpTheTree } from "../utils/dom";

import { postAtt } from "./attributes";
import { collectGifControls, isGifMediaPlaying } from "./gif-controls";

/**
 * Pause playing GIF media once per owning Facebook control. Mark each control before
 * clicking so multiple icon children and synchronous rescans cannot toggle playback twice.
 * @param post Search scope, including a missing root during page navigation.
 */
export function swatTheMosquitos(post: ParentNode | null): void {
  if (!post || typeof post.querySelectorAll !== "function") {
    return;
  }

  for (const { control, icon: gif, media } of collectGifControls(post)) {
    if (media) {
      control.setAttribute(postAtt, "1");
      if (isGifMediaPlaying(media)) control.click();
      continue;
    }
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
