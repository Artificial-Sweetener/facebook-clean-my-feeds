// SPDX-License-Identifier: GPL-3.0-only

import { hydrateOptions, decodeStoredOptions } from "../core/options/hydrate";
import type { HydratedSettings } from "../core/options/hydrate";
import { InvalidRegexOptionsError, resolveRegexFilters } from "../core/options/regex-validation";
import { defaults } from "../core/options/defaults";
import type { Options } from "../core/options/types";
import type { PendingFilters } from "../core/filters/types";
import type { Keywords } from "../i18n";
import { setOptions, deleteOptions } from "../storage/idb";
import type { SaveResult, SaveSource } from "../core/options/commands";

/** Mutable application models share references with runtime filtering and dialog listeners. */
export interface OptionsContext {
  state: { options: Options; filters: PendingFilters; language: string; hideAnInfoBox: boolean };
  options: Options;
  filters: PendingFilters;
  keyWords: Keywords;
}

/** Host-specific styling and feed resets are composed at the application boundary. */
export interface OptionsEffects {
  applyOptions: () => void;
}

/** Preserve shared object identity while removing stale legacy properties before replacement. */
function replaceContents<T extends object>(target: T, source: T): void {
  Object.keys(target).forEach((key) => Reflect.deleteProperty(target, key));
  Object.assign(target, source);
}

/**
 * Build a detached, valid candidate before any write, deletion, or shared-model replacement.
 * @throws TypeError for malformed settings or InvalidRegexOptionsError for an active invalid rule.
 */
function validateCandidate(incoming: unknown): HydratedSettings {
  const decoded = decodeStoredOptions(incoming);
  if (!decoded) throw new TypeError("Settings contain malformed option values");
  const hydrated = hydrateOptions(decoded, document.documentElement?.lang || "en");
  const resolved = resolveRegexFilters(hydrated.options);
  if (resolved.issues.length > 0) throw new InvalidRegexOptionsError(resolved.issues);
  hydrated.filters = resolved.filters;
  return hydrated;
}

/**
 * Own hydration and persistence so the UI can express intent without knowing storage or feeds.
 * The effect runs only after a successful write; rejected storage writes propagate to the caller.
 * @param context Shared options/filter/catalog objects whose identities are retained.
 * @param effects Host styling and feed-refresh callback composed by the application root.
 * @returns Save/reset operations that keep persistence outside settings presentation.
 */
export function createOptionsService(context: OptionsContext, effects: OptionsEffects) {
  const { state } = context;
  return {
    /**
     * Persist settings, synchronize shared models, and report required UI rebuilds.
     * @param pending Draft settings or null to save the currently installed model.
     * @param source Origin controls language rebuilding while preserving existing save semantics.
     * @returns Whether localization or toggle placement must be rebuilt after the save.
     * @throws TypeError for malformed settings or InvalidRegexOptionsError before any mutation.
     * Storage failures propagate unchanged after retaining the historical model-update ordering.
     */
    async saveOptions(
      pending: Record<string, unknown> | null,
      source: SaveSource
    ): Promise<SaveResult> {
      // Capture placement before applying imports so a changed file preference remounts the toggle.
      const previousLocation = state.options.CMF_BTN_OPTION?.toString() || defaults.CMF_BTN_OPTION;
      const incoming = pending || state.options;
      const languageChanged =
        source === "reset" ||
        (source === "dialog" && state.language !== incoming.CMF_DIALOG_LANGUAGE);
      const hydrated = validateCandidate(incoming);
      replaceContents(state.options, hydrated.options);
      replaceContents(state.filters, hydrated.filters);
      state.language = hydrated.language;
      state.hideAnInfoBox = hydrated.hideAnInfoBox;
      replaceContents(context.options, hydrated.options);
      replaceContents(context.filters, hydrated.filters);
      replaceContents(context.keyWords, hydrated.keyWords);
      await setOptions(JSON.stringify(state.options));
      effects.applyOptions();
      return {
        languageChanged,
        buttonLocationChanged:
          previousLocation !==
          (hydrated.options.CMF_BTN_OPTION?.toString() || defaults.CMF_BTN_OPTION),
      };
    },
    /**
     * Validate the retained settings before clearing storage, then let the later save resolve language.
     * Invalid legacy expressions must not erase persisted settings or mutate the current language.
     */
    async resetOptions(): Promise<void> {
      validateCandidate({ ...state.options, CMF_DIALOG_LANGUAGE: "" });
      await deleteOptions();
      state.options.CMF_DIALOG_LANGUAGE = "";
    },
  };
}
