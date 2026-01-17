const { translations } = require("../../ui/i18n/translations");
const { SEPARATOR } = require("../state/vars");

const { defaults } = require("./defaults");

function cloneKeywords(language) {
  const baseKeywords = { ...translations.en };

  if (language && translations[language]) {
    return { ...baseKeywords, ...translations[language] };
  }

  return baseKeywords;
}

function resolveLanguage(options, siteLanguage) {
  const lang = siteLanguage || "en";

  if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_LANGUAGE")) {
    return Object.prototype.hasOwnProperty.call(translations, lang) ? lang : "en";
  }

  const uiLang = options.CMF_DIALOG_LANGUAGE || "en";
  if (Object.prototype.hasOwnProperty.call(translations, uiLang)) {
    return uiLang;
  }

  if (Object.prototype.hasOwnProperty.call(translations, lang)) {
    return lang;
  }

  return lang;
}

function applyOptionDefaults(options, keyWords) {
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
        options[key] = defaults[key];
      }
    } else if (key.startsWith("GF_") && !key.startsWith("GF_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = defaults[key];
      }
    } else if (key.startsWith("VF_") && !key.startsWith("VF_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = defaults[key];
      }
    } else if (key.startsWith("MP_") && !key.startsWith("MP_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = defaults[key];
      }
    } else if (key.startsWith("PP_") && !key.startsWith("PP_BLOCKED")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = defaults[key];
      }
    } else if (key.startsWith("OTHER_INFO")) {
      if (!Object.prototype.hasOwnProperty.call(options, key)) {
        options[key] = defaults[key];
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

  if (!Object.prototype.hasOwnProperty.call(options, "CMF_BTN_OPTION")) {
    options.CMF_BTN_OPTION = defaults.CMF_BTN_OPTION;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "CMF_DIALOG_OPTION")) {
    options.CMF_DIALOG_OPTION = defaults.CMF_DIALOG_OPTION;
  }
  if (
    !Object.prototype.hasOwnProperty.call(options, "CMF_BORDER_COLOUR") ||
    options.CMF_BORDER_COLOUR.toString() === undefined ||
    options.CMF_BORDER_COLOUR.toString() === ""
  ) {
    options.CMF_BORDER_COLOUR = defaults.CMF_BORDER_COLOUR;
  }
  if (!Object.prototype.hasOwnProperty.call(options, "NF_LIKES_MAXIMUM_COUNT")) {
    options.NF_LIKES_MAXIMUM_COUNT = "";
  }

  return hideAnInfoBox;
}

function buildFilters(options, separator = SEPARATOR) {
  const filters = {};

  let nfBlockedText = "";
  let gfBlockedText = "";
  let vfBlockedText = "";
  let ppBlockedText = "";
  let mpBlockedText = "";
  let mpBlockedTextDesc = "";

  if (options.NF_BLOCKED_ENABLED === true) {
    nfBlockedText = options.NF_BLOCKED_TEXT;
  }
  if (options.GF_BLOCKED_ENABLED === true) {
    gfBlockedText = options.GF_BLOCKED_TEXT;
  }
  if (options.VF_BLOCKED_ENABLED === true) {
    vfBlockedText = options.VF_BLOCKED_TEXT;
  }
  if (options.MP_BLOCKED_ENABLED === true) {
    mpBlockedText = options.MP_BLOCKED_TEXT;
    mpBlockedTextDesc = options.MP_BLOCKED_TEXT_DESCRIPTION;
  }
  if (options.PP_BLOCKED_ENABLED === true) {
    ppBlockedText = options.PP_BLOCKED_TEXT;
  }

  let nfBlockedTextList = "";
  let gfBlockedTextList = "";
  let vfBlockedTextList = "";
  let ppBlockedTextList = "";
  let mpBlockedTextList = "";
  let mpBlockedTextDescList = "";

  if (options.NF_BLOCKED_ENABLED) {
    nfBlockedTextList = nfBlockedText;
    if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED[0] === "1") {
      if (gfBlockedText.length > 0) {
        nfBlockedTextList += (nfBlockedTextList.length > 0 ? separator : "") + gfBlockedText;
      }
    }
    if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED[0] === "1") {
      if (vfBlockedText.length > 0) {
        nfBlockedTextList += (nfBlockedTextList.length > 0 ? separator : "") + vfBlockedText;
      }
    }
  }

  if (options.GF_BLOCKED_ENABLED) {
    gfBlockedTextList = gfBlockedText;
    if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED[1] === "1") {
      if (nfBlockedText.length > 0) {
        gfBlockedTextList += (gfBlockedTextList.length > 0 ? separator : "") + nfBlockedText;
      }
    }
    if (options.VF_BLOCKED_ENABLED && options.VF_BLOCKED_FEED[1] === "1") {
      if (vfBlockedText.length > 0) {
        gfBlockedTextList += (gfBlockedTextList.length > 0 ? separator : "") + vfBlockedText;
      }
    }
  }

  if (options.VF_BLOCKED_ENABLED) {
    vfBlockedTextList = vfBlockedText;
    if (options.NF_BLOCKED_ENABLED && options.NF_BLOCKED_FEED[2] === "1") {
      if (nfBlockedText.length > 0) {
        vfBlockedTextList += (vfBlockedTextList.length > 0 ? separator : "") + nfBlockedText;
      }
    }
    if (options.GF_BLOCKED_ENABLED && options.GF_BLOCKED_FEED[2] === "1") {
      if (gfBlockedText.length > 0) {
        vfBlockedTextList += (vfBlockedTextList.length > 0 ? separator : "") + gfBlockedText;
      }
    }
  }

  if (options.MP_BLOCKED_ENABLED) {
    mpBlockedTextList = mpBlockedText;
    mpBlockedTextDescList = mpBlockedTextDesc;
  }

  if (options.PP_BLOCKED_ENABLED) {
    ppBlockedTextList = ppBlockedText;
  }

  filters.NF_BLOCKED_TEXT = [];
  filters.NF_BLOCKED_TEXT_LC = [];
  filters.NF_BLOCKED_ENABLED = false;
  if (options.NF_BLOCKED_ENABLED && nfBlockedTextList.length > 0) {
    filters.NF_BLOCKED_ENABLED = true;
    filters.NF_BLOCKED_TEXT = nfBlockedTextList.split(separator);
    filters.NF_BLOCKED_TEXT_LC = filters.NF_BLOCKED_TEXT.map((text) => text.toLowerCase());
  }

  filters.GF_BLOCKED_TEXT = [];
  filters.GF_BLOCKED_TEXT_LC = [];
  filters.GF_BLOCKED_ENABLED = false;
  if (options.GF_BLOCKED_ENABLED && gfBlockedTextList.length > 0) {
    filters.GF_BLOCKED_ENABLED = true;
    filters.GF_BLOCKED_TEXT = gfBlockedTextList.split(separator);
    filters.GF_BLOCKED_TEXT_LC = filters.GF_BLOCKED_TEXT.map((text) => text.toLowerCase());
  }

  filters.VF_BLOCKED_TEXT = [];
  filters.VF_BLOCKED_TEXT_LC = [];
  filters.VF_BLOCKED_ENABLED = false;
  if (options.VF_BLOCKED_ENABLED && vfBlockedTextList.length > 0) {
    filters.VF_BLOCKED_ENABLED = true;
    filters.VF_BLOCKED_TEXT = vfBlockedTextList.split(separator);
    filters.VF_BLOCKED_TEXT_LC = filters.VF_BLOCKED_TEXT.map((text) => text.toLowerCase());
  }

  filters.MP_BLOCKED_TEXT = [];
  filters.MP_BLOCKED_TEXT_LC = [];
  filters.MP_BLOCKED_TEXT_DESCRIPTION = [];
  filters.MP_BLOCKED_TEXT_DESCRIPTION_LC = [];
  filters.MP_BLOCKED_ENABLED = false;
  if (
    options.MP_BLOCKED_ENABLED &&
    (mpBlockedTextList.length > 0 || mpBlockedTextDescList.length > 0)
  ) {
    filters.MP_BLOCKED_ENABLED = true;
    filters.MP_BLOCKED_TEXT = mpBlockedTextList.split(separator);
    filters.MP_BLOCKED_TEXT_LC = filters.MP_BLOCKED_TEXT.map((text) => text.toLowerCase());
    filters.MP_BLOCKED_TEXT_DESCRIPTION = mpBlockedTextDescList.split(separator);
    filters.MP_BLOCKED_TEXT_DESCRIPTION_LC = filters.MP_BLOCKED_TEXT_DESCRIPTION.map((text) =>
      text.toLowerCase()
    );
  }

  filters.PP_BLOCKED_TEXT = [];
  filters.PP_BLOCKED_TEXT_LC = [];
  filters.PP_BLOCKED_ENABLED = false;
  if (options.PP_BLOCKED_ENABLED && ppBlockedTextList.length > 0) {
    filters.PP_BLOCKED_ENABLED = true;
    filters.PP_BLOCKED_TEXT = ppBlockedTextList.split(separator);
    filters.PP_BLOCKED_TEXT_LC = filters.PP_BLOCKED_TEXT.map((text) => text.toLowerCase());
  }

  return filters;
}

function hydrateOptions(storedOptions = {}, siteLanguage = "en") {
  const options = { ...storedOptions };
  const language = resolveLanguage(options, siteLanguage);

  options.CMF_DIALOG_LANGUAGE = language;

  const keyWords = cloneKeywords(language);
  const hideAnInfoBox = applyOptionDefaults(options, keyWords);
  const filters = buildFilters(options);

  return {
    options,
    filters,
    language,
    hideAnInfoBox,
    keyWords,
  };
}

module.exports = {
  applyOptionDefaults,
  buildFilters,
  cloneKeywords,
  hydrateOptions,
  resolveLanguage,
};
