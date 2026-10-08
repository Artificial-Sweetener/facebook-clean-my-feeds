// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext } from "./types";
import { hasNewsCardHeading, matchesNewsLabel } from "./news-identity";
import { cleanText } from "../core/filters/text-normalize";
import { postAtt, postAttTab } from "../dom/attributes";
import { hideNewsPost, hideFeature } from "../dom/hide";

/** Normalize invisible characters and whitespace before comparing a rendered heading. */
export function getNormalizedElementText(element: Element | null) {
  if (!element) {
    return "";
  }

  return cleanText(element.textContent || "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Compare localized right-rail headings without case or whitespace sensitivity. */
export function isRightRailHeadingText(element: Element | null, text: string) {
  const normalizedText = getNormalizedElementText(element);
  const normalizedTarget = cleanText(text || "")
    .replace(/\s+/g, " ")
    .trim();

  return (
    normalizedText.length > 0 &&
    normalizedTarget.length > 0 &&
    normalizedText.toLocaleLowerCase() === normalizedTarget.toLocaleLowerCase()
  );
}

/** Check document order so advertising links must follow their section heading. */
export function isAfterElement(source: Element | null, target: Element | null) {
  if (!source || !target || typeof source.compareDocumentPosition !== "function") {
    return false;
  }

  return !!(source.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING);
}

/** Require a Facebook redirect or advertising tracking parameter before treating a rail link as an ad. */
export function isPlausibleRightRailAdLink(link: HTMLAnchorElement | null) {
  if (!link) {
    return false;
  }

  const href = link.href || link.getAttribute("href") || "";
  if (href.startsWith("https://l.facebook.com/l.php")) {
    return true;
  }

  return /(?:utm_[a-z0-9_]+|fbclid|ad_id|adset_id|campaign_id)(?:=|%3D)/i.test(href);
}

/** Find an advertising link following the supplied heading inside one candidate section. */
export function hasPlausibleRightRailAdLink(section: Element | null, heading: Element | null) {
  if (!section || !heading) {
    return false;
  }

  return Array.from(section.querySelectorAll("a")).some(
    (link) => isAfterElement(heading, link) && isPlausibleRightRailAdLink(link)
  );
}

/** Reject containers that would hide an unrelated neighboring right-rail section. */
export function hasOtherRightRailHeading(
  section: Element | null,
  sponsoredHeading: Element | null,
  sponsoredLabel: string
) {
  if (!section || !sponsoredHeading) {
    return false;
  }

  const headingQuery = 'h1, h2, h3, h4, [role="heading"]';
  return Array.from(section.querySelectorAll(headingQuery)).some(
    (heading) =>
      heading !== sponsoredHeading &&
      getNormalizedElementText(heading).length > 0 &&
      !isRightRailHeadingText(heading, sponsoredLabel)
  );
}

/** Climb to the smallest unprocessed sponsored section containing an ad link and no unrelated heading. */
export function findRightRailSponsoredSection(
  rightRail: Element | null,
  sponsoredHeading: Element | null,
  sponsoredLabel: string
) {
  if (!rightRail || !sponsoredHeading || !sponsoredLabel) {
    return null;
  }

  let current = sponsoredHeading.parentElement;

  while (current && current !== rightRail) {
    if (current.hasAttribute(postAtt)) {
      return null;
    }

    if (
      hasPlausibleRightRailAdLink(current, sponsoredHeading) &&
      !hasOtherRightRailHeading(current, sponsoredHeading, sponsoredLabel)
    ) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

/** Hide matching sponsored sections while retaining neighboring birthday and contact sections. */
export function scrubRightRailSponsored(context: FeedContext | null) {
  if (!context) return false;
  const { keyWords, state, options } = context;
  if (!keyWords || !state || !options || !keyWords.SPONSORED) {
    return false;
  }

  const rightRail = document.querySelector('div[role="complementary"]');
  if (!rightRail) {
    return false;
  }

  const headings = Array.from(
    rightRail.querySelectorAll('h1, h2, h3, h4, [role="heading"]')
  ).filter((heading) => isRightRailHeadingText(heading, keyWords.SPONSORED));

  let hidden = false;
  for (const heading of headings) {
    const section = findRightRailSponsoredSection(rightRail, heading, keyWords.SPONSORED);
    if (section) {
      hideFeature(section, keyWords.SPONSORED, false, context);
      hidden = true;
    }
  }

  return hidden;
}

/**
 * Hide only semantically identified recommendation sections in the supported rail layout.
 * Contacts and unknown cards stay visible; another heading blocks a container that would absorb a neighboring section.
 * @param context Supplies the localized reason and presentation options; null skips discovery.
 * @returns False for a null context; otherwise returns no value after examining eligible sections.
 */
export function scrubRightRailSuggestions(context: FeedContext | null) {
  if (!context) return false;
  const { keyWords, state, options } = context;
  const query =
    'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
  for (const container of document.querySelectorAll(query)) {
    for (const item of container.querySelectorAll(`:scope > div:not([${postAtt}])`)) {
      const kinds = ["suggested", "groups", "people"] as const;
      if (!kinds.some((kind) => hasNewsCardHeading(item, kind))) continue;
      const otherHeading = Array.from(
        item.querySelectorAll('h1, h2, h3, h4, [role="heading"]')
      ).some((heading) => {
        const label = heading.textContent || "";
        return label.trim() !== "" && !kinds.some((kind) => matchesNewsLabel(label, kind));
      });
      if (otherHeading || item.querySelector('a[href="/events/birthdays/"]')) continue;
      hideNewsPost(item, keyWords.NF_SUGGESTIONS, false, {
        options,
        keyWords,
        attributes: { postAtt, postAttTab },
        state,
      });
    }
  }
}
