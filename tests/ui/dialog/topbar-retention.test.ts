// SPDX-License-Identifier: GPL-3.0-only

import { UiLifecycle } from "../../../src/ui/lifecycle";
import { setupTopbarMenuSync } from "../../../src/ui/dialog/topbar";
import { createState } from "../../../src/runtime/state";
import { mockRect } from "../helpers";

const NativeObserver = MutationObserver;

/** Count connected resources while preserving native microtask ordering and cancellation behavior. */
class CountingObserver implements MutationObserver {
  static readonly active = new Set<CountingObserver>();
  private readonly observer: MutationObserver;

  /** Forward actual records through the wrapper so lifecycle guards run exactly as in production. */
  constructor(callback: MutationCallback) {
    this.observer = new NativeObserver((records) => callback(records, this));
  }

  /** Track observers only once they own a target, regardless of repeated observe calls. */
  observe(target: Node, options?: MutationObserverInit): void {
    this.observer.observe(target, options);
    CountingObserver.active.add(this);
  }

  /** Release both browser observation and the test's active-resource counter together. */
  disconnect(): void {
    this.observer.disconnect();
    CountingObserver.active.delete(this);
  }

  /** Preserve synchronous queued-record consumption instead of fabricating fixture events. */
  takeRecords(): MutationRecord[] {
    return this.observer.takeRecords();
  }
}

/** Replace a two-control host cluster without retaining obsolete buttons through fixture ownership. */
function replaceButtons(banner: HTMLElement): void {
  banner.replaceChildren(
    ...[900, 955].map((left) => {
      const button = document.createElement("button");
      mockRect(button, { left, top: 0, width: 40, height: 40 });
      return button;
    })
  );
}

/** Mount enough geometry to use the production topbar discovery algorithm without a layout engine. */
function createBanner(): HTMLElement {
  const banner = document.createElement("div");
  banner.setAttribute("role", "banner");
  mockRect(banner, { left: 0, top: 0, width: 1000, height: 50 });
  replaceButtons(banner);
  return banner;
}

beforeEach(() => {
  globalThis.MutationObserver = CountingObserver;
});
afterEach(() => {
  for (const observer of CountingObserver.active) observer.disconnect();
  globalThis.MutationObserver = NativeObserver;
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

describe("topbar replacement resource bounds", () => {
  test("unrelated feed churn does not remeasure topbar geometry", async () => {
    const banner = createBanner();
    document.body.append(banner);
    const state = createState();
    const lifecycle = new UiLifecycle();
    state.dialogLifecycle = lifecycle;
    setupTopbarMenuSync(state);
    const geometry = jest.fn(banner.getBoundingClientRect);
    Object.defineProperty(banner, "getBoundingClientRect", { configurable: true, value: geometry });
    const first = banner.firstElementChild;
    if (!(first instanceof HTMLElement)) throw new Error("Expected the initial menu control");
    const buttonGeometry = jest.fn(first.getBoundingClientRect);
    Object.defineProperty(first, "getBoundingClientRect", {
      configurable: true,
      value: buttonGeometry,
    });
    for (let index = 0; index < 100; index += 1)
      document.body.append(document.createElement("article"));
    await Promise.resolve();
    expect(geometry).not.toHaveBeenCalled();
    expect(buttonGeometry).not.toHaveBeenCalled();
    replaceButtons(banner);
    await Promise.resolve();
    expect(geometry).toHaveBeenCalled();
    lifecycle.dispose();
    expect(CountingObserver.active.size).toBe(0);
  });

  test("rebinds live banner replacements behind a cached hidden banner", async () => {
    const cached = createBanner();
    cached.hidden = true;
    const banner = createBanner();
    document.body.append(cached, banner);
    const state = createState();
    state.showAtt = "cmf-show";
    const lifecycle = new UiLifecycle();
    state.dialogLifecycle = lifecycle;
    setupTopbarMenuSync(state);
    const dialog = document.createElement("div");
    dialog.id = "fbcmf";
    document.body.append(dialog);
    try {
      for (let index = 0; index < 40; index += 1) {
        replaceButtons(banner);
        await Promise.resolve();
        dialog.setAttribute(state.showAtt, "");
        banner.firstElementChild?.setAttribute("aria-expanded", "true");
        await Promise.resolve();
        expect(dialog.hasAttribute(state.showAtt)).toBe(false);
        expect(CountingObserver.active.size).toBe(4);
      }
    } finally {
      lifecycle.dispose();
    }
    expect(CountingObserver.active.size).toBe(0);
  });

  test.each(["buttons", "banner"])(
    "forty %s replacements retain only current controls",
    async (replacement) => {
      let banner = createBanner();
      document.body.append(banner);
      const state = createState();
      state.showAtt = "cmf-show";
      const lifecycle = new UiLifecycle();
      state.dialogLifecycle = lifecycle;
      const parentAdds = jest.spyOn(lifecycle, "add");
      setupTopbarMenuSync(state);
      const initial = parentAdds.mock.calls.length;
      expect(CountingObserver.active.size).toBe(4);
      const first = banner.firstElementChild;
      if (!(first instanceof HTMLElement)) throw new Error("Expected the initial menu control");
      for (let index = 0; index < 40; index += 1) {
        const previous = Array.from(banner.children);
        if (replacement === "buttons") replaceButtons(banner);
        else {
          const next = createBanner();
          banner.replaceWith(next);
          banner = next;
        }
        await Promise.resolve();
        expect(parentAdds.mock.calls.length).toBe(initial);
        expect(CountingObserver.active.size).toBe(4);
        expect(previous.every((button) => !button.hasAttribute("data-cmf-menu-sync"))).toBe(true);
        expect(
          Array.from(banner.children).every(
            (button) => button.getAttribute("data-cmf-menu-sync") === "1"
          )
        ).toBe(true);
      }
      const dialog = document.createElement("div");
      dialog.id = "fbcmf";
      dialog.setAttribute(state.showAtt, "");
      document.body.append(dialog);
      first.click();
      first.setAttribute("aria-expanded", "true");
      await Promise.resolve();
      expect(dialog.hasAttribute(state.showAtt)).toBe(true);
      lifecycle.dispose();
      expect(CountingObserver.active.size).toBe(0);
      expect(
        Array.from(banner.children).every((button) => !button.hasAttribute("data-cmf-menu-sync"))
      ).toBe(true);
    }
  );
});
