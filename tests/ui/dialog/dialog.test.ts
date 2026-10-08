// SPDX-License-Identifier: GPL-3.0-only

import { buildState, createCapabilities } from "./fixtures";
import { findElement, requireValue, mockRect } from "../helpers";
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

jest.mock("../../../src/ui/controls/toggle-button", () => ({
  createToggleButton: jest.fn((state: ToggleState, _keyWords: unknown, onToggle: () => void) => {
    if (state.btnToggleEl && state.btnToggleEl.parentNode) {
      state.btnToggleEl.parentNode.removeChild(state.btnToggleEl);
    }
    const btn = globalThis.document.createElement("button");
    btn.id = "fbcmfToggle";
    btn.addEventListener("click", onToggle);
    globalThis.document.body.appendChild(btn);
    state.btnToggleEl = btn;
    return btn;
  }),
}));

import type { ToggleState } from "../../../src/ui/dialog/types";
import { initDialog } from "../../../src/ui/dialog/dialog";
import { defaults } from "../../../src/core/options/defaults";
import { translations } from "../../../src/i18n";
import { setOptions, deleteOptions } from "../../../src/storage/idb";
import { createToggleButton } from "../../../src/ui/controls/toggle-button";

describe("ui/dialog/dialog", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
    Reflect.deleteProperty(document, "execCommand");
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
    const handlers = initDialog(context, createCapabilities(context, helpers));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const sponsored = findElement<HTMLInputElement>(dialog, 'input[name="NF_SPONSORED"]');
    const blockedFeed = findElement<HTMLInputElement>(
      dialog,
      'input[name="NF_BLOCKED_FEED"][value="1"]'
    );
    const blockedText = findElement<HTMLTextAreaElement>(
      dialog,
      'textarea[name="NF_BLOCKED_TEXT"]'
    );
    sponsored.checked = false;
    blockedFeed.checked = true;
    blockedText.value = "alpha\nbeta\n";

    await handlers.saveUserOptions();

    expect(state.options.NF_SPONSORED).toBe(false);
    expect(requireValue(state.options.NF_BLOCKED_FEED)[1]).toBe("1");
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
    const handlers = initDialog(context, createCapabilities(context, helpers));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const likesEnabled = findElement<HTMLInputElement>(dialog, 'input[name="NF_LIKES_MAXIMUM"]');
    const likesCount = findElement<HTMLInputElement>(
      dialog,
      'input[name="NF_LIKES_MAXIMUM_COUNT"]'
    );
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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const searchInput = findElement<HTMLInputElement>(dialog, ".fb-cmf-search input");
    const label = findElement<HTMLElement>(dialog, "fieldset label");

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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const fieldset = findElement<HTMLElement>(dialog, "fieldset");
    const legend = findElement<HTMLElement>(fieldset, "legend");

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
    const handlers = initDialog(context, createCapabilities(context));

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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    dialog.setAttribute(state.showAtt, "");

    document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);
  });

  test("topbar menu click closes the dialog", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });
    const menuBtn = document.createElement("button");
    menuBtn.setAttribute("aria-label", "Localized entry");
    menuBtn.setAttribute("aria-expanded", "false");
    mockRect(menuBtn, { left: 700, top: 8, width: 40, height: 40 });
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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    dialog.setAttribute(state.showAtt, "");

    menuBtn.click();

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);
  });

  test("saveUserOptions rebuilds the toggle when the placement changes", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    const handlers = initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const topRightOption = findElement<HTMLInputElement>(
      dialog,
      'input[name="CMF_BTN_OPTION"][value="1"]'
    );
    topRightOption.checked = true;

    await handlers.saveUserOptions();

    expect(state.options.CMF_BTN_OPTION).toBe("1");
    expect(createToggleButton).toHaveBeenCalledTimes(2);
    expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
  });

  test("saveUserOptions persists normalized menu preference values", async () => {
    const state = buildState();
    // Simulate a pre-hydration legacy numeric value at the external settings boundary.
    Reflect.set(state.options, "CMF_BTN_OPTION", 1);
    state.options.CMF_DIALOG_OPTION = "";
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    const handlers = initDialog(context, createCapabilities(context));

    await handlers.saveUserOptions();

    const saved = requireValue(jest.mocked(setOptions).mock.calls.at(-1))[0];
    if (typeof saved !== "string") throw new Error("Expected serialized options");
    const savedOptions: unknown = JSON.parse(saved);
    expect(savedOptions).toEqual(expect.objectContaining({ CMF_BTN_OPTION: "1" }));
    expect(savedOptions).toEqual(
      expect.objectContaining({ CMF_DIALOG_OPTION: defaults.CMF_DIALOG_OPTION })
    );
    expect(state.options.CMF_BTN_OPTION).toBe("1");
    expect(state.options.CMF_DIALOG_OPTION).toBe(defaults.CMF_DIALOG_OPTION);
  });

  test("topbar mutation observer closes dialog on expand", () => {
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });
    const menuBtn = document.createElement("button");
    menuBtn.setAttribute("aria-label", "Localized entry");
    menuBtn.setAttribute("aria-expanded", "false");
    mockRect(menuBtn, { left: 700, top: 8, width: 40, height: 40 });
    banner.appendChild(menuBtn);
    document.body.appendChild(banner);

    const observers: TestMutationObserver[] = [];
    const originalObserver = global.MutationObserver;
    /** Capture observer callbacks for deterministic delivery without jsdom microtasks. */
    class TestMutationObserver implements MutationObserver {
      /** Store the native callback and expose this observer to the fixture. */
      constructor(public callback: MutationCallback) {
        observers.push(this);
      }
      /** Observation is driven explicitly by this fixture. */
      observe(): void {}
      /** No platform resources are allocated by the test observer. */
      disconnect(): void {}
      /** Records are supplied directly when the fixture triggers callbacks. */
      takeRecords(): MutationRecord[] {
        return [];
      }
    }
    global.MutationObserver = TestMutationObserver;

    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: translations.en,
      pathInfo: {},
    };
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    dialog.setAttribute(state.showAtt, "");
    menuBtn.setAttribute("aria-expanded", "true");

    observers.forEach((observer) =>
      observer.callback(
        [
          {
            type: "attributes",
            attributeName: "aria-expanded",
            target: menuBtn,
            addedNodes: document.createDocumentFragment().childNodes,
            removedNodes: document.createDocumentFragment().childNodes,
            attributeNamespace: null,
            nextSibling: null,
            previousSibling: null,
            oldValue: null,
          },
        ],
        observer
      )
    );

    expect(dialog.hasAttribute(state.showAtt)).toBe(false);

    global.MutationObserver = originalObserver;
  });
});
