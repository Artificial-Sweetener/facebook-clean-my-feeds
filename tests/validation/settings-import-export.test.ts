// SPDX-License-Identifier: GPL-3.0-only

import { deleteOptions, setOptions } from "../../src/storage/idb";
import { allKnownOptions, control, deferred, mountSettings } from "./settings-fixtures";
import { initDialog } from "../../src/ui/dialog/dialog";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));

const mounted: ReturnType<typeof mountSettings>[] = [];
const capturedReaders: FileReader[] = [];

/** Exercise the file-input change listener while retaining the reader until the test chooses delivery. */
function selectFile(): FileReader {
  const input = control<HTMLInputElement>('input[type="file"]');
  Object.defineProperty(input, "files", {
    value: [new File(["fixture"], "settings.json")],
    configurable: true,
  });
  input.dispatchEvent(new Event("change"));
  const currentReader = capturedReaders.at(-1);
  if (!currentReader) throw new Error("Import did not allocate its FileReader");
  return currentReader;
}

/** Deliver real FileReader load events with deterministic text instead of depending on host I/O clocks. */
function finishRead(reader: FileReader, text: string): void {
  Object.defineProperty(reader, "result", { value: text, configurable: true });
  Object.defineProperty(reader, "readyState", { value: FileReader.DONE, configurable: true });
  reader.dispatchEvent(new ProgressEvent("load"));
}

/** Drain the bounded service-save and presentation-refresh promise chain after a synthetic load event. */
async function settleActions(): Promise<void> {
  for (let step = 0; step < 5; step += 1) await Promise.resolve();
}

/** Register the mounted generation so pending observers and action feedback are always cleaned up. */
function mount() {
  const fixture = mountSettings({ ...allKnownOptions, CMF_BTN_OPTION: "0" });
  mounted.push(fixture);
  return fixture;
}

beforeEach(() => {
  jest.useFakeTimers();
  document.documentElement.lang = "en";
  document.body.innerHTML = '<div role="banner"></div>';
  capturedReaders.length = 0;
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
  jest.mocked(deleteOptions).mockReset().mockResolvedValue(undefined);
  jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(function (this: FileReader) {
    capturedReaders.push(this);
    Object.defineProperty(this, "readyState", { value: FileReader.LOADING, configurable: true });
  });
});

afterEach(() => {
  mounted.splice(0).forEach(({ handlers, state }) => {
    handlers.destroyDialog();
    state.destroyDialog?.();
  });
  document.body.replaceChildren();
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("settings import and reset side effects", () => {
  test.each(["{broken", "[]", "null", "42", '"text"', "{}", '{"NF_SPONSORED":false}'])(
    "rejects incomplete or non-record import %s without replacing active filters",
    async (text) => {
      const { state, applyOptions } = mount();
      const previous = JSON.stringify(state.options);
      finishRead(selectFile(), text);
      await settleActions();
      expect(setOptions).not.toHaveBeenCalled();
      expect(applyOptions).not.toHaveBeenCalled();
      expect(JSON.stringify(state.options)).toBe(previous);
    }
  );

  test("successful file import rebuilds live text filters, controls and toggle placement", async () => {
    const { state, applyOptions } = mount();
    const oldToggle = state.btnToggleEl;
    finishRead(
      selectFile(),
      JSON.stringify({
        ...allKnownOptions,
        CMF_BTN_OPTION: "2",
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "ImportedİİSecond",
        NF_BLOCKED_FEED: ["1", "1", "1"],
        GF_BLOCKED_ENABLED: true,
        VF_BLOCKED_ENABLED: false,
      })
    );
    await settleActions();
    expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Imported", "Second"]);
    expect(state.filters.GF_BLOCKED_TEXT).toEqual(["Group", "Other group", "Imported", "Second"]);
    expect(state.filters.VF_BLOCKED_TEXT).toEqual([]);
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe("Imported\nSecond");
    expect(control<HTMLInputElement>('[name="NF_BLOCKED_ENABLED"]').checked).toBe(true);
    expect(state.btnToggleEl).not.toBe(oldToggle);
    expect(state.options.CMF_BTN_OPTION).toBe("2");
    expect(applyOptions).toHaveBeenCalledTimes(1);
    expect(setOptions).toHaveBeenCalledTimes(1);
  });

  test("destroy aborts an in-flight import and prevents queued loads from touching its replacement", async () => {
    const { state, handlers, context, capabilities } = mount();
    const reader = selectFile();
    const abort = jest.spyOn(reader, "abort").mockImplementation(() => undefined);
    handlers.destroyDialog();
    const replacement = initDialog(context, capabilities);
    const dialog = control("#fbcmf");
    finishRead(reader, JSON.stringify({ ...allKnownOptions, NF_BLOCKED_ENABLED: true }));
    await settleActions();
    expect(abort).toHaveBeenCalledTimes(1);
    expect(setOptions).not.toHaveBeenCalled();
    expect(document.getElementById("fbcmf")).toBe(dialog);
    expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
    replacement.destroyDialog();
  });

  test("an import completing persistence after destruction cannot refresh a replacement dialog", async () => {
    const { handlers, context, capabilities } = mount();
    const write = deferred<void>();
    jest.mocked(setOptions).mockReturnValue(write.promise);
    finishRead(selectFile(), JSON.stringify({ ...allKnownOptions, NF_BLOCKED_TEXT: "Imported" }));
    handlers.destroyDialog();
    const replacement = initDialog(context, capabilities);
    control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Replacement draft";
    write.resolve(undefined);
    await settleActions();
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
      "Replacement draft"
    );
    expect(control("#BTNImport").classList.contains("cmf-action--confirm-green")).toBe(false);
    replacement.destroyDialog();
  });

  test("reset retains the historical supported choices while deleting and rewriting storage", async () => {
    const { state, handlers } = mount();
    state.options.NF_BLOCKED_ENABLED = true;
    state.options.NF_BLOCKED_TEXT = "Retained by legacy reset";
    handlers.resetUserOptions();
    await settleActions();
    expect(deleteOptions).toHaveBeenCalledTimes(1);
    expect(setOptions).toHaveBeenCalledTimes(1);
    expect(state.filters.NF_BLOCKED_TEXT).toEqual(["Retained by legacy reset"]);
    expect(state.options.CMF_DIALOG_LANGUAGE).toBe("en");
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
      "Retained by legacy reset"
    );
  });

  test("a reset deletion completing after destruction cannot resave or update a replacement", async () => {
    const { handlers, context, capabilities } = mount();
    const deletion = deferred<void>();
    jest.mocked(deleteOptions).mockReturnValue(deletion.promise);
    handlers.resetUserOptions();
    handlers.destroyDialog();
    const replacement = initDialog(context, capabilities);
    control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Replacement draft";
    deletion.resolve(undefined);
    await settleActions();
    expect(setOptions).not.toHaveBeenCalled();
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
      "Replacement draft"
    );
    replacement.destroyDialog();
  });

  test("export downloads committed live options without collecting the unsubmitted draft", async () => {
    jest.useRealTimers();
    jest.spyOn(FileReader.prototype, "readAsText").mockRestore();
    const { state, handlers } = mount();
    control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Unsaved draft";
    let exported: Blob | undefined;
    const original = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
    const originalRevoke = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: jest.fn() });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      /** Retain the exact Blob passed to the browser download boundary. */
      value: (blob: Blob) => {
        exported = blob;
        return "blob:settings-test";
      },
    });
    const clicked: HTMLAnchorElement[] = [];
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      clicked.push(this);
    });
    try {
      handlers.exportUserOptions();
      if (!exported) throw new Error("Export did not create a settings blob");
      const exportedBlob = exported;
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("Expected exported text"));
        reader.onerror = () => reject(reader.error);
        reader.readAsText(exportedBlob);
      });
      expect(JSON.parse(text)).toEqual(state.options);
      expect(text).not.toContain("Unsaved draft");
      expect(clicked[0]?.download).toBe("fb - clean my feeds - settings.json");
      expect(setOptions).not.toHaveBeenCalled();
    } finally {
      handlers.destroyDialog();
      if (original) Object.defineProperty(URL, "createObjectURL", original);
      else Reflect.deleteProperty(URL, "createObjectURL");
      if (originalRevoke) Object.defineProperty(URL, "revokeObjectURL", originalRevoke);
      else Reflect.deleteProperty(URL, "revokeObjectURL");
    }
  });
});

test.each([
  { NF_STORIES: "not a boolean" },
  { NF_BLOCKED_FEED: ["1", null] },
  { NF_BLOCKED_TEXT: 42 },
  { CMF_DIALOG_LANGUAGE: {} },
])(
  "malformed known option %p causes no mutation, refresh, success or unhandled rejection",
  async (malformed) => {
    jest.useRealTimers();
    const { state, context, applyOptions } = mount();
    control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Unsubmitted draft survives";
    const previousOptions = JSON.stringify(state.options);
    const previousFilters = JSON.stringify(state.filters);
    const previousKeywords = JSON.stringify(context.keyWords);
    const previousContent = control("#fbcmf .content");
    finishRead(selectFile(), JSON.stringify({ ...allKnownOptions, ...malformed }));
    await new Promise<void>((resolve) => setTimeout(resolve, 5));
    expect(setOptions).not.toHaveBeenCalled();
    expect(applyOptions).not.toHaveBeenCalled();
    expect(JSON.stringify(state.options)).toBe(previousOptions);
    expect(JSON.stringify(state.filters)).toBe(previousFilters);
    expect(JSON.stringify(context.keyWords)).toBe(previousKeywords);
    expect(control("#fbcmf .content")).toBe(previousContent);
    expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
      "Unsubmitted draft survives"
    );
    expect(control("#BTNImport").classList.contains("cmf-action--confirm-green")).toBe(false);
  }
);

test("rejected import storage write does not report success or overwrite a later visible draft", async () => {
  const { applyOptions } = mount();
  const write = deferred<void>();
  jest.mocked(setOptions).mockReturnValueOnce(write.promise);
  finishRead(selectFile(), JSON.stringify({ ...allKnownOptions, NF_BLOCKED_TEXT: "Import" }));
  control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value = "Later unsubmitted draft";
  write.reject(new DOMException("Storage blocked", "SecurityError"));
  await settleActions();
  expect(applyOptions).not.toHaveBeenCalled();
  expect(control<HTMLTextAreaElement>('[name="NF_BLOCKED_TEXT"]').value).toBe(
    "Later unsubmitted draft"
  );
  expect(control("#BTNImport").classList.contains("cmf-action--confirm-green")).toBe(false);
});
