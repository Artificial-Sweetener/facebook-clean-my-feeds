// SPDX-License-Identifier: GPL-3.0-only

import { mountSettings, control, deferred } from "./settings-fixtures";
import { setOptions } from "../../src/storage/idb";
import { translations } from "../../src/i18n";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));
const mounted: ReturnType<typeof mountSettings>[] = [];

/** Keep each issue isolated while exercising the actual service and mounted controls. */
function mount() {
  const fixture = mountSettings({
    CMF_BTN_OPTION: "0",
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_TEXT: "Saved",
  });
  mounted.push(fixture);
  return fixture;
}

beforeEach(() => {
  jest.useFakeTimers();
  document.documentElement.lang = "en";
  document.body.innerHTML = '<div role="banner"></div>';
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
});
afterEach(() => {
  mounted.splice(0).forEach(({ handlers }) => handlers.destroyDialog());
  jest.clearAllTimers();
  jest.useRealTimers();
});

test("a pending save must not mark later unsaved edits clean when it completes", async () => {
  const { handlers, state } = mount();
  const write = deferred<void>();
  jest.mocked(setOptions).mockReturnValue(write.promise);
  const text = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  text.value = "First save";
  const saving = handlers.saveUserOptions();
  text.value = "Second unsaved draft";
  text.dispatchEvent(new Event("input", { bubbles: true }));
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
  write.resolve(undefined);
  await saving;
  expect(state.options.NF_BLOCKED_TEXT).toBe("First save");
  expect(text.value).toBe("Second unsaved draft");
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
});

test("a pending language save must preserve later unsaved filter edits through its rebuild", async () => {
  const { handlers, state } = mount();
  const write = deferred<void>();
  jest.mocked(setOptions).mockReturnValue(write.promise);
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "de";
  const saving = handlers.saveUserOptions();
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Unsaved filter update";
  write.resolve(undefined);
  await saving;
  expect(state.options.NF_BLOCKED_TEXT).toBe("Saved");
  expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
    "Unsaved filter update"
  );
});

test("changing locale updates the close control accessible name", async () => {
  const { handlers } = mount();
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "de";
  await handlers.saveUserOptions();
  expect(control(".fb-cmf-close button").getAttribute("aria-label")).toBe(
    translations.de.DLG_BUTTONS[1]
  );
});

test("the control collector must not persist unnamed search/report controls", async () => {
  const { handlers, state } = mount();
  await handlers.saveUserOptions();
  expect(Object.prototype.hasOwnProperty.call(state.options, "")).toBe(false);
});

test("a second locale choice remains an unsaved draft after the first locale save rebuilds", async () => {
  const { handlers, state } = mount();
  const write = deferred<void>();
  jest.mocked(setOptions).mockReturnValueOnce(write.promise);
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "de";
  const saving = handlers.saveUserOptions();
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "ar";
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "New pending filter";
  write.resolve(undefined);
  await saving;
  expect(state.language).toBe("de");
  expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Saved"]);
  expect(control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value).toBe("ar");
  expect(control("#fbcmf").dir).toBe("ltr");
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
  await handlers.saveUserOptions();
  expect(state.language).toBe("ar");
  expect(state.filters.NF_BLOCKED_TEXT).toEqual(["New pending filter"]);
  expect(control("#fbcmf").dir).toBe("rtl");
});

test("failed persistence retains the later draft and does not show success or rebuild", async () => {
  const { handlers } = mount();
  const write = deferred<void>();
  jest.mocked(setOptions).mockReturnValue(write.promise);
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "de";
  const saving = handlers.saveUserOptions();
  const textarea = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  textarea.value = "Later unsaved filter";
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  const rejection = expect(saving).rejects.toThrow("Storage blocked");
  write.reject(new Error("Storage blocked"));
  await rejection;
  expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]')).toBe(textarea);
  expect(textarea.value).toBe("Later unsaved filter");
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
  expect(control("#BTNSave").classList.contains("cmf-action--confirm-blue")).toBe(false);
});

test("a normal save clears dirty feedback and persists exactly the submitted filters", async () => {
  const { handlers, state } = mount();
  const textarea = control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]');
  textarea.value = "Newly saved filter";
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  await handlers.saveUserOptions();
  expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Newly saved filter"]);
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(false);
  expect(control("#BTNSave").classList.contains("cmf-action--confirm-blue")).toBe(true);
  jest.advanceTimersByTime(600);
  expect(control("#BTNSave").classList.contains("cmf-action--confirm-blue")).toBe(false);
});

test("reversed completion of two saves preserves a third unsubmitted draft", async () => {
  const { handlers, state } = mount();
  const firstWrite = deferred<void>();
  const secondWrite = deferred<void>();
  jest
    .mocked(setOptions)
    .mockReturnValueOnce(firstWrite.promise)
    .mockReturnValueOnce(secondWrite.promise);
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "de";
  const firstSave = handlers.saveUserOptions();
  control<HTMLSelectElement>('[name="CMF_DIALOG_LANGUAGE"]').value = "ar";
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Second committed filter";
  const secondSave = handlers.saveUserOptions();
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Third unsaved filter";
  secondWrite.resolve(undefined);
  await secondSave;
  firstWrite.resolve(undefined);
  await firstSave;
  expect(state.language).toBe("ar");
  expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Second committed filter"]);
  expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
    "Third unsaved filter"
  );
  expect(control("#BTNSave").classList.contains("cmf-action--dirty")).toBe(true);
});
