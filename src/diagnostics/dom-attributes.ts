// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotAttributeChange, SnapshotContent } from "../core/diagnostics/dom-snapshot";
import { postAtt } from "../dom/attributes";
import { SnapshotPrivacy } from "./dom-privacy";
import { snapshotDestination } from "./dom-destinations";

const references = new Set([
  "aria-labelledby",
  "aria-describedby",
  "aria-controls",
  "aria-owns",
  "aria-details",
  "aria-activedescendant",
  "for",
  "headers",
]);
const booleans = new Set([
  "hidden",
  "disabled",
  "checked",
  "selected",
  "multiple",
  "open",
  "inert",
  "controls",
  "loop",
  "muted",
  "autoplay",
  "attributionsrc",
]);
const states = new Set([
  "aria-hidden",
  "aria-expanded",
  "aria-selected",
  "aria-checked",
  "aria-disabled",
  "aria-pressed",
  "aria-busy",
  "aria-modal",
  "aria-haspopup",
  "contenteditable",
  "draggable",
  "data-virtualized",
]);
const numbers = new Set([
  "aria-level",
  "aria-posinset",
  "aria-setsize",
  "aria-colcount",
  "aria-rowcount",
  "colspan",
  "rowspan",
  "width",
  "height",
  "tabindex",
]);
const publicMarkers = new Set([
  "data-ad-rendering-role",
  "data-ad-preview",
  "data-ad-comet-preview",
  "data-visualcompletion",
  "data-type",
  "data-testid",
  "data-pagelet",
]);

/** Aliased references carry only report-local IDs; the original strings stay in transient collector memory. */
export interface PendingSnapshotReference {
  original: string;
  id: string;
  priority: number;
}

/** Apply one attribute policy to elements, ancestry shells and external references throughout a report. */
export class SnapshotAttributes {
  private ids = new Map<string, string>();
  private classes = new Map<string, string>();
  private privateNames = new Map<string, string>();
  private destinations = new Map<string, string>();
  private numericIds = new Map<string, string>();
  readonly pending = new Map<string, PendingSnapshotReference>();
  readonly omissions: Record<string, number> = {};
  redacted = 0;
  private attributeReads = 0;
  private textReads: Array<{
    element: Element;
    content: SnapshotContent;
    name: string;
    value: string;
    accessible: boolean;
    privateAtCapture: boolean;
    attributes: Record<string, string>;
    changes: Record<string, SnapshotAttributeChange>;
  }> = [];

  /** Reapply late identity and ancestry evidence only to originally captured text values; never bypass capture budgets. */
  reconcile(deadline: number): void {
    for (const entry of this.textReads) {
      if (performance.now() >= deadline) {
        this.omit("redaction-time-limit");
        break;
      }
      const content =
        !entry.privateAtCapture && entry.element.isConnected
          ? this.privacy.regions.classify(entry.element).content
          : entry.content;
      const safe = this.privacy.text(entry.value, content);
      entry.attributes[entry.name] = entry.accessible ? safe.slice(0, 180) : safe;
      if (entry.attributes[entry.name] !== entry.value) entry.changes[entry.name] = "redacted";
      else delete entry.changes[entry.name];
    }
  }

  /** Keep privacy dictionaries local and share aliases without publishing their reverse mapping. */
  constructor(
    private privacy: SnapshotPrivacy,
    private attributeLimit = 24000,
    private referenceLimit = 64
  ) {}

  /** Expose skipped attribute work explicitly instead of presenting a partial projection as complete. */
  private omit(reason: string, count = 1): void {
    this.omissions[reason] = (this.omissions[reason] || 0) + count;
  }

  /** Stable aliases preserve equality and reference edges only within the current exported report. */
  private alias(value: string, values: Map<string, string>, prefix: string): string {
    let token = values.get(value);
    if (!token) {
      token = `${prefix}${values.size + 1}`;
      values.set(value, token);
    }
    return token;
  }

  /** Record external label dependencies even when their targets are absent or outside the sampled feed. */
  private reference(value: string, priority: number): string {
    const id = this.alias(value, this.ids, "cmf-id-");
    const previous = this.pending.get(value);
    if (!previous && this.pending.size >= this.referenceLimit * 16) {
      this.omit("reference-discovery-limit");
      return id;
    }
    this.pending.set(value, {
      original: value,
      id,
      priority: Math.min(previous?.priority ?? priority, priority),
    });
    return id;
  }

  /** Follow visible-label dependencies before structural ARIA edges, including newly discovered SVG chains. */
  *references(): Generator<PendingSnapshotReference> {
    const visited = new Set<string>();
    while (visited.size < this.pending.size) {
      let next: PendingSnapshotReference | undefined;
      for (const entry of this.pending.values()) {
        if (!visited.has(entry.original) && (!next || entry.priority < next.priority)) next = entry;
      }
      if (!next) return;
      visited.add(next.original);
      yield next;
    }
  }

  /**
   * Project safe attribute semantics and annotate every transformation that affects selector portability.
   * @param element Original node; attribute values are read only and never retained outside aliases or safe projections.
   * @param content Provenance controlling whether accessible-name copy is eligible for retention.
   * @returns Safe attribute values plus transformation categories for the offline inspector.
   */
  read(
    element: Element,
    content: SnapshotContent
  ): { attributes: Record<string, string>; changes: Record<string, SnapshotAttributeChange> } {
    this.privacy.regions.rememberReferences(element);
    const privateAtCapture =
      content !== "interface" &&
      this.privacy.regions.classify(element).redaction?.reason !== "private-reference";
    const attributes: Record<string, string> = {};
    const changes: Record<string, SnapshotAttributeChange> = {};
    const maximum = Math.max(0, Math.min(64, this.attributeLimit - this.attributeReads));
    if (element.attributes.length > maximum)
      this.omit("attribute-limit", element.attributes.length - maximum);
    for (let index = 0; index < Math.min(element.attributes.length, maximum); index++) {
      const attribute = element.attributes.item(index);
      if (!attribute) continue;
      this.attributeReads++;
      let name = attribute.name;
      const value = attribute.value;
      if (!/^[a-z][a-z0-9_.:-]{0,63}$/i.test(name) || this.privacy.interfaceText(name) !== name) {
        name = this.alias(name, this.privateNames, "data-cmf-attribute-");
      }
      if (value.length > 4096) {
        attributes[name] = "";
        changes[name] = "redacted";
        this.omit("attribute-value-limit");
        continue;
      }
      if (name === "id") {
        attributes.id = this.alias(value, this.ids, "cmf-id-");
        changes.id = "alias";
      } else if (name === "class") {
        if (value.trim().split(/\s+/, 129).length > 128) this.omit("class-token-limit");
        attributes.class = value
          .trim()
          .split(/\s+/, 128)
          .filter(Boolean)
          .slice(0, 128)
          .map((token) => this.alias(token, this.classes, "cmf-class-"))
          .join(" ");
        changes.class = "alias";
      } else if (references.has(name)) {
        if (value.trim().split(/\s+/, 33).length > 32) this.omit("reference-token-limit");
        attributes[name] = value
          .trim()
          .split(/\s+/, 32)
          .filter(Boolean)
          .slice(0, 32)
          .map((id) =>
            this.reference(id, name === "aria-labelledby" || name === "aria-describedby" ? 1 : 2)
          )
          .join(" ");
        changes[name] = "alias";
      } else if (booleans.has(name)) {
        attributes[name] = "";
        if (value) changes[name] = "presence";
      } else if (states.has(name)) {
        attributes[name] = [
          "",
          "true",
          "false",
          "mixed",
          "menu",
          "listbox",
          "tree",
          "grid",
          "dialog",
          "plaintext-only",
        ].includes(value)
          ? value
          : "[value]";
        if (attributes[name] === "[value]") changes[name] = "redacted";
      } else if (numbers.has(name)) {
        const number = Number(value);
        attributes[name] = Number.isFinite(number)
          ? String(Math.max(-1, Math.min(9999, Math.trunc(number))))
          : "[number]";
        changes[name] = "bounded";
      } else if (name === "role") {
        attributes.role = this.privacy.interfaceText(value);
        if (attributes.role !== value) changes.role = "redacted";
      } else if (name === "dir" && ["auto", "ltr", "rtl"].includes(value)) {
        attributes.dir = value;
      } else if (name === "lang" && /^[a-z]{2,3}(?:-[a-z0-9]{2,8}){0,3}$/i.test(value)) {
        attributes.lang = value;
      } else if (name === "aria-label" || name === "title") {
        if (value.length > 180) this.omit("accessible-label-limit");
        attributes[name] = this.privacy.accessibleText(value, content).slice(0, 180);
        this.textReads.push({
          element,
          content,
          name,
          value,
          accessible: true,
          privateAtCapture,
          attributes,
          changes,
        });
        if (attributes[name] !== value) changes[name] = "redacted";
      } else if (name === "href" || name === "xlink:href") {
        if (value.startsWith("#") && element.namespaceURI === "http://www.w3.org/2000/svg") {
          attributes[name] = `#${this.reference(value.slice(1), 0)}`;
          changes[name] = "alias";
        } else {
          const destination = snapshotDestination(value, (identifier) =>
            this.alias(identifier, this.numericIds, "900000000")
          );
          attributes[name] = destination.value;
          Object.assign(attributes, destination.facts);
          attributes["data-cmf-link-key"] = this.alias(value, this.destinations, "destination-");
          changes[name] = "route";
        }
      } else if (publicMarkers.has(name)) {
        attributes[name] = this.privacy.interfaceText(value);
        if (attributes[name] !== value) changes[name] = "redacted";
      } else if (
        name === "type" &&
        /^(?:button|submit|reset|checkbox|radio|text|search|email|password|hidden|number|range|date|file)$/.test(
          value
        )
      ) {
        attributes[name] = value;
      } else if (
        name === postAtt ||
        name.startsWith("on") ||
        /(?:^|[-_:])(?:token|session|secret|password|auth|cookie|csrf|userid|profileid|account|tracking)(?:$|[-_:])/i.test(
          name
        ) ||
        [
          "src",
          "srcset",
          "poster",
          "action",
          "formaction",
          "srcdoc",
          "style",
          "value",
          "alt",
          "data",
          "codebase",
          "archive",
        ].includes(name)
      ) {
        attributes[
          name.startsWith("on") ||
          [
            "src",
            "srcset",
            "poster",
            "action",
            "formaction",
            "srcdoc",
            "style",
            "value",
            "alt",
            "data",
            "codebase",
            "archive",
          ].includes(name)
            ? `data-cmf-original-${name.replace(/[^a-z0-9-]/g, "-")}`
            : name
        ] = "";
        changes[name] = "presence";
      } else if (name === "d" || name === "points") {
        attributes[name] = /^[MmZzLlHhVvCcSsQqTtAaEe0-9+.,\s-]*$/.test(value) ? value : "";
        if (attributes[name] !== value) changes[name] = "redacted";
      } else if (
        element.namespaceURI === "http://www.w3.org/2000/svg" &&
        ["viewBox", "x", "y", "cx", "cy", "r", "rx", "ry", "x1", "x2", "y1", "y2"].includes(name)
      ) {
        attributes[name] = /^[-+\d.eE,\s%]+$/.test(value) ? value : "";
        if (attributes[name] !== value) changes[name] = "redacted";
      } else {
        attributes[name] = this.privacy.text(value, content);
        this.textReads.push({
          element,
          content,
          name,
          value,
          accessible: false,
          privateAtCapture,
          attributes,
          changes,
        });
        if (attributes[name] !== value) changes[name] = "redacted";
      }
    }
    this.redacted += Object.keys(changes).length;
    return { attributes, changes };
  }
}
