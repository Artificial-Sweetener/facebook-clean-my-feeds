// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotContent } from "../core/diagnostics/dom-snapshot";
import { sanitizePathname } from "./location";
import { sharedSelectors } from "../selectors/shared";
import { matchesSponsoredLabel } from "../core/filters/disclosure-labels";

const authored = `${sharedSelectors.authoredContent}, textarea, input, [role="textbox"], [role="log"], [data-lexical-editor]`;
const identity =
  '[data-ad-rendering-role="profile_name"], [data-hovercard], [data-profileid], [data-userid]';
const control =
  'button, [role="button"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="switch"], [role="option"]';
const heading = 'h1, h2, h3, h4, h5, h6, [role="heading"]';
const excluded = "script, style, noscript, template, iframe, object, embed, canvas, foreignObject";

/** Collect only bounded text used to recognize identity strings locally; none of this dictionary is serialized. */
function boundedText(element: Element, maximum = 180): string {
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let text = "";
  let count = 0;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (++count > 24 || text.length > maximum) return "";
    text += node.textContent || "";
  }
  return text.length <= maximum ? text.trim() : "";
}

/** Classify destinations before interpreting their labels; profile/content anchors are never public UI by default. */
export function isInterfaceLink(element: Element): boolean {
  const href = element.getAttribute("href");
  if (!href) return element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby");
  try {
    const url = new URL(href, "https://www.facebook.com/");
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return false;
    if (url.hostname === "meta.ai" || url.hostname.endsWith(".meta.ai")) return true;
    if (!(url.hostname === "facebook.com" || url.hostname.endsWith(".facebook.com"))) return false;
    return (
      /^\/(?:ads\/about|business\/help|help|settings|privacy)(?:\/|$)/.test(url.pathname) ||
      /^\/(?:groups\/discover|friends|reel|stories|watch)\/?$/.test(url.pathname) ||
      (url.searchParams.has("__cft__[0]") &&
        element.closest("h4, h5") !== null &&
        (element.querySelector("svg[aria-label], svg[aria-labelledby], span[aria-labelledby]") !==
          null ||
          matchesSponsoredLabel(element.getAttribute("aria-label") || boundedText(element))))
    );
  } catch {
    return false;
  }
}

/** Recognize ordinary profile navigation without treating arbitrary content or creation links as personal names. */
function isProfileLink(element: Element): boolean {
  if (!element.matches("a[href]") || isInterfaceLink(element)) return false;
  try {
    const url = new URL(element.getAttribute("href") || "", "https://www.facebook.com/");
    return (
      /(^|\.)facebook\.com$/.test(url.hostname) &&
      (url.pathname === "/profile.php" ||
        sanitizePathname(url.pathname).replace(/\/$/, "") === "/[profile]")
    );
  } catch {
    return false;
  }
}

/** Locally remember identity strings and replace them within otherwise useful personalized interface labels. */
export class SnapshotPrivacy {
  private identities = new Set<string>();
  private identityPattern: RegExp | null = null;
  private compiledIdentities = -1;

  /** Derive identity evidence from bounded discovery rather than retaining or hashing private page text. */
  remember(element: Element): void {
    if (this.identities.size >= 500) return;
    if (
      element.matches(identity) ||
      (element.matches("h4 a, h5 a") && !isInterfaceLink(element)) ||
      isProfileLink(element)
    ) {
      const name = boundedText(element);
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

  /** Prefer private provenance over public-control heuristics; unfamiliar ordinary content stays uncertain and redacted. */
  content(element: Element): SnapshotContent {
    if (element.closest(excluded)) return "excluded";
    if (element.closest(authored)) return "authored";
    if (element.closest(identity)) return "identity";
    const link = element.closest("a");
    if (link && !isInterfaceLink(link)) return "identity";
    if (element.closest(control) || element.closest(heading)) return "interface";
    if (link && isInterfaceLink(link)) return "interface";
    return "uncertain";
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

  /** Text provenance controls disclosure; unknown text does not become public just because a detector missed it. */
  text(value: string, content: SnapshotContent): string {
    if (!value.trim()) return "";
    return content === "interface" ? this.interfaceText(value) : `[${content} text]`;
  }
}
