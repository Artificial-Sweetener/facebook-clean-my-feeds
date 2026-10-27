// SPDX-License-Identifier: GPL-3.0-only

/** A diagnosable repository violation, keyed by rule and path for precise reviewed exceptions. */
export interface Violation {
  rule: string;
  file: string;
  detail: string;
  lines?: number;
}

/** Directional source ownership is explicit; patterns are checked in declared order. */
export interface Layer {
  name: string;
  patterns: string[];
  allows: string[];
}

/** Shared limits keep contributor guidance and the executable governance gate in agreement. */
export interface Policy {
  schemaVersion: number;
  warningLines: number;
  maximumLines: number;
  maximumExceptionDays: number;
  license: string;
  generatedJavaScript: string;
  layers: Layer[];
}

/** An exception applies only to one exact reviewed source revision and expires automatically. */
export interface ReviewedException {
  rule: string;
  file: string;
  fingerprint: string;
  owner: string;
  reason: string;
  extraction: string;
  reviewedAt: string;
  expires: string;
  cap?: number;
  previousCap?: number;
}

/** Every repository file must match exactly one reviewed inventory category, including unreachable source. */
export interface Inventory {
  schemaVersion: number;
  license: string;
  categories: { name: string; patterns: string[]; review: string }[];
}
