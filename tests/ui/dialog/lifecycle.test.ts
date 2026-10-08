// SPDX-License-Identifier: GPL-3.0-only
jest.mock("../../../src/storage/idb", () => ({
  deleteOptions: jest.fn(() => Promise.resolve()),
  setOptions: jest.fn(() => Promise.resolve()),
}));

import { buildState, createCapabilities } from "./fixtures";
import { findElement, mockRect, requireValue } from "../helpers";
import { initDialog } from "../../../src/ui/dialog/dialog";
import { triggerActionFeedback } from "../../../src/ui/dialog/action-feedback";
import type { DialogCapabilities, SaveResult } from "../../../src/ui/dialog/types";
import { translations } from "../../../src/i18n";

/** Retain disconnected callbacks so tests can simulate an already-queued browser delivery. */
class ControlledMutationObserver implements MutationObserver {
  static instances: ControlledMutationObserver[] = [];
  disconnected = false;
  targets: Node[] = [];

  /** Capture the actual production callback without scheduling automatic jsdom mutations. */
  constructor(private readonly callback: MutationCallback) {
    ControlledMutationObserver.instances.push(this);
  }

  /** Record observation ownership so teardown tests can inspect each registered target. */
  observe(target: Node): void {
    this.targets.push(target);
  }

  /** Record cleanup without discarding the callback, matching a previously queued delivery. */
  disconnect(): void {
    this.disconnected = true;
  }

  /** These deterministic fixtures never synthesize pending mutation records implicitly. */
  takeRecords(): MutationRecord[] {
    return [];
  }

  /** Deliver a callback deliberately, including after disconnection to test generation guards. */
  emit(records: MutationRecord[] = []): void {
    this.callback(records, this);
  }
}

/** Track resize subscriptions made by the real topbar toggle without requiring a layout engine. */
class ControlledResizeObserver implements ResizeObserver {
  static instances: ControlledResizeObserver[] = [];
  disconnected = false;

  /** Retain the browser callback so stale delivery can be tested after control replacement. */
  constructor(private readonly callback: ResizeObserverCallback) {
    ControlledResizeObserver.instances.push(this);
  }

  /** No geometry is queued automatically; tests provide all layout through mockRect. */
  observe(): void {}

  /** Switching anchors has no automatic effect in the deterministic observer fixture. */
  unobserve(): void {}

  /** Mark the whole subscription released while preserving the saved callback. */
  disconnect(): void {
    this.disconnected = true;
  }

  /** Simulate a callback that was queued before the observer was disconnected. */
  emit(): void {
    this.callback([], this);
  }
}

/** Browser registrations retain listener identity and capture semantics during cleanup. */
type ListenerCall = [
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | EventListenerOptions | undefined,
];

/** Normalize equivalent boolean/options capture arguments before comparing listener identities. */
function captureOption(options: boolean | EventListenerOptions | undefined): boolean {
  return typeof options === "boolean" ? options : Boolean(options?.capture);
}

/** Verify every owned document/window registration is matched by an equivalent removal. */
function expectListenersRemoved(added: ListenerCall[], removed: ListenerCall[]): void {
  for (const [type, listener, options] of added) {
    if (!["pointerdown", "click", "keydown", "resize", "scroll"].includes(type)) continue;
    expect(
      removed.some(
        ([removedType, removedListener, removedOptions]) =>
          type === removedType &&
          listener === removedListener &&
          captureOption(options) === captureOption(removedOptions)
      )
    ).toBe(true);
  }
}

/** Mount a geometrically valid Facebook menu so real topbar discovery binds its host hooks. */
function mountBanner(): HTMLButtonElement {
  document.body.innerHTML = '<div role="banner"><button aria-expanded="false">Menu</button></div>';
  mockRect(findElement(document, '[role="banner"]'), { left: 0, top: 0, width: 1000, height: 60 });
  const menu = findElement<HTMLButtonElement>(document, '[role="banner"] button');
  mockRect(menu, { left: 900, top: 10, width: 40, height: 40 });
  return menu;
}

/** Compose the real dialog and toggle with isolated settings and overridable application effects. */
function startDialog(state = buildState(), overrides: Partial<DialogCapabilities> = {}) {
  const context = {
    state,
    options: state.options,
    filters: state.filters,
    keyWords: translations.en,
    pathInfo: {},
  };
  const capabilities = { ...createCapabilities(context), ...overrides };
  const handlers = initDialog(context, capabilities);
  startedStates.add(state);
  return { state, context, capabilities, handlers };
}

const startedStates = new Set<ReturnType<typeof buildState>>();
const originalMutationObserver = globalThis.MutationObserver;
const originalResizeObserver = globalThis.ResizeObserver;

describe("ui/dialog lifecycle ownership", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    ControlledMutationObserver.instances = [];
    ControlledResizeObserver.instances = [];
    globalThis.MutationObserver = ControlledMutationObserver;
    globalThis.ResizeObserver = ControlledResizeObserver;
    document.body.innerHTML = "";
  });

  afterEach(() => {
    startedStates.forEach((state) => state.destroyDialog?.());
    startedStates.clear();
    document.body.innerHTML = "";
    globalThis.MutationObserver = originalMutationObserver;
    globalThis.ResizeObserver = originalResizeObserver;
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test("destroy cancels startup retries before the page body exists", () => {
    const body = document.body;
    body.remove();
    try {
      const { handlers, state } = startDialog();
      expect(jest.getTimerCount()).toBeGreaterThan(0);
      handlers.destroyDialog();
      expect(jest.getTimerCount()).toBe(0);
      document.documentElement.append(body);
      jest.advanceTimersByTime(1000);
      expect(document.getElementById("fbcmf")).toBeNull();
      expect(document.getElementById("fbcmfToggle")).toBeNull();
      expect(state.dialogLifecycle).toBeNull();
    } finally {
      if (!document.body) document.documentElement.append(body);
    }
  });

  test("destroy cancels missing-banner retries and clears save feedback", () => {
    const { handlers, state } = startDialog();
    triggerActionFeedback(state, "BTNSave", "cmf-action--confirm-blue");
    expect(state.saveFeedbackTimeoutId).not.toBeNull();
    expect(jest.getTimerCount()).toBeGreaterThan(0);
    handlers.destroyDialog();
    expect(state.saveFeedbackTimeoutId).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
    mountBanner();
    jest.advanceTimersByTime(1000);
    expect(document.getElementById("fbcmf")).toBeNull();
    expect(findElement(document, '[role="banner"] button').hasAttribute("data-cmf-menu-sync")).toBe(
      false
    );
  });

  test("destroy releases real-toggle observers, listeners, timers, and host ownership", () => {
    const menu = mountBanner();
    const documentAdds = jest.spyOn(document, "addEventListener");
    const documentRemoves = jest.spyOn(document, "removeEventListener");
    const windowAdds = jest.spyOn(window, "addEventListener");
    const windowRemoves = jest.spyOn(window, "removeEventListener");
    const state = buildState();
    state.options.CMF_BTN_OPTION = "1";
    const { handlers } = startDialog(state);
    state.syncToggleButtonTheme?.();
    expect(menu.dataset.cmfMenuSync).toBe("1");
    expect(ControlledMutationObserver.instances.length).toBeGreaterThan(0);
    expect(ControlledResizeObserver.instances.length).toBeGreaterThan(0);
    handlers.destroyDialog();
    handlers.destroyDialog();

    expect(document.getElementById("fbcmf")).toBeNull();
    expect(document.getElementById("fbcmfToggle")).toBeNull();
    expect(menu.dataset.cmfMenuSync).toBeUndefined();
    expect(state.btnToggleEl).toBeNull();
    expect(state.syncDialogSearch).toBeNull();
    expect(state.destroyDialog).toBeNull();
    expect(jest.getTimerCount()).toBe(0);
    expect(ControlledMutationObserver.instances.every((observer) => observer.disconnected)).toBe(
      true
    );
    expect(ControlledResizeObserver.instances.every((observer) => observer.disconnected)).toBe(
      true
    );
    expectListenersRemoved(documentAdds.mock.calls, documentRemoves.mock.calls);
    expectListenersRemoved(windowAdds.mock.calls, windowRemoves.mock.calls);
  });

  test("restart binds one fresh generation and stale callbacks cannot alter it", async () => {
    const menu = mountBanner();
    const first = startDialog();
    const oldObservers = [...ControlledMutationObserver.instances];
    const oldResizeObservers = [...ControlledResizeObserver.instances];
    first.handlers.destroyDialog();
    const documentAdds = jest.spyOn(document, "addEventListener");
    const current = startDialog(first.state);
    const dialog = findElement(document, "#fbcmf");
    dialog.setAttribute(current.state.showAtt, "");
    menu.setAttribute("aria-expanded", "true");
    const before = dialog.outerHTML;
    const pendingTimers = jest.getTimerCount();

    oldObservers.forEach((observer) => observer.emit());
    oldResizeObservers.forEach((observer) => observer.emit());
    expect(jest.getTimerCount()).toBe(pendingTimers);
    await first.handlers.saveUserOptions(null, "file");
    first.handlers.resetUserOptions();
    first.handlers.destroyDialog();
    expect(current.state.dialogLifecycle).not.toBeNull();
    expect(dialog.outerHTML).toBe(before);
    expect(document.querySelectorAll("#fbcmf")).toHaveLength(1);
    expect(documentAdds.mock.calls.filter(([type]) => type === "pointerdown")).toHaveLength(2);
    expect(documentAdds.mock.calls.filter(([type]) => type === "click")).toHaveLength(1);
    expect(documentAdds.mock.calls.filter(([type]) => type === "keydown")).toHaveLength(1);
    menu.click();
    expect(dialog.hasAttribute(current.state.showAtt)).toBe(false);
    current.handlers.destroyDialog();
  });

  test("a save resolving after cleanup cannot rebuild or restyle a restarted dialog", async () => {
    mountBanner();
    let resolveSave: ((result: SaveResult) => void) | undefined;
    const pendingSave = new Promise<SaveResult>((resolve) => {
      resolveSave = resolve;
    });
    const first = startDialog(buildState(), {
      /** Keep persistence pending until the prior dialog generation has been disposed. */
      saveOptions: () => pendingSave,
    });
    const pending = first.handlers.saveUserOptions(null, "file");
    first.handlers.destroyDialog();
    const current = startDialog(first.state);
    const dialog = findElement(document, "#fbcmf");
    const toggle = findElement(document, "#fbcmfToggle");
    requireValue(resolveSave)({ languageChanged: true, buttonLocationChanged: true });
    await pending;
    expect(document.getElementById("fbcmf")).toBe(dialog);
    expect(document.getElementById("fbcmfToggle")).toBe(toggle);
    current.handlers.destroyDialog();
  });

  test("initializing again disposes the previous generation without an explicit cleanup call", () => {
    const menu = mountBanner();
    const first = startDialog();
    const oldLifecycle = requireValue(first.state.dialogLifecycle);
    const oldObservers = [...ControlledMutationObserver.instances];
    const current = startDialog(first.state);

    expect(oldLifecycle.active).toBe(false);
    expect(oldObservers.every((observer) => observer.disconnected)).toBe(true);
    expect(document.querySelectorAll("#fbcmf")).toHaveLength(1);
    expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
    expect(menu.dataset.cmfMenuSync).toBe("1");
    current.handlers.destroyDialog();
  });

  test("a detached old close control cannot toggle the replacement generation", () => {
    mountBanner();
    const first = startDialog();
    const oldClose = findElement<HTMLButtonElement>(document, "#fbcmf .fb-cmf-close button");
    first.handlers.destroyDialog();
    const current = startDialog(first.state);
    const dialog = findElement(document, "#fbcmf");
    dialog.setAttribute(current.state.showAtt, "");

    oldClose.click();
    expect(dialog.hasAttribute(current.state.showAtt)).toBe(true);
    current.handlers.destroyDialog();
  });

  test("destroy aborts a pending settings import and ignores its saved completion callback", () => {
    mountBanner();
    const readers: FileReader[] = [];
    jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(function (this: FileReader) {
      readers.push(this);
      Object.defineProperty(this, "readyState", { configurable: true, value: FileReader.LOADING });
    });
    const abort = jest.spyOn(FileReader.prototype, "abort").mockImplementation(function (
      this: FileReader
    ) {
      Object.defineProperty(this, "readyState", { configurable: true, value: FileReader.DONE });
    });
    const saveOptions = jest.fn(async () => ({
      languageChanged: false,
      buttonLocationChanged: false,
    }));
    const first = startDialog(buildState(), { saveOptions });
    const input = findElement<HTMLInputElement>(document, '#fbcmf input[type="file"]');
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [new File(["{}"], "options.json")],
    });
    input.dispatchEvent(new Event("change"));
    const reader = requireValue(readers[0]);
    const oldOnLoad = requireValue(reader.onload);
    first.handlers.destroyDialog();
    expect(abort).toHaveBeenCalledTimes(1);
    expect(reader.onload).toBeNull();
    const current = startDialog(first.state);
    const dialog = findElement(document, "#fbcmf");
    Object.defineProperty(reader, "result", {
      configurable: true,
      value: JSON.stringify({
        NF_SPONSORED: false,
        GF_SPONSORED: false,
        VF_SPONSORED: false,
        MP_SPONSORED: false,
      }),
    });

    reader.addEventListener("load", oldOnLoad, { once: true });
    reader.dispatchEvent(new ProgressEvent("load"));
    expect(saveOptions).not.toHaveBeenCalled();
    expect(document.getElementById("fbcmf")).toBe(dialog);
    current.handlers.destroyDialog();
  });
});
