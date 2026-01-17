jest.mock("../../../src/dom/styles", () => ({
  addCSS: jest.fn(() => ({})),
  addExtraCSS: jest.fn(() => ({})),
}));

jest.mock("../../../src/dom/hide", () => ({
  toggleHiddenElements: jest.fn(),
}));

jest.mock("../../../src/storage/idb", () => ({
  deleteOptions: jest.fn(() => Promise.resolve()),
  setOptions: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../../src/ui/reporting/bug-report", () => ({
  buildBugReport: jest.fn(() => ({ text: "report", data: {} })),
  getSupportUrl: jest.fn(() => "https://example.com/support"),
}));

jest.mock("../../../src/ui/controls/toggle-button", () => ({
  createToggleButton: jest.fn((state, _keyWords, onToggle) => {
    const btn = globalThis.document.createElement("button");
    btn.id = "fbcmfToggle";
    btn.addEventListener("click", onToggle);
    globalThis.document.body.appendChild(btn);
    state.btnToggleEl = btn;
    return btn;
  }),
}));

const { initDialog } = require("../../../src/ui/dialog/dialog");
const { defaults, translations } = require("../../../src/ui/i18n/translations");
const { createState, SEPARATOR } = require("../../../src/core/state/vars");
const { setOptions, deleteOptions } = require("../../../src/storage/idb");

function buildState() {
  const state = createState();
  state.SEP = SEPARATOR;
  state.showAtt = "show";
  state.hideAtt = "hide";
  state.cssHideEl = "hideBlock";
  state.cssHideNumberOfShares = "hideShares";
  state.options = {
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
  state.filters = {};
  state.language = "en";
  state.iconDialogHeaderHTML = "<svg></svg>";
  state.iconDialogSearchHTML = "<svg></svg>";
  state.iconDialogFooterHTML = "<svg></svg>";
  state.iconFooterSaveHTML = "<svg></svg>";
  state.iconFooterCheckHTML = "<svg></svg>";
  state.iconClose = "<svg></svg>";
  state.iconLegendHTML = "<svg></svg>";
  state.dialogFooterIcons = {};
  state.dialogSectionIcons = {};
  state.iconToggleHTML = "<svg></svg>";
  return state;
}

describe("ui/dialog/dialog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "open").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
    window.open.mockRestore();
    delete navigator.clipboard;
    document.execCommand = undefined;
  });

  test("saveUserOptions collects inputs and updates state", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    const helpers = { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() };
    const handlers = initDialog(context, helpers);

    const dialog = document.getElementById("fbcmf");
    const sponsored = dialog.querySelector('input[name="NF_SPONSORED"]');
    const blockedFeed = dialog.querySelector('input[name="NF_BLOCKED_FEED"][value="1"]');
    const blockedText = dialog.querySelector('textarea[name="NF_BLOCKED_TEXT"]');
    sponsored.checked = false;
    blockedFeed.checked = true;
    blockedText.value = "alpha\nbeta\n";

    await handlers.saveUserOptions();

    expect(state.options.NF_SPONSORED).toBe(false);
    expect(state.options.NF_BLOCKED_FEED[1]).toBe("1");
    expect(state.options.NF_BLOCKED_TEXT).toBe(`alpha${state.SEP}beta`);
    expect(setOptions).toHaveBeenCalled();
  });

  test("saveUserOptions blocks save when likes maximum is missing", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    const helpers = { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() };
    const handlers = initDialog(context, helpers);

    const dialog = document.getElementById("fbcmf");
    const likesEnabled = dialog.querySelector('input[name="NF_LIKES_MAXIMUM"]');
    const likesCount = dialog.querySelector('input[name="NF_LIKES_MAXIMUM_COUNT"]');
    likesEnabled.checked = true;
    likesCount.value = "";

    await handlers.saveUserOptions();

    expect(window.alert).toHaveBeenCalled();
    expect(setOptions).not.toHaveBeenCalled();
  });

  test("search input filters labels and restores", () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    const searchInput = dialog.querySelector(".fb-cmf-search input");
    const label = dialog.querySelector("fieldset label");

    searchInput.value = "zzzz";
    searchInput.dispatchEvent(new Event("input"));
    expect(dialog.classList.contains("cmf-searching")).toBe(true);
    expect(label.style.display).toBe("none");

    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input"));
    expect(dialog.classList.contains("cmf-searching")).toBe(false);
    expect(label.style.display).toBe("");
  });

  test("legend click toggles fieldset state", () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    const fieldset = dialog.querySelector("fieldset");
    const legend = fieldset.querySelector("legend");

    expect(fieldset.classList.contains("cmf-hidden")).toBe(true);
    legend.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(fieldset.classList.contains("cmf-visible")).toBe(true);
  });

  test("resetUserOptions deletes saved options", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    const handlers = initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    await handlers.resetUserOptions();

    expect(deleteOptions).toHaveBeenCalled();
  });

  test("outside click closes the dialog", () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    dialog.setAttribute(state.showAtt, "");

    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);
  });

  test("topbar menu click closes the dialog", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    const menuBtn = document.createElement("button");
    menuBtn.setAttribute("aria-label", "Menu");
    menuBtn.setAttribute("aria-expanded", "false");
    banner.appendChild(menuBtn);
    document.body.appendChild(banner);

    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    dialog.setAttribute(state.showAtt, "");

    menuBtn.click();

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);
  });

  test("report bug actions generate, copy, and open", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    const btnGenerate = dialog.querySelector("#BTNReportGenerate");
    const btnCopy = dialog.querySelector("#BTNReportCopy");
    const btnOpen = dialog.querySelector("#BTNReportOpenIssues");
    const statusEl = dialog.querySelector(".cmf-report-status");
    const outputEl = dialog.querySelector(".cmf-report-output");

    btnGenerate.click();
    expect(outputEl.value).toBe("report");
    expect(outputEl.classList.contains("cmf-report-output--visible")).toBe(true);
    expect(statusEl.textContent).toBe(translations.en.DLG_REPORT_BUG_STATUS_READY);

    navigator.clipboard = { writeText: jest.fn(() => Promise.resolve()) };
    btnCopy.click();
    await Promise.resolve();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("report");
    expect(statusEl.textContent).toBe(translations.en.DLG_REPORT_BUG_STATUS_COPIED);

    btnOpen.click();
    expect(window.open).toHaveBeenCalledWith("https://example.com/support", "_blank");
  });

  test("report bug copy falls back to execCommand without clipboard", () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    const btnGenerate = dialog.querySelector("#BTNReportGenerate");
    const btnCopy = dialog.querySelector("#BTNReportCopy");
    const statusEl = dialog.querySelector(".cmf-report-status");
    const outputEl = dialog.querySelector(".cmf-report-output");
    outputEl.select = jest.fn();
    document.execCommand = jest.fn(() => true);

    btnGenerate.click();
    btnCopy.click();

    expect(outputEl.select).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(statusEl.textContent).toBe(translations.en.DLG_REPORT_BUG_STATUS_COPIED);
  });

  test("topbar mutation observer closes dialog on expand", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    const menuBtn = document.createElement("button");
    menuBtn.setAttribute("aria-label", "Menu");
    menuBtn.setAttribute("aria-expanded", "false");
    banner.appendChild(menuBtn);
    document.body.appendChild(banner);

    const observers = [];
    const originalObserver = global.MutationObserver;
    global.MutationObserver = class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };

    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, { setFeedSettings: jest.fn(), rerunFeeds: jest.fn() });

    const dialog = document.getElementById("fbcmf");
    dialog.setAttribute(state.showAtt, "");
    menuBtn.setAttribute("aria-expanded", "true");

    observers.forEach((observer) =>
      observer.callback([
        {
          type: "attributes",
          attributeName: "aria-expanded",
          target: menuBtn,
        },
      ])
    );

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);

    global.MutationObserver = originalObserver;
  });
});
