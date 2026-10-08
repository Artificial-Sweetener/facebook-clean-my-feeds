// SPDX-License-Identifier: GPL-3.0-only

import type { OptionsState } from "../../src/runtime/load-options";

let originalIndexedDB: PropertyDescriptor | undefined;

/** Simulate browsers that expose Safari identification while withholding IndexedDB entirely. */
beforeEach(() => {
  originalIndexedDB = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");
  Reflect.deleteProperty(globalThis, "indexedDB");
  jest.spyOn(navigator, "userAgent", "get").mockReturnValue("Version/15.0 Safari/605.1.15");
  document.documentElement.lang = "en";
});

/** Restore the original browser capability and navigator even when module import fails. */
afterEach(() => {
  if (originalIndexedDB) Object.defineProperty(globalThis, "indexedDB", originalIndexedDB);
  else Reflect.deleteProperty(globalThis, "indexedDB");
  jest.restoreAllMocks();
});

describe("Safari without IndexedDB", () => {
  test("imports the real eager storage wrapper and exposes opening failure as a rejected read", async () => {
    await jest.isolateModulesAsync(async () => {
      const storage = await import("../../src/storage/idb");
      expect(storage.DB_NAME).toBe("dbCMF");
      await expect(storage.getOptions()).rejects.toThrow();
    });
  });

  test("the real startup loader recovers unavailable storage without a mocked persistence wrapper", async () => {
    await jest.isolateModulesAsync(async () => {
      const { loadOptions } = await import("../../src/runtime/load-options");
      const state: OptionsState = {
        options: {},
        filters: {},
        language: "",
        hideAnInfoBox: false,
        optionsReady: false,
      };
      const result = await loadOptions(state);
      expect(state.optionsReady).toBe(true);
      expect(state.options.NF_SPONSORED).toBe(true);
      expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
      expect(result.options).toBe(state.options);
      expect(result.language).toBe("en");
    });
  });
});
