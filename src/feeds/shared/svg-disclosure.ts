// SPDX-License-Identifier: GPL-3.0-only

import { matchesSponsoredLabel } from "../../core/filters/disclosure-labels";
import { ownsPostElement } from "../../dom/ownership";
import { facebookUrl, getPostEvidence, PostEvidence } from "../../dom/post-evidence";
import { readSvgText } from "../../dom/svg-text";
import type { SvgText } from "../../dom/svg-text";
import { getNewsBlocks } from "./blocks";

const cache = new WeakMap<PostEvidence, WeakMap<Element, SvgText | null>>();

/**
 * Recognize exact all-locale sponsorship copy rendered through an owned tracked header SVG.
 * Tracking length is irrelevant once a complete sponsorship label is established. Ordinary times,
 * authored illustrations, nested posts and controls with conflicting accessible names remain unmatched.
 * @param control Candidate Facebook link whose graphic may reference external local SVG definitions.
 * @param post Concrete owning post; semantic header/body boundaries keep creative text independent.
 * @returns Proven public disclosure copy and its contributing text nodes, or null without sufficient evidence.
 */
export function getSvgDisclosure(control: Element, post: Element): SvgText | null {
  if (!control.querySelector("svg")) return null;
  const evidence = getPostEvidence(post);
  let results = cache.get(evidence);
  if (!results) {
    results = new WeakMap();
    cache.set(evidence, results);
  }
  if (results.has(control)) return results.get(control) || null;
  const url = facebookUrl(control);
  const blocks = getNewsBlocks(post);
  const name = control.getAttribute("aria-label");
  let result: SvgText | null = null;
  if (
    control.matches("a[href]") &&
    url?.searchParams.get("__cft__[0]") &&
    !url.pathname.startsWith("/groups/") &&
    !url.searchParams.has("section_header_type") &&
    !control.hasAttribute("aria-labelledby") &&
    (!name || matchesSponsoredLabel(name)) &&
    (control.closest("h4, h5") || blocks[0]?.contains(control)) &&
    ownsPostElement(control, post, { bodies: blocks.slice(1) }) &&
    evidence.isRendered(control)
  ) {
    for (const graphic of evidence.select("svg", control).slice(0, 16)) {
      if (
        graphic.closest('a, button, [role="button"], [role="link"]') !== control ||
        !evidence.isRendered(graphic) ||
        graphic.hasAttribute("aria-labelledby")
      )
        continue;
      const graphicName = graphic.getAttribute("aria-label");
      if (graphicName && !matchesSponsoredLabel(graphicName)) continue;
      const resolved = readSvgText(graphic, post);
      if (resolved && matchesSponsoredLabel(resolved.text)) {
        result = resolved;
        break;
      }
    }
  }
  results.set(control, result);
  return result;
}
