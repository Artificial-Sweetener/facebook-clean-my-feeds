// SPDX-License-Identifier: GPL-3.0-only

import { ownsPostElement } from "../../dom/ownership";
import { getPostEvidence, PostEvidence } from "../../dom/post-evidence";
import { matchesSponsoredLabel } from "../../core/filters/disclosure-labels";
import { sharedSelectors } from "../../selectors/shared";

/** Per-classification name memoization also serves detached posts and observer-free hosts. */
export interface SponsoredScope {
  dom: PostEvidence;
  names: Map<Element, boolean>;
}

/** Start one classification's scope so every route shares DOM facts and resolved names for the post. */
export function createSponsoredScope(post: Element): SponsoredScope {
  return { dom: getPostEvidence(post), names: new Map<Element, boolean>() };
}

/**
 * Exclude authored text and independent nested posts/comments before considering any advertising signal.
 * A generic feed wrapper may enclose one owning article; additional article ancestry is not its metadata.
 */
export function isOwnedControl(
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

/** Reuse both positive and negative names across tracking and same-header corroboration routes. */
export function hasSponsoredName(
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
export function hasSponsoredCorroboration(
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
