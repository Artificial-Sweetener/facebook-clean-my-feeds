// SPDX-License-Identifier: GPL-3.0-only

import { matchesNewsLabel } from "../core/filters/labels";
import { getPostEvidence } from "../dom/post-evidence";
import { isOwnedNewsElement } from "./news-identity";

/** Read an owned recommendation's accessible name or rendered copy, ignoring concealed text decoys. */
export function hasGroupsSuggestionLabel(element: Element, post: Element): boolean {
  const evidence = getPostEvidence(post);
  if (
    !isOwnedNewsElement(element, post) ||
    !evidence.isRendered(element) ||
    Array.from(element.querySelectorAll("*")).some((child) => !isOwnedNewsElement(child, post))
  )
    return false;
  const names = evidence.explicitNames(element);
  return (names.length ? names : [evidence.visibleText(element)]).some(
    (label) => matchesNewsLabel(label, "suggested") || matchesNewsLabel(label, "groups")
  );
}
