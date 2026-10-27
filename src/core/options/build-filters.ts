// SPDX-License-Identifier: GPL-3.0-only

import type { Filters } from "../filters/types";
import { SEPARATOR } from "./constants";
import type { Options } from "./types";

/** Return the historically enabled text; strict true prevents truthy corrupt flags activating it. */
function enabledText(enabled: boolean | undefined, value: string | undefined): string {
  return enabled === true ? (value ?? "") : "";
}

/** Append a nonempty cross-feed list without introducing an extra separator. */
function appendText(current: string, extra: string, separator: string): string {
  return extra.length > 0 ? current + (current.length > 0 ? separator : "") + extra : current;
}

/** Build parallel matching arrays, retaining empty tokens exactly as the saved list encoded them. */
function splitText(enabled: boolean, value: string, separator: string): string[] {
  return enabled ? value.split(separator) : [];
}

/**
 * Materialize independent and cross-feed blocked-text lists without mutating saved settings.
 * Marketplace activation deliberately splits an empty title into [""] when only its description
 * list is populated; existing classifiers rely on the original tokenization behavior.
 * @param options Settings, including partial pre-hydration fixtures with disabled filters.
 * @param separator Persisted list delimiter; tests may provide a readable substitute.
 * @returns Fresh case-sensitive and lowercase arrays in original user-entered order.
 */
export function buildFilters(options: Options, separator = SEPARATOR): Filters {
  const nfText = enabledText(options.NF_BLOCKED_ENABLED, options.NF_BLOCKED_TEXT);
  const gfText = enabledText(options.GF_BLOCKED_ENABLED, options.GF_BLOCKED_TEXT);
  const vfText = enabledText(options.VF_BLOCKED_ENABLED, options.VF_BLOCKED_TEXT);
  const mpText = enabledText(options.MP_BLOCKED_ENABLED, options.MP_BLOCKED_TEXT);
  const mpDescription = enabledText(
    options.MP_BLOCKED_ENABLED,
    options.MP_BLOCKED_TEXT_DESCRIPTION
  );
  const ppText = enabledText(options.PP_BLOCKED_ENABLED, options.PP_BLOCKED_TEXT);
  let nfList = options.NF_BLOCKED_ENABLED ? nfText : "";
  let gfList = options.GF_BLOCKED_ENABLED ? gfText : "";
  let vfList = options.VF_BLOCKED_ENABLED ? vfText : "";
  if (options.NF_BLOCKED_ENABLED) {
    if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED?.[0] === "1")
      nfList = appendText(nfList, gfText, separator);
    if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED?.[0] === "1")
      nfList = appendText(nfList, vfText, separator);
  }
  if (options.GF_BLOCKED_ENABLED) {
    if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED?.[1] === "1")
      gfList = appendText(gfList, nfText, separator);
    if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED?.[1] === "1")
      gfList = appendText(gfList, vfText, separator);
  }
  if (options.VF_BLOCKED_ENABLED) {
    if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED?.[2] === "1")
      vfList = appendText(vfList, nfText, separator);
    if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED?.[2] === "1")
      vfList = appendText(vfList, gfText, separator);
  }
  const nfEnabled = Boolean(options.NF_BLOCKED_ENABLED && nfList.length > 0);
  const gfEnabled = Boolean(options.GF_BLOCKED_ENABLED && gfList.length > 0);
  const vfEnabled = Boolean(options.VF_BLOCKED_ENABLED && vfList.length > 0);
  const mpEnabled = Boolean(
    options.MP_BLOCKED_ENABLED && (mpText.length > 0 || mpDescription.length > 0)
  );
  const ppEnabled = Boolean(options.PP_BLOCKED_ENABLED && ppText.length > 0);
  const nf = splitText(nfEnabled, nfList, separator);
  const gf = splitText(gfEnabled, gfList, separator);
  const vf = splitText(vfEnabled, vfList, separator);
  const mp = splitText(mpEnabled, mpText, separator);
  const mpDesc = splitText(mpEnabled, mpDescription, separator);
  const pp = splitText(ppEnabled, ppText, separator);
  return {
    NF_BLOCKED_ENABLED: nfEnabled,
    NF_BLOCKED_TEXT: nf,
    NF_BLOCKED_TEXT_LC: nf.map((text) => text.toLowerCase()),
    GF_BLOCKED_ENABLED: gfEnabled,
    GF_BLOCKED_TEXT: gf,
    GF_BLOCKED_TEXT_LC: gf.map((text) => text.toLowerCase()),
    VF_BLOCKED_ENABLED: vfEnabled,
    VF_BLOCKED_TEXT: vf,
    VF_BLOCKED_TEXT_LC: vf.map((text) => text.toLowerCase()),
    MP_BLOCKED_ENABLED: mpEnabled,
    MP_BLOCKED_TEXT: mp,
    MP_BLOCKED_TEXT_LC: mp.map((text) => text.toLowerCase()),
    MP_BLOCKED_TEXT_DESCRIPTION: mpDesc,
    MP_BLOCKED_TEXT_DESCRIPTION_LC: mpDesc.map((text) => text.toLowerCase()),
    PP_BLOCKED_ENABLED: ppEnabled,
    PP_BLOCKED_TEXT: pp,
    PP_BLOCKED_TEXT_LC: pp.map((text) => text.toLowerCase()),
  };
}
