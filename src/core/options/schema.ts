// SPDX-License-Identifier: GPL-3.0-only

import { defaults } from "./defaults";

/** Existing export intentionally lists default keys, including unused legacy aliases. */
export const optionKeys = Object.keys(defaults);

/** Narrow dynamic catalog keys before looking up their matching default setting. */
export function isDefaultKey(key: string): key is keyof typeof defaults {
  return Object.prototype.hasOwnProperty.call(defaults, key);
}
