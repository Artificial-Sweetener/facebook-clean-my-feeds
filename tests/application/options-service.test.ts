// SPDX-License-Identifier: GPL-3.0-only

import { createOptionsService } from "../../src/application/options-service";
import type { OptionsContext } from "../../src/application/options-service";
import { hydrateOptions } from "../../src/core/options/hydrate";
import type { StoredOptions } from "../../src/core/options/types";
import { deleteOptions, setOptions } from "../../src/storage/idb";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));
const write = jest.mocked(setOptions);
const remove = jest.mocked(deleteOptions);

/**
 * Build the smallest valid shared-model fixture without mounting presentation or feed code.
 * @param stored Original settings hydrated before the service is created.
 * @param detached Whether context pointers intentionally differ from state's pointer identities.
 * @returns Both model identities, service operations, and an observable host-effect callback.
 */
function createFixture(stored: StoredOptions = {}, detached = false) {
  const hydrated = hydrateOptions(stored);
  const context: OptionsContext = {
    state: {
      options: hydrated.options,
      filters: hydrated.filters,
      language: hydrated.language,
      hideAnInfoBox: hydrated.hideAnInfoBox,
    },
    options: detached ? { ...hydrated.options } : hydrated.options,
    filters: detached ? { ...hydrated.filters } : hydrated.filters,
    keyWords: hydrated.keyWords,
  };
  const applyOptions = jest.fn();
  return { context, applyOptions, service: createOptionsService(context, { applyOptions }) };
}

/** Reset persistence outcomes and document language so failures never leak into later cases. */
beforeEach(() => {
  document.documentElement.lang = "en";
  write.mockReset().mockResolvedValue(undefined);
  remove.mockReset().mockResolvedValue(undefined);
});

describe("application/options-service", () => {
  test.each([false, true])(
    "preserves shared model identities, including detached context %p",
    async (detached) => {
      const { context, applyOptions, service } = createFixture({ NF_STORIES: false }, detached);
      const stateOptions = context.state.options;
      const contextOptions = context.options;
      const stateFilters = context.state.filters;
      const contextFilters = context.filters;
      const keywords = context.keyWords;
      const pending = {
        NF_STORIES: true,
        CMF_DIALOG_LANGUAGE: "de",
        CMF_BTN_OPTION: "0",
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "OneİİTwo",
      };
      const result = await service.saveOptions(pending, "dialog");
      expect(context.state.options).toBe(stateOptions);
      expect(context.options).toBe(contextOptions);
      expect(context.state.filters).toBe(stateFilters);
      expect(context.filters).toBe(contextFilters);
      expect(context.keyWords).toBe(keywords);
      expect(context.options.NF_STORIES).toBe(true);
      expect(context.filters.NF_BLOCKED_TEXT_LC).toEqual(["one", "two"]);
      expect(context.keyWords.SPONSORED_EXTRA).toBe("Anzeige");
      expect(context.state.language).toBe("de");
      expect(result).toEqual({ languageChanged: true, buttonLocationChanged: true });
      expect(applyOptions).toHaveBeenCalledTimes(1);
      expect(pending).not.toHaveProperty("NF_SPONSORED");
    }
  );

  test("writes the historical JSON-string representation and preserves permitted extra fields", async () => {
    const { context, service } = createFixture();
    await service.saveOptions({ NF_STORIES: true, extra: { value: 7 } }, "file");
    expect(write).toHaveBeenCalledTimes(1);
    const serialized = write.mock.calls[0]?.[0];
    expect(typeof serialized).toBe("string");
    if (typeof serialized !== "string")
      throw new Error("Expected the legacy JSON storage representation");
    const decoded: unknown = JSON.parse(serialized);
    expect(decoded).toEqual(context.state.options);
    expect(decoded).toHaveProperty("extra", { value: 7 });
    expect(decoded).not.toHaveProperty("SPONSORED");
    expect(decoded).not.toHaveProperty("REELS_CONTROLS");
  });

  test("malformed known imported values fail before mutating active settings or writing storage", async () => {
    const { context, service, applyOptions } = createFixture({ NF_STORIES: true });
    const previous = JSON.stringify(context.state.options);
    await expect(service.saveOptions({ NF_STORIES: "true" }, "file")).rejects.toThrow(TypeError);
    expect(JSON.stringify(context.state.options)).toBe(previous);
    expect(write).not.toHaveBeenCalled();
    expect(applyOptions).not.toHaveBeenCalled();
  });

  test("retains original memory-before-persistence order and skips host effects if the write rejects", async () => {
    const failure = new DOMException("Quota exceeded", "QuotaExceededError");
    write.mockRejectedValue(failure);
    const { context, service, applyOptions } = createFixture({ NF_STORIES: false });
    await expect(service.saveOptions({ NF_STORIES: true }, "dialog")).rejects.toBe(failure);
    expect(context.state.options.NF_STORIES).toBe(true);
    expect(context.options.NF_STORIES).toBe(true);
    expect(applyOptions).not.toHaveBeenCalled();
  });

  test("reports imported button placement changes so the UI remounts at the requested location", async () => {
    const { service } = createFixture({ CMF_BTN_OPTION: "1" });
    const result = await service.saveOptions({ CMF_BTN_OPTION: "0" }, "file");
    expect(result.buttonLocationChanged).toBe(true);
    expect(result.languageChanged).toBe(false);
  });

  test("retains file-import language-rebuild behavior while updating hydrated text", async () => {
    const { context, service } = createFixture();
    const result = await service.saveOptions({ CMF_DIALOG_LANGUAGE: "de" }, "file");
    expect(result.languageChanged).toBe(false);
    expect(context.state.language).toBe("de");
    expect(context.keyWords.CMF_DIALOG_LANGUAGE).toBe("Deutsch");
  });

  test("reset retains historical current values, clears the language choice, and defers the subsequent save", async () => {
    const { context, service, applyOptions } = createFixture({
      NF_STORIES: true,
      CMF_DIALOG_LANGUAGE: "de",
    });
    document.documentElement.lang = "ar";
    await service.resetOptions();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(write).not.toHaveBeenCalled();
    expect(applyOptions).not.toHaveBeenCalled();
    expect(context.state.options.NF_STORIES).toBe(true);
    expect(context.state.options.CMF_DIALOG_LANGUAGE).toBe("");
    const result = await service.saveOptions(null, "reset");
    expect(result.languageChanged).toBe(true);
    expect(context.state.options.NF_STORIES).toBe(true);
    expect(context.state.language).toBe("en");
    expect(write).toHaveBeenCalledTimes(1);
    expect(applyOptions).toHaveBeenCalledTimes(1);
  });

  test("a rejected reset deletion leaves active language and settings unchanged", async () => {
    const failure = new DOMException("Storage blocked", "SecurityError");
    remove.mockRejectedValue(failure);
    const { context, service } = createFixture({ CMF_DIALOG_LANGUAGE: "de", NF_STORIES: true });
    await expect(service.resetOptions()).rejects.toBe(failure);
    expect(context.state.options.CMF_DIALOG_LANGUAGE).toBe("de");
    expect(context.state.options.NF_STORIES).toBe(true);
    expect(write).not.toHaveBeenCalled();
  });
});
