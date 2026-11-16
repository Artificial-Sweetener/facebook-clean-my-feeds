// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../dom/post-evidence";
import { sharedSelectors } from "../selectors/shared";

// Observed in Facebook author headings on 2026-11-14; exact geometry avoids confusing other badges with verification.
const verifiedPath =
  "M7.198.34a.88.88 0 0 1 1.164.38l.623 1.175 1.311.23a.88.88 0 0 1 .72.99l-.187 1.318.925.956a.88.88 0 0 1 0 1.224l-.925.957.186 1.317a.88.88 0 0 1-.719.99l-1.31.23-.625 1.176a.88.88 0 0 1-1.163.378l-1.196-.584-1.196.584a.88.88 0 0 1-1.164-.378l-.623-1.176-1.311-.23a.88.88 0 0 1-.72-.99l.187-1.317-.925-.957a.88.88 0 0 1 0-1.224l.925-.956-.187-1.318a.88.88 0 0 1 .72-.99l1.31-.23L3.643.72A.88.88 0 0 1 4.806.34l1.196.584L7.198.341zm1.656 4.764a.5.5 0 1 0-.708-.708L5.25 7.293 3.854 5.896a.5.5 0 1 0-.708.708L4.543 8a1 1 0 0 0 1.414 0l2.897-2.896z";

/**
 * Recognize the observed verification glyph without reading an accessible name or translated title.
 * Caller supplies author-header ownership; unfamiliar artwork falls through to semantic detection.
 * @param icon Candidate SVG in the owning author heading.
 * @param post Post scope sharing cached queries with the localized fallback.
 * @returns Whether the complete single-path geometry and coordinate system identify the known badge.
 */
export function hasVerifiedGeometry(icon: Element, post: Element): boolean {
  if (icon.getAttribute("viewBox")?.trim().replace(/\s+/g, " ") !== "0 0 12 12") return false;
  const evidence = getPostEvidence(post);
  const geometry = evidence.select(sharedSelectors.svgShapes, icon);
  const shape = geometry[0];
  if (!shape || shape.closest(sharedSelectors.svgDefinition)) return false;
  let ancestor: Element | null = shape;
  while (ancestor && ancestor !== icon) {
    if (!evidence.isVisible(ancestor)) return false;
    ancestor = ancestor.parentElement;
  }
  return (
    geometry.length === 1 &&
    geometry[0]?.localName === "path" &&
    geometry[0].getAttribute("d")?.trim().replace(/\s+/g, " ") === verifiedPath
  );
}
