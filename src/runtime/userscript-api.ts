// SPDX-License-Identifier: GPL-3.0-only

/** Metadata differs between managers, so support diagnostics treats every field as optional. */
export interface ScriptMetadata {
  name?: string;
  version?: string;
  supportURL?: string;
  namespace?: string;
  downloadURL?: string;
  updateURL?: string;
}

/** A manager may omit metadata entirely even when it supports menu commands. */
export interface UserscriptInfo {
  script?: ScriptMetadata;
  scriptHandler?: string;
  version?: string;
}

/** Only capabilities used by CMF are described; absent grants remain a supported state. */
export interface UserscriptManager {
  info?: UserscriptInfo;
  registerMenuCommand?: (caption: string, callback: () => void) => unknown;
}

declare global {
  // Optional globals are queried before use because managers expose different grants.
  var GM: UserscriptManager | undefined;
  var unsafeWindow: { chrome?: unknown } | undefined;
}

/** Keep manager feature detection at the browser boundary and tolerate unsupported grants. */
export function getUserscriptManager(): UserscriptManager | undefined {
  return globalThis.GM;
}
