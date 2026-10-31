// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotContent } from "../core/diagnostics/dom-snapshot";
import { diagnosticSelectors as selectors } from "../selectors/diagnostics";
import { translations } from "../i18n";
import { readSvgText } from "../dom/svg-text";
import {
  boundedLabel,
  MetadataContext,
  isProfileDestination,
  metadataDestination,
  metadataPost,
} from "./metadata-context";

/** Compare fixed fallback copy outside structurally established metadata areas across every supported locale. */
function normalizeLabel(value: string): string {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("en-US");
}

const fixedLabels = new Set(
  Object.values(translations).flatMap((catalog) =>
    Object.values(catalog).flatMap((value) =>
      (Array.isArray(value) ? value : [value])
        .filter((label): label is string => typeof label === "string" && label.trim() !== "")
        .map(normalizeLabel)
    )
  )
);

/** Gather private author copy without incorrectly teaching the sanitizer that adjacent action labels are names. */
function identityLabel(element: Element): string | null {
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let text = "";
  let count = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (++count > 128 || text.length > 180) return null;
    const action = node.parentElement?.closest('button, [role="button"]');
    if (!action || action === element) text += node.textContent || "";
  }
  return text.length <= 180 ? text.trim() : null;
}

/** Own source-local identity scrubbing and structural public provenance for one automatically redacted capture. */
export class SnapshotPrivacy {
  readonly metadataText = new Map<Element, string>();
  private privateGraphics = new Set<Element>();
  private metadata = new MetadataContext();
  private identities = new Set<string>();
  private identityPattern: RegExp | null = null;
  private compiledIdentities = -1;

  /** Identify actual author/profile links separately from post-header timestamps, disclosures and action controls. */
  private identityLink(link: Element): boolean {
    if (link.closest(selectors.identity)) return true;
    if (this.metadata.control(link)) return false;
    return isProfileDestination(link) || !this.interfaceLink(link);
  }

  /** Product navigation and independently established metadata can retain novel labels without a filter match. */
  private interfaceLink(link: Element): boolean {
    if (this.metadata.control(link)) return true;
    const url = metadataDestination(link);
    return (
      !!url &&
      (/^\/(?:ads\/about|business\/help|help|settings|privacy)(?:\/|$)/.test(url.pathname) ||
        /^\/(?:groups\/discover|friends|reel|stories|watch)\/?$/.test(url.pathname))
    );
  }

  /** Only metadata controls may authorize external accessible-label text; arbitrary UI references remain private. */
  publicReferenceSource(element: Element): boolean {
    return this.metadata.control(element) !== null;
  }

  /**
   * Retain local SVG text referenced by structural metadata, independently of recognized ad wording.
   * Complete text is checked for private substrings before individual fragments receive public provenance.
   * @param element Candidate metadata link/button, read without modifying it or its referenced definitions.
   */
  rememberMetadataGraphics(element: Element): void {
    if (
      !element.matches(selectors.control) ||
      this.metadataText.size >= 256 ||
      !this.metadata.control(element)
    )
      return;
    const post = metadataPost(element);
    if (!post) return;
    for (const graphic of Array.from(element.querySelectorAll("svg")).slice(0, 16)) {
      if (graphic.closest(selectors.control) !== element) continue;
      const resolved = readSvgText(graphic, post);
      if (!resolved) continue;
      const privateCopy =
        this.interfaceText(resolved.text) !==
        resolved.text.normalize("NFKC").replace(/\s+/g, " ").trim();
      for (const target of resolved.textElements) {
        if (this.metadataText.size >= 256) break;
        if (this.metadataText.has(target)) continue;
        this.metadataText.set(target, this.directText(target));
        if (privateCopy) this.privateGraphics.add(target);
      }
    }
  }

  /** Record exact direct copy so a reference replaced during cooperative capture loses its earlier public provenance. */
  private directText(element: Element): string {
    return Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent || "")
      .join("");
  }

  /** Learn names only from identity-bearing structure; arbitrary metadata links must never poison the name dictionary. */
  remember(element: Element): void {
    if (this.identities.size >= 500) return;
    if (
      element.matches(selectors.identity) ||
      (element.matches("a[href]") && this.identityLink(element))
    ) {
      const name = identityLabel(element);
      if (name) {
        this.identities.add(name);
        const parts = name.split(/\s+/);
        if (parts.length <= 4)
          for (const part of parts)
            if (part.length >= 3 && this.identities.size < 500) this.identities.add(part);
      }
    }
    if (element.matches("img[alt]")) {
      const alt = element.getAttribute("alt") || "";
      if (alt && alt.length <= 180) this.identities.add(alt);
    }
  }

  /**
   * Prefer authored/identity boundaries, then structural metadata, then fixed-copy fallbacks for other UI.
   * @param element Source element, whose role and author/body relationship establish provenance without a filter result.
   * @returns Privacy category for both text and accessible attributes; ambiguous content remains explicitly redacted.
   */
  content(element: Element): SnapshotContent {
    if (element.closest(selectors.excluded)) return "excluded";
    if (element.closest(selectors.authored)) return "authored";
    if (this.metadata.independentAction(element)) return "interface";
    if (element.closest(selectors.identity)) return "identity";
    const referenced = this.metadataText.get(element);
    if (referenced !== undefined && referenced === this.directText(element)) return "interface";
    const link = element.closest("a");
    if (link && this.identityLink(link)) return "identity";
    if (this.metadata.control(element)) return "interface";
    const labelOwner = element.closest(`${selectors.control}, ${selectors.heading}`);
    if (labelOwner) {
      const text = boundedLabel(labelOwner);
      const label = labelOwner.getAttribute("aria-label");
      if (
        ((text && fixedLabels.has(normalizeLabel(text))) ||
          (!text && label && fixedLabels.has(normalizeLabel(label)))) &&
        (!label || !text || normalizeLabel(label) === normalizeLabel(text))
      )
        return "interface";
    }
    return "uncertain";
  }

  /**
   * Accessible attributes establish their own provenance; a harmless caption cannot authorize a conflicting private title.
   * @param element Source control or descendant, classified through the same structural boundaries as visible copy.
   * @param value Attribute copy, sanitized before serialization.
   * @param content Existing boundary category; authored and identity regions cannot be upgraded here.
   * @param attribute Only an otherwise unnamed metadata control may publish a novel standalone aria-label.
   * @returns Public copy with private substrings removed, or a redaction placeholder.
   */
  accessibleText(
    element: Element,
    value: string,
    content: SnapshotContent,
    attribute: "aria-label" | "title"
  ): string {
    if (content !== "interface") return this.text(value, content);
    const text = boundedLabel(element);
    const sameCopy = text !== null && !!text && normalizeLabel(text) === normalizeLabel(value);
    const publicLabel =
      sameCopy ||
      fixedLabels.has(normalizeLabel(value)) ||
      (attribute === "aria-label" && !text && this.metadata.control(element) !== null);
    return this.text(value, publicLabel ? "interface" : "uncertain");
  }

  /**
   * Scrub complete fragmented labels before exporting pieces so split names, email addresses and phone numbers cannot escape.
   * @param node Captured text node; no private whole-label text is retained in the report.
   * @param content Already established boundary provenance.
   * @returns Sanitized fragment, conservatively suppressed when a multi-node label contains private copy.
   */
  textNode(node: Node, content: SnapshotContent): string {
    const value = node.textContent || "";
    if (content !== "interface") return this.text(value, content);
    if (!value.trim()) return value ? " " : "";
    const parent = node.parentElement;
    if (parent && this.privateGraphics.has(parent)) return "[redacted interface fragment]";
    const control = parent ? this.metadata.control(parent) : null;
    const whole = control ? this.metadata.label(control) : null;
    if (
      whole !== null &&
      whole !== value.trim() &&
      this.interfaceText(whole) !== whole.normalize("NFKC").replace(/\s+/g, " ").trim()
    )
      return "[redacted interface fragment]";
    return `${/^\s/u.test(value) ? " " : ""}${this.interfaceText(value)}${/\s$/u.test(value) ? " " : ""}`;
  }

  /**
   * Retain novel interface words while removing observed names, addresses, contact details and opaque identifiers.
   * @param value Candidate public interface copy, never an authored-content source allowed to bypass provenance checks.
   * @returns Normalized interface copy with private substrings replaced by explicit category placeholders.
   */
  interfaceText(value: string): string {
    let text = value
      .normalize("NFKC")
      .replace(/(?:https?:\/\/|www\.)[^\s<>]+/giu, "[destination]")
      .replace(/[\w.+-]+@[\w.-]+\.[\p{L}]{2,}/gu, "[email]")
      .replace(/(?:\+?\d[\d\s().-]{6,}\d)/g, "[number]");
    if (this.compiledIdentities !== this.identities.size) {
      const escaped = Array.from(this.identities)
        .sort((left, right) => right.length - left.length)
        .map((name) =>
          name
            .normalize("NFKC")
            .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            .replace(/\s+/g, "\\s+")
        );
      this.identityPattern = escaped.length ? new RegExp(escaped.join("|"), "giu") : null;
      this.compiledIdentities = this.identities.size;
    }
    if (this.identityPattern) text = text.replace(this.identityPattern, "[identity]");
    return text
      .replace(/(?:https?:\/\/|www\.)[^\s<>]+/giu, "[destination]")
      .replace(/[\w.+-]+@[\w.-]+\.[\p{L}]{2,}/gu, "[email]")
      .replace(/(?:\+?\d[\d\s().-]{6,}\d)/g, "[number]")
      .replace(/\b[\w-]{28,}\b/g, "[identifier]")
      .split("")
      .filter(
        (character) =>
          character.charCodeAt(0) >= 32 || [9, 10, 13].includes(character.charCodeAt(0))
      )
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Only structurally public text reaches the sanitizer; authored and identity boundaries remain placeholders. */
  text(value: string, content: SnapshotContent): string {
    if (!value.trim()) return "";
    if (content !== "interface") return `[${content} text]`;
    return this.interfaceText(value);
  }
}
