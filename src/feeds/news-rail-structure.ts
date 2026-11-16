// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../dom/post-evidence";
import { ownsPostElement } from "../dom/ownership";
import { postAtt } from "../dom/attributes";
import { newsSelectors } from "../selectors/news";
import { sharedSelectors } from "../selectors/shared";

/**
 * Recognize a rail advertising section from attributed outbound image creatives, without reading headings.
 * Attribution reporting is corroborated by Facebook's outbound redirect and a rendered image;
 * a generic external link, birthday, contact, or neighboring heading cannot qualify the section.
 * @param rail Complementary region limiting the ancestor search.
 * @param heading Candidate section heading; the smallest independent section wins.
 * @returns The owned advertising section, or null when structure is incomplete or ambiguous.
 */
export function findStructuralRailAdSection(rail: Element, heading: Element): Element | null {
  for (
    let section = heading.parentElement;
    section && section !== rail;
    section = section.parentElement
  ) {
    if (section.hasAttribute(postAtt) || section.querySelector(newsSelectors.railContentBoundary))
      return null;
    const evidence = getPostEvidence(section);
    const headings = evidence.select(newsSelectors.advertisingRailHeadings);
    if (headings.length !== 1 || headings[0] !== heading) return null;
    if (!evidence.isRendered(heading)) return null;
    const ad = evidence.select(newsSelectors.attributedAdLinks).some((link) => {
      if (
        !ownsPostElement(link, section) ||
        !evidence.isRendered(link) ||
        !(heading.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING)
      )
        return false;
      try {
        const url = new URL(link.getAttribute("href") || "", "https://www.facebook.com/");
        if (
          url.protocol !== "https:" ||
          url.hostname !== "l.facebook.com" ||
          url.pathname !== "/l.php" ||
          url.username ||
          url.password ||
          !url.searchParams.has("u")
        )
          return false;
        return evidence.select(sharedSelectors.images, link).some((image) => {
          let ancestor: Element | null = image;
          while (ancestor && ancestor !== link) {
            if (!evidence.isPainted(ancestor)) return false;
            ancestor = ancestor.parentElement;
          }
          return ancestor === link;
        });
      } catch {
        return false;
      }
    });
    if (ad) return section;
  }
  return null;
}
