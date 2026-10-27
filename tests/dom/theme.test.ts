// SPDX-License-Identifier: GPL-3.0-only
import { watchDarkMode } from "../../src/dom/theme";

/** Observer test double records every bootstrap/active generation for ownership assertions. */
class ThemeObserver implements MutationObserver {
  static instances: ThemeObserver[] = [];
  readonly observe = jest.fn<void, [Node, MutationObserverInit?]>();
  readonly disconnect = jest.fn<void, []>();
  readonly takeRecords = jest.fn<MutationRecord[], []>(() => []);
  /** Capture the callback so the fixture can simulate document-root arrival synchronously. */
  constructor(readonly callback: MutationCallback) {
    ThemeObserver.instances.push(this);
  }
}

describe("theme observer lifetime", () => {
  test("teardown disconnects the successor observer after a delayed document root", () => {
    const originalObserver = globalThis.MutationObserver;
    const descriptor = Object.getOwnPropertyDescriptor(document, "documentElement");
    const realRoot = document.documentElement;
    let root: HTMLElement | null = null;
    globalThis.MutationObserver = ThemeObserver;
    Object.defineProperty(document, "documentElement", {
      configurable: true,
      /** Model a root that arrives after the bootstrap observer connects. */
      get: () => root,
    });
    try {
      const onChange = jest.fn();
      const watcher = watchDarkMode({ isDarkMode: null }, onChange);
      const bootstrap = ThemeObserver.instances[0];
      if (!bootstrap) throw new Error("Expected bootstrap observer");
      root = realRoot;
      bootstrap.callback([], bootstrap);
      const active = ThemeObserver.instances[1];
      if (!active) throw new Error("Expected active root observer");
      expect(bootstrap.disconnect).toHaveBeenCalledTimes(1);
      watcher?.disconnect();
      watcher?.disconnect();
      expect(active.disconnect).toHaveBeenCalledTimes(1);
      const calls = onChange.mock.calls.length;
      active.callback([], active);
      expect(onChange).toHaveBeenCalledTimes(calls);
    } finally {
      globalThis.MutationObserver = originalObserver;
      if (descriptor) Object.defineProperty(document, "documentElement", descriptor);
      else Reflect.deleteProperty(document, "documentElement");
      ThemeObserver.instances = [];
    }
  });
});
