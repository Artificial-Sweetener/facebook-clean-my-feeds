// SPDX-License-Identifier: GPL-3.0-only

import { snapshotLimits } from "../core/diagnostics/dom-snapshot";
import type {
  DomSnapshot,
  SnapshotElement,
  SnapshotLimits,
} from "../core/diagnostics/dom-snapshot";
import { DomCapture } from "./dom-capture-tree";
import { isReportUi, selectSnapshotRegions, yieldSnapshotWork } from "./dom-selection";

/** A selected complaint element bypasses detector-dependent discovery; limits can only reduce the production defaults. */
export interface SnapshotCaptureOptions {
  target?: Element | null;
  limits?: Partial<SnapshotLimits>;
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
    for (const source of capture.privacy.metadataText.keys()) {
      const copy = capture.captured.get(source);
      if (copy && capture.privacy.content(source) === "interface")
        capture.promoteLabel(source, copy);
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
