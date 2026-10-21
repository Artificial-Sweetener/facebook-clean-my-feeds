// SPDX-License-Identifier: GPL-3.0-only

import type { SnapshotAttributeChange, SnapshotContent } from "../core/diagnostics/dom-snapshot";
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
const roles = new Set(
  "article banner button checkbox columnheader combobox complementary contentinfo definition dialog document feed figure form generic grid gridcell group heading img link list listbox listitem log main marquee math menu menubar menuitem menuitemcheckbox menuitemradio navigation none note option paragraph presentation progressbar radio radiogroup region row rowgroup rowheader scrollbar search searchbox separator slider spinbutton status strong subscript suggestion superscript switch tab table tablist tabpanel term textbox time timer toolbar tooltip tree treegrid treeitem comment".split(
    " "
  )
);
const publicMarkers = new Set([
  "data-ad-rendering-role",
  "data-ad-preview",
  "data-ad-comet-preview",
  "data-visualcompletion",
  "data-type",
]);

/** Aliased references carry only report-local IDs; the original strings stay in transient collector memory. */
export interface PendingSnapshotReference {
  original: string;
  id: string;
  interfaceLabel: boolean;
}

/** Apply one attribute policy to elements, ancestry shells and external references throughout a report. */
export class SnapshotAttributes {
  private ids = new Map<string, string>();
  private classes = new Map<string, string>();
  private privateNames = new Map<string, string>();
  readonly pending = new Map<string, PendingSnapshotReference>();
  readonly omissions: Record<string, number> = {};
  redacted = 0;
  private attributeReads = 0;

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
  private reference(value: string, interfaceLabel: boolean): string {
    const id = this.alias(value, this.ids, "cmf-id-");
    const previous = this.pending.get(value);
    if (!previous && this.pending.size >= this.referenceLimit) {
      this.omit("reference-limit");
      return id;
    }
    this.pending.set(value, {
      original: value,
      id,
      interfaceLabel: interfaceLabel || previous?.interfaceLabel === true,
    });
    return id;
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
      if (!/^[a-z][a-z0-9_.:-]{0,63}$/.test(name) || this.privacy.interfaceText(name) !== name) {
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
        if (value.trim().split(/\s+/, 33).length > 32) this.omit("class-token-limit");
        attributes.class = value
          .trim()
          .split(/\s+/, 32)
          .filter(Boolean)
          .slice(0, 32)
          .map((token) => this.alias(token, this.classes, "cmf-class-"))
          .join(" ");
        changes.class = "alias";
      } else if (references.has(name)) {
        if (value.trim().split(/\s+/, 9).length > 8) this.omit("reference-token-limit");
        attributes[name] = value
          .trim()
          .split(/\s+/, 8)
          .filter(Boolean)
          .slice(0, 8)
          .map((id) =>
            this.reference(id, content === "interface" && /labelledby|describedby/.test(name))
          )
          .join(" ");
        changes[name] = "alias";
      } else if (booleans.has(name)) {
        attributes[name] = "";
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
        attributes.role = roles.has(value) ? value : "[role]";
        if (attributes.role === "[role]") changes.role = "redacted";
      } else if (name === "dir" && ["auto", "ltr", "rtl"].includes(value)) {
        attributes.dir = value;
      } else if (name === "lang" && /^[a-z]{2,3}(?:-[a-z0-9]{2,8}){0,3}$/i.test(value)) {
        attributes.lang = value;
      } else if (["aria-label", "title"].includes(name)) {
        attributes[name] = this.privacy.text(value, content).slice(0, 180);
        if (attributes[name] !== value) changes[name] = "redacted";
      } else if (name === "href" || name === "xlink:href") {
        if (value.startsWith("#") && element.namespaceURI === "http://www.w3.org/2000/svg") {
          attributes[name] = `#${this.reference(value.slice(1), false)}`;
          changes[name] = "alias";
        } else {
          const destination = snapshotDestination(value);
          attributes[name] = destination.value;
          Object.assign(attributes, destination.facts);
          changes[name] = "route";
        }
      } else if (
        publicMarkers.has(name) &&
        /^[a-z][a-z_-]{0,63}$/.test(value) &&
        this.privacy.interfaceText(value) === value
      ) {
        attributes[name] = value;
      } else if (
        name === "type" &&
        /^(?:button|submit|reset|checkbox|radio|text|search|email|password|hidden|number|range|date|file)$/.test(
          value
        )
      ) {
        attributes[name] = value;
      } else {
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
            "d",
            "points",
          ].includes(name)
            ? `data-cmf-original-${name.replace(/[^a-z0-9-]/g, "-")}`
            : name
        ] = "";
        changes[name] = "presence";
      }
    }
    this.redacted += Object.keys(changes).length;
    return { attributes, changes };
  }
}
