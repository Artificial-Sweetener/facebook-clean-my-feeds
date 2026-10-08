// SPDX-License-Identifier: GPL-3.0-only

import { isNestedMarkedNode } from "../../dom/walker";
import { translations } from "../../i18n";
import { videosSelectors } from "../../selectors/videos";
import type { SponsoredState } from "../types";
import { getNewsBlocksQuery } from "./blocks";

const cftParam = "__cft__[0]=";
const maximumCandidateLinks = 10;
const maximumInspectedLinks = 2;
const postOwnerSelector = 'div[role="article"], div[aria-posinset]';
const authoredRegionSelector =
  'p, blockquote, [data-ad-preview="message"], [data-ad-comet-preview="message"], [data-ad-rendering-role="story_message"], [data-ad-rendering-role="creative_body"], [contenteditable="true"], [data-commentid], [data-testid^="UFI2Comment/"], [role="comment"]';
const sponsoredLabels = new Set(
  Object.values(translations).flatMap((catalog) =>
    [catalog.SPONSORED, catalog.SPONSORED_EXTRA]
      .filter((label): label is string => typeof label === "string")
      .map(normalizeLabel)
  )
);

/** Fold display-only Unicode variants while retaining exact words, punctuation, and diacritics. */
function normalizeLabel(label: string): string {
  return label
    .normalize("NFKC")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Reject lookalike hosts, redirect query text, malformed links, and non-web destinations. */
function facebookUrl(link: Element): URL | null {
  const href = link.getAttribute("href");
  if (!href) return null;
  try {
    const url = new URL(href, "https://www.facebook.com/");
    return (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password &&
      (url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com"))
      ? url
      : null;
  } catch {
    return null;
  }
}

/**
 * Exclude authored text and independent nested posts/comments before considering any advertising signal.
 * A generic feed wrapper may enclose one owning article; additional article ancestry is not its metadata.
 */
function isOwnedControl(control: Element, post: Element, bodies: readonly Element[]): boolean {
  if (isNestedMarkedNode(control, post)) return false;
  const authoredRegion = control.closest(authoredRegionSelector);
  if (authoredRegion && post.contains(authoredRegion)) return false;
  if (bodies.some((body) => body.contains(control))) return false;
  const owner = control.closest(postOwnerSelector);
  if (!owner || owner === post || !post.contains(owner)) return true;
  if (post.matches(`${postOwnerSelector}, div[aria-describedby], div[data-virtualized]`))
    return false;
  const parentOwner = owner.parentElement?.closest(postOwnerSelector);
  return !parentOwner || !post.contains(parentOwner);
}

/**
 * Retain the established feed body boundaries even when Facebook omits explicit message annotations.
 * News/group/search layouts expose header, body, then footer; video selectors already identify its body.
 */
function authoredBlocks(post: Element, state: SponsoredState): Element[] {
  if (state.isNF || state.isGF || state.isSF) {
    return Array.from(post.querySelectorAll(getNewsBlocksQuery(post))).slice(1);
  }
  if (state.isVF) {
    return Array.from(
      post.querySelectorAll(
        `${videosSelectors.blockQueries.videos}, ${videosSelectors.blockQueries.search}`
      )
    );
  }
  return [];
}

/** Extract fragmented label text while ignoring hidden decoys and non-rendered script/style content. */
function visibleControlText(control: Element): string {
  const walker = control.ownerDocument.createTreeWalker(control, NodeFilter.SHOW_TEXT);
  let text = "";
  let node: Node | null;
  while ((node = walker.nextNode())) {
    let element = node.parentElement;
    let visible = true;
    while (element && control.contains(element)) {
      const style = element.ownerDocument.defaultView?.getComputedStyle(element);
      if (
        element.matches('script, style, [hidden], [aria-hidden="true"]') ||
        style?.display === "none" ||
        style?.visibility === "hidden"
      ) {
        visible = false;
        break;
      }
      if (element === control) break;
      element = element.parentElement;
    }
    if (visible) text += node.textContent || "";
  }
  return text;
}

/**
 * Read a control's own accessible name or visible label, never text from a surrounding post.
 * Referenced labels must be owned by this post and cannot be an enclosing post/body container.
 * @param control Candidate disclosure or tracking control whose own name may identify sponsorship.
 * @param post Ownership boundary used to resolve referenced labels without reading unrelated content.
 * @param bodies Authored regions excluded even when they omit explicit message attributes.
 * @returns Whether a supported exact sponsorship label is present on the owned control.
 */
function hasSponsoredName(control: Element, post: Element, bodies: readonly Element[]): boolean {
  const ariaLabel = control.getAttribute("aria-label");
  if (ariaLabel) return sponsoredLabels.has(normalizeLabel(ariaLabel));
  const labelIds = control.getAttribute("aria-labelledby");
  if (labelIds) {
    const labels = labelIds
      .trim()
      .split(/\s+/)
      .map((id) =>
        Array.from(post.querySelectorAll("[id]")).find(
          (element) =>
            element.id === id && !element.contains(control) && isOwnedControl(element, post, bodies)
        )
      );
    if (labels.every((label) => label !== undefined)) {
      return sponsoredLabels.has(
        normalizeLabel(labels.map((label) => label?.textContent || "").join(" "))
      );
    }
    return false;
  }
  return [visibleControlText(control), control.getAttribute("title") || ""].some((label) =>
    sponsoredLabels.has(normalizeLabel(label))
  );
}

/** Require sponsorship on the tracking control itself or another control in its own author heading. */
function hasSponsoredCorroboration(
  link: Element,
  post: Element,
  bodies: readonly Element[]
): boolean {
  if (hasSponsoredName(link, post, bodies)) return true;
  const header = link.closest("h4, h5");
  return (
    !!header &&
    post.contains(header) &&
    Array.from(header.querySelectorAll('a, button, [role="button"], [role="link"]')).some(
      (control) => isOwnedControl(control, post, bodies) && hasSponsoredName(control, post, bodies)
    )
  );
}

/** Expose the locale-independent sponsorship decision without diagnostic details. */
function isSponsored(post: Element | null, state: SponsoredState | null) {
  return inspectSponsored(post, state).isSponsored;
}

/**
 * Confirm an explicit embedded-ad disclosure without promoting its owning video's authored body to an ad post.
 * @param control Candidate anchor itself; requires an exact Facebook disclosure destination and localized sponsored name.
 * @param post Owning video scope; paragraphs, comments, independent nested posts, and marked child features remain excluded.
 * @returns Whether this control supplies sufficient evidence to hide only its separately selected embedded-ad container.
 */
export function isSponsoredDisclosure(control: Element, post: Element): boolean {
  if (!control.matches("a[href]")) return false;
  const url = facebookUrl(control);
  const owner = control.closest(postOwnerSelector);
  return (
    url?.pathname === "/ads/about/" &&
    (!owner || owner === post || !post.contains(owner)) &&
    isOwnedControl(control, post, []) &&
    Array.from(control.querySelectorAll("*")).every((child) => isOwnedControl(child, post, [])) &&
    hasSponsoredName(control, post, [])
  );
}

/** Expose read-only aggregate evidence, never URLs, parameter values, labels, or post content. */
function getSponsoredDiagnostics(post: Element | null, state: SponsoredState | null) {
  return inspectSponsored(post, state).diagnostics;
}

/**
 * Require an owned Facebook disclosure control or a corroborated tracking control in a known feed layout.
 * CFT length alone never identifies an advertisement. Signature limits retain their prior feed-specific
 * thresholds but count only the parameter, not trailing query parameters or fragments.
 * @param post Read-only post scope; null returns initialized unmatched diagnostics.
 * @param state Feed flags select wrapper/body boundaries; null disables all matching.
 * @returns A decision with privacy-safe source, route, and eligible-candidate counts.
 */
function inspectSponsored(post: Element | null, state: SponsoredState | null) {
  const diagnostics = createSponsoredDiagnostics(post, state);
  if (!post || !state) return { isSponsored: false, diagnostics };
  const bodies = authoredBlocks(post, state);
  diagnostics.adsAboutLinkCount = Array.from(post.querySelectorAll("a[href]")).filter((link) => {
    const url = facebookUrl(link);
    return (
      url?.pathname === "/ads/about/" &&
      isOwnedControl(link, post, bodies) &&
      hasSponsoredName(link, post, bodies)
    );
  }).length;
  if (diagnostics.adsAboutLinkCount > 0) {
    diagnostics.matchedBy = "ads-about";
    return { isSponsored: true, diagnostics };
  }

  const candidates = collectCftLinkCandidates(post, state, bodies);
  diagnostics.cftLinks.selectedSource = candidates.selectedSource;
  diagnostics.cftLinks.selectedCount = candidates.links.length;
  diagnostics.cftLinks.rejectedForVolume = candidates.links.length >= maximumCandidateLinks;
  if (diagnostics.cftLinks.rejectedForVolume) return { isSponsored: false, diagnostics };

  const inspectedLinks = candidates.links.slice(0, maximumInspectedLinks);
  diagnostics.cftLinks.inspectedCount = inspectedLinks.length;
  inspectedLinks.forEach((link) => {
    const value = facebookUrl(link)?.searchParams.get("__cft__[0]");
    const signatureLength =
      value === null || value === undefined ? 0 : cftParam.length + value.length;
    if (signatureLength >= diagnostics.cftLinks.minimumSignatureLength) {
      diagnostics.cftLinks.meetsMinimumCount += 1;
    } else {
      diagnostics.cftLinks.belowMinimumCount += 1;
    }
  });
  const isSponsoredPost = diagnostics.cftLinks.meetsMinimumCount > 0;
  if (isSponsoredPost) diagnostics.matchedBy = "cft-link-signature";
  return { isSponsored: isSponsoredPost, diagnostics };
}

/**
 * Select only owned, semantically corroborated controls from the existing feed wrapper families.
 * Ordinary author tracking links do not consume the inspection budget or prevent describedby fallback.
 * @param post Read-only feed item containing supported metadata wrapper families.
 * @param state Feed flags choose the existing wrapper priority and route-specific layouts.
 * @param bodies Authored regions that cannot corroborate a sponsorship control.
 * @returns Eligible controls from the first matching family and its diagnostic source label.
 */
function collectCftLinkCandidates(
  post: Element,
  state: SponsoredState,
  bodies: readonly Element[]
) {
  const queries: string[] = [];
  let selectedSource = "none";
  if (state.isNF || state.isGF) {
    const link = `span > a[href*="${cftParam}"]:not([href^="/groups/"]):not([href*="section_header_type"])`;
    queries.push(`div[aria-posinset] ${link}`, `div[aria-describedby] ${link}`);
    selectedSource = "nested-wrapper";
  } else if (state.isVF) {
    queries.push(`div > div > div > div > span > span > div > a[href*="${cftParam}"]`);
    selectedSource = "video-wrapper";
  } else if (state.isSF) {
    queries.push(`div[role="article"] span > a[href*="${cftParam}"]`);
    selectedSource = "nested-article";
  }
  for (const query of queries) {
    const links = Array.from(post.querySelectorAll<HTMLAnchorElement>(query)).filter((link) => {
      const url = facebookUrl(link);
      return (
        url !== null &&
        !url.pathname.startsWith("/groups/") &&
        !url.searchParams.has("section_header_type") &&
        url.searchParams.has("__cft__[0]") &&
        isOwnedControl(link, post, bodies) &&
        hasSponsoredCorroboration(link, post, bodies)
      );
    });
    if (links.length > 0) return { links, selectedSource };
  }
  return { links: [], selectedSource: "none" };
}

/** Initialize stable diagnostic fields even when no usable post or feed state is available. */
function createSponsoredDiagnostics(post: Element | null, state: SponsoredState | null) {
  const canMatchRoot = !!(post && typeof post.matches === "function");
  return {
    matchedBy: "none",
    adsAboutLinkCount: 0,
    rootContainer:
      canMatchRoot &&
      post.matches('div[role="article"], div[aria-posinset], div[aria-describedby]'),
    rootRoleArticle: canMatchRoot && post.matches('div[role="article"]'),
    rootAriaPosinset: canMatchRoot && post.matches("div[aria-posinset]"),
    rootAriaDescribedby: canMatchRoot && post.matches("div[aria-describedby]"),
    cftLinks: {
      minimumSignatureLength: state ? (state.isSF ? 250 : state.isVF ? 299 : 311) : 0,
      selectedSource: "none",
      selectedCount: 0,
      inspectedCount: 0,
      belowMinimumCount: 0,
      meetsMinimumCount: 0,
      rejectedForVolume: false,
    },
  };
}

export { getSponsoredDiagnostics, isSponsored };
