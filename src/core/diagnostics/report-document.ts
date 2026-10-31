// SPDX-License-Identifier: GPL-3.0-only

import type { DomSnapshot } from "./dom-snapshot";
import { isDomSnapshot } from "./snapshot-validation";
import { isPostHistory } from "./post-history";
import { unwrapReportMarkdown } from "./report-markdown";

/** Offline consumers depend on the versioned snapshot while retaining the complete environment and diagnostic envelope. */
export interface ReportDocument {
  schemaVersion: 2;
  generatedAt: string;
  snapshot: DomSnapshot;
  [key: string]: unknown;
}

/** Parse only bounded, supported reports; malformed attachments never become executable inspector inputs. */
export function parseReportDocument(text: string): ReportDocument | null {
  if (text.length > 12_000_000) return null;
  try {
    const value: unknown = JSON.parse(unwrapReportMarkdown(text));
    return typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      "schemaVersion" in value &&
      "generatedAt" in value &&
      "snapshot" in value &&
      value.schemaVersion === 2 &&
      typeof value.generatedAt === "string" &&
      isDomSnapshot(value.snapshot) &&
      (!("history" in value) || isPostHistory(value.history))
      ? (value as ReportDocument)
      : null;
  } catch {
    return null;
  }
}
