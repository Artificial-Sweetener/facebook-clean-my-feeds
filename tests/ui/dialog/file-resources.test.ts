// SPDX-License-Identifier: GPL-3.0-only

import { exportUserOptions, importUserOptions } from "../../../src/ui/dialog/import-export";
import { UiLifecycle } from "../../../src/ui/lifecycle";
import { buildState } from "./fixtures";
import { requireValue } from "../helpers";

jest.mock("../../../src/storage/idb", () => ({
  deleteOptions: jest.fn(() => Promise.resolve()),
  setOptions: jest.fn(() => Promise.resolve()),
}));

const originalCreate = Object.getOwnPropertyDescriptor(URL, "createObjectURL");
const originalRevoke = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
const readers: FileReader[] = [];
const lifecycles: UiLifecycle[] = [];
const revoke = jest.fn();
let nextUrl = 0;

/** Inspect actual owned registrations rather than counting cumulative calls to the public API. */
function ownedCount(lifecycle: UiLifecycle): number {
  const cleanups: unknown = Reflect.get(lifecycle, "cleanups");
  if (!(cleanups instanceof Set)) throw new Error("Expected lifecycle cleanup ownership set");
  return cleanups.size;
}

/** Keep the production state shape while omitting unrelated DOM observers and feedback timers. */
function fixture() {
  const state = buildState();
  Object.assign(state.options, {
    NF_SPONSORED: false,
    GF_SPONSORED: false,
    VF_SPONSORED: false,
    MP_SPONSORED: false,
  });
  const lifecycle = new UiLifecycle();
  state.dialogLifecycle = lifecycle;
  lifecycles.push(lifecycle);
  return { state, lifecycle };
}

/** Supply one selected file without installing additional event handlers in the fixture itself. */
function fileEvent(): Event {
  const input = document.createElement("input");
  input.type = "file";
  Object.defineProperty(input, "files", { value: [new File(["fixture"], "settings.json")] });
  const event = new Event("change");
  Object.defineProperty(event, "target", { value: input });
  return event;
}

/** Deliver terminal browser states explicitly, independent of filesystem or event-loop timing. */
function finishRead(
  reader: FileReader,
  type: "load" | "error" | "abort",
  result: string | ArrayBuffer | null = null
): void {
  Object.defineProperty(reader, "result", { configurable: true, value: result });
  Object.defineProperty(reader, "readyState", { configurable: true, value: FileReader.DONE });
  reader.dispatchEvent(new ProgressEvent(type));
}

/** Check all terminal callbacks are detached, including failure handlers added for ownership. */
function expectDetached(reader: FileReader): void {
  expect(reader.onload).toBeNull();
  expect(reader.onerror).toBeNull();
  expect(reader.onabort).toBeNull();
}

/** Restore browser APIs absent in jsdom without leaving synthetic URL capabilities for other tests. */
function restoreUrl(key: string, descriptor: PropertyDescriptor | undefined): void {
  if (descriptor) Object.defineProperty(URL, key, descriptor);
  else Reflect.deleteProperty(URL, key);
}

beforeEach(() => {
  jest.useFakeTimers();
  document.body.replaceChildren();
  readers.length = 0;
  nextUrl = 0;
  revoke.mockClear();
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: jest.fn(() => `blob:settings-${++nextUrl}`),
  });
  Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revoke });
  jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    expect(revoke).not.toHaveBeenCalledWith(this.href);
    expect(this.download).toBe("fb - clean my feeds - settings.json");
  });
  jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(function (this: FileReader) {
    readers.push(this);
    Object.defineProperty(this, "readyState", { configurable: true, value: FileReader.LOADING });
  });
  jest.spyOn(FileReader.prototype, "abort").mockImplementation(function (this: FileReader) {
    finishRead(this, "abort");
  });
});

afterEach(() => {
  lifecycles.splice(0).forEach((lifecycle) => lifecycle.dispose());
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
  restoreUrl("createObjectURL", originalCreate);
  restoreUrl("revokeObjectURL", originalRevoke);
});

describe("settings download URL ownership", () => {
  test("one hundred exports release each URL once and return ownership to baseline", () => {
    const { state, lifecycle } = fixture();
    for (let index = 0; index < 100; index += 1) {
      exportUserOptions(state);
      expect(ownedCount(lifecycle)).toBe(1);
      expect(jest.getTimerCount()).toBe(1);
      expect(revoke).toHaveBeenCalledTimes(index);
      jest.advanceTimersByTime(0);
      expect(revoke).toHaveBeenLastCalledWith(`blob:settings-${index + 1}`);
      expect(revoke).toHaveBeenCalledTimes(index + 1);
      expect(ownedCount(lifecycle)).toBe(0);
      expect(jest.getTimerCount()).toBe(0);
    }
    lifecycle.dispose();
    expect(revoke).toHaveBeenCalledTimes(100);
  });

  test("teardown cancels every pending revocation timer and revokes each URL exactly once", () => {
    const { state, lifecycle } = fixture();
    exportUserOptions(state);
    exportUserOptions(state);
    expect(ownedCount(lifecycle)).toBe(2);
    expect(revoke).not.toHaveBeenCalled();
    lifecycle.dispose();
    lifecycle.dispose();
    jest.runOnlyPendingTimers();
    expect(revoke.mock.calls).toEqual([["blob:settings-1"], ["blob:settings-2"]]);
    expect(ownedCount(lifecycle)).toBe(0);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("a throwing download still releases its URL and does not retain the anchor", () => {
    const { state, lifecycle } = fixture();
    const remove = jest.spyOn(HTMLAnchorElement.prototype, "remove");
    jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {
      throw new Error("Host click failure");
    });
    expect(() => exportUserOptions(state)).toThrow("Host click failure");
    expect(remove).toHaveBeenCalledTimes(1);
    expect(revoke).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(ownedCount(lifecycle)).toBe(0);
  });

  test("an unmounted export releases its URL without requiring lifecycle ownership", () => {
    const state = buildState();
    exportUserOptions(state);
    expect(revoke).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(revoke).toHaveBeenCalledWith("blob:settings-1");
    expect(jest.getTimerCount()).toBe(0);
  });

  test("a disposed generation cannot allocate a new download", () => {
    const { state, lifecycle } = fixture();
    lifecycle.dispose();
    exportUserOptions(state);
    expect(URL.createObjectURL).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });
});

describe("settings import reader ownership", () => {
  test.each(["success", "malformed", "non-record", "missing", "non-text", "error", "abort"])(
    "one hundred %s reads release their handlers and owned registration immediately",
    async (outcome) => {
      const { state, lifecycle } = fixture();
      const save = jest.fn(() => Promise.resolve());
      for (let index = 0; index < 100; index += 1) {
        importUserOptions(fileEvent(), save, state, lifecycle);
        const reader = requireValue(readers.at(-1));
        expect(ownedCount(lifecycle)).toBe(1);
        const text =
          outcome === "success"
            ? JSON.stringify(state.options)
            : outcome === "malformed"
              ? "{broken"
              : outcome === "non-record"
                ? "[]"
                : outcome === "non-text"
                  ? null
                  : "{}";
        finishRead(reader, outcome === "error" || outcome === "abort" ? outcome : "load", text);
        expectDetached(reader);
        expect(ownedCount(lifecycle)).toBe(0);
      }
      await Promise.resolve();
      lifecycle.dispose();
      expect(FileReader.prototype.abort).not.toHaveBeenCalled();
      expect(save).toHaveBeenCalledTimes(outcome === "success" ? 100 : 0);
    }
  );

  test("terminal cleanup precedes an unresolved save and suppresses duplicate queued loads", async () => {
    const { state, lifecycle } = fixture();
    let resolveSave: (() => void) | undefined;
    const save = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        })
    );
    importUserOptions(fileEvent(), save, state, lifecycle);
    const reader = requireValue(readers.at(-1));
    const queuedLoad = requireValue(reader.onload);
    finishRead(reader, "load", JSON.stringify(state.options));
    expectDetached(reader);
    expect(ownedCount(lifecycle)).toBe(0);
    reader.addEventListener("load", queuedLoad, { once: true });
    reader.dispatchEvent(new ProgressEvent("load"));
    expect(save).toHaveBeenCalledTimes(1);
    lifecycle.dispose();
    expect(FileReader.prototype.abort).not.toHaveBeenCalled();
    requireValue(resolveSave)();
    await Promise.resolve();
  });

  test("teardown aborts only pending readers and ignores their already-queued load callbacks", () => {
    const { state, lifecycle } = fixture();
    const save = jest.fn(() => Promise.resolve());
    for (let index = 0; index < 3; index += 1)
      importUserOptions(fileEvent(), save, state, lifecycle);
    const first = requireValue(readers[0]);
    const pending = requireValue(readers[1]);
    const queuedLoad = requireValue(pending.onload);
    finishRead(first, "load", "{}");
    expect(ownedCount(lifecycle)).toBe(2);
    lifecycle.dispose();
    lifecycle.dispose();
    expect(FileReader.prototype.abort).toHaveBeenCalledTimes(2);
    readers.forEach(expectDetached);
    expect(ownedCount(lifecycle)).toBe(0);
    finishRead(pending, "load", JSON.stringify(state.options));
    pending.addEventListener("load", queuedLoad, { once: true });
    pending.dispatchEvent(new ProgressEvent("load"));
    expect(save).not.toHaveBeenCalled();
  });

  test.each([FileReader.EMPTY, FileReader.LOADING])(
    "one hundred synchronous read failures in state %i release all reader ownership",
    (readyState) => {
      const { state, lifecycle } = fixture();
      const save = jest.fn(() => Promise.resolve());
      jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(function (
        this: FileReader
      ) {
        readers.push(this);
        Object.defineProperty(this, "readyState", { configurable: true, value: readyState });
        throw new DOMException("Read unavailable", "InvalidStateError");
      });
      for (let index = 0; index < 100; index += 1) {
        expect(() => importUserOptions(fileEvent(), save, state, lifecycle)).not.toThrow();
        expectDetached(requireValue(readers.at(-1)));
        expect(ownedCount(lifecycle)).toBe(0);
      }
      lifecycle.dispose();
      expect(FileReader.prototype.abort).toHaveBeenCalledTimes(
        readyState === FileReader.LOADING ? 100 : 0
      );
      expect(save).not.toHaveBeenCalled();
    }
  );

  test("a disposed generation cannot begin a new read", () => {
    const { state, lifecycle } = fixture();
    lifecycle.dispose();
    importUserOptions(fileEvent(), jest.fn(), state, lifecycle);
    expect(FileReader.prototype.readAsText).not.toHaveBeenCalled();
  });
});

test("removing settled ownership never executes cleanup or affects other teardown registrations", () => {
  const { lifecycle } = fixture();
  const settled = jest.fn();
  const pending = jest.fn();
  lifecycle.add(settled);
  lifecycle.add(pending);
  lifecycle.remove(settled);
  lifecycle.remove(settled);
  expect(settled).not.toHaveBeenCalled();
  expect(ownedCount(lifecycle)).toBe(1);
  lifecycle.dispose();
  lifecycle.remove(pending);
  expect(settled).not.toHaveBeenCalled();
  expect(pending).toHaveBeenCalledTimes(1);
  expect(ownedCount(lifecycle)).toBe(0);
});
