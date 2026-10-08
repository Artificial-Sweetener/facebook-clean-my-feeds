/** @jest-environment node */
// SPDX-License-Identifier: GPL-3.0-only

import "fake-indexeddb/auto";
import {
  DB_KEY,
  DB_NAME,
  DB_STORE,
  deleteOptions,
  getOptions,
  optionsStore,
  setOptions,
} from "../../src/storage/idb";
import { get, set } from "../../src/vendor/idb-keyval";

/** Clear only the historical options key so storage tests do not depend on execution order. */
beforeEach(async () => {
  await deleteOptions();
});

describe("storage/idb persisted compatibility", () => {
  test("keeps the database/store/key identifiers and opens the expected store", async () => {
    expect([DB_NAME, DB_STORE, DB_KEY]).toEqual(["dbCMF", "Mopping", "Options"]);
    await expect(
      optionsStore("readonly", (store) => [store.transaction.db.name, store.name])
    ).resolves.toEqual(["dbCMF", "Mopping"]);
  });

  test("round-trips legacy JSON strings and current object representations", async () => {
    const encoded = JSON.stringify({ NF_STORIES: true, CMF_DIALOG_LANGUAGE: "de" });
    await setOptions(encoded);
    await expect(getOptions()).resolves.toBe(encoded);
    const object = { NF_STORIES: false, customLegacySetting: { nested: true } };
    await setOptions(object);
    await expect(getOptions()).resolves.toEqual(object);
  });

  test("deletes only Options and keeps other historical store entries", async () => {
    await set("Unrelated", "preserved", optionsStore);
    await setOptions({ NF_STORIES: true });
    await deleteOptions();
    await expect(getOptions()).resolves.toBeUndefined();
    await expect(get("Unrelated", optionsStore)).resolves.toBe("preserved");
  });
});
