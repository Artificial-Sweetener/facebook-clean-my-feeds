// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions, StoredOptions } from "./types";

const booleanKeys = [
  "SPONSORED",
  "NF_TABLIST_STORIES_REELS_ROOMS",
  "NF_STORIES",
  "NF_SURVEY",
  "NF_PEOPLE_YOU_MAY_KNOW",
  "NF_PAID_PARTNERSHIP",
  "NF_SPONSORED_PAID",
  "NF_SUGGESTIONS",
  "NF_FOLLOW",
  "NF_PARTICIPATE",
  "NF_REELS_SHORT_VIDEOS",
  "NF_SHORT_REEL_VIDEO",
  "NF_META_AI",
  "NF_META_AI_PROMPTS",
  "NF_AI_INFO_POSTS",
  "NF_EVENTS_YOU_MAY_LIKE",
  "NF_ANIMATED_GIFS_POSTS",
  "NF_ANIMATED_GIFS_PAUSE",
  "NF_SHARES",
  "NF_LIKES_MAXIMUM",
  "NF_TOP_CARDS_PAGES",
  "NF_HIDE_VERIFIED_BADGE",
  "NF_FILTER_VERIFIED_BADGE",
  "NF_AI_SIDE_PANELS",
  "GF_PAID_PARTNERSHIP",
  "GF_SUGGESTIONS",
  "GF_SHORT_REEL_VIDEO",
  "GF_ANIMATED_GIFS_POSTS",
  "GF_ANIMATED_GIFS_PAUSE",
  "GF_SHARES",
  "VF_LIVE",
  "VF_INSTAGRAM",
  "VF_DUPLICATE_VIDEOS",
  "VF_ANIMATED_GIFS_PAUSE",
  "PP_ANIMATED_GIFS_POSTS",
  "PP_ANIMATED_GIFS_PAUSE",
  "OTHER_INFO_BOX_CORONAVIRUS",
  "OTHER_INFO_BOX_CLIMATE_SCIENCE",
  "OTHER_INFO_BOX_SUBSCRIBE",
  "REELS_CONTROLS",
  "REELS_DISABLE_LOOPING",
  "NF_BLOCKED_ENABLED",
  "GF_BLOCKED_ENABLED",
  "VF_BLOCKED_ENABLED",
  "MP_BLOCKED_ENABLED",
  "PP_BLOCKED_ENABLED",
  "NF_BLOCKED_RE",
  "GF_BLOCKED_RE",
  "VF_BLOCKED_RE",
  "MP_BLOCKED_RE",
  "PP_BLOCKED_RE",
  "VERBOSITY_DEBUG",
  "NF_SPONSORED",
  "GF_SPONSORED",
  "VF_SPONSORED",
  "MP_SPONSORED",
];
const arrayKeys = [
  "NF_BLOCKED_FEED",
  "GF_BLOCKED_FEED",
  "VF_BLOCKED_FEED",
  "MP_BLOCKED_FEED",
  "PP_BLOCKED_FEED",
];
const stringKeys = [
  "DLG_VERBOSITY",
  "VERBOSITY_MESSAGE_BG_COLOUR",
  "CMF_BORDER_COLOUR",
  "VERBOSITY_MESSAGE_COLOUR",
  "CMF_DIALOG_LANGUAGE",
  "NF_LIKES_MAXIMUM_COUNT",
  "NF_BLOCKED_TEXT",
  "GF_BLOCKED_TEXT",
  "VF_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT_DESCRIPTION",
  "PP_BLOCKED_TEXT",
];
const radioKeys = ["VERBOSITY_LEVEL", "CMF_BTN_OPTION", "CMF_DIALOG_OPTION"];
const hydratedKeys = [
  "NF_TABLIST_STORIES_REELS_ROOMS",
  "NF_STORIES",
  "NF_SURVEY",
  "NF_PEOPLE_YOU_MAY_KNOW",
  "NF_PAID_PARTNERSHIP",
  "NF_SPONSORED_PAID",
  "NF_SUGGESTIONS",
  "NF_FOLLOW",
  "NF_PARTICIPATE",
  "NF_REELS_SHORT_VIDEOS",
  "NF_SHORT_REEL_VIDEO",
  "NF_META_AI",
  "NF_META_AI_PROMPTS",
  "NF_AI_INFO_POSTS",
  "NF_EVENTS_YOU_MAY_LIKE",
  "NF_ANIMATED_GIFS_POSTS",
  "NF_ANIMATED_GIFS_PAUSE",
  "NF_SHARES",
  "NF_LIKES_MAXIMUM",
  "NF_TOP_CARDS_PAGES",
  "NF_HIDE_VERIFIED_BADGE",
  "NF_FILTER_VERIFIED_BADGE",
  "NF_AI_SIDE_PANELS",
  "GF_PAID_PARTNERSHIP",
  "GF_SUGGESTIONS",
  "GF_SHORT_REEL_VIDEO",
  "GF_ANIMATED_GIFS_POSTS",
  "GF_ANIMATED_GIFS_PAUSE",
  "GF_SHARES",
  "VF_LIVE",
  "VF_INSTAGRAM",
  "VF_DUPLICATE_VIDEOS",
  "VF_ANIMATED_GIFS_PAUSE",
  "PP_ANIMATED_GIFS_POSTS",
  "PP_ANIMATED_GIFS_PAUSE",
  "OTHER_INFO_BOX_CORONAVIRUS",
  "OTHER_INFO_BOX_CLIMATE_SCIENCE",
  "OTHER_INFO_BOX_SUBSCRIBE",
  "NF_BLOCKED_ENABLED",
  "GF_BLOCKED_ENABLED",
  "VF_BLOCKED_ENABLED",
  "MP_BLOCKED_ENABLED",
  "PP_BLOCKED_ENABLED",
  "VERBOSITY_DEBUG",
  "NF_SPONSORED",
  "GF_SPONSORED",
  "VF_SPONSORED",
  "MP_SPONSORED",
  "NF_BLOCKED_FEED",
  "GF_BLOCKED_FEED",
  "VF_BLOCKED_FEED",
  "MP_BLOCKED_FEED",
  "PP_BLOCKED_FEED",
  "VERBOSITY_LEVEL",
  "CMF_BTN_OPTION",
  "CMF_DIALOG_OPTION",
  "VERBOSITY_MESSAGE_BG_COLOUR",
  "CMF_BORDER_COLOUR",
  "VERBOSITY_MESSAGE_COLOUR",
  "CMF_DIALOG_LANGUAGE",
  "NF_LIKES_MAXIMUM_COUNT",
  "NF_BLOCKED_TEXT",
  "GF_BLOCKED_TEXT",
  "VF_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT",
  "MP_BLOCKED_TEXT_DESCRIPTION",
  "PP_BLOCKED_TEXT",
];

/** Exclude primitives and arrays before accessing persisted own properties. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Preserve legacy extra fields while proving every known setting's value is usable.
 * @param value Untrusted JSON or IndexedDB result at the persistence boundary.
 * @returns Whether the record has usable known fields, allowing historical radio representations.
 */
export function isStoredOptions(value: unknown): value is StoredOptions {
  if (!isRecord(value)) return false;
  for (const key of booleanKeys) {
    if (key === "VERBOSITY_DEBUG" && (value[key] === undefined || value[key] === "")) continue;
    if (key in value && typeof value[key] !== "boolean") return false;
  }
  for (const key of stringKeys) {
    if (key === "CMF_DIALOG_LANGUAGE") continue;
    if (key === "VERBOSITY_MESSAGE_BG_COLOUR" && value[key] === undefined) continue;
    if (key in value && typeof value[key] !== "string") return false;
  }
  for (const key of arrayKeys) {
    const entry = value[key];
    if (
      key in value &&
      (!Array.isArray(entry) || !entry.every((item: unknown) => typeof item === "string"))
    )
      return false;
  }
  for (const key of [...radioKeys, "CMF_DIALOG_LANGUAGE"]) {
    const entry = value[key];
    if (
      entry !== undefined &&
      entry !== null &&
      typeof entry !== "string" &&
      typeof entry !== "number" &&
      typeof entry !== "boolean"
    )
      return false;
  }
  return true;
}

/**
 * Decode external JSON/IndexedDB data without trusting unknown property types.
 * Unknown legacy keys survive valid records for export and re-save compatibility.
 * @returns A validated settings record, or undefined for malformed input so the caller can recover.
 */
export function decodeStoredOptions(value: unknown): StoredOptions | undefined {
  return isStoredOptions(value) ? value : undefined;
}

/** Prove that mutation by the defaults layer established every required hydrated field. */
export function isHydratedOptions(value: unknown): value is HydratedOptions {
  if (!isStoredOptions(value)) return false;
  return (
    hydratedKeys.every(
      (key) => Object.prototype.hasOwnProperty.call(value, key) && value[key] !== undefined
    ) &&
    radioKeys.every((key) => typeof value[key] === "string") &&
    typeof value.CMF_DIALOG_LANGUAGE === "string" &&
    typeof value.VERBOSITY_DEBUG === "boolean"
  );
}
