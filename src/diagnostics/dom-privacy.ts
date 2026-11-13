// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotContent } from "../core/diagnostics/dom-snapshot";
import { diagnosticSelectors as selectors } from "../selectors/diagnostics";
import { SensitiveRegions } from "./sensitive-regions";
import { SensitiveText } from "./sensitive-text";

/**
 * Evidence-first, capture-local redaction: unknown text is retained and only likely sensitive regions are suppressed.
 * Region decisions and private substring replacement are independent of filter vocabulary, layout depths and matches.
 */
export class SnapshotPrivacy {
  readonly regions = new SensitiveRegions();
  readonly labels = new SensitiveText();

  /** Seed full identities and reference relationships without authorizing or suppressing unfamiliar interface copy. */
  remember(element: Element): void {
    this.regions.rememberReferences(element);
    if (!element.matches("a, " + selectors.personalIdentity + ", " + selectors.profile)) return;
    const decision = this.regions.classify(element);
    if (decision.content !== "identity") return;
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let text = "";
    let node: Node | null;
    let count = 0;
    while ((node = walker.nextNode())) {
      if (++count > 128 || text.length > 180) {
        this.labels.identityLimitReached = true;
        return;
      }
      if (node.parentElement && this.regions.classify(node.parentElement).content === "identity")
        text += node.textContent || "";
    }
    this.labels.remember(text);
  }

  /** Apply the region decision to visible copy, preserving unknown labels and reporting redacted categories explicitly. */
  text(value: string, content: SnapshotContent): string {
    if (!value.trim()) return value ? " " : "";
    return content === "interface" ? this.labels.redact(value) : `[${content} text]`;
  }

  /** Accessible names use their actual region, not agreement with a known visible label. */
  accessibleText(value: string, content: SnapshotContent): string {
    return this.text(value, content);
  }

  /** Preserve non-sensitive portions of fragmented labels, including SVG text outside the rendered post. */
  textNode(node: Node, content: SnapshotContent): string {
    if (content !== "interface") return this.text(node.textContent || "", content);
    const parent = node.parentElement;
    const label = parent?.closest(`${selectors.control}, ${selectors.heading}, text`);
    return label ? this.labels.fragment(node, label) : this.labels.redact(node.textContent || "");
  }

  /** Attribute values and marker names share the same narrow substring sanitizer as preserved text. */
  interfaceText(value: string): string {
    return this.labels.redact(value);
  }
}
