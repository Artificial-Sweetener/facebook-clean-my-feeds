/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import { gzipSync } from "node:zlib";
import { encodeReport } from "../../../src/diagnostics/report-encoding";
import { decodeReport, inspectReportSelector } from "../../../tools/inspect-report";
import { snapshotLimits } from "../../../src/core/diagnostics/dom-snapshot";
import type { ReportDocument } from "../../../src/core/diagnostics/report-document";
import type { SnapshotElement, SnapshotNode } from "../../../src/core/diagnostics/dom-snapshot";

/**
 * Construct source-shaped records without any reference to a Facebook session.
 * @param ref Report-local node identity.
 * @param tag Source tag name.
 * @param children Ordered sanitized descendants.
 * @returns Complete element facts needed for regression fixture reconstruction.
 */
function element(ref: string, tag: string, children: SnapshotNode[]): SnapshotElement {
  return {
    kind: "element",
    ref,
    tag,
    namespace: "html",
    content: "interface",
    attributes: {},
    attributeChanges: {},
    children,
    childNodeCount: children.length,
    layout: {
      x: 0,
      y: 0,
      width: 100,
      height: 40,
      display: "block",
      visibility: "visible",
      position: "static",
      order: "0",
      direction: "ltr",
      inViewport: true,
      concealedByAncestor: false,
    },
  };
}

/**
 * Reproduce an unfamiliar interface module and private authored neighbor in exported data only.
 * @returns Supported automatically redacted report with no original page access.
 */
function report(): ReportDocument {
  return {
    schemaVersion: 2,
    generatedAt: "2026-10-20T12:00:00Z",
    environment: { browser: { name: "Firefox", version: "158.0" } },
    snapshot: {
      version: 1,
      target: null,
      limits: snapshotLimits,
      references: [],
      regions: [
        {
          ref: "n1",
          selection: "viewport",
          ancestors: [],
          root: element("n1", "section", [
            element("n2", "h3", [
              {
                kind: "text",
                ref: "n3",
                content: "interface",
                value: "Unfamiliar discovery capsule",
                size: "short",
              },
            ]),
          ]),
        },
        {
          ref: "n4",
          selection: "neighbor",
          ancestors: [],
          root: element("n4", "article", [
            {
              kind: "text",
              ref: "n5",
              content: "authored",
              value: "[authored text]",
              size: "long",
            },
          ]),
        },
      ],
      coverage: {
        scope: "selected-regions",
        capturedNodes: 5,
        discoveredNodes: 5,
        identitySeedNodes: 0,
        retainedLabelCharacters: 28,
        redactedTextNodes: 1,
        redactedAttributes: 0,
        elapsedMs: 2,
        discoveryComplete: true,
        regionSelectionComplete: true,
        omissions: {},
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
    },
  };
}

test("one pasted payload retains the complete report and supports a precise new selector offline", async () => {
  const original = report();
  const pasted = await encodeReport(original);
  expect(pasted).toContain('"encoding":"gzip-base64"');
  const decoded = decodeReport(pasted);
  expect(decoded).toEqual(original);
  expect(inspectReportSelector(decoded, "section > h3")).toMatchObject({
    error: null,
    regions: [
      { region: "n1", matches: ["n2"] },
      { region: "n4", matches: [] },
    ],
  });
  expect(decodeReport(JSON.stringify(original))).toEqual(original);
});

test("automatic packing makes repeated structural evidence substantially smaller without dropping any nodes", async () => {
  const data = report();
  data.telemetry = Array.from({ length: 1000 }, () => ({
    state: "captured",
    detail: "read-only structural evidence",
  }));
  const pasted = await encodeReport(data);
  expect(pasted.length).toBeLessThan(JSON.stringify(data).length / 4);
  expect(decodeReport(pasted)).toEqual(data);
});

test("corrupted, unsupported and oversized compressed reports fail before fixture reconstruction", () => {
  expect(() => decodeReport('{"encoding":"raw","data":"x"}')).toThrow(
    "Unsupported report encoding"
  );
  expect(() =>
    decodeReport('{"format":"cmf-report","encoding":"gzip-base64","data":"AAAA"}')
  ).toThrow();
  expect(() =>
    decodeReport(
      JSON.stringify({
        format: "cmf-report",
        version: 2,
        encoding: "gzip-base64",
        data: gzipSync("x".repeat(12_000_001)).toString("base64"),
      })
    )
  ).toThrow();
  expect(() => decodeReport('{"schemaVersion":2,"snapshot":{}}')).toThrow(
    "Malformed or unsupported report"
  );
});
