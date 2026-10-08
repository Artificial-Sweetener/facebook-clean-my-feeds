// SPDX-License-Identifier: GPL-3.0-only

import { buildState, createCapabilities } from "./fixtures";
import { findElement } from "../helpers";
import { translations } from "../../../src/i18n";
import { initDialog } from "../../../src/ui/dialog/dialog";
import type { ToggleState } from "../../../src/ui/dialog/types";

jest.mock("../../../src/storage/idb", () => ({
  deleteOptions: jest.fn(() => Promise.resolve()),
  setOptions: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../../src/ui/controls/toggle-button", () => ({
  destroyToggleButton: jest.fn((state: ToggleState) => {
    state.btnToggleEl?.remove();
    state.btnToggleEl = null;
  }),
  createToggleButton: jest.fn((state: ToggleState, _keywords: unknown, onToggle: () => void) => {
    const button = document.createElement("button");
    button.id = "fbcmfToggle";
    button.addEventListener("click", onToggle);
    document.body.appendChild(button);
    state.btnToggleEl = button;
    return button;
  }),
}));

describe("ui/reporting/report-controls", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.spyOn(window, "open").mockImplementation(() => null);
  });
  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(navigator, "clipboard");
    Reflect.deleteProperty(document, "execCommand");
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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const btnGenerate = findElement<HTMLElement>(dialog, "#BTNReportGenerate");
    const btnCopy = findElement<HTMLElement>(dialog, "#BTNReportCopy");
    const btnOpen = findElement<HTMLElement>(dialog, "#BTNReportOpenIssues");
    const statusEl = findElement<HTMLElement>(dialog, ".cmf-report-status");
    const outputEl = findElement<HTMLTextAreaElement>(dialog, ".cmf-report-output");

    btnGenerate.click();
    expect(outputEl.value).toBe("report");
    expect(outputEl.classList.contains("cmf-report-output--visible")).toBe(true);
    expect(statusEl.textContent).toBe(translations.en.DLG_REPORT_BUG_STATUS_READY);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: jest.fn(() => Promise.resolve()) },
    });
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
    initDialog(context, createCapabilities(context));

    const dialog = findElement(document, `#${"fbcmf"}`);
    const btnGenerate = findElement<HTMLElement>(dialog, "#BTNReportGenerate");
    const btnCopy = findElement<HTMLElement>(dialog, "#BTNReportCopy");
    const statusEl = findElement<HTMLElement>(dialog, ".cmf-report-status");
    const outputEl = findElement<HTMLTextAreaElement>(dialog, ".cmf-report-output");
    outputEl.select = jest.fn();
    document.execCommand = jest.fn(() => true);

    btnGenerate.click();
    btnCopy.click();

    expect(outputEl.select).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(statusEl.textContent).toBe(translations.en.DLG_REPORT_BUG_STATUS_COPIED);
  });

  test("report controls remain active after rebuilding localized dialog content", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: { ...translations.en },
    };
    const capabilities = {
      ...createCapabilities(context),
      buildReport: jest.fn(() => ({ text: "localized-report" })),
    };
    const handlers = initDialog(context, capabilities);
    const dialog = findElement(document, "#fbcmf");
    const firstGenerate = findElement<HTMLButtonElement>(dialog, "#BTNReportGenerate");
    firstGenerate.click();
    expect(capabilities.buildReport).toHaveBeenCalledTimes(1);

    findElement<HTMLSelectElement>(dialog, 'select[name="CMF_DIALOG_LANGUAGE"]').value = "de";
    await handlers.saveUserOptions();

    const nextGenerate = findElement<HTMLButtonElement>(dialog, "#BTNReportGenerate");
    expect(nextGenerate).not.toBe(firstGenerate);
    nextGenerate.click();
    expect(capabilities.buildReport).toHaveBeenCalledTimes(2);
    expect(findElement<HTMLTextAreaElement>(dialog, ".cmf-report-output").value).toBe(
      "localized-report"
    );
    expect(findElement(dialog, ".cmf-report-status").textContent).toBe(
      translations.de.DLG_REPORT_BUG_STATUS_READY
    );
    handlers.destroyDialog();
  });

  test("search binds the replacement input after rebuilding localized dialog content", async () => {
    const state = buildState();
    const context = {
      state,
      options: state.options,
      filters: state.filters,
      keyWords: { ...translations.en },
    };
    const handlers = initDialog(context, createCapabilities(context));
    const dialog = findElement(document, "#fbcmf");
    const oldSearch = findElement<HTMLInputElement>(dialog, ".fb-cmf-search input");
    findElement<HTMLSelectElement>(dialog, 'select[name="CMF_DIALOG_LANGUAGE"]').value = "de";
    await handlers.saveUserOptions();

    const newSearch = findElement<HTMLInputElement>(dialog, ".fb-cmf-search input");
    expect(newSearch).not.toBe(oldSearch);
    newSearch.value = "zzzz-unmatched";
    newSearch.dispatchEvent(new Event("input"));
    expect(dialog.classList.contains("cmf-searching")).toBe(true);
    expect(findElement(dialog, "fieldset label").style.display).toBe("none");
    oldSearch.value = "";
    oldSearch.dispatchEvent(new Event("input"));
    expect(dialog.classList.contains("cmf-searching")).toBe(true);
    handlers.destroyDialog();
  });
});
