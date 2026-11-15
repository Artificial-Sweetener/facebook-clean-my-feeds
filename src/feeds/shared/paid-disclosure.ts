// SPDX-License-Identifier: GPL-3.0-only

import { matchesPaidByDisclosure } from "../../core/filters/labels";
import { facebookUrl, getPostEvidence } from "../../dom/post-evidence";
import { newsSelectors } from "../../selectors/news";
import { sharedSelectors } from "../../selectors/shared";
import { isOwnedNewsMetadata } from "../news-identity";
import { getNewsBlocks } from "./blocks";
import { getStructuralSponsoredKind } from "./sponsored-structure";

/**
 * Try language-independent creative/disclaimer evidence before localized payer disclosures.
 * Header boundaries come from owned profile/content signals or the established block layouts;
 * wrapper depth, generated classes, tracking length and the position of the author heading are irrelevant.
 * @param post Read-only news post; authored text, profile names and independent nested content cannot supply evidence.
 * @returns Whether one rendered candidate owns a complete localized paid-by statement, with an optional sponsored prefix.
 */
export function hasPaidByDisclosure(post: Element): boolean {
  if (getStructuralSponsoredKind(post) === "paid") return true;
  const evidence = getPostEvidence(post);
  const legacy = evidence.select(newsSelectors.paidDisclosureLegacy);
  const header = getNewsBlocks(post)[0];
  const controls = header ? evidence.select(newsSelectors.paidDisclosureControls, header) : [];
  return [...new Set([...legacy, ...controls])].some((control) => {
    if (
      !isOwnedNewsMetadata(control, post) ||
      control.closest(newsSelectors.paidDisclosureIdentity) ||
      control.parentElement?.closest(newsSelectors.paidDisclosureControls) ||
      (control.localName === "a" && !facebookUrl(control)) ||
      !matchesPaidByDisclosure(evidence.visibleText(control))
    )
      return false;
    const descendants = evidence.select("*", control);
    if (
      descendants.length > 128 ||
      descendants.some(
        (child) =>
          evidence.isRendered(child) &&
          (!isOwnedNewsMetadata(child, post) ||
            child.matches(
              `${sharedSelectors.profileName}, ${newsSelectors.paidDisclosureControls}`
            ))
      )
    )
      return false;
    // Conflicting or unresolved accessible names cannot be overridden by descendant text.
    if (control.hasAttribute("aria-label") || control.hasAttribute("aria-labelledby")) {
      const names = evidence.explicitNames(control);
      if (!names.length || !names.every(matchesPaidByDisclosure)) return false;
    }
    return true;
  });
}
