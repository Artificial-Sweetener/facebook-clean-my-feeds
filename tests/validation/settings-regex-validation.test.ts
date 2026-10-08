// SPDX-License-Identifier: GPL-3.0-only

import { buildFilters } from "../../src/core/options/build-filters";
import {
  getRegexValidationIssues,
  InvalidRegexOptionsError,
  resolveRegexFilters,
  type RegexFeed,
} from "../../src/core/options/regex-validation";
import type { Options } from "../../src/core/options/types";
import { deleteOptions, setOptions } from "../../src/storage/idb";
import { allKnownOptions, createSettingsFixture } from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));
beforeEach(() => {
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
  jest.mocked(deleteOptions).mockReset().mockResolvedValue(undefined);
});

const feeds: readonly RegexFeed[] = ["NF", "GF", "VF", "PP"];

/** Persisted scope flags deliberately match the production exact-string activation convention. */
function flags(mask: number): string[] {
  return [0, 1, 2].map((bit) => (mask & (1 << bit) ? "1" : "0"));
}

describe("regex boundary validation and provenance", () => {
  test.each(feeds)(
    "isolates only invalid active rules and preserves source lines for %s",
    (feed) => {
      const options: Options = {
        [`${feed}_BLOCKED_ENABLED`]: true,
        [`${feed}_BLOCKED_RE`]: true,
        [`${feed}_BLOCKED_TEXT`]: "^\\D+$İİ[İİ^valid$İİ(",
      };
      const result = resolveRegexFilters(options);
      expect(result.issues).toEqual([
        { field: `${feed}_BLOCKED_TEXT`, line: 2, destination: feed },
        { field: `${feed}_BLOCKED_TEXT`, line: 4, destination: feed },
      ]);
      expect(result.filters[`${feed}_BLOCKED_TEXT`]).toEqual(["^\\D+$", "^valid$"]);
      expect(result.filters[`${feed}_BLOCKED_TEXT_LC`]).toEqual(["^\\d+$", "^valid$"]);
      expect(result.filters[`${feed}_BLOCKED_ENABLED`]).toBe(true);
      expect(options[`${feed}_BLOCKED_TEXT`]).toBe("^\\D+$İİ[İİ^valid$İİ(");
    }
  );

  test.each(feeds)("all invalid regex rules disable only the derived %s text matcher", (feed) => {
    const options: Options = {
      [`${feed}_BLOCKED_ENABLED`]: true,
      [`${feed}_BLOCKED_RE`]: true,
      [`${feed}_BLOCKED_TEXT`]: "[İİ(",
    };
    const result = resolveRegexFilters(options);
    expect(result.filters[`${feed}_BLOCKED_ENABLED`]).toBe(false);
    expect(result.filters[`${feed}_BLOCKED_TEXT`]).toEqual([]);
    expect(options[`${feed}_BLOCKED_ENABLED`]).toBe(true);
  });

  test.each(feeds)(
    "disabled and literal %s rules do not become regex validation failures",
    (feed) => {
      for (const [enabled, regex] of [
        [false, false],
        [false, true],
        [true, false],
      ]) {
        const options: Options = {
          [`${feed}_BLOCKED_ENABLED`]: enabled,
          [`${feed}_BLOCKED_RE`]: regex,
          [`${feed}_BLOCKED_TEXT`]: "[",
        };
        expect(getRegexValidationIssues(options)).toEqual([]);
        expect(resolveRegexFilters(options).filters).toEqual(buildFilters(options));
      }
    }
  );

  test("cross-feed regex failure reports original source rather than destination-list offset", () => {
    const options: Options = {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_RE: false,
      NF_BLOCKED_TEXT: "literalİİ[",
      NF_BLOCKED_FEED: ["1", "1", "1"],
      GF_BLOCKED_ENABLED: true,
      GF_BLOCKED_RE: true,
      GF_BLOCKED_TEXT: "^group$",
      VF_BLOCKED_ENABLED: true,
      VF_BLOCKED_RE: true,
      VF_BLOCKED_TEXT: "^video$",
    };
    const result = resolveRegexFilters(options);
    expect(result.issues).toEqual([
      { field: "NF_BLOCKED_TEXT", line: 2, destination: "GF" },
      { field: "NF_BLOCKED_TEXT", line: 2, destination: "VF" },
    ]);
    expect(result.filters.NF_BLOCKED_TEXT).toEqual(["literal", "["]);
    expect(result.filters.GF_BLOCKED_TEXT).toEqual(["^group$", "literal"]);
    expect(result.filters.VF_BLOCKED_TEXT).toEqual(["^video$", "literal"]);
  });

  test("Marketplace's currently inert regex flags do not reject or reinterpret its literal rules", () => {
    const options: Options = {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_RE: true,
      MP_BLOCKED_TEXT: "[",
      MP_BLOCKED_TEXT_DESCRIPTION: "(",
    };
    expect(getRegexValidationIssues(options)).toEqual([]);
    expect(resolveRegexFilters(options).filters).toEqual(buildFilters(options));
  });

  test.each(["[", "(", "*", "\\", "(?<", "[z-a]"])(
    "new invalid expression %p rejects before every mutation and write",
    async (pattern) => {
      const fixture = createSettingsFixture({
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_RE: true,
        NF_BLOCKED_TEXT: "^valid$",
      });
      const beforeOptions = JSON.stringify(fixture.state.options);
      const beforeFilters = JSON.stringify(fixture.state.filters);
      const beforeKeywords = JSON.stringify(fixture.context.keyWords);
      for (const source of ["dialog", "file"] as const) {
        await expect(
          fixture.service.saveOptions(
            { ...fixture.state.options, CMF_DIALOG_LANGUAGE: "de", NF_BLOCKED_TEXT: pattern },
            source
          )
        ).rejects.toBeInstanceOf(InvalidRegexOptionsError);
        expect(JSON.stringify(fixture.state.options)).toBe(beforeOptions);
        expect(JSON.stringify(fixture.state.filters)).toBe(beforeFilters);
        expect(JSON.stringify(fixture.context.keyWords)).toBe(beforeKeywords);
        expect(fixture.state.language).toBe("en");
      }
      expect(setOptions).not.toHaveBeenCalled();
      expect(fixture.applyOptions).not.toHaveBeenCalled();
    }
  );

  test("diagnostic issue records and thrown error contain coordinates but never private expressions", async () => {
    const pattern = "Private customer secret [";
    const options = { NF_BLOCKED_ENABLED: true, NF_BLOCKED_RE: true, NF_BLOCKED_TEXT: pattern };
    const issues = getRegexValidationIssues(options);
    expect(JSON.stringify(issues)).toBe(
      '[{"field":"NF_BLOCKED_TEXT","line":1,"destination":"NF"}]'
    );
    const error = new InvalidRegexOptionsError(issues);
    expect(`${error.message}${JSON.stringify(error)}`).not.toContain("Private customer secret");
  });

  test("reset validates retained legacy rules before deleting storage or changing language", async () => {
    const fixture = createSettingsFixture({
      CMF_DIALOG_LANGUAGE: "de",
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_RE: true,
      NF_BLOCKED_TEXT: "^Valid$İİ[",
    });
    const before = JSON.stringify(fixture.context);
    await expect(fixture.service.resetOptions()).rejects.toBeInstanceOf(InvalidRegexOptionsError);
    expect(JSON.stringify(fixture.context)).toBe(before);
    expect(deleteOptions).not.toHaveBeenCalled();
    expect(setOptions).not.toHaveBeenCalled();
    expect(fixture.applyOptions).not.toHaveBeenCalled();
  });

  test("all enabled/scope combinations retain exact valid filter construction in literal and regex modes", () => {
    for (let enabled = 0; enabled < 8; enabled += 1) {
      for (let scope = 0; scope < 512; scope += 1) {
        for (const regex of [false, true]) {
          const options: Options = {
            ...allKnownOptions,
            NF_BLOCKED_ENABLED: Boolean(enabled & 1),
            GF_BLOCKED_ENABLED: Boolean(enabled & 2),
            VF_BLOCKED_ENABLED: Boolean(enabled & 4),
            NF_BLOCKED_RE: regex,
            GF_BLOCKED_RE: regex,
            VF_BLOCKED_RE: regex,
            NF_BLOCKED_TEXT: "^\\D+$İİNews",
            GF_BLOCKED_TEXT: "İİGroup",
            VF_BLOCKED_TEXT: "Videoİİ",
            NF_BLOCKED_FEED: flags(scope),
            GF_BLOCKED_FEED: flags(scope >> 3),
            VF_BLOCKED_FEED: flags(scope >> 6),
          };
          const result = resolveRegexFilters(options);
          expect({ enabled, scope, regex, filters: result.filters, issues: result.issues }).toEqual(
            { enabled, scope, regex, filters: buildFilters(options), issues: [] }
          );
        }
      }
    }
  });
});
