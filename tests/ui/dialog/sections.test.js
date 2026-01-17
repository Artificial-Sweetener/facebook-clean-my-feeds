const { buildDialogSections } = require("../../../src/ui/dialog/sections");
const { defaults, translations } = require("../../../src/ui/i18n/translations");
const { createState, SEPARATOR } = require("../../../src/core/state/vars");

function buildState() {
  const state = createState();
  state.SEP = SEPARATOR;
  state.language = "en";
  state.iconLegendHTML = "<svg></svg>";
  state.dialogSectionIcons = {};
  return state;
}

describe("ui/dialog/sections", () => {
  test("blocked text textareas split by separator", () => {
    const state = buildState();
    const options = {
      ...defaults,
      NF_BLOCKED_TEXT: "alphaIIbeta",
      GF_BLOCKED_TEXT: "",
      VF_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT_DESCRIPTION: "",
      PP_BLOCKED_TEXT: "",
      NF_LIKES_MAXIMUM_COUNT: "",
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
      VERBOSITY_DEBUG: false,
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      CMF_DIALOG_LANGUAGE: "en",
      CMF_BTN_OPTION: "0",
      CMF_DIALOG_OPTION: "0",
    };
    const sections = buildDialogSections({
      state,
      options,
      keyWords: translations.en,
      translations,
    });

    const nfSection = sections[0];
    const textarea = nfSection.querySelector('textarea[name="NF_BLOCKED_TEXT"]');
    expect(textarea.textContent.replace(/\r?\n/g, state.SEP)).toBe(options.NF_BLOCKED_TEXT);
  });

  test("likes maximum count input strips non-numeric values", () => {
    const state = buildState();
    const options = {
      ...defaults,
      NF_BLOCKED_TEXT: "",
      GF_BLOCKED_TEXT: "",
      VF_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT_DESCRIPTION: "",
      PP_BLOCKED_TEXT: "",
      NF_LIKES_MAXIMUM_COUNT: "",
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
      VERBOSITY_DEBUG: false,
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      CMF_DIALOG_LANGUAGE: "en",
      CMF_BTN_OPTION: "0",
      CMF_DIALOG_OPTION: "0",
    };
    const sections = buildDialogSections({
      state,
      options,
      keyWords: translations.en,
      translations,
    });

    const input = sections[0].querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
    input.value = "12ab";
    input.dispatchEvent(new Event("input"));
    expect(input.value).toBe("12");
  });

  test("language select includes current language", () => {
    const state = buildState();
    const options = {
      ...defaults,
      NF_BLOCKED_TEXT: "",
      GF_BLOCKED_TEXT: "",
      VF_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT_DESCRIPTION: "",
      PP_BLOCKED_TEXT: "",
      NF_LIKES_MAXIMUM_COUNT: "",
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
      VERBOSITY_DEBUG: false,
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      CMF_DIALOG_LANGUAGE: "en",
      CMF_BTN_OPTION: "0",
      CMF_DIALOG_OPTION: "0",
    };
    const sections = buildDialogSections({
      state,
      options,
      keyWords: translations.en,
      translations,
    });

    const select = sections[7].querySelector('select[name="CMF_DIALOG_LANGUAGE"]');
    expect(select.value).toBe("en");
  });

  test("tips content injects links for tokens", () => {
    const state = buildState();
    const options = {
      ...defaults,
      NF_BLOCKED_TEXT: "",
      GF_BLOCKED_TEXT: "",
      VF_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT: "",
      MP_BLOCKED_TEXT_DESCRIPTION: "",
      PP_BLOCKED_TEXT: "",
      NF_LIKES_MAXIMUM_COUNT: "",
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
      VERBOSITY_DEBUG: false,
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      CMF_DIALOG_LANGUAGE: "en",
      CMF_BTN_OPTION: "0",
      CMF_DIALOG_OPTION: "0",
    };
    const sections = buildDialogSections({
      state,
      options,
      keyWords: translations.en,
      translations,
    });

    const tipsSection = sections[9];
    const anchors = tipsSection.querySelectorAll("a");
    expect(anchors.length).toBeGreaterThan(0);
  });
});
