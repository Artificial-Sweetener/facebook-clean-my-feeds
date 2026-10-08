// SPDX-License-Identifier: GPL-3.0-only

import { defaults } from "../../../src/core/options/defaults";
import {
  buildFilters,
  cloneKeywords,
  decodeStoredOptions,
  hydrateOptions,
} from "../../../src/core/options/hydrate";
import { translations } from "../../../src/i18n";

describe("options and catalog compatibility", () => {
  test("leaves historically unhydrated defaults absent and materializes the established aliases", () => {
    const { options } = hydrateOptions();
    expect(options).not.toHaveProperty("SPONSORED");
    expect(options).not.toHaveProperty("DLG_VERBOSITY");
    for (const key of [
      "REELS_CONTROLS",
      "REELS_DISABLE_LOOPING",
      "NF_BLOCKED_RE",
      "GF_BLOCKED_RE",
      "VF_BLOCKED_RE",
      "MP_BLOCKED_RE",
      "PP_BLOCKED_RE",
    ]) {
      expect(options).not.toHaveProperty(key);
    }
    expect([
      options.NF_SPONSORED,
      options.GF_SPONSORED,
      options.VF_SPONSORED,
      options.MP_SPONSORED,
    ]).toEqual([true, true, true, true]);
    expect(options.VERBOSITY_LEVEL).toBe(defaults.DLG_VERBOSITY);
  });

  test("preserves shallow default-array aliases and stored arrays without mutating the record", () => {
    const feed = ["0", "1", "0"];
    const stored = { NF_BLOCKED_FEED: feed, legacy: { value: 2 } };
    const { options } = hydrateOptions(stored);
    expect(options).not.toBe(stored);
    expect(options.NF_BLOCKED_FEED).toBe(feed);
    expect(options.GF_BLOCKED_FEED).toBe(defaults.GF_BLOCKED_FEED);
    expect(options).toHaveProperty("legacy", stored.legacy);
    expect(stored).not.toHaveProperty("CMF_DIALOG_LANGUAGE");
  });

  test("retains an unknown site language when explicit configuration is invalid but uses English text", () => {
    const hydrated = hydrateOptions({ CMF_DIALOG_LANGUAGE: "xx" }, "zz");
    expect(hydrated.language).toBe("zz");
    expect(hydrated.options.CMF_DIALOG_LANGUAGE).toBe("zz");
    expect(hydrated.keyWords).toEqual(translations.en);
    expect(hydrateOptions({}, "zz").language).toBe("en");
  });

  test("keeps all locale-only values and non-English empty profile feed labels", () => {
    expect(Object.keys(translations)).toHaveLength(23);
    expect(translations.de.SPONSORED_EXTRA).toBe("Anzeige");
    expect(translations.de.DLG_TIPS_MAINTAINER_PREFIX).toBe("Vom Maintainer:");
    expect(translations.en.PP_BLOCKED_FEED).toEqual(["Profile page"]);
    expect(translations.ar.PP_BLOCKED_FEED).toBe("");
    expect(cloneKeywords("de").SPONSORED_EXTRA).toBe("Anzeige");
    expect(cloneKeywords("en").DLG_BUTTONS).toBe(translations.en.DLG_BUTTONS);
  });

  test("retains marketplace's empty title token when only description filtering is enabled", () => {
    const options = hydrateOptions({
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "SaleİİSALE",
    }).options;
    const filters = buildFilters(options);
    expect(filters.MP_BLOCKED_TEXT).toEqual([""]);
    expect(filters.MP_BLOCKED_TEXT_DESCRIPTION).toEqual(["Sale", "SALE"]);
    expect(filters.MP_BLOCKED_TEXT_DESCRIPTION_LC).toEqual(["sale", "sale"]);
  });

  test("retains legacy normalization of explicit undefined colors/debug and null radio values", () => {
    const input = {
      VERBOSITY_DEBUG: undefined,
      VERBOSITY_MESSAGE_BG_COLOUR: undefined,
      VERBOSITY_LEVEL: null,
    };
    expect(decodeStoredOptions(input)).toBe(input);
    const { options } = hydrateOptions(input);
    expect(options.VERBOSITY_DEBUG).toBe(defaults.VERBOSITY_DEBUG);
    expect(options.VERBOSITY_MESSAGE_BG_COLOUR).toBe(defaults.VERBOSITY_MESSAGE_BG_COLOUR);
    expect(options.VERBOSITY_LEVEL).toBe(defaults.DLG_VERBOSITY);
  });

  test("boundary decoding rejects malformed known values while preserving valid legacy extra keys", () => {
    expect(decodeStoredOptions({ NF_STORIES: "true" })).toBeUndefined();
    expect(decodeStoredOptions({ NF_BLOCKED_FEED: [1] })).toBeUndefined();
    expect(decodeStoredOptions([])).toBeUndefined();
    expect(decodeStoredOptions(null)).toBeUndefined();
    expect(decodeStoredOptions({ NF_STORIES: true, extra: { nested: 1 } })).toEqual({
      NF_STORIES: true,
      extra: { nested: 1 },
    });
  });
});
