// SPDX-License-Identifier: GPL-3.0-only

import { catalog as locale0 } from "./locales/en";
import { catalog as locale1 } from "./locales/ar";
import { catalog as locale2 } from "./locales/bg";
import { catalog as locale3 } from "./locales/cs";
import { catalog as locale4 } from "./locales/de";
import { catalog as locale5 } from "./locales/el";
import { catalog as locale6 } from "./locales/es";
import { catalog as locale7 } from "./locales/fi";
import { catalog as locale8 } from "./locales/fr";
import { catalog as locale9 } from "./locales/he";
import { catalog as locale10 } from "./locales/id";
import { catalog as locale11 } from "./locales/it";
import { catalog as locale12 } from "./locales/ja";
import { catalog as locale13 } from "./locales/lv";
import { catalog as locale14 } from "./locales/nl";
import { catalog as locale15 } from "./locales/pl";
import { catalog as locale16 } from "./locales/pt";
import { catalog as locale17 } from "./locales/ru";
import { catalog as locale18 } from "./locales/tr";
import { catalog as locale19 } from "./locales/uk";
import { catalog as locale20 } from "./locales/vi";
import { catalog as locale21 } from "./locales/zh-Hans";
import { catalog as locale22 } from "./locales/zh-Hant";
import type { Keywords, LocaleCode, TranslationRegistry } from "./types";

export type { Keywords, LocaleCode, TranslationKey, TranslationRegistry } from "./types";

/** Each catalog is typed against the English baseline while preserving locale-only fields. */
export const translations: TranslationRegistry = {
  en: locale0,
  ar: locale1,
  bg: locale2,
  cs: locale3,
  de: locale4,
  el: locale5,
  es: locale6,
  fi: locale7,
  fr: locale8,
  he: locale9,
  id: locale10,
  it: locale11,
  ja: locale12,
  lv: locale13,
  nl: locale14,
  pl: locale15,
  pt: locale16,
  ru: locale17,
  tr: locale18,
  uk: locale19,
  vi: locale20,
  "zh-Hans": locale21,
  "zh-Hant": locale22,
};

/** Check an external language identifier before using it to index the closed registry. */
export function isLocaleCode(language: string): language is LocaleCode {
  return Object.prototype.hasOwnProperty.call(translations, language);
}

/** Return a supported catalog without inventing a catalog for unknown site languages. */
export function getTranslation(language: string): Keywords | undefined {
  return isLocaleCode(language) ? translations[language] : undefined;
}
