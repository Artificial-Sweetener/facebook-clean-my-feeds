// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence, PostEvidence } from "./post-evidence";
import { sharedSelectors } from "../selectors/shared";

/** Resolved rendered copy retains its exact text-bearing nodes for privacy-aware snapshot capture. */
export interface SvgText {
  text: string;
  textElements: Element[];
}

const cache = new WeakMap<PostEvidence, WeakMap<Element, SvgText | null>>();
const svgNamespace = "http://www.w3.org/2000/svg";
const supportedTags = new Set(["svg", "g", "symbol", "use", "text", "tspan"]);

/**
 * Read a bounded SVG instance, following only fragment references in its own document.
 * Definition ancestors may be offscreen or accessibility-hidden; visibility of the painted instance
 * is checked by its caller. Individual hidden branches contribute no text. Cycles, foreign markup,
 * missing definitions and exhausted budgets fail closed rather than returning a partial label.
 * @param graphic Visible SVG instance owned by the caller's metadata control.
 * @param post Post scope receiving invalidations for every reference, including missing targets.
 * @returns Complete rendered text and its contributing element parents, or null for incomplete evidence.
 */
export function readSvgText(graphic: Element, post: Element): SvgText | null {
  const evidence = getPostEvidence(post);
  let results = cache.get(evidence);
  if (!results) {
    results = new WeakMap();
    cache.set(evidence, results);
  }
  if (results.has(graphic)) return results.get(graphic) || null;
  const active = new Set<Element>();
  const textElements = new Set<Element>();
  let nodes = 0;
  let characters = 0;
  const control = graphic.closest('a, button, [role="button"], [role="link"]');

  /**
   * Expand complete instance branches without reading HTML, unrelated posts or authored definitions.
   * @param element Current instance or referenced SVG subtree within the shared traversal budget.
   * @param depth Combined child/reference depth; excessive indirection cannot monopolize a feed scan.
   * @returns Complete branch copy, an empty string for concealed branches, or null for incomplete evidence.
   */
  function read(element: Element, depth: number): string | null {
    if (
      ++nodes > 128 ||
      depth > 24 ||
      active.has(element) ||
      element.namespaceURI !== svgNamespace ||
      !supportedTags.has(element.localName)
    )
      return null;
    if (!evidence.isPainted(element)) return "";
    if (element.closest(`${sharedSelectors.authoredContent}, ${sharedSelectors.profileName}`))
      return null;
    const owner = element.closest(sharedSelectors.postOwner);
    const ownerControl = element.closest('a, button, [role="button"], [role="link"]');
    if ((owner && owner !== post) || (ownerControl && ownerControl !== control)) return null;
    active.add(element);
    let text = "";
    if (element.localName === "use") {
      const href = element.getAttribute("href") ?? element.getAttribute("xlink:href");
      if (!href || !/^#[^\s#]{1,512}$/.test(href)) return null;
      const target = evidence.referenceTarget(href.slice(1));
      if (!target) return null;
      const resolved = read(target, depth + 1);
      if (resolved === null) return null;
      text = resolved;
    } else {
      for (const child of Array.from(element.childNodes)) {
        if (++nodes > 128) return null;
        if (child instanceof Element) {
          const resolved = read(child, depth + 1);
          if (resolved === null) return null;
          text += resolved;
        } else if (child.nodeType === Node.TEXT_NODE) {
          const value = child.textContent || "";
          if (value.trim() && !["text", "tspan"].includes(element.localName)) return null;
          if (["text", "tspan"].includes(element.localName)) {
            characters += value.length;
            if (characters > 256) return null;
            text += value;
            textElements.add(element);
          }
        }
      }
    }
    active.delete(element);
    return text;
  }
  const text = read(graphic, 0);
  const result = text?.trim() ? { text, textElements: Array.from(textElements) } : null;
  results.set(graphic, result);
  return result;
}
