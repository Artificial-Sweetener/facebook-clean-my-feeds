// SPDX-License-Identifier: GPL-3.0-only

import { cleanText } from "./text-normalize";
import { newsLabels } from "../../i18n/news-labels";

/** Semantic slots are independent of settings labels and remain exact matches after normalization. */
export type NewsLabelKind =
  | "follow"
  | "join"
  | "verified"
  | "suggested"
  | "groups"
  | "people"
  | "reels"
  | "events";
const labelKinds: readonly NewsLabelKind[] = [
  "follow",
  "join",
  "verified",
  "suggested",
  "groups",
  "people",
  "reels",
  "events",
];

/** Remove display-only whitespace and directional/invisible separators without admitting partial phrases. */
function normalizeLabel(text: string): string {
  return cleanText(text)
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

const labelsByKind = new Map<NewsLabelKind, ReadonlySet<string>>(
  labelKinds.map((kind, index) => [
    kind,
    new Set(
      Object.values(newsLabels).flatMap((labels) =>
        (labels[index] || "").split("|").map(normalizeLabel)
      )
    ),
  ])
);

/** Match an expected semantic label in any shipped locale so the settings language cannot change detection. */
export function matchesNewsLabel(text: string, kind: NewsLabelKind): boolean {
  const normalized = normalizeLabel(text);
  return normalized !== "" && labelsByKind.get(kind)?.has(normalized) === true;
}

/** Require a complete localized paid-by template with a nonempty payer, preserving word boundaries and suffix-language order. */
export function matchesNewsPaidBy(text: string): boolean {
  const label = normalizeLabel(text);
  return Object.values(newsLabels).some((labels) =>
    labels[8].split("|").some((template) => {
      const [prefix = "", suffix = ""] = normalizeLabel(template).split("______");
      return (
        (prefix !== "" || suffix !== "") &&
        label.startsWith(prefix) &&
        label.endsWith(suffix) &&
        label.slice(prefix.length, label.length - suffix.length).trim() !== ""
      );
    })
  );
}
