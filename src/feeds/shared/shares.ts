// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../../core/options/types";
import type { FeedProcessingState } from "../types";
import { postAtt } from "../../dom/attributes";

/** Add the share-hiding attribute and Shares reason to matched count spans; debug mode also exposes those spans, without changing the post's own hidden state. */
function hideNumberOfShares(
  post: Element,
  state: Pick<FeedProcessingState, "cssHideNumberOfShares" | "showAtt">,
  options: Pick<HydratedOptions, "VERBOSITY_DEBUG">
) {
  if (!post || !state || !options) {
    return;
  }

  const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not([${postAtt}])`;
  const shares = post.querySelectorAll(query);
  for (const share of shares) {
    share.setAttribute(state.cssHideNumberOfShares, "");
    if (options.VERBOSITY_DEBUG) {
      share.setAttribute(state.showAtt, "");
    }
    share.setAttribute(postAtt, "Shares");
  }
}

/** Count unprocessed share indicators without reading or modifying their text; existing feature markers retain ownership. */
function findNumberOfShares(post: Element) {
  if (!post) {
    return 0;
  }
  const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not([${postAtt}])`;
  return post.querySelectorAll(query).length;
}

export { findNumberOfShares, hideNumberOfShares };
