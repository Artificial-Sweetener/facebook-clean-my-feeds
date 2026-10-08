// SPDX-License-Identifier: GPL-3.0-only

import * as idbKeyval from "../vendor/idb-keyval";

/** Persistence identifiers are compatibility contracts shared with earlier userscript releases. */
export const DB_NAME = "dbCMF";
export const DB_STORE = "Mopping";
export const DB_KEY = "Options";

/** Opening is intentionally eager at module evaluation, including the Safari startup gate. */
export const optionsStore = idbKeyval.createStore(DB_NAME, DB_STORE);

/** Read legacy object or JSON-string settings without trusting their external contents. */
export function getOptions(): Promise<unknown> {
  return idbKeyval.get(DB_KEY, optionsStore);
}

/** Persist either supported settings representation and reject if the transaction cannot commit. */
export function setOptions(options: unknown): Promise<void> {
  return idbKeyval.set(DB_KEY, options, optionsStore);
}

/** Reset only CMF's options key, preserving other entries in the historical database. */
export function deleteOptions(): Promise<void> {
  return idbKeyval.del(DB_KEY, optionsStore);
}
