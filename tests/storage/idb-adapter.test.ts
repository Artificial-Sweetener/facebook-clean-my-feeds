/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import "fake-indexeddb/auto";
import {
  clear,
  createStore,
  delMany,
  entries,
  get,
  getMany,
  keys,
  promisifyRequest,
  set,
  setMany,
  update,
  values,
} from "../../src/vendor/idb-keyval";
import type { UseStore } from "../../src/vendor/idb-keyval";

let nextDatabase = 0;

/** Allocate an isolated real IndexedDB implementation for each behavioral adapter test. */
function freshStore(): UseStore {
  nextDatabase += 1;
  return createStore(`adapter-test-${nextDatabase}`, "values");
}

/** Restore navigator and IndexedDB spies even when an assertion fails. */
afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

describe("owned IndexedDB adapter", () => {
  test("starts opening eagerly before the returned store is called", async () => {
    const open = jest.spyOn(indexedDB, "open");
    const store = freshStore();
    await Promise.resolve();
    expect(open).toHaveBeenCalledTimes(1);
    await expect(get("missing", store)).resolves.toBeUndefined();
  });

  test("preserves batched reads, cursor order, updates and deletion", async () => {
    const store = freshStore();
    await setMany(
      [
        ["b", 2],
        ["a", { count: 1 }],
      ],
      store
    );
    await expect(getMany(["b", "missing", "a"], store)).resolves.toEqual([
      2,
      undefined,
      { count: 1 },
    ]);
    await expect(keys(store)).resolves.toEqual(["a", "b"]);
    await expect(values(store)).resolves.toEqual([{ count: 1 }, 2]);
    await expect(entries(store)).resolves.toEqual([
      ["a", { count: 1 }],
      ["b", 2],
    ]);
    await update("b", (value) => (typeof value === "number" ? value + 1 : 0), store);
    await expect(get("b", store)).resolves.toBe(3);
    await delMany(["a", "missing"], store);
    await expect(keys(store)).resolves.toEqual(["b"]);
    await clear(store);
    await expect(keys(store)).resolves.toEqual([]);
  });

  test("write promises reject on abort and no value is committed", async () => {
    const store = freshStore();
    /** Abort after queuing the write to prove resolution waits for transaction commit. */
    const abortingStore: UseStore = (mode, callback) =>
      store(mode, (objectStore) => {
        const result = callback(objectStore);
        objectStore.transaction.abort();
        return result;
      });
    await expect(set("aborted", true, abortingStore)).rejects.toBeNull();
    await expect(get("aborted", store)).resolves.toBeUndefined();
  });

  test("native request errors reject instead of reporting a successful write", async () => {
    const store = freshStore();
    await set("existing", 1, store);
    await expect(
      store("readwrite", (objectStore) => promisifyRequest(objectStore.add(2, "existing")))
    ).rejects.toHaveProperty("name", "ConstraintError");
    await expect(get("existing", store)).resolves.toBe(1);
  });

  test("database-open failures reject through the returned store", async () => {
    const failure = new DOMException("Opening failed", "UnknownError");
    jest.spyOn(indexedDB, "open").mockImplementation(() => {
      throw failure;
    });
    await expect(get("missing", freshStore())).rejects.toBe(failure);
  });

  test("updater exceptions propagate and leave the previous value unchanged", async () => {
    const store = freshStore();
    await set("count", 1, store);
    const failure = new Error("cannot update");
    await expect(
      update(
        "count",
        () => {
          throw failure;
        },
        store
      )
    ).rejects.toBe(failure);
    await expect(get("count", store)).resolves.toBe(1);
  });

  test("Safari probes databases before opening, including when the probe rejects", async () => {
    jest.spyOn(navigator, "userAgent", "get").mockReturnValue("Version/15.0 Safari/605.1.15");
    const probe = jest.spyOn(indexedDB, "databases").mockRejectedValue(new Error("probe failed"));
    const store = freshStore();
    expect(probe).toHaveBeenCalledTimes(1);
    await set("ready", true, store);
    await expect(get("ready", store)).resolves.toBe(true);
  });

  test("Safari repeats a stalled probe every 100 milliseconds then stops polling", async () => {
    jest.useFakeTimers({ doNotFake: ["setImmediate"] });
    jest.spyOn(navigator, "userAgent", "get").mockReturnValue("Version/15.0 Safari/605.1.15");
    const probe = jest
      .spyOn(indexedDB, "databases")
      .mockImplementationOnce(() => new Promise(() => {}))
      .mockResolvedValue([]);
    const store = freshStore();
    expect(probe).toHaveBeenCalledTimes(1);
    await jest.advanceTimersByTimeAsync(100);
    await set("ready", true, store);
    await jest.advanceTimersByTimeAsync(300);
    expect(probe).toHaveBeenCalledTimes(2);
  });

  test("Chrome user agents skip Safari's database-probing workaround", async () => {
    jest.spyOn(navigator, "userAgent", "get").mockReturnValue("Chrome/120.0 Safari/537.36");
    const probe = jest.spyOn(indexedDB, "databases");
    await set("ready", true, freshStore());
    expect(probe).not.toHaveBeenCalled();
  });
});
