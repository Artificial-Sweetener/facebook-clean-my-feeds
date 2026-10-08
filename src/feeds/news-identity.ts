// SPDX-License-Identifier: GPL-3.0-only

import { cleanText } from "../core/filters/text-normalize";
import { isNestedMarkedNode } from "../dom/walker";
import { newsLabels } from "../i18n/news-labels";
import { newsSelectors } from "../selectors/news";
import { getNewsBlocksQuery } from "./shared/blocks";

/** Semantic slots are independent of settings labels and remain exact matches after normalization. */
export type NewsLabelKind =
  | "follow"
  | "join"
  | "verified"
  | "suggested"
  | "groups"
  | "people"
  | "reels"
  | "events";
const labelKinds: readonly NewsLabelKind[] = [
  "follow",
  "join",
  "verified",
  "suggested",
  "groups",
  "people",
  "reels",
  "events",
];

/** Remove display-only whitespace and directional/invisible separators without admitting partial phrases. */
function normalizeLabel(text: string): string {
  return cleanText(text)
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const labelsByKind = new Map<NewsLabelKind, ReadonlySet<string>>(
  labelKinds.map((kind, index) => [
    kind,
    new Set(
      Object.values(newsLabels).flatMap((labels) =>
        (labels[index] || "").split("|").map(normalizeLabel)
      )
    ),
  ])
);

/** Match an expected semantic label in any shipped locale so the settings language cannot change detection. */
export function matchesNewsLabel(text: string, kind: NewsLabelKind): boolean {
  const normalized = normalizeLabel(text);
  return normalized !== "" && labelsByKind.get(kind)?.has(normalized) === true;
}

/** Reject user-authored message blocks, paragraphs/quotes, nested posts/comments, and independently hidden child features. */
export function isOwnedNewsElement(element: Element, post: Element): boolean {
  if (isNestedMarkedNode(element, post)) return false;
  const body = element.closest(
    'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]'
  );
  if (body && post.contains(body)) return false;
  const owner = element.closest(newsSelectors.standardPost);
  return !owner || owner === post || !post.contains(owner);
}

/** Reject legacy body/footer blocks for metadata signals even when message annotations are absent. */
export function isOwnedNewsMetadata(element: Element, post: Element): boolean {
  return (
    isOwnedNewsElement(element, post) &&
    !Array.from(post.querySelectorAll(getNewsBlocksQuery(post)))
      .slice(1)
      .some((body) => body.contains(element))
  );
}

/** Resolve only Facebook-owned ordinary HTTP destinations; external lookalike paths and redirect query text cannot identify a feature. */
export function facebookPath(link: Element): string | null {
  const href = link.getAttribute("href");
  if (!href) return null;
  try {
    const url = new URL(href, "https://www.facebook.com/");
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password &&
      (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com"))
      ? url.pathname
      : null;
  } catch {
    return null;
  }
}

/** Return header-local controls and badges only from this post's own rendered author headings. */
export function ownNewsHeaders(post: Element): Element[] {
  return Array.from(post.querySelectorAll("h4, h5")).filter((header) =>
    isOwnedNewsMetadata(header, post)
  );
}

/** Read the highest-priority explicit accessible name, never unrelated ancestor copy or a conflicting fallback title. */
export function explicitNewsNames(element: Element): string[] {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const text = labelledBy
      .trim()
      .split(/\s+/)
      .map((id) => element.ownerDocument.getElementById(id)?.textContent || "")
      .join(" ")
      .trim();
    if (text !== "") return [text];
  }
  const label = element.getAttribute("aria-label");
  if (label?.trim()) return [label];
  const svgTitle = Array.from(element.children).find(
    (child) => child.localName === "title"
  )?.textContent;
  if (svgTitle?.trim()) return [svgTitle];
  const title = element.getAttribute("title");
  return title?.trim() ? [title] : [];
}

/** Recognize a card's own semantic heading rather than a user's body/comment mention of the same words. */
export function hasNewsCardHeading(post: Element, kind: NewsLabelKind): boolean {
  return Array.from(post.querySelectorAll('h2, h3, [role="heading"]')).some(
    (heading) =>
      isOwnedNewsMetadata(heading, post) && matchesNewsLabel(heading.textContent || "", kind)
  );
}

/** Require the exact action name from visible control copy or its explicit accessible name. */
export function hasNewsActionName(element: Element, kind: "follow" | "join"): boolean {
  const names = explicitNewsNames(element);
  return (names.length > 0 ? names : [element.textContent || ""]).some((name) =>
    matchesNewsLabel(name, kind)
  );
}

/** Find verified icons only in the owning author header; an unrelated SVG or author name is not verification. */
export function ownVerifiedBadges(post: Element): Element[] {
  return ownNewsHeaders(post).flatMap((header) =>
    Array.from(header.querySelectorAll("svg")).filter((icon) => {
      if (!isOwnedNewsElement(icon, post)) return false;
      const iconNames = explicitNewsNames(icon);
      if (iconNames.length > 0) return iconNames.some((name) => matchesNewsLabel(name, "verified"));
      let wrapper = icon.parentElement;
      while (wrapper && wrapper !== header && wrapper.tagName === "SPAN") {
        if (!isBadgeOnlyWrapper(wrapper, icon)) return false;
        if (explicitNewsNames(wrapper).some((name) => matchesNewsLabel(name, "verified")))
          return true;
        wrapper = wrapper.parentElement;
      }
      return false;
    })
  );
}

/** Keep author copy and neighboring icons visible when collapsing a badge's otherwise empty span wrappers. */
export function isBadgeOnlyWrapper(wrapper: Element, icon: Element): boolean {
  if (
    wrapper.matches('a, button, [role="button"]') ||
    wrapper.querySelector('a, button, [role="button"], img, video')
  )
    return false;
  if (wrapper.querySelectorAll("svg").length !== 1 || !wrapper.contains(icon)) return false;
  const walker = document.createTreeWalker(wrapper, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.textContent?.trim() && !icon.contains(node)) return false;
  }
  return true;
}

/** Restrict reels to owned media previews so pasted links and comment mentions cannot identify the parent post. */
export function ownPostReelLinks(post: Element): Element[] {
  return Array.from(post.querySelectorAll("a[href]")).filter((link) => {
    const path = facebookPath(link);
    return (
      path !== null &&
      /^\/reel\/[^/]+\/?$/.test(path) &&
      isOwnedNewsElement(link, post) &&
      link.querySelector('video, img, [role="img"]') !== null
    );
  });
}

/** Require a complete localized paid-by template with a nonempty payer, preserving word boundaries and suffix-language order. */
export function matchesNewsPaidBy(text: string): boolean {
  const label = normalizeLabel(text);
  return Object.values(newsLabels).some((labels) =>
    labels[8].split("|").some((template) => {
      const [prefix = "", suffix = ""] = normalizeLabel(template).split("______");
      return (
        (prefix !== "" || suffix !== "") &&
        label.startsWith(prefix) &&
        label.endsWith(suffix) &&
        label.slice(prefix.length, label.length - suffix.length).trim() !== ""
      );
    })
  );
}
