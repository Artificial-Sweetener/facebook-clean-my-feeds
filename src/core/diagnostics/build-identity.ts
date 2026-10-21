// SPDX-License-Identifier: GPL-3.0-only

declare const __CMF_SOURCE_DIGEST__: string | undefined;

/** Reproducible source identity distinguishes development builds that share the same public userscript version. */
export const buildIdentity =
  typeof __CMF_SOURCE_DIGEST__ === "string" ? __CMF_SOURCE_DIGEST__ : "unbundled";
