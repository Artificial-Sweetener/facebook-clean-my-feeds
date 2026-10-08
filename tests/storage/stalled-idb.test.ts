// SPDX-License-Identifier: GPL-3.0-only

import { IDBFactory, IDBOpenDBRequest } from "fake-indexeddb";
import type { OptionsState } from "../../src/runtime/load-options";

let originalIndexedDB: PropertyDescriptor | undefined;

/** Isolate the real adapter's eager database promise from both other tests and browser storage. */
beforeEach(() => {
  originalIndexedDB = Object.getOwnPropertyDescriptor(globalThis, "indexedDB");
  Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: new IDBFactory() });
  document.documentElement.lang = "en";
  jest.useFakeTimers();
});

/** Restore capabilities and timers even when a stalled native request never finishes. */
afterEach(() => {
  if (originalIndexedDB) Object.defineProperty(globalThis, "indexedDB", originalIndexedDB);
  else Reflect.deleteProperty(globalThis, "indexedDB");
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("real startup with stalled IndexedDB", () => {
  test.each([false, true])(
    "a never-settling open releases defaults and leaves no poller with Safari=%s",
    async (safari) => {
      jest
        .spyOn(navigator, "userAgent", "get")
        .mockReturnValue(safari ? "Version/15.0 Safari/605.1.15" : "Chrome/120.0 Safari/537.36");
      const probe = jest
        .spyOn(indexedDB, "databases")
        .mockImplementation(() => new Promise(() => {}));
      const open = jest.spyOn(indexedDB, "open").mockReturnValue(new IDBOpenDBRequest());
      await jest.isolateModulesAsync(async () => {
        const storage = await import("../../src/storage/idb");
        const writes = jest.spyOn(storage, "setOptions");
        const { loadOptions } = await import("../../src/runtime/load-options");
        const state: OptionsState = {
          options: {},
          filters: {},
          language: "",
          hideAnInfoBox: false,
          optionsReady: false,
        };
        const pending = loadOptions(state);
        await jest.advanceTimersByTimeAsync(3000);
        await expect(pending).resolves.toHaveProperty("language", "en");
        expect(state.optionsReady).toBe(true);
        expect(state.options.NF_SPONSORED).toBe(true);
        expect(writes).not.toHaveBeenCalled();
        await jest.advanceTimersByTimeAsync(57_000);
        expect(open).toHaveBeenCalledTimes(1);
        expect(probe).toHaveBeenCalledTimes(safari ? 10 : 0);
        expect(jest.getTimerCount()).toBe(0);
      });
    }
  );
});
