// SPDX-License-Identifier: GPL-3.0-only

import type {
  DomSnapshot,
  SnapshotElement,
  SnapshotNode,
  SnapshotRegion,
} from "../core/diagnostics/dom-snapshot";

const excludedTags = new Set([
  "script",
  "style",
  "noscript",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "link",
  "meta",
  "base",
  "foreignobject",
]);
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

/** Escape data separately from markup so retained interface text can never become executable HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Reconstruct rendering facts with finite CSS vocabularies rather than copying arbitrary source style declarations. */
function renderingStyle(element: SnapshotElement): string {
  const properties: Array<[string, string, RegExp]> = [
    [
      "display",
      element.layout.display,
      /^(?:none|block|inline|inline-block|flex|inline-flex|grid|inline-grid|contents|list-item|table|table-row|table-cell)$/,
    ],
    ["visibility", element.layout.visibility, /^(?:visible|hidden|collapse)$/],
    ["order", element.layout.order, /^-?\d{1,6}$/],
    ["direction", element.layout.direction, /^(?:ltr|rtl)$/],
  ];
  return properties
    .filter(([, value, allowed]) => allowed.test(value))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

/**
 * Render a safe element with source aliases, diagnostic references and explicitly projected visibility.
 * @param element Sanitized source record; executable tags and resource attributes are guarded again at this boundary.
 * @param children Already escaped or serialized child markup in original sibling order.
 * @returns Inert HTML preserving usable source semantics and report-local node references.
 */
function elementHtml(element: SnapshotElement, children: string): string {
  const tag =
    excludedTags.has(element.tag.toLowerCase()) || !/^[a-z][a-z0-9-]{0,40}$/i.test(element.tag)
      ? "cmf-excluded"
      : element.tag;
  const attributes = Object.entries(element.attributes)
    .filter(
      ([name]) =>
        /^[a-z][a-z0-9_.:-]{0,80}$/.test(name) &&
        !/^on/i.test(name) &&
        ![
          "style",
          "src",
          "srcset",
          "srcdoc",
          "poster",
          "action",
          "formaction",
          "autofocus",
          "is",
          "data-cmf-node",
          "data-cmf-projected-style",
        ].includes(name)
    )
    .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
    .join("");
  const style = renderingStyle(element);
  const opening = `<${tag}${attributes} data-cmf-node="${escapeHtml(element.ref)}"${style ? ` style="${escapeHtml(style)}" data-cmf-projected-style=""` : ""}>`;
  return voidTags.has(tag) ? opening : `${opening}${children}</${tag}>`;
}

/** Serialize ordered sanitized descendants; omissions remain inspectable but do not impersonate source elements. */
function nodeHtml(node: SnapshotNode): string {
  if (node.kind === "text") return escapeHtml(node.value);
  if (node.kind === "omitted") return `<!-- CMF omitted: ${escapeHtml(node.reason)} -->`;
  return elementHtml(node, node.children.map(nodeHtml).join(""));
}

/**
 * Export one inert regional fixture with real ancestry shells and its external accessible-name dependencies.
 * @param snapshot Complete captured report data; source identifiers and private reverse mappings are never needed.
 * @param region Region to reconstruct, evaluated separately from neighboring regions to avoid duplicate source roots.
 * @returns Self-contained HTML with network/resource execution disabled; absent ancestor siblings remain explicit limitations.
 */
export function snapshotRegionHtml(snapshot: DomSnapshot, region: SnapshotRegion): string {
  let tree = nodeHtml(region.root);
  for (const ancestor of [...region.ancestors].reverse()) {
    if (ancestor.tag === "html" || ancestor.tag === "body") continue;
    tree = elementHtml(ancestor, `<!-- CMF ancestry shell: other siblings omitted -->${tree}`);
  }
  const rootIds = new Set<string>();
  const queue: SnapshotNode[] = [region.root, ...region.ancestors];
  while (queue.length) {
    const node = queue.pop();
    if (node?.kind !== "element") continue;
    if (node.attributes.id) rootIds.add(node.attributes.id);
    queue.push(...node.children);
  }
  const references = snapshot.references
    .filter((reference) => reference.target && !rootIds.has(reference.id))
    .map((reference) => (reference.target ? nodeHtml(reference.target) : ""))
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"><title>CMF sanitized DOM fixture</title></head><body>${tree}${references}</body></html>`;
}

/** An offline query reports individual source-node matches, partial coverage and nonportable attribute dependencies. */
export interface SnapshotSelectorResult {
  regions: Array<{ region: string; matches: string[] }>;
  warnings: string[];
  error: string | null;
}

/**
 * Evaluate a CSS selector against every inert regional fixture without reading or changing Facebook's original DOM.
 * @param snapshot Captured tree and external references, including explicit coverage limitations.
 * @param selector Proposed standard CSS selector; invalid syntax returns a diagnostic instead of throwing.
 * @param document Host document used only to create detached inert fixture documents.
 * @returns Source references matching in each region plus limitations relevant to interpreting the result.
 */
export function testSnapshotSelector(
  snapshot: DomSnapshot,
  selector: string,
  document: Document
): SnapshotSelectorResult {
  const result: SnapshotSelectorResult = { regions: [], warnings: [], error: null };
  if (!selector.trim() || selector.length > 2000)
    return { ...result, error: "empty-or-oversized-selector" };
  if (
    !snapshot.coverage.discoveryComplete ||
    !snapshot.coverage.regionSelectionComplete ||
    Object.keys(snapshot.coverage.omissions).length
  )
    result.warnings.push("partial-capture");
  if (snapshot.coverage.mutationsDuringCapture)
    result.warnings.push("live-page-changed-during-capture");
  const structure = selector.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
  if (/[.#][a-z_-]|\[(?:id|class|aria-labelledby|aria-describedby)\s*[*^$|~]?=/i.test(structure))
    result.warnings.push("identifiers-and-classes-are-report-local");
  if (/data-cmf-/.test(selector))
    result.warnings.push("diagnostic-attributes-do-not-exist-on-facebook");
  if (/style|:visible|:hidden/.test(selector))
    result.warnings.push("styles-are-projected-from-rendering-facts");
  if (/:nth-|:first-|:last-|:only-|[+~]/.test(selector))
    result.warnings.push("ancestor-siblings-outside-regions-are-omitted");
  for (const region of snapshot.regions) {
    const fixture = document.implementation.createHTMLDocument("");
    fixture.documentElement.innerHTML = snapshotRegionHtml(snapshot, region).replace(
      /^<!doctype html>/i,
      ""
    );
    try {
      const matches = Array.from(fixture.querySelectorAll(selector))
        .map((element) => element.getAttribute("data-cmf-node"))
        .filter((ref): ref is string => ref !== null);
      result.regions.push({ region: region.ref, matches });
    } catch {
      result.error = "invalid-selector";
      break;
    }
  }
  return result;
}
