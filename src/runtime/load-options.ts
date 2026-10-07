// SPDX-License-Identifier: GPL-3.0-only
import type { PendingFilters } from "../core/filters/types";
import { decodeStoredOptions, hydrateOptions } from "../core/options/hydrate";
import type { HydratedSettings } from "../core/options/hydrate";
import type { Options, StoredOptions } from "../core/options/types";
import { resolveRegexFilters } from "../core/options/regex-validation";
import { getOptions } from "../storage/idb";

/** Small mutable state boundary owned by startup hydration, without feed or UI dependencies. */
export interface OptionsState {
  options: Options;
  filters: PendingFilters;
  language: string;
  hideAnInfoBox: boolean;
  optionsReady: boolean;
}

/**
 * Read either historical JSON-string settings or an object while treating external data as unknown.
 * Invalid JSON, malformed known settings, and unavailable storage all use the existing empty-input
 * defaults; startup remains useful when private-mode IndexedDB is blocked or unavailable.
 */
async function readStoredOptions(): Promise<StoredOptions> {
  try {
    const rawOptions = await getOptions();
    const candidate: unknown = typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;
    return decodeStoredOptions(candidate) ?? {};
  } catch {
    return {};
  }
}

/**
 * Hydrate startup options and install all derived state together after persistence has settled.
 * @param state The existing shared state object, whose identity must remain stable for listeners.
 * @returns The same options/filter objects installed on state, plus localized keywords for contexts.
 * Storage and malformed-payload failures recover to defaults; readiness is set only after hydration.
 */
export async function loadOptions(state: OptionsState): Promise<HydratedSettings> {
  const storedOptions = await readStoredOptions();
  const siteLanguage = document.documentElement?.lang ?? "en";
  const hydrated = hydrateOptions(storedOptions, siteLanguage);
  // Keep legacy text available for repair while invalid regex rules cannot reach a feed scan.
  hydrated.filters = resolveRegexFilters(hydrated.options).filters;
  state.options = hydrated.options;
  state.filters = hydrated.filters;
  state.language = hydrated.language;
  state.hideAnInfoBox = hydrated.hideAnInfoBox;
  state.optionsReady = true;
  return hydrated;
}
