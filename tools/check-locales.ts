// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../src/i18n";
import localeContract from "../governance/locale-contract.json";

/**
 * Enforce English key coverage while retaining reviewed locale-only copy and heterogeneous label values.
 * @param locales - Runtime dictionaries; values may intentionally be empty strings or string arrays.
 * @param allowedExtras - Exact historical extra keys, reviewed separately from English-baseline additions.
 * @returns Human-readable parity failures without rewriting any translated values.
 */
export function localeProblems(
  locales: Readonly<Record<string, object>>,
  allowedExtras: Readonly<Record<string, readonly string[]>> = localeContract.allowedExtraKeys
): string[] {
  const english = locales.en;
  if (!english) return ["The English translation baseline is missing"];
  const expected = new Set(Object.keys(english));
  const problems: string[] = [];
  for (const [locale, dictionary] of Object.entries(locales)) {
    for (const key of expected) {
      if (!Object.hasOwn(dictionary, key)) problems.push(`${locale}: missing ${key}`);
    }
    const extras = new Set(allowedExtras[locale] ?? []);
    for (const key of Object.keys(dictionary)) {
      if (!expected.has(key) && !extras.has(key))
        problems.push(`${locale}: unreviewed extra ${key}`);
    }
    for (const key of extras) {
      if (!Object.hasOwn(dictionary, key))
        problems.push(`${locale}: stale extra-key approval ${key}`);
    }
  }
  return problems;
}

if (require.main === module) {
  const problems = localeProblems(translations);
  if (problems.length) {
    console.error(problems.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(
      `All ${Object.keys(translations).length} locales meet the reviewed English-key contract.`
    );
  }
}
