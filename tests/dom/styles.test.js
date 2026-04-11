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

  test("ensureStyleTag mounts to document head when available", () => {
    const doc = document.implementation.createHTMLDocument("cmf-test");
    const style = ensureStyleTag("test-style", doc);

    expect(style).not.toBeNull();
    expect(doc.head.contains(style)).toBe(true);
    expect(doc.querySelectorAll("#test-style").length).toBe(1);
  });

  test("ensureStyleTag mounts to documentElement when head is missing", () => {
    const doc = document.implementation.createHTMLDocument("cmf-test");
    doc.documentElement.removeChild(doc.head);

    const style = ensureStyleTag("test-style", doc);

    expect(style).not.toBeNull();
    expect(doc.head).toBeNull();
    expect(doc.documentElement.contains(style)).toBe(true);
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
    const css = style.textContent;
    const topbarOverlayRule = ".fb-cmf-toggle.fb-cmf-toggle-topbar::after";
    const dimmedTopbarOverlayRule =
      '.fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after';
    const lightModeDimmedTopbarOverlayRule =
      '.__fb-light-mode .fb-cmf-toggle.fb-cmf-toggle-topbar[data-cmf-page-dimmed="true"]::after';

    expect(style).not.toBeNull();
    expect(css).toContain(".fb-cmf-toggle");
    expect(css).toContain('.fb-cmf-toggle[data-cmf-page-dimmed="true"]');
    expect(css).toContain("pointer-events:none");
    expect(css).toContain("background-color:rgba(11,11,11,0.66)");
    expect(css).toContain("background-color:rgba(244,244,244,0.8)");
    expect(css).toContain("opacity:1");
    expect(css).not.toContain('.fb-cmf-toggle[data-cmf-page-dimmed="true"]{display:none');
    expect(css.indexOf(dimmedTopbarOverlayRule)).toBeGreaterThan(css.indexOf(topbarOverlayRule));
    expect(css.indexOf(lightModeDimmedTopbarOverlayRule)).toBeGreaterThan(
      css.indexOf(dimmedTopbarOverlayRule)
    );
  });
});
