// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../src/i18n";
import { applySearchFilter } from "../../src/ui/dialog/search";
import { deleteOptions, setOptions } from "../../src/storage/idb";
import { control, mountSettings } from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));
const mounted: ReturnType<typeof mountSettings>[] = [];

/** Mount a valid active regex configuration so a rejected edit must preserve meaningful filters. */
function mount(language = "en") {
  const fixture = mountSettings({
    CMF_DIALOG_LANGUAGE: language,
    CMF_BTN_OPTION: "0",
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_RE: true,
    NF_BLOCKED_TEXT: "^Valid$",
  });
  mounted.push(fixture);
  return fixture;
}

beforeEach(() => {
  jest.useFakeTimers();
  document.documentElement.lang = "en";
  document.body.innerHTML = '<div role="banner"></div>';
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
  jest.mocked(deleteOptions).mockReset().mockResolvedValue(undefined);
});
afterEach(() => {
  mounted.splice(0).forEach(({ state }) => state.destroyDialog?.());
  document.body.replaceChildren();
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("localized invalid regex field errors", () => {
  test.each(Object.entries(translations))(
    "invalid draft is retained with translated source-line error in %s",
    async (language, catalog) => {
      const { handlers, state, applyOptions } = mount(language);
      const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
      input.value = "^Valid$\n\nPrivate invalid [";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      const before = JSON.stringify(state.options);
      await expect(handlers.saveUserOptions()).resolves.toBeUndefined();
      expect(JSON.stringify(state.options)).toBe(before);
      expect(state.filters.NF_BLOCKED_TEXT).toEqual(["^Valid$"]);
      expect(input.value).toBe("^Valid$\n\nPrivate invalid [");
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(document.activeElement).toBe(input);
      const expected = catalog.DLG_REGEX_ERROR.replace(
        "{field}",
        `${catalog.DLG_NF}: ${catalog.DLG_BLOCK_TEXT_FILTER_TITLE}`
      )
        .replace("{line}", "3")
        .replace("{feed}", catalog.DLG_NF);
      expect(input.validationMessage).toBe(expected);
      expect(control(".cmf-regex-error").textContent).toBe(expected);
      expect(control(".cmf-regex-error").textContent).not.toContain("Private invalid");
      expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
      expect(control("#BTNSave").classList.contains("cmf-action--confirm-blue")).toBe(false);
      expect(setOptions).not.toHaveBeenCalled();
      expect(applyOptions).not.toHaveBeenCalled();
      input.value = "^Repaired$";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      expect(input.validationMessage).toBe("");
      await handlers.saveUserOptions();
      expect(state.filters.NF_BLOCKED_TEXT).toEqual(["^Repaired$"]);
      expect(document.querySelector(".cmf-regex-error")).toBeNull();
    }
  );

  test("a cross-feed failure focuses the actual source field and reports the consuming feed", async () => {
    const { handlers, state } = mount();
    control<HTMLInputElement>('[name="NF_BLOCKED_RE"]').checked = false;
    control<HTMLInputElement>('[name="NF_BLOCKED_FEED"][value="1"]').checked = true;
    control<HTMLInputElement>('[name="GF_BLOCKED_ENABLED"]').checked = true;
    control<HTMLInputElement>('[name="GF_BLOCKED_RE"]').checked = true;
    const source = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
    source.value = "Valid\n[";
    await handlers.saveUserOptions();
    expect(document.activeElement).toBe(source);
    expect(source.validationMessage).toContain("line 2");
    expect(source.validationMessage).toContain(translations.en.DLG_GF);
    expect(control<HTMLTextAreaElement>('[name="GF_BLOCKED_TEXT"]').validationMessage).toBe("");
    expect(state.options.GF_BLOCKED_ENABLED).toBe(false);
    expect(setOptions).not.toHaveBeenCalled();
  });

  test("rejected import reports its original file line without replacing or invalidating the visible draft", async () => {
    const { state } = mount();
    const textarea = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
    textarea.value = "My unsubmitted draft";
    const readers: FileReader[] = [];
    jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(function (this: FileReader) {
      readers.push(this);
    });
    const input = control<HTMLInputElement>('input[type="file"]');
    Object.defineProperty(input, "files", { value: [new File(["fixture"], "settings.json")] });
    input.dispatchEvent(new Event("change"));
    const reader = readers[0];
    if (!reader) throw new Error("Expected import reader");
    Object.defineProperty(reader, "result", {
      value: JSON.stringify({ ...state.options, NF_BLOCKED_TEXT: "validİİPrivate invalid [" }),
    });
    reader.dispatchEvent(new ProgressEvent("load"));
    for (let step = 0; step < 6; step += 1) await Promise.resolve();
    expect(setOptions).not.toHaveBeenCalled();
    expect(state.options.NF_BLOCKED_TEXT).toBe("^Valid$");
    expect(textarea.value).toBe("My unsubmitted draft");
    expect(textarea.validationMessage).toBe("");
    expect(control(".cmf-regex-error").textContent).toContain(
      translations.en.DLG_REGEX_IMPORT_ERROR
    );
    expect(control(".cmf-regex-error").textContent).toContain("line 2");
    expect(control(".cmf-regex-error").textContent).not.toContain("Private invalid");
    expect(control("#BTNImport").classList.contains("cmf-action--confirm-green")).toBe(false);
  });

  test("legacy invalid stored rules are visible for repair with a localized warning", () => {
    const fixture = mountSettings({
      CMF_DIALOG_LANGUAGE: "de",
      CMF_BTN_OPTION: "0",
      PP_BLOCKED_ENABLED: true,
      PP_BLOCKED_RE: true,
      PP_BLOCKED_TEXT: "[",
    });
    mounted.push(fixture);
    expect(control<HTMLTextAreaElement>('[name="PP_BLOCKED_TEXT"]').value).toBe("[");
    expect(control(".cmf-regex-error").textContent).toContain(
      translations.de.DLG_REGEX_SAVED_ERROR
    );
    expect(setOptions).not.toHaveBeenCalled();
  });
});

test("an invalid source hidden by settings search is revealed and stays visible on reopen", async () => {
  const { handlers, state } = mount();
  const dialog = control("#fbcmf");
  const search = control<HTMLInputElement>(".fb-cmf-search input");
  const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  input.value = "Invalid [";
  search.value = "No matching settings label";
  applySearchFilter(dialog, search.value);
  const section = input.closest("fieldset");
  if (!section) throw new Error("Expected source fieldset");
  expect(section.style.display).toBe("none");
  await handlers.saveUserOptions();
  expect(search.value).toBe("");
  expect(dialog.classList.contains("cmf-searching")).toBe(false);
  expect(section.style.display).toBe("");
  expect(section.classList.contains("cmf-visible")).toBe(true);
  expect(
    Array.from(section.querySelectorAll("label")).every((label) => label.style.display !== "none")
  ).toBe(true);
  expect(document.activeElement).toBe(input);
  expect(section.querySelector(".cmf-regex-error")).not.toBeNull();
  state.syncDialogSearch?.();
  expect(section.style.display).toBe("");
});

test.each([false, true])(
  "reset reveals the saved invalid source and preserves an edited draft: %s",
  async (editedDraft) => {
    const fixture = mountSettings({
      CMF_DIALOG_LANGUAGE: "de",
      CMF_BTN_OPTION: "0",
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_RE: true,
      NF_BLOCKED_TEXT: "^Valid$İİ[",
    });
    mounted.push(fixture);
    const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
    const value = editedDraft ? "^Repaired pending draft$" : "^Valid$\n[";
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const before = JSON.stringify(fixture.state.options);
    control<HTMLButtonElement>("#BTNReset").click();
    for (let step = 0; step < 6; step += 1) await Promise.resolve();
    expect(JSON.stringify(fixture.state.options)).toBe(before);
    expect(input.value).toBe(value);
    expect(document.activeElement).toBe(input);
    expect(control(".cmf-regex-error").textContent).toContain(
      translations.de.DLG_REGEX_SAVED_ERROR
    );
    expect(input.validity.valid).toBe(editedDraft);
    expect(deleteOptions).not.toHaveBeenCalled();
    expect(setOptions).not.toHaveBeenCalled();
  }
);

test.each([false, true])(
  "invalid save button events are handled without escaping after immediate teardown: %s",
  async (destroyImmediately) => {
    const { handlers, state } = mount();
    const unhandled = jest.fn();
    window.addEventListener("unhandledrejection", unhandled);
    try {
      control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Invalid [";
      control<HTMLButtonElement>("#BTNSave").click();
      if (destroyImmediately) handlers.destroyDialog();
      for (let step = 0; step < 6; step += 1) await Promise.resolve();
      expect(unhandled).not.toHaveBeenCalled();
      expect(state.options.NF_BLOCKED_TEXT).toBe("^Valid$");
      expect(setOptions).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("unhandledrejection", unhandled);
    }
  }
);

test("a disposed dialog resolves its pending invalid-save handler without annotating a replacement", async () => {
  const { handlers } = mount();
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Invalid [";
  const pending = handlers.saveUserOptions();
  handlers.destroyDialog();
  mount();
  await expect(pending).resolves.toBeUndefined();
  expect(document.querySelector(".cmf-regex-error")).toBeNull();
  expect(setOptions).not.toHaveBeenCalled();
});

test("a rejected earlier draft cannot attach a stale regex error to a newer corrected draft", async () => {
  const { handlers, state } = mount();
  const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  input.value = "Invalid [";
  const rejection = handlers.saveUserOptions();
  input.value = "^New valid draft$";
  input.dispatchEvent(new Event("input", { bubbles: true }));
  await rejection;
  expect(input.value).toBe("^New valid draft$");
  expect(input.validationMessage).toBe("");
  expect(document.querySelector(".cmf-regex-error")).toBeNull();
  expect(state.filters.NF_BLOCKED_TEXT).toEqual(["^Valid$"]);
  expect(setOptions).not.toHaveBeenCalled();
});

test.each([
  { draft: "Firstİİ[", line: 1 },
  { draft: "\n^First$\n \nSecondİİ[", line: 4 },
])("an encoded separator in a draft still reports visible row $line", async ({ draft, line }) => {
  const { handlers } = mount();
  const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  input.value = draft;
  await handlers.saveUserOptions();
  expect(input.value).toBe(draft);
  expect(input.validationMessage).toContain(`line ${line}:`);
  expect(setOptions).not.toHaveBeenCalled();
});

test("a save-button storage failure is handled without replacing its draft or reporting success", async () => {
  const { applyOptions } = mount();
  const unhandled = jest.fn();
  window.addEventListener("unhandledrejection", unhandled);
  try {
    jest.mocked(setOptions).mockRejectedValueOnce(new Error("Storage unavailable"));
    const input = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
    input.value = "^Pending valid draft$";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    control<HTMLButtonElement>("#BTNSave").click();
    for (let step = 0; step < 6; step += 1) await Promise.resolve();
    expect(unhandled).not.toHaveBeenCalled();
    expect(input.value).toBe("^Pending valid draft$");
    expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
    expect(control("#BTNSave").classList.contains("cmf-action--confirm-blue")).toBe(false);
    expect(applyOptions).not.toHaveBeenCalled();
  } finally {
    window.removeEventListener("unhandledrejection", unhandled);
  }
});
