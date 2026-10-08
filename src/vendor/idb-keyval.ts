// SPDX-License-Identifier: GPL-3.0-only

/*!
 * Owned TypeScript adaptation of idb-keyval, preserving the bundled adapter's API.
 * Original: https://github.com/jakearchibald/idb-keyval
 * Copyright 2016, Jake Archibald
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * CMF adaptation: explicit unknown storage values and transaction/request handlers;
 * retains the original eager-open and Safari indexedDB.databases workaround.
 */

/** Run one operation against a named store; callbacks execute while its transaction is active. */
export type UseStore = <T>(
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>
) => Promise<T>;

/** Resolve a request with its native result, retaining IndexedDB's native rejection reason. */
export function promisifyRequest<T>(request: IDBRequest<T>): Promise<T>;
/** Resolve a write only after its transaction commits; abort/error rejects instead. */
export function promisifyRequest(request: IDBTransaction): Promise<void>;
/** Install event handlers appropriate to the native request/transaction discriminator. */
export function promisifyRequest<T>(
  request: IDBRequest<T> | IDBTransaction
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if ("result" in request) {
      request.onsuccess = () => resolve(request.result);
    } else {
      request.oncomplete = () => resolve(undefined);
      request.onabort = () => reject(request.error);
    }
    request.onerror = () => reject(request.error);
  });
}

/**
 * Wait for Safari's IndexedDB startup to become responsive before opening the database.
 * Polling every 100 ms is intentional: older Safari can leave the first databases() call pending.
 * Either fulfillment or rejection releases startup, matching the original finally-based gate.
 * Missing IndexedDB skips probing so eager opening rejects asynchronously at the recovery boundary.
 */
function waitForSafariIndexedDB(): Promise<void> {
  const safari =
    typeof indexedDB !== "undefined" &&
    !("userAgentData" in navigator && navigator.userAgentData) &&
    /Safari\//.test(navigator.userAgent) &&
    !/Chrom(e|ium)\//.test(navigator.userAgent) &&
    typeof indexedDB.databases === "function";
  if (!safari) return Promise.resolve();
  let interval: ReturnType<typeof setInterval> | undefined;
  return new Promise<void>((resolve) => {
    /** Release Safari startup when any probe settles; older pending probes may remain unresolved. */
    const probe = (): void => {
      void indexedDB.databases().then(
        () => resolve(),
        () => resolve()
      );
    };
    interval = setInterval(probe, 100);
    probe();
  }).finally(() => {
    if (interval !== undefined) clearInterval(interval);
  });
}

/**
 * Start opening a database immediately, creating its store during the first upgrade.
 * @param databaseName Existing persisted database identifier; changing it loses access to saved data.
 * @param storeName Existing object-store identifier, reused for every transaction.
 * @returns A reusable transaction runner sharing the eagerly started database-open promise.
 * @throws Native IndexedDB errors asynchronously through the returned runner.
 */
export function createStore(databaseName: string, storeName: string): UseStore {
  const database = waitForSafariIndexedDB().then(() => {
    const request = indexedDB.open(databaseName);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(storeName);
    };
    return promisifyRequest(request);
  });
  return (mode, callback) =>
    database.then((db) => callback(db.transaction(storeName, mode).objectStore(storeName)));
}

let defaultStore: UseStore | undefined;

/** Lazily create only the optional generic store; CMF's named store is eagerly created by its wrapper. */
function getDefaultStore(): UseStore {
  defaultStore ??= createStore("keyval-store", "keyval");
  return defaultStore;
}

/** Read an untrusted stored value; callers must decode it before treating it as an application type. */
export function get(key: IDBValidKey, customStore = getDefaultStore()): Promise<unknown> {
  return customStore("readonly", (store) => promisifyRequest<unknown>(store.get(key)));
}

/** Put one structured-cloneable value and resolve only after the write transaction completes. */
export function set(
  key: IDBValidKey,
  value: unknown,
  customStore = getDefaultStore()
): Promise<void> {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}

/** Remove one key without changing the containing database or other stored values. */
export function del(key: IDBValidKey, customStore = getDefaultStore()): Promise<void> {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}

/** Clear the selected object store and wait for the resulting transaction to commit. */
export function clear(customStore = getDefaultStore()): Promise<void> {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}

/** Read values in caller key order within one transaction, retaining undefined for absent keys. */
export function getMany(
  keys: readonly IDBValidKey[],
  customStore = getDefaultStore()
): Promise<unknown[]> {
  return customStore("readonly", (store) =>
    Promise.all(keys.map((key) => promisifyRequest<unknown>(store.get(key))))
  );
}

/** Put all entries within one transaction so a native transaction failure cannot partially commit. */
export function setMany(
  entries: ReadonlyArray<readonly [IDBValidKey, unknown]>,
  customStore = getDefaultStore()
): Promise<void> {
  return customStore("readwrite", (store) => {
    entries.forEach(([key, value]) => store.put(value, key));
    return promisifyRequest(store.transaction);
  });
}

/** Delete a batch using the same transaction and native commit/error semantics as individual writes. */
export function delMany(
  keys: readonly IDBValidKey[],
  customStore = getDefaultStore()
): Promise<void> {
  return customStore("readwrite", (store) => {
    keys.forEach((key) => store.delete(key));
    return promisifyRequest(store.transaction);
  });
}

/** Visit entries in IndexedDB cursor order and complete only after the read transaction ends. */
function eachCursor(
  customStore: UseStore,
  callback: (cursor: IDBCursorWithValue) => void
): Promise<void> {
  return customStore("readonly", (store) => {
    const request = store.openCursor();
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor) {
        callback(cursor);
        cursor.continue();
      }
    };
    return promisifyRequest(store.transaction);
  });
}

/** Return every native key in cursor order, without guessing narrower application key types. */
export function keys(customStore = getDefaultStore()): Promise<IDBValidKey[]> {
  const result: IDBValidKey[] = [];
  return eachCursor(customStore, (cursor) => {
    result.push(cursor.key);
  }).then(() => result);
}

/** Return untrusted values in cursor order for validation by the caller. */
export function values(customStore = getDefaultStore()): Promise<unknown[]> {
  const result: unknown[] = [];
  return eachCursor(customStore, (cursor) => {
    result.push(cursor.value);
  }).then(() => result);
}

/** Keep each native key paired with its unknown stored value while iterating the store. */
export function entries(customStore = getDefaultStore()): Promise<Array<[IDBValidKey, unknown]>> {
  const result: Array<[IDBValidKey, unknown]> = [];
  return eachCursor(customStore, (cursor) => {
    result.push([cursor.key, cursor.value]);
  }).then(() => result);
}

/**
 * Run a synchronous read-modify-write callback inside one transaction.
 * The updater receives unknown data and must validate it; callback exceptions reject unchanged.
 */
export function update(
  key: IDBValidKey,
  updater: (value: unknown) => unknown,
  customStore = getDefaultStore()
): Promise<void> {
  return customStore(
    "readwrite",
    (store) =>
      new Promise<void>((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          try {
            store.put(updater(request.result), key);
            resolve(promisifyRequest(store.transaction));
          } catch (error: unknown) {
            reject(error);
          }
        };
        request.onerror = () => reject(request.error);
      })
  );
}
