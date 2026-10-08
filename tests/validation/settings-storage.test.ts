/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import "fake-indexeddb/auto";
import { deleteOptions, getOptions, setOptions } from "../../src/storage/idb";
import { decodeStoredOptions, hydrateOptions } from "../../src/core/options/hydrate";
import { allKnownOptions, arrayOptionKeys, booleanOptionKeys } from "./settings-fixtures";

beforeEach(async () => {
  await deleteOptions();
});
afterEach(async () => {
  await deleteOptions();
});

describe("settings complete IndexedDB roundtrip", () => {
  test.each(
    [false, true].flatMap((enabled) =>
      ["serialized", "record"].flatMap((representation) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((scope) => ({ enabled, representation, scope }))
      )
    )
  )(
    "76 keys survive $representation storage with enable $enabled and scope $scope",
    async ({ enabled, representation, scope }) => {
      const settings = { ...allKnownOptions };
      for (const key of booleanOptionKeys) Reflect.set(settings, key, enabled);
      for (const key of arrayOptionKeys) {
        Reflect.set(
          settings,
          key,
          [0, 1, 2].map((bit) => (scope & (1 << bit) ? "1" : "0"))
        );
      }
      const hydratedBefore = hydrateOptions(settings);
      const payload = representation === "serialized" ? JSON.stringify(settings) : settings;
      await setOptions(payload);
      const stored = await getOptions();
      expect(stored).toEqual(payload);
      if (typeof stored !== "string") expect(stored).not.toBe(payload);
      const decoded = decodeStoredOptions(typeof stored === "string" ? JSON.parse(stored) : stored);
      if (!decoded) throw new Error("Persisted complete options failed boundary validation");
      const hydratedAfter = hydrateOptions(decoded);
      expect(hydratedAfter.options).toEqual(hydratedBefore.options);
      expect(hydratedAfter.filters).toEqual(hydratedBefore.filters);
      expect(hydratedAfter.language).toBe(hydratedBefore.language);
      expect(hydratedAfter.hideAnInfoBox).toBe(hydratedBefore.hideAnInfoBox);
      await deleteOptions();
      expect(await getOptions()).toBeUndefined();
    }
  );

  test("IndexedDB snapshots arrays rather than keeping live references to later option edits", async () => {
    const settings = { ...allKnownOptions, NF_BLOCKED_FEED: ["1", "0", "0"] };
    await setOptions(settings);
    settings.NF_BLOCKED_FEED[1] = "1";
    settings.NF_BLOCKED_TEXT = "Changed after write";
    const stored = decodeStoredOptions(await getOptions());
    expect(stored?.NF_BLOCKED_FEED).toEqual(["1", "0", "0"]);
    expect(stored?.NF_BLOCKED_TEXT).toBe(allKnownOptions.NF_BLOCKED_TEXT);
  });
});
