// SPDX-License-Identifier: GPL-3.0-only

import type { DomSnapshot } from "./dom-snapshot";

/** Offline consumers depend on the versioned snapshot while retaining the complete environment and diagnostic envelope. */
export interface ReportDocument {
  schemaVersion: 2;
  generatedAt: string;
  snapshot: DomSnapshot;
  [key: string]: unknown;
}

/** Bound untrusted report records before any inspector attempts to walk their attributes or children. */
function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Numeric capture facts must be finite rather than attacker-provided strings or non-JSON sentinels. */
function numbers(value: unknown, keys: readonly string[]): boolean {
  return (
    record(value) &&
    keys.every((key) => typeof value[key] === "number" && Number.isFinite(value[key]))
  );
}

/** Attribute maps have bounded string keys/values; executable semantics are guarded again by fixture serialization. */
function strings(value: unknown): value is Record<string, string> {
  return (
    record(value) &&
    Object.keys(value).length <= 100 &&
    Object.entries(value).every(
      ([key, entry]) => key.length <= 100 && typeof entry === "string" && entry.length <= 4096
    )
  );
}

/**
 * Validate recursively consumed fields, including ancestry and external labels.
 * @param value Untrusted embedded snapshot.
 * @returns Whether all fields consumed by the inspector satisfy bounded schema requirements.
 */
function snapshot(value: unknown): value is DomSnapshot {
  if (
    !record(value) ||
    value.version !== 1 ||
    !Array.isArray(value.regions) ||
    value.regions.length > 20 ||
    !Array.isArray(value.references) ||
    value.references.length > 128
  )
    return false;
  if (
    !(value.target === null || typeof value.target === "string") ||
    !record(value.coverage) ||
    !record(value.privacy)
  )
    return false;
  if (
    !numbers(value.limits, [
      "nodes",
      "nodesPerRegion",
      "depth",
      "regions",
      "labelCharacters",
      "totalLabelCharacters",
      "discoveryNodes",
      "references",
      "attributes",
    ])
  )
    return false;
  if (
    !numbers(value.coverage, [
      "capturedNodes",
      "discoveredNodes",
      "identitySeedNodes",
      "retainedLabelCharacters",
      "redactedTextNodes",
      "redactedAttributes",
      "elapsedMs",
      "mutationsDuringCapture",
    ])
  )
    return false;
  if (
    !record(value.coverage.omissions) ||
    !Object.values(value.coverage.omissions).every(
      (entry) => typeof entry === "number" && Number.isFinite(entry)
    )
  )
    return false;
  if (
    typeof value.coverage.discoveryComplete !== "boolean" ||
    typeof value.coverage.regionSelectionComplete !== "boolean"
  )
    return false;
  if (
    value.coverage.scope !== "selected-regions" ||
    value.privacy.policy !== "content-boundaries-v1" ||
    value.privacy.interfaceLabels !== "automatically-sanitized" ||
    value.privacy.authoredText !== "redacted" ||
    value.privacy.mediaContent !== "omitted" ||
    value.privacy.identifiers !== "report-local-aliases" ||
    value.privacy.classes !== "report-local-aliases" ||
    value.privacy.destinations !== "structural-templates"
  )
    return false;
  const queue: Array<{ node: unknown; depth: number }> = [];
  for (const region of value.regions) {
    if (
      !record(region) ||
      typeof region.ref !== "string" ||
      !["target", "viewport", "neighbor", "surface"].includes(String(region.selection)) ||
      !Array.isArray(region.ancestors) ||
      region.ancestors.length > 12
    )
      return false;
    if (
      !record(region.root) ||
      region.root.kind !== "element" ||
      !region.ancestors.every((node) => record(node) && node.kind === "element")
    )
      return false;
    queue.push(
      { node: region.root, depth: 0 },
      ...region.ancestors.map((node) => ({ node, depth: 0 }))
    );
  }
  for (const reference of value.references) {
    if (
      !record(reference) ||
      typeof reference.id !== "string" ||
      !["captured", "external", "missing", "budget-exceeded"].includes(String(reference.status))
    )
      return false;
    if (reference.target !== null) {
      if (!record(reference.target) || reference.target.kind !== "element") return false;
      queue.push({ node: reference.target, depth: 0 });
    }
  }
  let count = 0;
  while (queue.length) {
    const entry = queue.pop();
    if (!entry || ++count > 12000 || entry.depth > 48 || !record(entry.node)) return false;
    const node = entry.node;
    if (node.kind === "omitted") {
      if (
        !["node-limit", "region-limit", "depth-limit", "excluded-content"].includes(
          String(node.reason)
        )
      )
        return false;
      continue;
    }
    if (
      typeof node.ref !== "string" ||
      node.ref.length > 100 ||
      !["interface", "authored", "identity", "uncertain", "excluded"].includes(String(node.content))
    )
      return false;
    if (node.kind === "text") {
      if (
        typeof node.value !== "string" ||
        node.value.length > 4096 ||
        !["empty", "short", "medium", "long"].includes(String(node.size))
      )
        return false;
      continue;
    }
    if (
      node.kind !== "element" ||
      typeof node.tag !== "string" ||
      !/^[a-z][a-z0-9-]{0,40}$/i.test(node.tag) ||
      !["html", "svg", "other"].includes(String(node.namespace))
    )
      return false;
    if (
      !strings(node.attributes) ||
      !strings(node.attributeChanges) ||
      !Array.isArray(node.children) ||
      typeof node.childNodeCount !== "number" ||
      !Number.isSafeInteger(node.childNodeCount) ||
      node.childNodeCount < 0
    )
      return false;
    if (!numbers(node.layout, ["x", "y", "width", "height"]) || !record(node.layout)) return false;
    const layout = node.layout;
    if (
      !["display", "visibility", "position", "order", "direction"].every(
        (key) => typeof layout[key] === "string" && layout[key].length <= 100
      )
    )
      return false;
    if (
      typeof node.layout.inViewport !== "boolean" ||
      typeof node.layout.concealedByAncestor !== "boolean"
    )
      return false;
    for (const child of node.children) queue.push({ node: child, depth: entry.depth + 1 });
  }
  return true;
}

/** Parse only bounded, supported reports; malformed attachments never become executable inspector inputs. */
export function parseReportDocument(text: string): ReportDocument | null {
  if (text.length > 12_000_000) return null;
  try {
    const value: unknown = JSON.parse(text);
    return record(value) &&
      value.schemaVersion === 2 &&
      typeof value.generatedAt === "string" &&
      snapshot(value.snapshot)
      ? (value as ReportDocument)
      : null;
  } catch {
    return null;
  }
}
