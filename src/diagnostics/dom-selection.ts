// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotLimits, SnapshotRegion } from "../core/diagnostics/dom-snapshot";
import { SnapshotPrivacy } from "./dom-privacy";

/** Candidate collection does not call production post discovery or any content classifier. */
export interface SnapshotSelection {
  regions: Array<{ element: Element; selection: SnapshotRegion["selection"] }>;
  discovered: number;
  seeded: number;
  discoveryComplete: boolean;
  selectionComplete: boolean;
}

/** Cooperatively release the main thread while collecting a user-requested report. */
export function yieldSnapshotWork(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Ignore CMF's controls and prior report text instead of accidentally sampling the reporting interface itself. */
export function isReportUi(element: Element): boolean {
  return element.closest("#fbcmf, #fbcmfToggle") !== null;
}

/** Treat viewport overlap as a sampling priority, never as evidence that a post is an advertisement. */
function visible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top < (view?.innerHeight || 0) &&
    rect.left < (view?.innerWidth || 0)
  );
}

/**
 * Scope an unfamiliar element to nearby structure without requiring a known post layout.
 * @param target User-selected complaint element.
 * @returns Nearest semantic region or bounded wrapper containing related headings and controls.
 */
export function snapshotTargetRegion(target: Element): Element {
  const semantic = target.closest('[role="article"], [aria-posinset], section, [role="region"]');
  if (semantic && !semantic.matches('[role="main"], body, html')) return semantic;
  let region = target;
  let fallback = target;
  for (let depth = 0; depth < 8; depth++) {
    const parent = region.parentElement;
    if (
      !parent ||
      parent.matches(
        'body, html, main, [role="main"], [role="navigation"], [role="dialog"], [role="feed"], [role="banner"]'
      )
    )
      break;
    region = parent;
    if (depth < 3) fallback = region;
    if (
      region.querySelector('h1, h2, h3, h4, h5, h6, [role="heading"]') &&
      region.querySelector('button, [role="button"]')
    )
      return region;
  }
  region = fallback;
  return region;
}

/**
 * Discover independent surfaces, unfamiliar controls and post-like containers with a bounded whole-page walk.
 * @param document Current Facebook document, excluding the settings/report interface.
 * @param target Optional user-selected complaint element, prioritized independently of existing detection.
 * @param limits Work and sample budgets applied before serialization.
 * @param privacy Local identity dictionary populated before any interface text is retained.
 * @returns Prioritized regions and explicit discovery/sampling completeness flags.
 */
export async function selectSnapshotRegions(
  document: Document,
  target: Element | null,
  limits: SnapshotLimits,
  privacy: SnapshotPrivacy
): Promise<SnapshotSelection> {
  let seeded = 0;
  if (target?.isConnected && !isReportUi(target)) {
    const region = snapshotTargetRegion(target);
    for (const scope of [region, region.previousElementSibling, region.nextElementSibling]) {
      if (!scope || isReportUi(scope)) continue;
      const identities = document.createTreeWalker(scope, NodeFilter.SHOW_ELEMENT);
      let identity: Node | null = scope;
      let local = 0;
      while (identity && local++ < limits.nodesPerRegion) {
        if (identity instanceof Element && !isReportUi(identity)) privacy.remember(identity);
        if (++seeded % 128 === 0) await yieldSnapshotWork();
        identity = identities.nextNode();
      }
    }
  }
  const root = document.body || document.documentElement;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    /** Prune CMF's own subtree so copied reports never become input to later reports. */
    acceptNode: (node) =>
      node instanceof Element && isReportUi(node)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT,
  });
  const candidates = new Set<Element>();
  const surfaces: Element[] = [];
  let discovered = 0;
  let node: Node | null = root;
  while (node && discovered < limits.discoveryNodes) {
    if (node instanceof Element && !isReportUi(node)) {
      discovered++;
      privacy.remember(node);
      if (
        node.matches(
          '[role="main"], [role="dialog"], [role="navigation"], [role="complementary"], [role="banner"]'
        )
      )
        surfaces.push(node);
      if (node.matches('[role="article"], [aria-posinset], section, [role="region"]'))
        candidates.add(node);
      if (
        node.matches('button, [role="button"], [role="heading"]') &&
        !node.closest('[role="article"], [aria-posinset]')
      )
        candidates.add(snapshotTargetRegion(node));
    }
    if (discovered > 0 && discovered % 128 === 0) await yieldSnapshotWork();
    node = walker.nextNode();
  }
  for (const surface of surfaces) {
    let branch = surface;
    for (let depth = 0; depth < 8 && branch.children.length === 1; depth++) {
      const child = branch.firstElementChild;
      if (!child || isReportUi(child)) break;
      branch = child;
    }
    for (const child of Array.from(branch.children).slice(0, 128))
      if (!isReportUi(child)) candidates.add(child);
    if (branch.children.length === 0) candidates.add(branch);
  }
  const regions: SnapshotSelection["regions"] = [];
  /** Keep non-overlapping regions in priority order, preserving space for useful neighboring examples. */
  const add = (element: Element | null, selection: SnapshotRegion["selection"]): void => {
    if (
      !element ||
      !element.isConnected ||
      isReportUi(element) ||
      regions.some(
        (region) =>
          region.element === element ||
          region.element.contains(element) ||
          element.contains(region.element)
      )
    )
      return;
    if (regions.length < limits.regions) regions.push({ element, selection });
  };
  if (target?.isConnected && target.ownerDocument === document && !isReportUi(target)) {
    const region = snapshotTargetRegion(target);
    add(region, "target");
    add(region.previousElementSibling, "neighbor");
    add(region.nextElementSibling, "neighbor");
  }
  const inView = Array.from(candidates)
    .filter(visible)
    .sort(
      (left, right) =>
        Number(!!right.closest('main, [role="main"], [role="feed"]')) -
        Number(!!left.closest('main, [role="main"], [role="feed"]'))
    );
  for (const candidate of inView) add(candidate, "viewport");
  for (const candidate of inView.slice(0, 3)) {
    add(candidate.previousElementSibling, "neighbor");
    add(candidate.nextElementSibling, "neighbor");
  }
  for (const candidate of candidates) add(candidate, "surface");
  for (const surface of surfaces) add(surface, "surface");
  if (!regions.length) add(root, "surface");
  return {
    regions,
    discovered,
    seeded,
    discoveryComplete: node === null,
    selectionComplete: Array.from(candidates).every((candidate) =>
      regions.some((region) => region.element.contains(candidate))
    ),
  };
}
