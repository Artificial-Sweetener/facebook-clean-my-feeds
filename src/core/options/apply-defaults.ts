// SPDX-License-Identifier: GPL-3.0-only

import type { Keywords } from "../../i18n";
import { defaults } from "./defaults";
import { isDefaultKey } from "./schema";
import type { StoredOptions } from "./types";

/**
 * Mutate only missing historical option keys and normalize the three radio-backed settings.
 * Defaults omitted by the original routine (notably Reels and regexp flags) stay absent.
 * Catalog iteration is preserved because its insertion order also controls exported settings.
 * @param options Mutable persisted record; existing own properties normally override defaults.
 * @param keyWords Selected catalog whose feed-prefixed labels determine historical option coverage.
 * @returns Whether any informational-box filter is enabled.
 */
export function applyOptionDefaults(options: StoredOptions, keyWords: Keywords): boolean {
  let hideAnInfoBox = false;

  if (!Object.prototype.hasOwnProperty.call(options, "NF_SPONSORED")) {
    options.NF_SPONSORED = defaults.SPONSORED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "GF_SPONSORED")) {
    options.GF_SPONSORED = defaults.SPONSORED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "VF_SPONSORED")) {
    options.VF_SPONSORED = defaults.SPONSORED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "MP_SPONSORED")) {
    options.MP_SPONSORED = defaults.SPONSORED;
  }

  for (const key of Object.keys(keyWords)) {
    if (key.startsWith("NF_") && !key.startsWith("NF_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
    } else if (key.startsWith("GF_") && !key.startsWith("GF_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
    } else if (key.startsWith("VF_") && !key.startsWith("VF_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
    } else if (key.startsWith("MP_") && !key.startsWith("MP_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
    } else if (key.startsWith("PP_") && !key.startsWith("PP_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
    } else if (key.startsWith("OTHER_INFO")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = isDefaultKey(key) ? defaults[key] : undefined;
      }
      if (options[key]) {
        hideAnInfoBox = true;
      }
    }
  }

  if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_ENABLED")) {
    options.NF_BLOCKED_ENABLED = defaults.NF_BLOCKED_ENABLED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_FEED")) {
    options.NF_BLOCKED_FEED = defaults.NF_BLOCKED_FEED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "NF_BLOCKED_TEXT")) {
    options.NF_BLOCKED_TEXT = "";
  }

  if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_ENABLED")) {
    options.GF_BLOCKED_ENABLED = defaults.GF_BLOCKED_ENABLED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_FEED")) {
    options.GF_BLOCKED_FEED = defaults.GF_BLOCKED_FEED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "GF_BLOCKED_TEXT")) {
    options.GF_BLOCKED_TEXT = "";
  }

  if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_ENABLED")) {
    options.VF_BLOCKED_ENABLED = defaults.VF_BLOCKED_ENABLED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_FEED")) {
    options.VF_BLOCKED_FEED = defaults.VF_BLOCKED_FEED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "VF_BLOCKED_TEXT")) {
    options.VF_BLOCKED_TEXT = "";
  }

  if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_ENABLED")) {
    options.MP_BLOCKED_ENABLED = defaults.MP_BLOCKED_ENABLED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_FEED")) {
    options.MP_BLOCKED_FEED = defaults.MP_BLOCKED_FEED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_TEXT")) {
    options.MP_BLOCKED_TEXT = "";
  }
  if (!Object.prototype.hasOwnProperty.call(options, "MP_BLOCKED_TEXT_DESCRIPTION")) {
    options.MP_BLOCKED_TEXT_DESCRIPTION = "";
  }

  if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_ENABLED")) {
    options.PP_BLOCKED_ENABLED = defaults.PP_BLOCKED_ENABLED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_FEED")) {
    options.PP_BLOCKED_FEED = defaults.PP_BLOCKED_FEED;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "PP_BLOCKED_TEXT")) {
    options.PP_BLOCKED_TEXT = "";
  }

  if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_LEVEL")) {
    options.VERBOSITY_LEVEL = defaults.DLG_VERBOSITY;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "VERBOSITY_MESSAGE_COLOUR")) {
    options.VERBOSITY_MESSAGE_COLOUR = "";
  }
  if (
    !Object.prototype.hasOwnProperty.call(options, "VERBOSITY_MESSAGE_BG_COLOUR") ||
    options.VERBOSITY_MESSAGE_BG_COLOUR === undefined ||
    options.VERBOSITY_MESSAGE_BG_COLOUR.toString() === ""
  ) {
    options.VERBOSITY_MESSAGE_BG_COLOUR = defaults.VERBOSITY_MESSAGE_BG_COLOUR;
  }
  if (
    !Object.prototype.hasOwnProperty.call(options, "VERBOSITY_DEBUG") ||
    options.VERBOSITY_DEBUG === undefined ||
    options.VERBOSITY_DEBUG.toString() === ""
  ) {
    options.VERBOSITY_DEBUG = defaults.VERBOSITY_DEBUG;
  }

  normalizeEnumOption(options, "VERBOSITY_LEVEL", ["0", "1", "2"], defaults.DLG_VERBOSITY);
  normalizeEnumOption(options, "CMF_BTN_OPTION", ["0", "1", "2"], defaults.CMF_BTN_OPTION);
  normalizeEnumOption(options, "CMF_DIALOG_OPTION", ["0", "1"], defaults.CMF_DIALOG_OPTION);
  if (
    !Object.prototype.hasOwnProperty.call(options, "CMF_BORDER_COLOUR") ||
    options.CMF_BORDER_COLOUR?.toString() === undefined ||
    options.CMF_BORDER_COLOUR?.toString() === ""
  ) {
    options.CMF_BORDER_COLOUR = defaults.CMF_BORDER_COLOUR;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "NF_LIKES_MAXIMUM_COUNT")) {
    options.NF_LIKES_MAXIMUM_COUNT = "";
  }

  return hideAnInfoBox;
}

/** Convert persisted numeric radio values to strings; invalid and null values use the legacy default. */
function normalizeEnumOption(
  options: StoredOptions,
  key: "VERBOSITY_LEVEL" | "CMF_BTN_OPTION" | "CMF_DIALOG_OPTION",
  validValues: readonly string[],
  defaultValue: string
): void {
  if (!Object.prototype.hasOwnProperty.call(options, key)) {
    options[key] = defaultValue;
    return;
  }

  const value = options[key];
  if (value === undefined || value === null) {
    options[key] = defaultValue;
    return;
  }

  const normalized = value.toString();
  options[key] = validValues.includes(normalized) ? normalized : defaultValue;
}
