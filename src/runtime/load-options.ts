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
 * defaults. A three-second deadline also releases startup when IndexedDB never settles.
 * Timing out does not write defaults or cancel the native read: late data is ignored for this
 * session, while a later explicit save can still use the shared database if it eventually opens.
 */
async function readStoredOptions(): Promise<StoredOptions> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const deadline = new Promise<undefined>((resolve) => {
      timer = setTimeout(() => resolve(undefined), 3000);
    });
    const rawOptions = await Promise.race([getOptions(), deadline]);
    const candidate: unknown = typeof rawOptions === "string" ? JSON.parse(rawOptions) : rawOptions;
    return decodeStoredOptions(candidate) ?? {};
  } catch {
    return {};
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/**
 * Hydrate startup options and install all derived state together after persistence or its deadline.
 * @param state The existing shared state object, whose identity must remain stable for listeners.
 * @returns The same options/filter objects installed on state, plus localized keywords for contexts.
 * Storage failure, a stalled read, and malformed payloads recover to defaults without overwriting
 * persistence; readiness is set only after hydration and is never revisited by late read results.
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
