// SPDX-License-Identifier: GPL-3.0-only

import { buildFilters, decodeStoredOptions, hydrateOptions } from "../../src/core/options/hydrate";
import type { Options } from "../../src/core/options/types";
import { SEPARATOR } from "../../src/core/options/constants";
import { setOptions } from "../../src/storage/idb";
import {
  allKnownOptions,
  arrayOptionKeys,
  booleanOptionKeys,
  createSettingsFixture,
  stringOptionKeys,
} from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));

beforeEach(() => {
  document.documentElement.lang = "en";
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
});

describe("settings complete persisted option inventory", () => {
  test.each([false, true])("roundtrips every option with boolean flags %p", async (enabled) => {
    const pending = { ...allKnownOptions };
    for (const key of booleanOptionKeys) Reflect.set(pending, key, enabled);
    const original = JSON.stringify(pending);
    const { service, context } = createSettingsFixture();
    await service.saveOptions(pending, "file");
    const serialized = jest.mocked(setOptions).mock.calls.at(-1)?.[0];
    if (typeof serialized !== "string") throw new Error("Expected serialized storage write");
    const decoded = decodeStoredOptions(JSON.parse(serialized));
    if (!decoded) throw new Error("Complete fixture failed the production decoder");
    const restored = hydrateOptions(decoded);
    expect(restored.options).toEqual(pending);
    expect(restored.filters).toEqual(context.filters);
    expect(JSON.stringify(pending)).toBe(original);
    expect(new Set([...booleanOptionKeys, ...arrayOptionKeys, ...stringOptionKeys]).size).toBe(
      Object.keys(allKnownOptions).length
    );
  });

  test.each(booleanOptionKeys)(
    "rejects corrupt boolean %s without mutating options",
    async (key) => {
      const { context, service, applyOptions } = createSettingsFixture(allKnownOptions);
      const before = JSON.stringify(context);
      for (const malformed of ["true", "false", 1, 0, null, [], {}]) {
        await expect(
          service.saveOptions({ ...allKnownOptions, [key]: malformed }, "file")
        ).rejects.toThrow(TypeError);
        expect(JSON.stringify(context)).toBe(before);
      }
      expect(setOptions).not.toHaveBeenCalled();
      expect(applyOptions).not.toHaveBeenCalled();
    }
  );

  test.each(arrayOptionKeys)("preserves legacy string-array shapes for %s", (key) => {
    for (const value of [[], ["1"], ["true", "false"], ["1", "0", "1", "legacy"]]) {
      const decoded = decodeStoredOptions({ ...allKnownOptions, [key]: value });
      expect(decoded).toBeDefined();
      if (!decoded) throw new Error("Valid legacy string array was rejected");
      expect(Reflect.get(hydrateOptions(decoded).options, key)).toEqual(value);
    }
    for (const value of ["101", [1, 0, 1], ["1", null], {}, null]) {
      expect(decodeStoredOptions({ ...allKnownOptions, [key]: value })).toBeUndefined();
    }
  });

  test.each(
    stringOptionKeys.filter(
      (key) =>
        !["VERBOSITY_LEVEL", "CMF_BTN_OPTION", "CMF_DIALOG_OPTION", "CMF_DIALOG_LANGUAGE"].includes(
          key
        )
    )
  )("rejects malformed text preference %s", (key) => {
    for (const value of [0, true, null, [], {}]) {
      expect(decodeStoredOptions({ ...allKnownOptions, [key]: value })).toBeUndefined();
    }
  });

  test.each(["VERBOSITY_LEVEL", "CMF_BTN_OPTION", "CMF_DIALOG_OPTION"])(
    "normalizes every primitive radio representation for %s",
    (key) => {
      const valid = key === "CMF_DIALOG_OPTION" ? ["0", "1"] : ["0", "1", "2"];
      const fallback = key === "CMF_BTN_OPTION" ? "1" : "0";
      for (const value of [
        undefined,
        null,
        false,
        true,
        "",
        "invalid",
        -1,
        0,
        1,
        2,
        3,
        "0",
        "1",
        "2",
      ]) {
        const decoded = decodeStoredOptions({ [key]: value });
        if (!decoded) throw new Error("Primitive legacy radio representation was rejected");
        const normalized = String(value);
        expect(Reflect.get(hydrateOptions(decoded).options, key)).toBe(
          valid.includes(normalized) ? normalized : fallback
        );
      }
    }
  );
});

/** Convert exactly three scope bits to persisted string flags without assuming array-length validation. */
function scopeFlags(mask: number): string[] {
  return [0, 1, 2].map((bit) => (mask & (1 << bit) ? "1" : "0"));
}

/** Independently model ordered own-list then cross-feed contributions for one destination. */
function expectedFeed(enabled: boolean[], scopes: string[][], destination: number): string[] {
  if (!enabled[destination]) return [];
  const labels = ["News", "Groups", "Videos"];
  const own = labels[destination];
  if (!own) throw new Error("Unknown matrix destination");
  return [
    own,
    ...labels.filter(
      (_, source) =>
        source !== destination && enabled[source] && scopes[source]?.[destination] === "1"
    ),
  ];
}

describe("settings directed feed-scope activation matrix", () => {
  test.each([0, 1, 2, 3, 4, 5, 6, 7])(
    "all 512 directed scope combinations respect enabled mask %i",
    (enabledMask) => {
      const enabled = [0, 1, 2].map((bit) => Boolean(enabledMask & (1 << bit)));
      for (let scopeMask = 0; scopeMask < 512; scopeMask += 1) {
        const scopes = [0, 3, 6].map((shift) => scopeFlags((scopeMask >> shift) & 7));
        const options: Options = {
          NF_BLOCKED_ENABLED: Boolean(enabled[0]),
          NF_BLOCKED_TEXT: "News",
          GF_BLOCKED_ENABLED: Boolean(enabled[1]),
          GF_BLOCKED_TEXT: "Groups",
          VF_BLOCKED_ENABLED: Boolean(enabled[2]),
          VF_BLOCKED_TEXT: "Videos",
          NF_BLOCKED_FEED: scopes[0] || [],
          GF_BLOCKED_FEED: scopes[1] || [],
          VF_BLOCKED_FEED: scopes[2] || [],
        };
        const filters = buildFilters(options);
        expect({
          enabledMask,
          scopeMask,
          lists: [filters.NF_BLOCKED_TEXT, filters.GF_BLOCKED_TEXT, filters.VF_BLOCKED_TEXT],
        }).toEqual({
          enabledMask,
          scopeMask,
          lists: [0, 1, 2].map((destination) => expectedFeed(enabled, scopes, destination)),
        });
        expect([
          filters.NF_BLOCKED_ENABLED,
          filters.GF_BLOCKED_ENABLED,
          filters.VF_BLOCKED_ENABLED,
        ]).toEqual(enabled);
      }
    }
  );

  test.each([false, true])(
    "all five destination flags are strict when enabled is %p",
    (enabled) => {
      const options = { ...allKnownOptions };
      for (const prefix of ["NF", "GF", "VF", "MP", "PP"]) {
        Reflect.set(options, `${prefix}_BLOCKED_ENABLED`, enabled);
      }
      const filters = buildFilters(options);
      for (const prefix of ["NF", "GF", "VF", "MP", "PP"]) {
        expect(Reflect.get(filters, `${prefix}_BLOCKED_ENABLED`)).toBe(enabled);
        const list: unknown = Reflect.get(filters, `${prefix}_BLOCKED_TEXT`);
        expect(Array.isArray(list)).toBe(true);
        if (!Array.isArray(list)) throw new Error("Expected a materialized filter list");
        expect(list.length > 0).toBe(enabled);
      }
    }
  );

  test.each(["", "İİ", "İİWordİİ", "OneİİİİTwo", "İI", "Iİ", " A "])(
    "preserves exact delimiter and empty-token contract for %p",
    (text) => {
      const filters = buildFilters({ NF_BLOCKED_ENABLED: true, NF_BLOCKED_TEXT: text });
      expect(filters.NF_BLOCKED_ENABLED).toBe(text.length > 0);
      expect(filters.NF_BLOCKED_TEXT).toEqual(text.length ? text.split(SEPARATOR) : []);
      expect(filters.NF_BLOCKED_TEXT_LC).toEqual(
        text.length ? text.split(SEPARATOR).map((part) => part.toLowerCase()) : []
      );
    }
  );

  test("disabled destination never inherits enabled source text and unusual scope values stay inert", () => {
    const filters = buildFilters({
      NF_BLOCKED_ENABLED: false,
      NF_BLOCKED_TEXT: "News",
      NF_BLOCKED_FEED: ["1", "1", "1"],
      GF_BLOCKED_ENABLED: true,
      GF_BLOCKED_TEXT: "Group",
      GF_BLOCKED_FEED: ["1", "true", "01"],
      VF_BLOCKED_ENABLED: true,
      VF_BLOCKED_TEXT: "Video",
      VF_BLOCKED_FEED: [],
    });
    expect(filters.NF_BLOCKED_TEXT).toEqual([]);
    expect(filters.GF_BLOCKED_TEXT).toEqual(["Group"]);
    expect(filters.VF_BLOCKED_TEXT).toEqual(["Video"]);
  });
});
