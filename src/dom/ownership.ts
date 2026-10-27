// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "./attributes";
import { sharedSelectors } from "../selectors/shared";

/** Legacy wrappers may contain one article, while concrete post scopes reject independent nested owners. */
interface OwnershipBoundary {
  bodies?: readonly Element[];
  allowArticleWrapper?: boolean;
}

/** Keep metadata evidence outside authored text, nested features, comments and independent posts. */
export function ownsPostElement(
  element: Element,
  post: Element,
  boundary: OwnershipBoundary = {}
): boolean {
  if (!post.contains(element)) return false;
  const marked = element.closest(`[${postAtt}]`);
  if (marked && marked !== post) return false;
  const authored = element.closest(sharedSelectors.authoredContent);
  if (authored && post.contains(authored)) return false;
  if (boundary.bodies?.some((body) => body.contains(element))) return false;
  const owner = element.closest(sharedSelectors.postOwner);
  if (!owner || owner === post || !post.contains(owner)) return true;
  if (
    !boundary.allowArticleWrapper ||
    post.matches(`${sharedSelectors.postOwner}, div[aria-describedby], div[data-virtualized]`)
  )
    return false;
  const parentOwner = owner.parentElement?.closest(sharedSelectors.postOwner);
  return !parentOwner || !post.contains(parentOwner);
}
