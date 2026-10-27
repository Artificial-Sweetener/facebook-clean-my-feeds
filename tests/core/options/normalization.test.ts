// SPDX-License-Identifier: GPL-3.0-only
import { defaults } from "../../../src/core/options/defaults";
import { decodeStoredOptions, hydrateOptions } from "../../../src/core/options/hydrate";
import { isHydratedOptions } from "../../../src/core/options/validate";
import type { StoredScalar } from "../../../src/core/options/types";

/** Every setting whose original hydration routine explicitly normalizes legacy scalar values. */
type NormalizedKey =
  | "VERBOSITY_LEVEL"
  | "CMF_BTN_OPTION"
  | "CMF_DIALOG_OPTION"
  | "CMF_DIALOG_LANGUAGE"
  | "VERBOSITY_DEBUG"
  | "VERBOSITY_MESSAGE_BG_COLOUR"
  | "CMF_BORDER_COLOUR";

/** Input/output pairs cover sentinel normalization without permitting arbitrary object coercion. */
interface NormalizationCase {
  key: NormalizedKey;
  value: StoredScalar;
  expected: string | boolean;
}

const radioKeys = ["VERBOSITY_LEVEL", "CMF_BTN_OPTION", "CMF_DIALOG_OPTION"] as const;

const cases: NormalizationCase[] = [
  ...radioKeys.flatMap((key): NormalizationCase[] => {
    const fallback = key === "VERBOSITY_LEVEL" ? defaults.DLG_VERBOSITY : defaults[key];
    return [
      ...[undefined, null, "", "invalid", true, false, 3].map((value) => ({
        key,
        value,
        expected: fallback,
      })),
      { key, value: 0, expected: "0" },
      { key, value: 1, expected: "1" },
      { key, value: 2, expected: key === "CMF_DIALOG_OPTION" ? fallback : "2" },
    ];
  }),
  ...[undefined, null, "", false, 0].map((value) => ({
    key: "CMF_DIALOG_LANGUAGE" as const,
    value,
    expected: "en",
  })),
  ...[true, 1, "unsupported"].map((value) => ({
    key: "CMF_DIALOG_LANGUAGE" as const,
    value,
    expected: "ar",
  })),
  { key: "CMF_DIALOG_LANGUAGE", value: "de", expected: "de" },
  ...[undefined, ""].map((value) => ({
    key: "VERBOSITY_DEBUG" as const,
    value,
    expected: defaults.VERBOSITY_DEBUG,
  })),
  ...[undefined, ""].map((value) => ({
    key: "VERBOSITY_MESSAGE_BG_COLOUR" as const,
    value,
    expected: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
  })),
  { key: "CMF_BORDER_COLOUR", value: "", expected: defaults.CMF_BORDER_COLOUR },
];

describe("legacy option normalization boundaries", () => {
  test.each(cases)(
    "normalizes $key=$value without losing unrelated saved choices",
    ({ key, value, expected }) => {
      const input: Record<string, unknown> = {
        NF_STORIES: true,
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "My saved filter",
        [key]: value,
      };
      const decoded = decodeStoredOptions(input);
      expect(decoded).toBe(input);
      if (!decoded) throw new Error("Expected the documented legacy sentinel to be accepted");
      const result = hydrateOptions(decoded, "ar");
      expect(result.options[key]).toBe(expected);
      expect(result.options.NF_STORIES).toBe(true);
      expect(result.filters.NF_BLOCKED_TEXT).toEqual(["My saved filter"]);
      expect(isHydratedOptions(result.options)).toBe(true);
    }
  );

  test("does not certify the empty debug sentinel as an already hydrated boolean", () => {
    const unnormalized = { ...hydrateOptions().options, VERBOSITY_DEBUG: "" };
    expect(decodeStoredOptions(unnormalized)).toBe(unnormalized);
    expect(isHydratedOptions(unnormalized)).toBe(false);
  });

  test("rejects unsafe debug/color sentinels and unrecognized structured option values", () => {
    expect(decodeStoredOptions({ VERBOSITY_DEBUG: null })).toBeUndefined();
    expect(decodeStoredOptions({ VERBOSITY_MESSAGE_BG_COLOUR: null })).toBeUndefined();
    expect(decodeStoredOptions({ CMF_BORDER_COLOUR: undefined })).toBeUndefined();
    expect(decodeStoredOptions({ CMF_BTN_OPTION: {} })).toBeUndefined();
    expect(decodeStoredOptions({ CMF_DIALOG_LANGUAGE: [] })).toBeUndefined();
  });
});
