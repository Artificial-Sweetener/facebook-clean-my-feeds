// SPDX-License-Identifier: GPL-3.0-only

import { snapshotLimits } from "../core/diagnostics/dom-snapshot";
import type {
  DomSnapshot,
  SnapshotContent,
  SnapshotElement,
  SnapshotLayout,
  SnapshotLimits,
  SnapshotNode,
} from "../core/diagnostics/dom-snapshot";
import { SnapshotPrivacy } from "./dom-privacy";
import { SnapshotAttributes } from "./dom-attributes";
import { isReportUi, selectSnapshotRegions, yieldSnapshotWork } from "./dom-selection";

/** A selected complaint element bypasses detector-dependent discovery; limits can only reduce the production defaults. */
export interface SnapshotCaptureOptions {
  target?: Element | null;
  limits?: Partial<SnapshotLimits>;
}

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
class DomCapture {
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

  /** Capture budgets are immutable for the lifetime of a report generation request. */
  constructor(readonly limits: SnapshotLimits) {}

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
  omit(reason: "node-limit" | "region-limit" | "depth-limit" | "excluded-content"): SnapshotNode {
    this.omissions[reason] = (this.omissions[reason] || 0) + 1;
    return { kind: "omitted", reason };
  }

  /**
   * Copy safe element facts once, including ancestry shells whose omitted descendants remain explicit.
   * @param element Source node read without mutation or retention in serialized output.
   * @param override Interface provenance for a separately referenced plain label, when permitted by the caller.
   * @returns A detached data record with safe attributes, rendering facts and initially empty children.
   */
  shell(element: Element, override?: SnapshotContent): SnapshotElement {
    const content = override || this.privacy.content(element);
    const attributes = this.attributes.read(element, content);
    let rendering = this.layouts.get(element);
    if (!rendering) {
      rendering = layout(element);
      this.layouts.set(element, rendering);
    }
    return {
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
      attributes: attributes.attributes,
      attributeChanges: attributes.changes,
      layout: rendering,
      childNodeCount: element.childNodes.length,
      children: [],
    };
  }

  /**
   * Redact private text at its source; retain bounded unfamiliar interface labels without a known-phrase lookup.
   * @param node Original text node; raw content is used only for immediate redaction and size bucketing.
   * @param inherited Optional explicit provenance for a separately referenced accessible label.
   * @returns A safe text record with either interface copy or an explicit redaction/omission placeholder.
   */
  private text(node: Node, inherited?: SnapshotContent): SnapshotNode {
    const value = node.textContent || "";
    const content =
      inherited || (node.parentElement ? this.privacy.content(node.parentElement) : "uncertain");
    let safe = this.privacy.text(value, content);
    if (content !== "interface" && value.trim()) this.redacted++;
    if (
      content === "interface" &&
      (safe.length > this.limits.labelCharacters ||
        this.labels + safe.length > this.limits.totalLabelCharacters)
    ) {
      safe = "[interface text omitted: label budget]";
      this.omissions["label-limit"] = (this.omissions["label-limit"] || 0) + 1;
    } else if (content === "interface") this.labels += safe.length;
    return {
      kind: "text",
      ref: `n${++this.nextRef}`,
      content,
      value: safe,
      size: !value.trim()
        ? "empty"
        : value.length <= 32
          ? "short"
          : value.length <= 180
            ? "medium"
            : "long",
    };
  }

  /** Restore a bounded disclosure leaf already visited before its ARIA source, using the same budgets as external labels. */
  promoteLabel(source: Element, copy: SnapshotElement): void {
    copy.content = "interface";
    for (const [index, node] of Array.from(source.childNodes).entries()) {
      const previous = copy.children[index];
      if (node.nodeType !== Node.TEXT_NODE || previous?.kind !== "text") continue;
      if (previous.content !== "interface" && node.textContent?.trim()) this.redacted--;
      copy.children[index] = this.text(node, "interface");
    }
  }

  /**
   * Copy one region using iterative traversal, releasing the event loop between bounded batches.
   * @param element Region root selected independently of filter outcomes.
   * @param override Only a constrained external accessible-label leaf may receive explicit interface provenance.
   * @returns Ordered sanitized tree, with explicit gaps wherever work limits stop traversal.
   */
  async region(element: Element, override?: SnapshotContent): Promise<SnapshotElement> {
    this.nodes++;
    const root = this.shell(element, override);
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
        if (this.nodes >= this.limits.nodes || localNodes >= this.limits.nodesPerRegion) {
          entry.copy.children.push(
            this.omit(this.nodes >= this.limits.nodes ? "node-limit" : "region-limit")
          );
          break;
        }
        this.nodes++;
        localNodes++;
        if (child.nodeType === Node.TEXT_NODE) entry.copy.children.push(this.text(child, override));
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
        if (localNodes % 64 === 0) await yieldSnapshotWork();
      }
      queue.push(...branches.reverse());
    }
    return root;
  }
}

/**
 * Collect an independent, read-only DOM snapshot with explicit redaction, external references and coverage limits.
 * @param document Live page to sample; no page node, input, media source or setting is changed.
 * @param options Optional complaint target and reduced test/support budgets.
 * @returns JSON-safe structure suitable for offline inspection and regression fixtures.
 */
export async function captureDomSnapshot(
  document: Document,
  options: SnapshotCaptureOptions = {}
): Promise<DomSnapshot> {
  const start = performance.now();
  const limits = { ...snapshotLimits };
  for (const key of Object.keys(limits) as Array<keyof SnapshotLimits>) {
    const value = options.limits?.[key];
    if (typeof value === "number" && Number.isFinite(value))
      limits[key] = Math.max(1, Math.min(limits[key], Math.floor(value)));
  }
  let mutationsDuringCapture = 0;
  /** Count changes without retaining their private target text or attribute values. */
  const countMutations = (records: MutationRecord[]): void => {
    for (const record of records) {
      const element =
        record.target instanceof Element ? record.target : record.target.parentElement;
      if (element && !isReportUi(element)) mutationsDuringCapture++;
    }
  };
  const observer =
    typeof MutationObserver === "undefined" ? null : new MutationObserver(countMutations);
  observer?.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  try {
    const capture = new DomCapture(limits);
    const selection = await selectSnapshotRegions(
      document,
      options.target || null,
      limits,
      capture.privacy
    );
    const regions: DomSnapshot["regions"] = [];
    for (const selected of selection.regions) {
      if (capture.nodes >= limits.nodes) {
        capture.omit("node-limit");
        break;
      }
      const root = await capture.region(selected.element);
      const ancestors: SnapshotElement[] = [];
      let ancestor = selected.element.parentElement;
      while (ancestor && ancestors.length < 8) {
        ancestors.unshift(capture.shell(ancestor));
        ancestor = ancestor.parentElement;
      }
      regions.push({ ref: root.ref, selection: selected.selection, ancestors, root });
      await yieldSnapshotWork();
    }
    const references: DomSnapshot["references"] = [];
    for (const pending of capture.attributes.pending.values()) {
      if (references.length >= limits.references) {
        capture.omissions["reference-limit"] = capture.attributes.pending.size - references.length;
        break;
      }
      const target = document.getElementById(pending.original);
      if (!target) {
        references.push({ id: pending.id, status: "missing", target: null });
        continue;
      }
      const existing = capture.captured.get(target);
      const publicLeaf =
        pending.interfaceLabel &&
        target.localName === "span" &&
        target.childElementCount === 0 &&
        capture.privacy.content(target) === "uncertain";
      if (existing) {
        if (publicLeaf) capture.promoteLabel(target, existing);
        references.push({ id: pending.id, status: "captured", target: null });
        continue;
      }
      if (capture.nodes >= limits.nodes) {
        references.push({ id: pending.id, status: "budget-exceeded", target: null });
        continue;
      }
      const copy = await capture.region(target, publicLeaf ? "interface" : undefined);
      references.push({ id: pending.id, status: "external", target: copy });
    }
    if (observer) countMutations(observer.takeRecords());
    return {
      version: 1,
      limits,
      regions,
      references,
      target: options.target ? capture.captured.get(options.target)?.ref || null : null,
      coverage: {
        scope: "selected-regions",
        capturedNodes: capture.nodes,
        discoveredNodes: selection.discovered,
        identitySeedNodes: selection.seeded,
        retainedLabelCharacters: capture.labels,
        redactedTextNodes: capture.redacted,
        redactedAttributes: capture.attributes.redacted,
        omissions: { ...capture.omissions, ...capture.attributes.omissions },
        elapsedMs: Math.round(performance.now() - start),
        discoveryComplete: selection.discoveryComplete,
        regionSelectionComplete: selection.selectionComplete,
        mutationsDuringCapture,
      },
      privacy: {
        policy: "content-boundaries-v1",
        interfaceLabels: "automatically-sanitized",
        authoredText: "redacted",
        mediaContent: "omitted",
        identifiers: "report-local-aliases",
        classes: "report-local-aliases",
        destinations: "structural-templates",
      },
    };
  } finally {
    observer?.disconnect();
  }
}
