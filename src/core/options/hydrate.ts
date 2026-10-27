// SPDX-License-Identifier: GPL-3.0-only

import { getTranslation, isLocaleCode, translations } from "../../i18n";
import type { Keywords } from "../../i18n";
import type { Filters } from "../filters/types";
import { applyOptionDefaults } from "./apply-defaults";
import { buildFilters } from "./build-filters";
import type { HydratedOptions, StoredOptions } from "./types";
import { isHydratedOptions } from "./validate";

export { applyOptionDefaults } from "./apply-defaults";
export { buildFilters } from "./build-filters";
export { decodeStoredOptions } from "./validate";

/** Shallow-copy the English fallback and supported locale, preserving historical array aliases. */
export function cloneKeywords(language?: string): Keywords {
  return { ...translations.en, ...(language ? getTranslation(language) : undefined) };
}

/**
 * Keep the historical distinction between unset and invalid explicitly configured language.
 * If both explicit configuration and site language are unsupported, return the site's code
 * (for example "zz") while cloneKeywords independently supplies English text.
 */
export function resolveLanguage(
  options: Pick<StoredOptions, "CMF_DIALOG_LANGUAGE">,
  siteLanguage?: string
): string {
  const language = siteLanguage || "en";
  if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_LANGUAGE")) {
    return isLocaleCode(language) ? language : "en";
  }
  const configured = options.CMF_DIALOG_LANGUAGE || "en";
  return typeof configured === "string" && isLocaleCode(configured) ? configured : language;
}

/** Completed pure initialization, ready for the runtime composition root to install atomically. */
export interface HydratedSettings {
  options: HydratedOptions;
  filters: Filters;
  language: string;
  hideAnInfoBox: boolean;
  keyWords: Keywords;
}

/**
 * Copy validated persisted settings, apply legacy defaults, and materialize locale/filter state.
 * @param storedOptions A record validated at the storage/import boundary; never mutated here.
 * @param siteLanguage Facebook's document language, including unsupported language identifiers.
 * @returns The full hydrated settings bundle without DOM or storage side effects.
 * @throws TypeError if malformed known values bypassed the boundary decoder.
 */
export function hydrateOptions(
  storedOptions: StoredOptions = {},
  siteLanguage = "en"
): HydratedSettings {
  const options = { ...storedOptions };
  const language = resolveLanguage(options, siteLanguage);
  options.CMF_DIALOG_LANGUAGE = language;
  const keyWords = cloneKeywords(language);
  const hideAnInfoBox = applyOptionDefaults(options, keyWords);
  const hydratedOptions: unknown = options;
  if (!isHydratedOptions(hydratedOptions)) {
    throw new TypeError("Settings contain malformed option values");
  }
  return {
    options: hydratedOptions,
    filters: buildFilters(hydratedOptions),
    language,
    hideAnInfoBox,
    keyWords,
  };
}
