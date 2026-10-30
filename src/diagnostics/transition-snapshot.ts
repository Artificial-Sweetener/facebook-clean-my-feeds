// SPDX-License-Identifier: GPL-3.0-only

import { snapshotLimits } from "../core/diagnostics/dom-snapshot";
import type { DomSnapshot, SnapshotElement } from "../core/diagnostics/dom-snapshot";
import { DomCapture } from "./dom-capture-tree";

/**
 * Freeze a small structural state synchronously before Facebook can discard its contents.
 * Uses the report's redaction policy without layout reads, media, raw text, source identifiers or executable markup.
 * Identity discovery and external references share the same node/time budgets; gaps remain explicit in coverage.
 * @param post News root whose pre-decision content is useful for replay.
 * @param deadline Monotonic millisecond deadline shared by identity seeding, traversal and external references.
 * @returns Independent sanitized fixture with report-local aliases and unknown rendering geometry.
 */
export function captureTransitionSnapshot(post: Element, deadline: number): DomSnapshot {
  const start = performance.now();
  const limits = {
    ...snapshotLimits,
    nodes: 256,
    nodesPerRegion: 256,
    depth: 24,
    regions: 1,
    references: 8,
    attributes: 1024,
    totalLabelCharacters: 1024,
    discoveryNodes: 256,
  };
  const capture = new DomCapture(limits, false, deadline);
  const walker = post.ownerDocument.createTreeWalker(post, NodeFilter.SHOW_ELEMENT);
  let node: Node | null = post;
  let seeded = 0;
  while (node && seeded < limits.discoveryNodes && performance.now() < deadline) {
    if (node instanceof Element) capture.privacy.remember(node);
    seeded++;
    node = walker.nextNode();
  }
  const root = capture.regionNow(post);
  const ancestors: SnapshotElement[] = [];
  let ancestor = post.parentElement;
  while (ancestor && ancestors.length < 4 && performance.now() < deadline) {
    ancestors.unshift(capture.shell(ancestor));
    ancestor = ancestor.parentElement;
  }
  const references: DomSnapshot["references"] = [];
  for (const pending of capture.attributes.pending.values()) {
    if (references.length >= limits.references) break;
    const target = post.ownerDocument.getElementById(pending.original);
    if (!target) {
      references.push({ id: pending.id, status: "missing", target: null });
      continue;
    }
    const publicLeaf =
      pending.interfaceLabel &&
      target.localName === "span" &&
      target.childElementCount === 0 &&
      capture.privacy.content(target) === "uncertain";
    const existing = capture.captured.get(target);
    if (existing) {
      if (publicLeaf) capture.promoteLabel(target, existing);
      references.push({ id: pending.id, status: "captured", target: null });
      continue;
    }
    if (capture.nodes >= limits.nodes || performance.now() >= deadline) {
      references.push({ id: pending.id, status: "budget-exceeded", target: null });
      continue;
    }
    capture.privacy.remember(target);
    references.push({
      id: pending.id,
      status: "external",
      target: capture.regionNow(target, publicLeaf ? "interface" : undefined),
    });
  }
  for (const source of capture.privacy.svgDisclosureText.keys()) {
    const copy = capture.captured.get(source);
    if (copy && capture.privacy.content(source) === "interface") capture.promoteLabel(source, copy);
  }
  return {
    version: 1,
    limits,
    regions: [{ ref: root.ref, selection: "target", ancestors, root }],
    references,
    target: root.ref,
    coverage: {
      scope: "selected-regions",
      capturedNodes: capture.nodes,
      discoveredNodes: seeded,
      identitySeedNodes: seeded,
      retainedLabelCharacters: capture.labels,
      redactedTextNodes: capture.redacted,
      redactedAttributes: capture.attributes.redacted,
      omissions: { ...capture.omissions, ...capture.attributes.omissions },
      elapsedMs: Math.round(performance.now() - start),
      discoveryComplete: node === null,
      regionSelectionComplete: true,
      mutationsDuringCapture: 0,
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
}
