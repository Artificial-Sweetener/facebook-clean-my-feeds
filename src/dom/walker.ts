// SPDX-License-Identifier: GPL-3.0-only
import { cleanText } from "../core/filters/text-normalize";

import { postAtt } from "./attributes";

/**
 * Count only structural text containers used by the button-noise heuristic.
 */
export function countDescendants(element: Element): number {
  return element.querySelectorAll("div, span").length;
}

/**
 * Exclude descendants already handled as a separate hidden CMF feature.
 */
export function isNestedMarkedNode(
  node: Element | null | undefined,
  root: Element | null
): boolean {
  if (!node || !root || typeof node.closest !== "function") {
    return false;
  }

  const markedAncestor = node.closest(`[${postAtt}]`);
  return !!markedAncestor && markedAncestor !== root;
}

/**
 * Collect visible filtering text while excluding nested marked content and button noise.
 * @param node Post content root; only immediate div, blockquote and span branches are scanned.
 * @returns Deduplicated nonempty text fragments in discovery order.
 */
export function scanTreeForText(node: Element): string[] {
  const arrayTextValues: string[] = [];
  const elements = node.querySelectorAll(":scope > div, :scope > blockquote, :scope > span");

  for (const element of elements) {
    if (isNestedMarkedNode(element, node)) {
      continue;
    }

    if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "false") {
      continue;
    }

    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let currentNode;
    while ((currentNode = walk.nextNode())) {
      const elParent = currentNode.parentElement;
      if (!elParent) continue;
      const elParentTN = elParent.tagName.toLowerCase();
      const val = cleanText(currentNode.textContent ?? "").trim();

      if (isNestedMarkedNode(elParent, node)) {
        continue;
      }

      if (val === "" || val.toLowerCase() === "facebook") {
        continue;
      }

      if (elParent.hasAttribute("aria-hidden") && elParent.getAttribute("aria-hidden") === "true") {
        continue;
      }

      if (
        elParentTN === "div" &&
        elParent.hasAttribute("role") &&
        elParent.getAttribute("role") === "button"
      ) {
        if (elParent.parentElement && elParent.parentElement.tagName.toLowerCase() !== "object") {
          continue;
        }
      }

      if (elParentTN === "title") {
        continue;
      }

      const elGeneric = elParent.closest('div[role="button"]');
      const elGenericDescendantsCount = elGeneric ? countDescendants(elGeneric) : 0;
      if (elGenericDescendantsCount < 2 && val.length > 1) {
        arrayTextValues.push(...val.split("\n"));
      }
    }
  }

  return [...new Set(arrayTextValues)];
}

/**
 * Use marketplace-wide text traversal with lowercase signals for its simpler layout.
 * @param node Listing root whose descendant text nodes are inspected.
 * @returns Ordered lowercase text fragments, retaining duplicates for historical matching.
 */
export function mpScanTreeForText(node: Element): string[] {
  const arrayTextValues: string[] = [];
  let currentNode;
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);

  while ((currentNode = walk.nextNode())) {
    const val = cleanText(currentNode.textContent ?? "").trim();
    if (val !== "" && val.length > 1 && val.toLowerCase() !== "facebook") {
      arrayTextValues.push(val.toLowerCase());
    }
  }

  return arrayTextValues;
}

/**
 * Use loaded content images as fallback text while excluding icons and nested CMF features.
 */
export function scanImagesForAltText(node: Element): string[] {
  const arrayAltTextValues: string[] = [];
  const images = node.querySelectorAll<HTMLImageElement>("img[alt]");
  for (const img of images) {
    if (isNestedMarkedNode(img, node)) {
      continue;
    }

    if (img.alt.length > 0 && img.naturalWidth > 32) {
      const altText = cleanText(img.alt);
      if (!arrayAltTextValues.includes(altText)) {
        arrayAltTextValues.push(altText);
      }
    }
  }

  return arrayAltTextValues;
}

/**
 * Bound expensive content traversal to a feed-specific number of matched blocks.
 * @param post Post root whose already-hidden descendants must be ignored.
 * @param selector Feed-owned selectors for content blocks.
 * @param maxBlocks Maximum matching blocks visited in document order.
 * @returns Nonempty text and image-description fragments in discovery order.
 */
export function extractTextContent(post: Element, selector: string, maxBlocks: number): string[] {
  const blocks = post.querySelectorAll(selector);
  const arrayTextValues: string[] = [];

  for (let b = 0; b < Math.min(maxBlocks, blocks.length); b++) {
    const block = blocks[b];
    if (!block) continue;
    if (isNestedMarkedNode(block, post)) {
      continue;
    }

    if (countDescendants(block) > 0) {
      arrayTextValues.push(...scanTreeForText(block));
      arrayTextValues.push(...scanImagesForAltText(block));
    }
  }

  return arrayTextValues.filter((item) => item !== "");
}
