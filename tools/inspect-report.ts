// SPDX-License-Identifier: GPL-3.0-only

import fs from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { JSDOM } from "jsdom";
import { parseReportDocument } from "../src/core/diagnostics/report-document";
import type { ReportDocument } from "../src/core/diagnostics/report-document";
import { unwrapReportMarkdown } from "../src/core/diagnostics/report-markdown";
import { snapshotRegionHtml, testSnapshotSelector } from "../src/diagnostics/dom-fixture";

/** Decode pasted report text with strict compressed and inflated bounds before inspecting any DOM record. */
export function decodeReport(text: string): ReportDocument {
  if (text.length > 16_000_000) throw new Error("Report exceeds supported size");
  text = unwrapReportMarkdown(text);
  const value: unknown = JSON.parse(text);
  if (typeof value === "object" && value !== null && "encoding" in value) {
    if (
      !("format" in value) ||
      value.format !== "cmf-report" ||
      !("version" in value) ||
      value.version !== 2 ||
      value.encoding !== "gzip-base64" ||
      !("data" in value) ||
      typeof value.data !== "string" ||
      !/^[a-z0-9+/]*={0,2}$/i.test(value.data)
    )
      throw new Error("Unsupported report encoding");
    text = gunzipSync(Buffer.from(value.data, "base64"), { maxOutputLength: 12_000_000 }).toString(
      "utf8"
    );
  }
  const report = parseReportDocument(text);
  if (!report) throw new Error("Malformed or unsupported report");
  return report;
}

/** Evaluate proposed CSS using only sanitized regional fixtures; JSDOM loads no scripts or external resources. */
export function inspectReportSelector(report: ReportDocument, selector: string) {
  const dom = new JSDOM("");
  try {
    return testSnapshotSelector(report.snapshot, selector, dom.window.document);
  } finally {
    dom.window.close();
  }
}

/**
 * Reconstruct local regression fixtures and optionally test a new selector from pasted evidence alone.
 * @param args Input JSON path, output directory, and optional CSS selector.
 * @throws If input, schema, output paths or selector arguments are invalid.
 */
async function main(args: string[]): Promise<void> {
  const [input, destination, selector] = args;
  if (!input || !destination)
    throw new Error("Usage: npm run report:inspect -- report.json output-directory [selector]");
  const report = decodeReport(await fs.readFile(input, "utf8"));
  await fs.mkdir(destination, { recursive: true });
  for (const [index, region] of report.snapshot.regions.entries())
    await fs.writeFile(
      path.join(destination, `region-${index + 1}.html`),
      snapshotRegionHtml(report.snapshot, region)
    );
  await fs.writeFile(path.join(destination, "report.json"), JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        regions: report.snapshot.regions.length,
        coverage: report.snapshot.coverage,
        ...(selector ? { selector: inspectReportSelector(report, selector) } : {}),
      },
      null,
      2
    )
  );
}

if (require.main === module)
  main(process.argv.slice(2)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Report inspection failed");
    process.exitCode = 1;
  });
