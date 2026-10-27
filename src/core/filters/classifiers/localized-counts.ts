// SPDX-License-Identifier: GPL-3.0-only

const decimalDigit = /\p{Nd}/u;
const digits = new Map<string, string>();
const compactUnits = new Map<string, ReadonlyMap<string, number>>();

/** Decode Unicode decimal-digit runs without tying numeric values to a particular writing system. */
export function normalizeCountDigits(value: string): string {
  return value
    .replace(/\p{Nd}/gu, (digit) => {
      if (digit >= "0" && digit <= "9") return digit;
      const cached = digits.get(digit);
      if (cached !== undefined) return cached;
      const point = digit.codePointAt(0);
      if (point === undefined) return digit;
      let start = point;
      while (start > 0 && decimalDigit.test(String.fromCodePoint(start - 1))) start -= 1;
      const decoded = String((point - start) % 10);
      digits.set(digit, decoded);
      return decoded;
    })
    .replace(/[\u200e\u200f\u061c]/g, "")
    .replace(/\u066b/g, ".")
    .replace(/\u066c/g, ",");
}

/** Ignore presentation whitespace while retaining the exact localized unit spelling and punctuation. */
function normalizeUnit(value: string): string {
  return value.normalize("NFKC").replace(/\s/g, "").toLowerCase();
}

/**
 * Derive compact scales from the host's locale data once, including plural and East Asian ten-thousand units.
 * @param locale Facebook document language, independent of the userscript settings language.
 * @returns Compact unit multipliers; unsupported locales fall back to the host's English data.
 */
function unitsForLocale(locale: string): ReadonlyMap<string, number> {
  const previous = compactUnits.get(locale);
  if (previous) return previous;
  const units = new Map<string, number>();
  for (const compactDisplay of ["short", "long"] as const) {
    let formatter: Intl.NumberFormat;
    try {
      formatter = new Intl.NumberFormat(locale || "en", { notation: "compact", compactDisplay });
    } catch {
      formatter = new Intl.NumberFormat("en", { notation: "compact", compactDisplay });
    }
    for (let exponent = 3; exponent <= 12; exponent += 1) {
      for (const factor of [1, 2, 5]) {
        const count = factor * 10 ** exponent;
        const parts = formatter.formatToParts(count);
        const unit = parts.find((part) => part.type === "compact")?.value;
        if (!unit) continue;
        const numeric = parts
          .filter((part) => ["integer", "fraction", "decimal"].includes(part.type))
          .map((part) => (part.type === "decimal" ? "." : normalizeCountDigits(part.value)))
          .join("");
        const divisor = Number(numeric);
        if (divisor > 0) units.set(normalizeUnit(unit), count / divisor);
      }
    }
  }
  compactUnits.set(locale, units);
  return units;
}

/**
 * Expand an exact localized compact count without guessing at unknown words or arbitrary suffixes.
 * @param value Count with normalized decimal digits; plain integers are handled by the caller.
 * @param locale Facebook document language used to disambiguate units such as Turkish B and English B.
 * @returns Expanded integer count, or undefined when the input has no recognized compact unit.
 */
export function readLocalizedCompactCount(value: string, locale: string): number | undefined {
  const match = /^([0-9]+(?:[.,][0-9]+)?)\s*([^\d\s].*)$/u.exec(value);
  if (!match?.[1] || !match[2]) return undefined;
  const multiplier = unitsForLocale(locale).get(normalizeUnit(match[2]));
  if (multiplier === undefined) return undefined;
  return Math.round(Number(match[1].replace(",", ".")) * multiplier);
}
