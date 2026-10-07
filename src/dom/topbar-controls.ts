// SPDX-License-Identifier: GPL-3.0-only
/** A visible control and the geometry measured during the current layout pass. */
interface MeasuredControl {
  element: Element;
  rect: DOMRect;
}
/** Adjacent controls are grouped to distinguish the right-side account/menu cluster. */
interface ControlCluster {
  controls: MeasuredControl[];
  rightEdge: number;
}
const MIN_CONTROL_SIZE = 28;
const MAX_CONTROL_SIZE = 72;
const MIN_ASPECT_RATIO = 0.75;
const MAX_ASPECT_RATIO = 1.35;
const MAX_CLUSTER_GAP = 24;
const MAX_ROW_OFFSET = 12;
const RECT_MATCH_TOLERANCE = 1;
const topbarControlSelector = 'button, [role="button"], a[aria-label]';

/**
 * Ignore unlaid-out and detached controls whose zero-size rectangles cannot anchor a button.
 */
export function getRect(element: Element | null): DOMRect | null {
  if (!element || typeof element.getBoundingClientRect !== "function") {
    return null;
  }
  const rect = element.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return null;
  }
  return rect;
}

/**
 * Recognize native and Facebook ARIA controls without relying on unstable class names.
 */
export function isInteractiveControl(element: Element | null): boolean {
  if (!element || !element.tagName) {
    return false;
  }
  const tagName = element.tagName.toUpperCase();
  if (tagName === "BUTTON") {
    return true;
  }
  if (element.getAttribute("role") === "button") {
    return true;
  }
  if (element.getAttribute("aria-expanded") !== null) {
    return true;
  }
  if (tagName === "A" && element.getAttribute("aria-label")) {
    return true;
  }
  const tabIndex = element.getAttribute("tabindex");
  return tabIndex !== null && tabIndex !== "-1";
}

/**
 * Treat one-pixel geometry differences as nested wrappers for the same visual control.
 */
export function isSameRect(first: DOMRect, second: DOMRect): boolean {
  return (
    Math.abs(first.left - second.left) <= RECT_MATCH_TOLERANCE &&
    Math.abs(first.top - second.top) <= RECT_MATCH_TOLERANCE &&
    Math.abs(first.width - second.width) <= RECT_MATCH_TOLERANCE &&
    Math.abs(first.height - second.height) <= RECT_MATCH_TOLERANCE
  );
}

/**
 * Keep the first semantic control when several nested elements occupy the same rectangle.
 */
export function dedupeOverlappingControls(controls: MeasuredControl[]): MeasuredControl[] {
  return controls.filter(
    (control, index) =>
      !controls
        .slice(0, index)
        .some((existingControl) => isSameRect(existingControl.rect, control.rect))
  );
}

/**
 * Reject oversized navigation regions and non-square controls outside the banner row.
 * @param element Candidate native or ARIA control whose geometry is inspected.
 * @param bannerRect Visible banner bounds, or null before its first layout.
 * @returns Whether the candidate fits the size, aspect and vertical-overlap constraints.
 */
export function isTopbarControlCandidate(element: Element, bannerRect: DOMRect | null): boolean {
  if (!isInteractiveControl(element)) {
    return false;
  }
  const rect = getRect(element);
  if (!rect) {
    return false;
  }
  if (
    rect.width < MIN_CONTROL_SIZE ||
    rect.height < MIN_CONTROL_SIZE ||
    rect.width > MAX_CONTROL_SIZE ||
    rect.height > MAX_CONTROL_SIZE
  ) {
    return false;
  }
  const aspectRatio = rect.width / rect.height;
  if (aspectRatio < MIN_ASPECT_RATIO || aspectRatio > MAX_ASPECT_RATIO) {
    return false;
  }
  if (!bannerRect) {
    return true;
  }
  return rect.bottom > bannerRect.top && rect.top < bannerRect.bottom;
}

/**
 * Group nearby controls on one row so central navigation does not displace the account cluster.
 * @param controls Visible controls sorted from left to right.
 * @returns Ordered geometry clusters with the right edge cached for ranking.
 */
export function buildControlClusters(controls: MeasuredControl[]): ControlCluster[] {
  const clusters: ControlCluster[] = [];
  controls.forEach((control) => {
    const currentCluster = clusters[clusters.length - 1];
    if (!currentCluster) {
      clusters.push({
        controls: [control],
        rightEdge: control.rect.right,
      });
      return;
    }

    const previous = currentCluster.controls[currentCluster.controls.length - 1];
    if (!previous) return;
    const gap = control.rect.left - previous.rect.right;
    const sameRow = Math.abs(control.rect.top - previous.rect.top) <= MAX_ROW_OFFSET;
    const similarHeight = Math.abs(control.rect.height - previous.rect.height) <= MAX_ROW_OFFSET;
    if (sameRow && similarHeight && gap >= -1 && gap <= MAX_CLUSTER_GAP) {
      currentCluster.controls.push(control);
      currentCluster.rightEdge = control.rect.right;
      return;
    }

    clusters.push({
      controls: [control],
      rightEdge: control.rect.right,
    });
  });
  return clusters;
}

/**
 * Locate the rightmost cluster of account controls using geometry rather than localized labels.
 * @param root Page or isolated DOM subtree containing the banner.
 * @returns Controls in left-to-right order from the highest-priority cluster.
 */
export function getTopbarControlButtons(root: ParentNode | null = document): Element[] {
  if (!root || typeof root.querySelector !== "function") {
    return [];
  }
  const banner = root.querySelector('[role="banner"]');
  if (!banner) {
    return [];
  }

  const bannerRect = getRect(banner);
  const controls = dedupeOverlappingControls(
    Array.from(new Set(Array.from(banner.querySelectorAll(topbarControlSelector))))
      .filter((control) => isTopbarControlCandidate(control, bannerRect))
      .map((control) => ({
        element: control,
        rect: getRect(control),
      }))
      .filter((control): control is MeasuredControl => control.rect !== null)
      .sort((a, b) => a.rect.left - b.rect.left)
  );

  if (controls.length === 0) {
    return [];
  }

  const clusters = buildControlClusters(controls);
  const candidateClusters = clusters.some((cluster) => cluster.controls.length > 1)
    ? clusters.filter((cluster) => cluster.controls.length > 1)
    : clusters;
  candidateClusters.sort(
    (a, b) => b.rightEdge - a.rightEdge || b.controls.length - a.controls.length
  );

  return candidateClusters[0]?.controls.map((control) => control.element) ?? [];
}

/**
 * Choose the leftmost member of the selected account cluster as the insertion anchor.
 */
export function getTopbarMenuButton(root: ParentNode | null = document): Element | null {
  const controls = getTopbarControlButtons(root);
  return controls[0] ?? null;
}

/**
 * Check current cluster membership after Facebook replaces or relays out its topbar.
 */
export function isTopbarControlButton(
  element: Element | null,
  root: ParentNode | null = document
): boolean {
  return getTopbarControlButtons(root).some((control) => control === element);
}
