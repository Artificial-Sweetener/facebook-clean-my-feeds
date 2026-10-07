// SPDX-License-Identifier: GPL-3.0-only

import type { StoredOptions } from "../../../src/core/options/types";
import { defaults } from "../../../src/core/options/defaults";
import {
  applyOptionDefaults,
  buildFilters,
  cloneKeywords,
  hydrateOptions,
  resolveLanguage,
} from "../../../src/core/options/hydrate";
import { translations } from "../../../src/i18n";

describe("core/options/hydrate", () => {
  test("resolveLanguage prefers site language when unset", () => {
    expect(resolveLanguage({}, "en")).toBe("en");
  });

  test("resolveLanguage respects configured language when valid", () => {
    expect(resolveLanguage({ CMF_DIALOG_LANGUAGE: "ar" }, "en")).toBe("ar");
  });

  test("resolveLanguage falls back to site language when config invalid", () => {
    expect(resolveLanguage({ CMF_DIALOG_LANGUAGE: "xx" }, "en")).toBe("en");
  });

  test("resolveLanguage returns unknown site language when both invalid", () => {
    expect(resolveLanguage({ CMF_DIALOG_LANGUAGE: "xx" }, "zz")).toBe("zz");
  });

  test("cloneKeywords returns a copy of translations with expected keys", () => {
    const cloned = cloneKeywords("en");
    expect(cloned).not.toBe(translations.en);
    expect(cloned.NF_STORIES).toBe(translations.en.NF_STORIES);
  });

  test("applyOptionDefaults fills missing values and tracks info boxes", () => {
    const options: StoredOptions = { OTHER_INFO_BOX_CORONAVIRUS: true };
    const keyWords = cloneKeywords("en");

    const hideAnInfoBox = applyOptionDefaults(options, keyWords);

    expect(hideAnInfoBox).toBe(true);
    expect(options.NF_SPONSORED).toBe(defaults.SPONSORED);
    expect(options.NF_BLOCKED_TEXT).toBe("");
    expect(options.NF_BLOCKED_ENABLED).toBe(defaults.NF_BLOCKED_ENABLED);
    expect(options.NF_META_AI_PROMPTS).toBe(true);
    expect(options.VERBOSITY_LEVEL).toBe(defaults.DLG_VERBOSITY);
    expect(options.CMF_BORDER_COLOUR).toBe(defaults.CMF_BORDER_COLOUR);
  });

  test("applyOptionDefaults normalizes radio-backed preference values", () => {
    const options: StoredOptions = {
      VERBOSITY_LEVEL: 2,
      CMF_BTN_OPTION: 1,
      CMF_DIALOG_OPTION: "",
    };
    const keyWords = cloneKeywords("en");

    applyOptionDefaults(options, keyWords);

    expect(options.VERBOSITY_LEVEL).toBe("2");
    expect(options.CMF_BTN_OPTION).toBe("1");
    expect(options.CMF_DIALOG_OPTION).toBe(defaults.CMF_DIALOG_OPTION);
  });

  test("buildFilters merges blocked text across feeds when enabled", () => {
    const options: StoredOptions = {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "alphaIIbeta",
      NF_BLOCKED_FEED: ["1", "0", "0"],
      GF_BLOCKED_ENABLED: true,
      GF_BLOCKED_TEXT: "gamma",
      GF_BLOCKED_FEED: ["1", "0", "0"],
      VF_BLOCKED_ENABLED: false,
      VF_BLOCKED_TEXT: "delta",
      VF_BLOCKED_FEED: ["0", "0", "1"],
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "item",
      MP_BLOCKED_TEXT_DESCRIPTION: "sellIIbuy",
      PP_BLOCKED_ENABLED: false,
      PP_BLOCKED_TEXT: "omega",
    };

    const filters = buildFilters(hydrateOptions(options).options, "II");

    expect(filters.NF_BLOCKED_ENABLED).toBe(true);
    expect(filters.NF_BLOCKED_TEXT).toEqual(["alpha", "beta", "gamma"]);
    expect(filters.NF_BLOCKED_TEXT_LC).toEqual(["alpha", "beta", "gamma"]);
    expect(filters.GF_BLOCKED_ENABLED).toBe(true);
    expect(filters.GF_BLOCKED_TEXT).toEqual(["gamma"]);
    expect(filters.MP_BLOCKED_ENABLED).toBe(true);
    expect(filters.MP_BLOCKED_TEXT).toEqual(["item"]);
    expect(filters.MP_BLOCKED_TEXT_DESCRIPTION).toEqual(["sell", "buy"]);
  });

  test("buildFilters disables filters when blocked text is empty", () => {
    const options: StoredOptions = {
      NF_BLOCKED_ENABLED: false,
      NF_BLOCKED_TEXT: "alpha",
      NF_BLOCKED_FEED: ["1", "0", "0"],
      GF_BLOCKED_ENABLED: false,
      GF_BLOCKED_TEXT: "",
      GF_BLOCKED_FEED: ["0", "1", "0"],
      VF_BLOCKED_ENABLED: false,
      VF_BLOCKED_TEXT: "",
      VF_BLOCKED_FEED: ["0", "0", "1"],
      MP_BLOCKED_ENABLED: false,
      MP_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT_DESCRIPTION: "",
      PP_BLOCKED_ENABLED: false,
      PP_BLOCKED_TEXT: "",
    };

    const filters = buildFilters(hydrateOptions(options).options, "II");

    expect(filters.NF_BLOCKED_ENABLED).toBe(false);
    expect(filters.NF_BLOCKED_TEXT).toEqual([]);
    expect(filters.GF_BLOCKED_ENABLED).toBe(false);
    expect(filters.VF_BLOCKED_ENABLED).toBe(false);
    expect(filters.MP_BLOCKED_ENABLED).toBe(false);
    expect(filters.PP_BLOCKED_ENABLED).toBe(false);
  });

  test("hydrateOptions wires defaults, filters, and language", () => {
    const { options, filters, language, hideAnInfoBox, keyWords } = hydrateOptions({}, "en");

    expect(language).toBe("en");
    expect(options.CMF_DIALOG_LANGUAGE).toBe("en");
    expect(filters).toHaveProperty("NF_BLOCKED_ENABLED");
    expect(typeof hideAnInfoBox).toBe("boolean");
    expect(keyWords.NF_STORIES).toBe(translations.en.NF_STORIES);
  });
});
