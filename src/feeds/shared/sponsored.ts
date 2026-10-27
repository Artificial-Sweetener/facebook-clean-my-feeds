// SPDX-License-Identifier: GPL-3.0-only

import { ownsPostElement } from "../../dom/ownership";
import { facebookUrl, getPostEvidence, PostEvidence } from "../../dom/post-evidence";
import { matchesSponsoredLabel } from "../../core/filters/disclosure-labels";
import { videosSelectors } from "../../selectors/videos";
import { sharedSelectors } from "../../selectors/shared";
import type { SponsoredState } from "../types";
import { getNewsBlocks } from "./blocks";

const cftParam = "__cft__[0]=";
const maximumCandidateLinks = 10;
/**
 * Exclude authored text and independent nested posts/comments before considering any advertising signal.
 * A generic feed wrapper may enclose one owning article; additional article ancestry is not its metadata.
 */
function isOwnedControl(
  control: Element,
  post: Element,
  bodies: readonly Element[],
  evidence: PostEvidence
): boolean {
  return (
    ownsPostElement(control, post, { bodies, allowArticleWrapper: true }) &&
    evidence.isRendered(control)
  );
}

/**
 * Retain the established feed body boundaries even when Facebook omits explicit message annotations.
 * News/group/search layouts expose header, body, then footer; video selectors already identify its body.
 */
function authoredBlocks(post: Element, state: SponsoredState): Element[] {
  if (state.isNF || state.isGF || state.isSF) {
    return getNewsBlocks(post).slice(1);
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

/** Per-classification name memoization also serves detached posts and observer-free hosts. */
interface SponsoredScope {
  dom: PostEvidence;
  names: Map<Element, boolean>;
}

/** Reuse both positive and negative names across tracking and same-header corroboration routes. */
function hasSponsoredName(
  control: Element,
  post: Element,
  bodies: readonly Element[],
  scope: SponsoredScope
): boolean {
  const cached = scope.names.get(control);
  if (cached !== undefined) return cached;
  const result = readSponsoredName(control, post, bodies, scope);
  scope.names.set(control, result);
  return result;
}

/**
 * Read a control's own accessible name or visible label, never text from a surrounding post.
 * Direct references must be owned; separately named graphics may use constrained shared labels.
 * @param control Candidate disclosure or tracking control whose own name may identify sponsorship.
 * @param post Ownership boundary used to resolve referenced labels without reading unrelated content.
 * @param bodies Authored regions excluded even when they omit explicit message attributes.
 * @param scope Shared per-version DOM facts and per-classification name results.
 * @returns Whether a supported exact sponsorship label is present on the owned control.
 */
function readSponsoredName(
  control: Element,
  post: Element,
  bodies: readonly Element[],
  scope: SponsoredScope
): boolean {
  const ariaLabel = control.getAttribute("aria-label");
  if (ariaLabel) return matchesSponsoredLabel(ariaLabel);
  const labelIds = control.getAttribute("aria-labelledby");
  if (labelIds) {
    const labels = scope.dom
      .referencedLabels(control)
      .map((label) =>
        label &&
        post.contains(label) &&
        !label.contains(control) &&
        isOwnedControl(label, post, bodies, scope.dom)
          ? label
          : null
      );
    if (labels.every((label) => label !== null)) {
      return matchesSponsoredLabel(
        labels.map((label) => (label ? scope.dom.labelText(label) : "")).join(" ")
      );
    }
    return false;
  }
  return (
    [scope.dom.visibleText(control), control.getAttribute("title") || ""].some((label) =>
      matchesSponsoredLabel(label)
    ) || hasSponsoredGraphicName(control, post, bodies, scope)
  );
}

/**
 * Resolve an owned disclosure graphic's accessible name, including Facebook's shared SVG labels.
 * External references must be plain leaf spans outside posts, authored regions, and controls;
 * arbitrary external aria-labelledby on the tracking link itself remains unsupported.
 * @param control Tracking or disclosure control already checked against the post's ownership boundary.
 * @param post Owning post; referenced labels cannot enclose it or the disclosure control.
 * @param bodies Legacy authored regions that cannot supply advertising evidence.
 * @param scope Shared names, label dependencies and bounded style reads.
 * @returns Whether an independently named graphic supplies an exact supported advertising label.
 */
function hasSponsoredGraphicName(
  control: Element,
  post: Element,
  bodies: readonly Element[],
  scope: SponsoredScope
): boolean {
  return scope.dom
    .select("svg[aria-label], svg[aria-labelledby], span[aria-labelledby]", control)
    .slice(0, 16)
    .some((graphic) => {
      if (
        !isOwnedControl(graphic, post, bodies, scope.dom) ||
        graphic.closest('a, button, [role="button"], [role="link"]') !== control ||
        graphic.closest('[hidden], [aria-hidden="true"]') ||
        !scope.dom.isVisible(graphic) ||
        (graphic.localName === "span" &&
          (graphic.childElementCount !== 1 || graphic.firstElementChild?.localName !== "svg"))
      )
        return false;
      const ariaLabel = graphic.getAttribute("aria-label");
      if (ariaLabel) return matchesSponsoredLabel(ariaLabel);
      const ids = graphic.getAttribute("aria-labelledby")?.trim().split(/\s+/);
      if (!ids?.length) return false;
      const labels = scope.dom.referencedLabels(graphic).map((label) => {
        if (!label || label.contains(control) || label.contains(post)) return null;
        if (post.contains(label))
          return isOwnedControl(label, post, bodies, scope.dom) ? label : null;
        return label.localName === "span" &&
          label.childElementCount === 0 &&
          !label.closest(
            `${sharedSelectors.authoredContent}, ${sharedSelectors.postOwner}, a, button, [role="link"], [role="button"]`
          )
          ? label
          : null;
      });
      return (
        labels.every((label) => label !== null) &&
        matchesSponsoredLabel(
          labels.map((label) => (label ? scope.dom.labelText(label) : "")).join(" ")
        )
      );
    });
}

/** Require sponsorship on the tracking control itself or another control in its own author heading. */
function hasSponsoredCorroboration(
  link: Element,
  post: Element,
  bodies: readonly Element[],
  scope: SponsoredScope
): boolean {
  if (hasSponsoredName(link, post, bodies, scope)) return true;
  const header = link.closest("h4, h5");
  return (
    !!header &&
    post.contains(header) &&
    scope.dom
      .select('a, button, [role="button"], [role="link"]', header)
      .some(
        (control) =>
          control !== link &&
          isOwnedControl(control, post, bodies, scope.dom) &&
          hasSponsoredName(control, post, bodies, scope)
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
  const scope = { dom: getPostEvidence(post), names: new Map<Element, boolean>() };
  const owner = control.closest(sharedSelectors.postOwner);
  return (
    url?.pathname === "/ads/about/" &&
    (!owner || owner === post || !post.contains(owner)) &&
    isOwnedControl(control, post, [], scope.dom) &&
    Array.from(control.querySelectorAll("*")).every(
      (child) => !scope.dom.isRendered(child) || isOwnedControl(child, post, [], scope.dom)
    ) &&
    hasSponsoredName(control, post, [], scope)
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
 * Inspect every eligible control below the existing ten-candidate rejection ceiling, so short author
 * controls cannot mask a later qualifying signature. This performs at most nine signature checks.
 * @param post Read-only post scope; null returns initialized unmatched diagnostics.
 * @param state Feed flags select wrapper/body boundaries; null disables all matching.
 * @returns A decision with privacy-safe source, route, and eligible-candidate counts.
 */
function inspectSponsored(post: Element | null, state: SponsoredState | null) {
  const diagnostics = createSponsoredDiagnostics(post, state);
  if (!post || !state) return { isSponsored: false, diagnostics };
  const scope = { dom: getPostEvidence(post), names: new Map<Element, boolean>() };
  const bodies = authoredBlocks(post, state);
  diagnostics.adsAboutLinkCount = scope.dom.select("a[href]").filter((link) => {
    const url = facebookUrl(link);
    return (
      url?.pathname === "/ads/about/" &&
      isOwnedControl(link, post, bodies, scope.dom) &&
      hasSponsoredName(link, post, bodies, scope)
    );
  }).length;
  if (diagnostics.adsAboutLinkCount > 0) {
    diagnostics.matchedBy = "ads-about";
    return { isSponsored: true, diagnostics };
  }

  const candidates = collectCftLinkCandidates(post, state, bodies, scope);
  diagnostics.cftLinks.selectedSource = candidates.selectedSource;
  diagnostics.cftLinks.selectedCount = candidates.links.length;
  diagnostics.cftLinks.rejectedForVolume = candidates.links.length >= maximumCandidateLinks;
  if (diagnostics.cftLinks.rejectedForVolume) return { isSponsored: false, diagnostics };

  const inspectedLinks = candidates.links;
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
 * @param scope Shared facts reused across wrapper and semantic candidate routes.
 * @returns Eligible controls from the first matching family and its diagnostic source label.
 */
function collectCftLinkCandidates(
  post: Element,
  state: SponsoredState,
  bodies: readonly Element[],
  scope: SponsoredScope
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
    const links = scope.dom.select(query).filter((link) => {
      const url = facebookUrl(link);
      return (
        url !== null &&
        !url.pathname.startsWith("/groups/") &&
        !url.searchParams.has("section_header_type") &&
        url.searchParams.has("__cft__[0]") &&
        isOwnedControl(link, post, bodies, scope.dom) &&
        hasSponsoredCorroboration(link, post, bodies, scope)
      );
    });
    if (links.length > 0) return { links, selectedSource };
  }
  if (state.isNF || state.isGF || state.isVF || state.isSF) {
    const links = scope.dom.select("h4 a[href], h5 a[href]").filter((link) => {
      const url = facebookUrl(link);
      return (
        url !== null &&
        !url.pathname.startsWith("/groups/") &&
        !url.searchParams.has("section_header_type") &&
        url.searchParams.has("__cft__[0]") &&
        isOwnedControl(link, post, bodies, scope.dom) &&
        hasSponsoredCorroboration(link, post, bodies, scope)
      );
    });
    if (links.length) return { links, selectedSource: "semantic-header" };
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
