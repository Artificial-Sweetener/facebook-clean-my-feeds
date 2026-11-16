// SPDX-License-Identifier: GPL-3.0-only

import { ownsPostElement } from "../../dom/ownership";
import { facebookUrl, getPostEvidence, PostEvidence } from "../../dom/post-evidence";
import { sharedSelectors } from "../../selectors/shared";
import { getNewsBlocks } from "./blocks";

/** Keep the independently selectable paid-disclaimer and ordinary-ad settings distinct. */
type StructuralSponsoredKind = "paid" | "sponsored" | null;
const cache = new WeakMap<PostEvidence, StructuralSponsoredKind>();

/**
 * Corroborate the historical tracking signature with owned creative and metadata structure.
 * No heading, accessible name, SVG text or translated label is consulted. Missing structure
 * returns null so established localized detectors can still handle incomplete and older layouts.
 * @param post Feed post whose header, media and CTA must belong to one rendered creative.
 * @returns The structural disclosure family, cached only for the current DOM content version.
 */
export function getStructuralSponsoredKind(post: Element): StructuralSponsoredKind {
  const evidence = getPostEvidence(post);
  if (cache.has(evidence)) return cache.get(evidence) ?? null;
  const result = inspectStructure(post, evidence);
  cache.set(evidence, result);
  return result;
}

/** Require every signal to be rendered and owned, excluding comments, messages and nested shared posts. */
function isOwnedSignal(element: Element, post: Element, evidence: PostEvidence): boolean {
  return ownsPostElement(element, post) && evidence.isRendered(element);
}

/**
 * Inspect corroborated ad creatives; a long ordinary author URL never establishes sponsorship alone.
 * @param post Owning feed item whose header and creative must supply all structural signals.
 * @param evidence Per-version queries and visibility facts shared with the localized fallback.
 * @returns The independently selectable disclosure family, or null when any corroborating signal is missing.
 */
function inspectStructure(post: Element, evidence: PostEvidence): StructuralSponsoredKind {
  const blocks = getNewsBlocks(post);
  const header = blocks[0];
  if (!header || blocks.length < 2) return null;
  const tracked = evidence.select("a[href]", header).filter((link) => {
    const url = facebookUrl(link);
    const signature = url?.searchParams.get("__cft__[0]");
    return (
      !!signature &&
      signature.length + "__cft__[0]=".length >= 311 &&
      !url?.pathname.startsWith("/groups/") &&
      !url?.searchParams.has("section_header_type") &&
      isOwnedSignal(link, post, evidence)
    );
  });
  if (tracked.length < 2 || !tracked.some((link) => link.closest(sharedSelectors.profileName)))
    return null;
  const creative = blocks.slice(1).some((block) => {
    const cta = evidence
      .select(sharedSelectors.adCreativeCta, block)
      .some((element) => isOwnedSignal(element, post, evidence));
    return (
      cta &&
      evidence
        .select(sharedSelectors.adCreativeMedia, block)
        .some((media) => isOwnedSignal(media, post, evidence))
    );
  });
  if (!creative) return null;
  const paid = evidence.select(sharedSelectors.paidMetadataButton, header).some((button) => {
    if (
      !isOwnedSignal(button, post, evidence) ||
      button.matches(sharedSelectors.statefulDisclosureControl) ||
      button.closest(sharedSelectors.authorMetadata) ||
      button.parentElement?.closest(sharedSelectors.interactive) ||
      button.querySelector(
        `${sharedSelectors.disclosureNonTextContent}, ${sharedSelectors.authoredContent}`
      )
    )
      return false;
    const parts = Array.from(button.children).filter((part) => evidence.isRendered(part));
    return (
      parts.length === 2 &&
      parts.every((part) => part.localName === "span" && isOwnedSignal(part, post, evidence))
    );
  });
  if (paid) return "paid";
  return tracked.some(
    (link) =>
      !link.closest(sharedSelectors.profileName) &&
      !link.querySelector(sharedSelectors.avatarMedia) &&
      evidence
        .select(sharedSelectors.svgLabelGeometry, link)
        .some((graphic) => isOwnedSignal(graphic, post, evidence))
  )
    ? "sponsored"
    : null;
}
