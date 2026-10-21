// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../i18n";
import { disclosureLabels } from "../../i18n/disclosure-labels";

/** Normalize presentation-only Unicode while retaining exact words and meaningful punctuation. */
function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Slot order is kept identical to the strongly typed all-locale catalog. */
type DisclosureKind = "ad" | "aiInfo" | "metaAiBrand" | "metaAiCopy";
const kinds: readonly DisclosureKind[] = ["ad", "aiInfo", "metaAiBrand", "metaAiCopy"];
const labels = new Map(
  kinds.map((kind, index) => [
    kind,
    new Set(
      Object.values(disclosureLabels).flatMap((values) =>
        (values[index] || "").split("|").map(normalize)
      )
    ),
  ])
);

/** Recognize a complete label from any supported locale without using the selected UI language. */
export function matchesDisclosureLabel(text: string, kind: DisclosureKind): boolean {
  return labels.get(kind)?.has(normalize(text)) === true;
}

/** Retain supported promotional-copy matching across every catalog instead of English-only substrings. */
export function containsMetaAiCopy(text: string): boolean {
  const normalized = normalize(text);
  return Array.from(labels.get("metaAiCopy") || []).some(
    (label) => label !== "" && normalized.includes(label)
  );
}

const sponsorshipLabels = new Set(
  Object.values(translations).flatMap((catalog) =>
    [catalog.SPONSORED, catalog.SPONSORED_EXTRA]
      .filter((label): label is string => typeof label === "string")
      .map(normalize)
  )
);

/** Match complete sponsorship and abbreviated ad labels from all supported locales. */
export function matchesSponsoredLabel(text: string): boolean {
  return sponsorshipLabels.has(normalize(text)) || matchesDisclosureLabel(text, "ad");
}
