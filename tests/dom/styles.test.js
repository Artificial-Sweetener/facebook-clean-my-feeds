jest.mock("../../src/utils/random", () => ({
  generateRandomString: jest.fn(() => "abc"),
}));

const { defaults } = require("../../src/core/options/defaults");
const { addCSS, addExtraCSS, addToSS, ensureStyleTag } = require("../../src/dom/styles");

describe("dom/styles", () => {
  test("ensureStyleTag creates a style tag", () => {
    const style = ensureStyleTag("test-style");
    expect(style).not.toBeNull();
    expect(style.id).toBe("test-style");
  });

  test("addToSS appends formatted CSS to state", () => {
    const state = { tempStyleSheetCode: "" };
    addToSS(state, ".a, .b", "color: red; height: 10px;");
    expect(state.tempStyleSheetCode).toContain(".a");
    expect(state.tempStyleSheetCode).toContain("color:red");
  });

  test("addCSS returns a style tag and sets cssID", () => {
    const state = {
      cssID: "",
      tempStyleSheetCode: "",
      hideAtt: "hide",
      showAtt: "show",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideNumberOfShares: "hideShares",
      iconNewWindowClass: "cmf-link-new",
    };
    const options = {
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
    };

    const style = addCSS(state, options, defaults);

    expect(style).not.toBeNull();
    expect(state.cssID).toBe("ABC");
    expect(style.textContent).toContain(`[${state.hideAtt}]`);
  });

  test("addExtraCSS appends extra rules", () => {
    const state = {
      cssID: "",
      tempStyleSheetCode: "",
      hideAtt: "hide",
      showAtt: "show",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideNumberOfShares: "hideShares",
      iconNewWindowClass: "cmf-link-new",
    };
    const options = {
      CMF_BTN_OPTION: "0",
      CMF_DIALOG_OPTION: "0",
      CMF_BORDER_COLOUR: defaults.CMF_BORDER_COLOUR,
      VERBOSITY_MESSAGE_COLOUR: "",
      VERBOSITY_MESSAGE_BG_COLOUR: defaults.VERBOSITY_MESSAGE_BG_COLOUR,
    };

    addCSS(state, options, defaults);
    const style = addExtraCSS(state, options, defaults);

    expect(style).not.toBeNull();
    expect(style.textContent).toContain(".fb-cmf-toggle");
  });
});
