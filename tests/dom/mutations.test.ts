// SPDX-License-Identifier: GPL-3.0-only

import { observeAttributes } from "../../src/dom/mutations";

const originalMutationObserver = global.MutationObserver;
afterEach(() => {
  global.MutationObserver = originalMutationObserver;
});

describe("dom/mutations", () => {
  test("observeAttributes returns null when MutationObserver missing", () => {
    const original = global.MutationObserver;
    Reflect.deleteProperty(global, "MutationObserver");

    const observer = observeAttributes(document.body, {}, jest.fn());
    expect(observer).toBeNull();

    global.MutationObserver = original;
  });

  test("observeAttributes wires MutationObserver", () => {
    const observe = jest.fn();
    const original = global.MutationObserver;
    /** Preserve the complete observer API while recording the requested target and options. */
    class ObserverMock implements MutationObserver {
      observe = observe;
      disconnect = jest.fn();
      takeRecords = jest.fn((): MutationRecord[] => []);
    }
    global.MutationObserver = ObserverMock;

    const target = document.createElement("div");
    const options = { attributes: true };
    const callback = jest.fn();
    const observer = observeAttributes(target, options, callback);

    expect(observer).not.toBeNull();
    expect(observe).toHaveBeenCalledWith(target, options);

    global.MutationObserver = original;
  });
});
