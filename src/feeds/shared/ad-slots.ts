// SPDX-License-Identifier: GPL-3.0-only

import { facebookUrl, getPostEvidence } from "../../dom/post-evidence";
import { ownsPostElement } from "../../dom/ownership";
import { adSlotSelectors } from "../../selectors/ad-slots";
import { sharedSelectors } from "../../selectors/shared";
import { postAtt } from "../../dom/attributes";

/** Respect native concealment and foreign ownership while allowing a previously CMF-hidden slot to be reclassified. */
function isOwnedSlot(container: Element, root: Element): boolean {
  const foreign = container.closest(
    `${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}`
  );
  if (foreign && foreign !== root && root.contains(foreign)) return false;
  const evidence = getPostEvidence(root);
  let ancestor: Element | null = container;
  while (ancestor && ancestor !== root) {
    if (ancestor === container && ancestor.hasAttribute(postAtt)) {
      if (
        ancestor.matches('[hidden], [inert], [aria-hidden="true"]') ||
        (ancestor instanceof HTMLElement &&
          (ancestor.style.display === "none" || ancestor.style.visibility === "hidden"))
      )
        return false;
    } else if (!evidence.isVisible(ancestor)) return false;
    ancestor = ancestor.parentElement;
  }
  return ancestor === root;
}

/** Empty layout wrappers may surround the heading and creative; unrelated text or graphics cannot be hidden with them. */
function hasForeignContent(container: Element, heading: Element, creative: Element): boolean {
  const pending: Node[] = [container];
  let visited = 0;
  while (pending.length) {
    const node = pending.pop();
    if (!node || node === heading || node === creative) continue;
    if (++visited > 128) return true;
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true;
    if (node instanceof Element && node.matches("img, video, svg, input, textarea")) return true;
    pending.push(...Array.from(node.childNodes));
  }
  return false;
}

/** Require the native advertiser redirect and its ad-interaction marker; ordinary external links do not qualify. */
function isAdCreative(link: Element): boolean {
  const url = facebookUrl(link);
  return !!(
    url?.hostname === "l.facebook.com" &&
    url.pathname === "/l.php" &&
    url.searchParams.get("u") &&
    url.searchParams.get("ai")
  );
}

/**
 * Locate the smallest independently controlled ad container around a disclosure heading.
 * Ownership, an ad-specific redirect and rendered media corroborate the URL without reading labels.
 * The first ancestor with another link is decisive: ambiguous neighbors cannot be swallowed by climbing farther.
 * @param disclosure Native Facebook ad-disclosure anchor already selected within the caller's surface.
 * @param root Active surface boundary, which can never itself become a hide target.
 * @returns An exclusive heading/creative container, or null for incomplete or foreign evidence.
 */
function findAdSlot(disclosure: Element, root: Element): Element | null {
  if (facebookUrl(disclosure)?.pathname !== "/ads/about/") return null;
  const heading = disclosure.closest(adSlotSelectors.headings);
  if (!heading || heading.querySelectorAll(adSlotSelectors.links).length !== 1) return null;
  const controls = heading.querySelectorAll(adSlotSelectors.controls);
  const menu = controls[0];
  if (
    controls.length !== 1 ||
    !menu?.matches(adSlotSelectors.menu) ||
    !menu.querySelector("svg, i")
  )
    return null;
  let container = heading.parentElement;
  for (
    let depth = 0;
    container && container !== root && depth < 12;
    depth++, container = container.parentElement
  ) {
    if (!root.contains(container)) return null;
    const links = container.querySelectorAll(adSlotSelectors.links);
    if (links.length < 2) continue;
    if (links.length !== 2 || container.children.length !== 2) return null;
    const creative = Array.from(links).find((link) => link !== disclosure);
    const evidence = getPostEvidence(container);
    if (
      !creative ||
      !isOwnedSlot(container, root) ||
      !ownsPostElement(disclosure, container) ||
      !ownsPostElement(menu, container) ||
      !evidence.isRendered(disclosure) ||
      !evidence.isRendered(menu) ||
      heading.contains(creative) ||
      !isAdCreative(creative) ||
      !ownsPostElement(creative, container) ||
      !evidence.isRendered(creative) ||
      hasForeignContent(container, heading, creative) ||
      container.querySelectorAll(adSlotSelectors.headings).length !== 1 ||
      container.querySelector(
        `${sharedSelectors.postOwner}, ${sharedSelectors.authoredContent}, ${adSlotSelectors.input}`
      ) ||
      !Array.from(creative.querySelectorAll(adSlotSelectors.media)).some((media) =>
        evidence.isRendered(media)
      ) ||
      Array.from(container.querySelectorAll(adSlotSelectors.controls)).some(
        (control) => !heading.contains(control) && !creative.contains(control)
      )
    )
      return null;
    const branches = Array.from(container.children);
    return branches.some((branch) => branch.contains(heading) && !branch.contains(creative)) &&
      branches.some((branch) => branch.contains(creative) && !branch.contains(heading))
      ? container
      : null;
  }
  return null;
}

/** Collect exclusive native ad slots once; successful detection performs no localized-name lookup. */
export function collectStructuralAdSlots(root: Element): Element[] {
  const slots = new Set<Element>();
  for (const disclosure of root.querySelectorAll(adSlotSelectors.disclosures)) {
    const slot = findAdSlot(disclosure, root);
    if (slot) slots.add(slot);
  }
  return Array.from(slots);
}
