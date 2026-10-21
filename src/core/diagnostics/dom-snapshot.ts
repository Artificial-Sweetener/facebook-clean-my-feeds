// SPDX-License-Identifier: GPL-3.0-only

/** Content provenance is explicit; an unknown region is never silently treated as public interface copy. */
export type SnapshotContent = "interface" | "authored" | "identity" | "uncertain" | "excluded";

/** Capture limits apply to work as well as output; omitted evidence remains distinguishable from absent evidence. */
export interface SnapshotLimits {
  nodes: number;
  nodesPerRegion: number;
  depth: number;
  regions: number;
  labelCharacters: number;
  totalLabelCharacters: number;
  discoveryNodes: number;
  references: number;
  attributes: number;
}

/** Quantized viewport-relative geometry describes placement without retaining screenshots or media. */
export interface SnapshotLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  display: string;
  visibility: string;
  position: string;
  order: string;
  direction: string;
  inViewport: boolean;
  concealedByAncestor: boolean;
}

/** Attribute transformations mark which selectors remain portable and which values are report-local aliases. */
export type SnapshotAttributeChange = "alias" | "route" | "redacted" | "presence" | "bounded";

/** An element retains its place and safe semantics, never executable attributes, source URLs or private identifiers. */
export interface SnapshotElement {
  kind: "element";
  ref: string;
  tag: string;
  namespace: "html" | "svg" | "other";
  content: SnapshotContent;
  attributes: Record<string, string>;
  attributeChanges: Record<string, SnapshotAttributeChange>;
  layout: SnapshotLayout;
  childNodeCount: number;
  children: SnapshotNode[];
}

/** Private text keeps only a size bucket and placeholder; public control copy is retained without a phrase allowlist. */
export interface SnapshotText {
  kind: "text";
  ref: string;
  content: SnapshotContent;
  value: string;
  size: "empty" | "short" | "medium" | "long";
}

/** A structural gap states why descendants cannot support conclusions or complete selector evaluation. */
export interface SnapshotOmission {
  kind: "omitted";
  reason: "node-limit" | "region-limit" | "depth-limit" | "excluded-content";
}

/** Ordered node records can be reconstructed into inert test fixtures without consulting the original page. */
export type SnapshotNode = SnapshotElement | SnapshotText | SnapshotOmission;

/** Each independently captured region carries its real ancestry and selection rationale. */
export interface SnapshotRegion {
  ref: string;
  selection: "target" | "viewport" | "neighbor" | "surface";
  ancestors: SnapshotElement[];
  root: SnapshotElement;
}

/** Reference targets can lie outside captured posts, be missing, or be deliberately omitted by a capture budget. */
export interface SnapshotReference {
  id: string;
  status: "captured" | "external" | "missing" | "budget-exceeded";
  target: SnapshotElement | null;
}

/** Versioned, JSON-safe independent DOM evidence is the primary support artifact, with detector telemetry alongside it. */
export interface DomSnapshot {
  version: 1;
  limits: SnapshotLimits;
  regions: SnapshotRegion[];
  references: SnapshotReference[];
  target: string | null;
  coverage: {
    scope: "selected-regions";
    capturedNodes: number;
    discoveredNodes: number;
    identitySeedNodes: number;
    retainedLabelCharacters: number;
    redactedTextNodes: number;
    redactedAttributes: number;
    omissions: Record<string, number>;
    elapsedMs: number;
    discoveryComplete: boolean;
    regionSelectionComplete: boolean;
    mutationsDuringCapture: number;
  };
  privacy: {
    policy: "content-boundaries-v1";
    interfaceLabels: "automatically-sanitized";
    authoredText: "redacted";
    mediaContent: "omitted";
    identifiers: "report-local-aliases";
    classes: "report-local-aliases";
    destinations: "structural-templates";
  };
}

/** Defaults capture useful neighboring structure with a bounded foreground cost and output size. */
export const snapshotLimits: Readonly<SnapshotLimits> = {
  nodes: 6000,
  nodesPerRegion: 1600,
  depth: 36,
  regions: 12,
  labelCharacters: 180,
  totalLabelCharacters: 16000,
  discoveryNodes: 12000,
  references: 64,
  attributes: 24000,
};
