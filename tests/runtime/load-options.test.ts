// SPDX-License-Identifier: GPL-3.0-only
import { loadOptions } from "../../src/runtime/load-options";
import type { OptionsState } from "../../src/runtime/load-options";
import { getOptions } from "../../src/storage/idb";

jest.mock("../../src/storage/idb", () => ({ getOptions: jest.fn() }));
const readOptions = jest.mocked(getOptions);

/** Create only the startup-owned state so unrelated UI/feed changes cannot mask loader regressions. */
function createOptionsState(): OptionsState {
  return { options: {}, filters: {}, language: "", hideAnInfoBox: false, optionsReady: false };
}

/** Keep document language and storage failures isolated between startup scenarios. */
beforeEach(() => {
  document.documentElement.lang = "en";
  readOptions.mockReset();
});

/** Restore real clocks after timeout scenarios so other startup cases do not retain scheduled work. */
afterEach(() => {
  jest.useRealTimers();
});

describe("runtime/load-options", () => {
  test("loads a legacy serialized record and installs the returned state objects in place", async () => {
    readOptions.mockResolvedValue(
      JSON.stringify({ NF_STORIES: true, OTHER_INFO_BOX_CORONAVIRUS: true })
    );
    const state = createOptionsState();
    const identity = state;
    const result = await loadOptions(state);
    expect(state).toBe(identity);
    expect(state.options).toBe(result.options);
    expect(state.filters).toBe(result.filters);
    expect(state.options.NF_STORIES).toBe(true);
    expect(state.hideAnInfoBox).toBe(true);
    expect(state.language).toBe("en");
    expect(state.optionsReady).toBe(true);
  });

  test("accepts raw legacy objects and preserves unknown extra keys", async () => {
    readOptions.mockResolvedValue({
      CMF_DIALOG_LANGUAGE: "de",
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "AlphaİİBeta",
      extra: { version: 1 },
    });
    const result = await loadOptions(createOptionsState());
    expect(result.language).toBe("de");
    expect(result.keyWords.SPONSORED_EXTRA).toBe("Anzeige");
    expect(result.filters.NF_BLOCKED_TEXT_LC).toEqual(["alpha", "beta"]);
    expect(result.options).toHaveProperty("extra", { version: 1 });
  });

  test.each(["JSON string", "raw object"])(
    "preserves saved filters when an empty debug sentinel arrives as a %s",
    async (representation) => {
      const saved = {
        NF_STORIES: true,
        VERBOSITY_DEBUG: "",
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "My saved filter",
      };
      readOptions.mockResolvedValue(
        representation === "JSON string" ? JSON.stringify(saved) : saved
      );
      const state = createOptionsState();
      const result = await loadOptions(state);
      expect(result.options.NF_STORIES).toBe(true);
      expect(result.options.VERBOSITY_DEBUG).toBe(false);
      expect(result.options.NF_BLOCKED_TEXT).toBe("My saved filter");
      expect(result.filters.NF_BLOCKED_TEXT).toEqual(["My saved filter"]);
      expect(result.filters.NF_BLOCKED_ENABLED).toBe(true);
      expect(state.optionsReady).toBe(true);
    }
  );

  test("uses the site's document language when no language preference is stored", async () => {
    document.documentElement.lang = "ar";
    readOptions.mockResolvedValue(undefined);
    const state = createOptionsState();
    const result = await loadOptions(state);
    expect(state.language).toBe("ar");
    expect(result.keyWords.LANGUAGE_DIRECTION).toBe("rtl");
  });

  test.each([
    "{broken",
    "[]",
    "null",
    "12",
    JSON.stringify({ NF_STORIES: "invalid" }),
    null,
    [],
    12,
  ])(
    "recovers malformed storage payload %p to normal startup defaults",
    async (payload: unknown) => {
      readOptions.mockResolvedValue(payload);
      const state = createOptionsState();
      await loadOptions(state);
      expect(state.options.NF_STORIES).toBe(false);
      expect(state.options.NF_SPONSORED).toBe(true);
      expect(state.optionsReady).toBe(true);
    }
  );

  test("continues startup with defaults when the storage read rejects", async () => {
    readOptions.mockRejectedValue(new DOMException("IndexedDB unavailable", "SecurityError"));
    const state = createOptionsState();
    await expect(loadOptions(state)).resolves.toHaveProperty("language", "en");
    expect(state.options.NF_SPONSORED).toBe(true);
    expect(state.filters.NF_BLOCKED_ENABLED).toBe(false);
    expect(state.optionsReady).toBe(true);
  });

  test("does not publish partial readiness while persistence is still pending", async () => {
    let completeRead: ((value: unknown) => void) | undefined;
    readOptions.mockImplementation(
      () =>
        new Promise((resolve) => {
          completeRead = resolve;
        })
    );
    const state = createOptionsState();
    const initialOptions = state.options;
    const pending = loadOptions(state);
    expect(state.optionsReady).toBe(false);
    expect(state.options).toBe(initialOptions);
    if (!completeRead) throw new Error("Expected loader to start the storage read");
    completeRead({ NF_STORIES: true });
    await pending;
    expect(state.optionsReady).toBe(true);
    expect(state.options.NF_STORIES).toBe(true);
  });

  test("releases a permanently stalled read after three seconds and removes the deadline", async () => {
    jest.useFakeTimers();
    readOptions.mockImplementation(() => new Promise(() => {}));
    const state = createOptionsState();
    const pending = loadOptions(state);
    await jest.advanceTimersByTimeAsync(2999);
    expect(state.optionsReady).toBe(false);
    await jest.advanceTimersByTimeAsync(1);
    await pending;
    expect(state.optionsReady).toBe(true);
    expect(state.options.NF_SPONSORED).toBe(true);
    expect(jest.getTimerCount()).toBe(0);
  });

  test.each([false, true])("clears the read deadline when storage rejects=%s", async (rejects) => {
    jest.useFakeTimers();
    if (rejects) readOptions.mockRejectedValue(new Error("storage unavailable"));
    else readOptions.mockResolvedValue({ NF_STORIES: true });
    const state = createOptionsState();
    await loadOptions(state);
    expect(state.optionsReady).toBe(true);
    expect(state.options.NF_STORIES).toBe(!rejects);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("late stored settings cannot replace live state after timeout recovery", async () => {
    jest.useFakeTimers();
    let completeRead: ((value: unknown) => void) | undefined;
    readOptions.mockImplementation(
      () =>
        new Promise((resolve) => {
          completeRead = resolve;
        })
    );
    const state = createOptionsState();
    const pending = loadOptions(state);
    await jest.advanceTimersByTimeAsync(3000);
    const result = await pending;
    state.options.NF_STORIES = true;
    if (!completeRead) throw new Error("Expected loader to start the storage read");
    completeRead({ NF_STORIES: false, CMF_DIALOG_LANGUAGE: "de" });
    await jest.advanceTimersByTimeAsync(60_000);
    expect(state.options).toBe(result.options);
    expect(state.options.NF_STORIES).toBe(true);
    expect(state.language).toBe("en");
    expect(jest.getTimerCount()).toBe(0);
  });

  test("preserves the unknown-site-language fallback without requiring a matching catalog", async () => {
    document.documentElement.lang = "zz";
    readOptions.mockResolvedValue({ CMF_DIALOG_LANGUAGE: "unknown" });
    const state = createOptionsState();
    const result = await loadOptions(state);
    expect(state.language).toBe("zz");
    expect(result.keyWords.CMF_DIALOG_LANGUAGE).toBe("English");
  });
});
