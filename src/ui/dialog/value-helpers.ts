// SPDX-License-Identifier: GPL-3.0-only

/** Check externally sourced property names before using them to index a closed contract. */
export function hasOwnKey<T extends object>(object: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/** Read a dynamic form/catalog key without admitting untyped values to control rendering. */
export function readValue<T extends object>(object: T, key: string): T[keyof T] | undefined {
  return hasOwnKey(object, key) ? object[key] : undefined;
}
