// SPDX-License-Identifier: GPL-3.0-only

import type {
  SnapshotElement,
  SnapshotLayout,
  SnapshotLimits,
  SnapshotNode,
  SnapshotText,
} from "../core/diagnostics/dom-snapshot";
import { SnapshotPrivacy } from "./dom-privacy";
import { SnapshotAttributes } from "./dom-attributes";
import { isReportUi, yieldSnapshotWork } from "./dom-selection";

/** Quantize potentially unstable geometry and bound values before exporting them. */
function dimension(value: number): number {
  return Number.isFinite(value)
    ? Math.max(-100000, Math.min(100000, Math.round(value / 4) * 4))
    : 0;
}

/**
 * Capture only rendering facts useful for interpreting controls and hidden decoys, without copying arbitrary CSS.
 * @param element Original page element whose quantized geometry and public rendering state are sampled.
 * @returns Bounded viewport coordinates, rendering properties and explicit ancestor concealment evidence.
 */
function layout(element: Element): SnapshotLayout {
  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;
  const style = view?.getComputedStyle(element);
  let ancestor = element.parentElement;
  let concealedByAncestor = false;
  for (let depth = 0; ancestor && depth < 40; depth++, ancestor = ancestor.parentElement) {
    if (
      ancestor.matches('[hidden], [aria-hidden="true"]') ||
      ancestor.getAttribute("style")?.match(/display\s*:\s*none|visibility\s*:\s*hidden/i)
    ) {
      concealedByAncestor = true;
      break;
    }
  }
  return {
    x: dimension(rect.x),
    y: dimension(rect.y),
    width: dimension(rect.width),
    height: dimension(rect.height),
    display: style?.display || "unknown",
    visibility: style?.visibility || "unknown",
    position: style?.position || "unknown",
    order: style?.order || "0",
    direction: style?.direction || "unknown",
    inViewport:
      rect.width > 0 &&
      rect.height > 0 &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top < (view?.innerHeight || 0) &&
      rect.left < (view?.innerWidth || 0),
    concealedByAncestor,
  };
}

/** Own a single capture's aliases, provenance decisions and cooperative traversal budgets. */
export class DomCapture {
  readonly privacy = new SnapshotPrivacy();
  readonly attributes = new SnapshotAttributes(
    this.privacy,
    this.limits.attributes,
    this.limits.references
  );
  readonly captured = new Map<Element, SnapshotElement>();
  readonly omissions: Record<string, number> = {};
  nodes = 0;
  labels = 0;
  redacted = 0;
  private nextRef = 0;
  private customTags = new Map<string, string>();
  private layouts = new WeakMap<Element, SnapshotLayout>();
  private elementSources = new Map<SnapshotElement, Element>();
  private textSources = new Map<SnapshotText, Node>();

  /** Capture budgets are immutable for the lifetime of a report generation request. */
  constructor(
    readonly limits: SnapshotLimits,
    private measureLayout = true,
    private deadline = Infinity
  ) {}

  /** Bound unknown custom tag names while retaining equality and sibling structure through local aliases. */
  private tag(element: Element): string {
    if (!element.localName.includes("-") && /^[a-z][a-z0-9]{0,24}$/i.test(element.localName))
      return element.localName;
    let tag = this.customTags.get(element.localName);
    if (!tag) {
      tag = `cmf-element-${this.customTags.size + 1}`;
      this.customTags.set(element.localName, tag);
    }
    return tag;
  }

  /** Count every structural gap so a partial capture cannot be mistaken for a complete DOM. */
  omit(
    reason: "node-limit" | "region-limit" | "depth-limit" | "excluded-content" | "time-limit"
  ): SnapshotNode {
    this.omissions[reason] = (this.omissions[reason] || 0) + 1;
    return { kind: "omitted", reason };
  }

  /**
   * Copy safe element facts once, including ancestry shells whose omitted descendants remain explicit.
   * @param element Source node read without mutation or retention in serialized output.
   * @returns A detached data record with safe attributes, rendering facts and initially empty children.
   */
  shell(element: Element): SnapshotElement {
    this.privacy.remember(element);
    const { content, redaction } = this.privacy.regions.classify(element);
    const attributes = this.attributes.read(element, content);
    let rendering = this.layouts.get(element);
    if (!rendering) {
      rendering = this.measureLayout
        ? layout(element)
        : {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            display: "unknown",
            visibility: "unknown",
            position: "unknown",
            order: "0",
            direction: "unknown",
            inViewport: false,
            concealedByAncestor: false,
          };
      this.layouts.set(element, rendering);
    }
    const copy: SnapshotElement = {
      kind: "element",
      ref: `n${++this.nextRef}`,
      tag: this.tag(element),
      namespace:
        element.namespaceURI === "http://www.w3.org/2000/svg"
          ? "svg"
          : element.namespaceURI === "http://www.w3.org/1999/xhtml"
            ? "html"
            : "other",
      content,
      ...(redaction ? { redaction } : {}),
      attributes: attributes.attributes,
      attributeChanges: attributes.changes,
      layout: rendering,
      childNodeCount: element.childNodes.length,
      children: [],
    };
    this.elementSources.set(copy, element);
    return copy;
  }

  /**
   * Redact private text at its source; retain bounded unfamiliar interface labels without a known-phrase lookup.
   * @param node Original text node; raw content is used only for immediate redaction and size bucketing.
   * @returns A safe text record with either interface copy or an explicit redaction/omission placeholder.
   */
  private text(node: Node): SnapshotText {
    const value = node.textContent || "";
    const { content, redaction } = node.parentElement
      ? this.privacy.regions.classify(node.parentElement)
      : { content: "interface" as const };
    let safe = this.privacy.textNode(node, content);
    if (content !== "interface" && value.trim()) this.redacted++;
    if (
      content === "interface" &&
      (safe.length > this.limits.labelCharacters ||
        this.labels + safe.length > this.limits.totalLabelCharacters)
    ) {
      safe = "[interface text omitted: label budget]";
      this.omissions["label-limit"] = (this.omissions["label-limit"] || 0) + 1;
    } else if (content === "interface") this.labels += safe.length;
    const copy: SnapshotText = {
      kind: "text",
      ref: `n${++this.nextRef}`,
      content,
      ...(redaction ? { redaction } : {}),
      value: safe,
      size: !value.trim()
        ? "empty"
        : value.length <= 32
          ? "short"
          : value.length <= 180
            ? "medium"
            : "long",
    };
    this.textSources.set(copy, node);
    return copy;
  }

  /** Reconcile late identity/reference discoveries and moved nodes without granting permanent public provenance to old labels. */
  reconcilePrivacy(): void {
    for (const source of this.elementSources.values()) {
      if (performance.now() >= this.deadline) {
        this.omissions["redaction-time-limit"] = 1;
        return;
      }
      if (source.isConnected) this.privacy.remember(source);
    }
    this.attributes.reconcile(this.deadline);
    for (const [copy, source] of this.elementSources) {
      if (performance.now() >= this.deadline) {
        this.omissions["redaction-time-limit"] = 1;
        return;
      }
      if (!source.isConnected || (copy.redaction && copy.redaction.reason !== "private-reference"))
        continue;
      const { content, redaction } = this.privacy.regions.classify(source);
      copy.content = content;
      if (redaction) copy.redaction = redaction;
      else delete copy.redaction;
    }
    this.labels = 0;
    this.redacted = 0;
    delete this.omissions["label-limit"];
    const sources = Array.from(this.textSources);
    this.textSources.clear();
    for (const [copy, source] of sources) {
      // A move cannot declassify already captured private content; newly discovered shared references can.
      if (copy.redaction && copy.redaction.reason !== "private-reference") {
        if (copy.size !== "empty") this.redacted++;
        continue;
      }
      if (!source.isConnected || performance.now() >= this.deadline) {
        if (performance.now() >= this.deadline) this.omissions["redaction-time-limit"] = 1;
        if (copy.content !== "interface" && source.textContent?.trim()) this.redacted++;
        else this.labels += copy.value.length;
        continue;
      }
      const refreshed = this.text(source);
      copy.content = refreshed.content;
      copy.value = refreshed.value;
      if (refreshed.redaction) copy.redaction = refreshed.redaction;
      else delete copy.redaction;
    }
    if (this.privacy.regions.referenceLimitReached) this.omissions["redaction-reference-limit"] = 1;
    if (this.privacy.labels.identityLimitReached) this.omissions["redaction-identity-limit"] = 1;
    if (this.privacy.labels.limitReached) this.omissions["redaction-fragment-limit"] = 1;
  }

  /**
   * Copy one region using iterative traversal, releasing the event loop between bounded batches.
   * @param element Region root selected independently of filter outcomes.
   * @returns Ordered sanitized tree, with explicit gaps wherever work limits stop traversal.
   */
  private *walk(element: Element): Generator<void, SnapshotElement> {
    this.nodes++;
    const root = this.shell(element);
    this.captured.set(element, root);
    const queue: Array<{ source: Element; copy: SnapshotElement; depth: number }> = [
      { source: element, copy: root, depth: 0 },
    ];
    let localNodes = 1;
    while (queue.length) {
      const entry = queue.pop();
      if (!entry) break;
      if (entry.copy.content === "excluded") {
        entry.copy.children.push(this.omit("excluded-content"));
        continue;
      }
      if (entry.depth >= this.limits.depth) {
        if (entry.source.childNodes.length) entry.copy.children.push(this.omit("depth-limit"));
        continue;
      }
      const branches: typeof queue = [];
      for (let child = entry.source.firstChild; child; child = child.nextSibling) {
        if (performance.now() >= this.deadline) {
          entry.copy.children.push(this.omit("time-limit"));
          return root;
        }
        if (this.nodes >= this.limits.nodes || localNodes >= this.limits.nodesPerRegion) {
          entry.copy.children.push(
            this.omit(this.nodes >= this.limits.nodes ? "node-limit" : "region-limit")
          );
          break;
        }
        this.nodes++;
        localNodes++;
        if (child.nodeType === Node.TEXT_NODE) entry.copy.children.push(this.text(child));
        else if (child instanceof Element) {
          if (isReportUi(child)) {
            entry.copy.children.push(this.omit("excluded-content"));
            continue;
          }
          const copy = this.shell(child);
          this.captured.set(child, copy);
          entry.copy.children.push(copy);
          branches.push({ source: child, copy, depth: entry.depth + 1 });
        } else entry.copy.children.push(this.omit("excluded-content"));
        if (localNodes % 64 === 0) yield;
      }
      queue.push(...branches.reverse());
    }
    return root;
  }
  /** Capture a foreground report cooperatively, yielding between bounded traversal batches. */
  async region(element: Element): Promise<SnapshotElement> {
    const steps = this.walk(element);
    let step = steps.next();
    while (!step.done) {
      await yieldSnapshotWork();
      step = steps.next();
    }
    return step.value;
  }

  /** Freeze a transition before Facebook can replace its nodes; caller supplies strict work and time limits. */
  regionNow(element: Element): SnapshotElement {
    const steps = this.walk(element);
    let step = steps.next();
    while (!step.done) step = steps.next();
    return step.value;
  }
}
