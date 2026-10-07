// SPDX-License-Identifier: GPL-3.0-only
import { startUserscript } from "../../src/entry/startup";
import { getOptions, setOptions } from "../../src/storage/idb";
import { initDialog, toggleDialog } from "../../src/ui/dialog/dialog";

jest.mock("../../src/storage/idb", () => ({
  getOptions: jest.fn(),
  setOptions: jest.fn(),
  deleteOptions: jest.fn(),
}));
jest.mock("../../src/assets", () => ({
  aboutIcon: "data:,",
  bugIcon: "data:,",
  checkIcon: "data:,",
  exportIcon: "data:,",
  groupsIcon: "data:,",
  importIcon: "data:,",
  infoIcon: "data:,",
  marketplaceIcon: "data:,",
  mopIcon: "data:,",
  newsIcon: "data:,",
  prefIcon: "data:,",
  profileIcon: "data:,",
  reelsIcon: "data:,",
  resetIcon: "data:,",
  saveIcon: "data:,",
  searchIcon: "data:,",
  videosIcon: "data:,",
}));
jest.mock("../../src/ui/dialog/dialog", () => ({
  initDialog: jest.fn(() => ({ destroyDialog: jest.fn() })),
  toggleDialog: jest.fn(),
}));

describe("composition lifecycle", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1000 });
    document.body.innerHTML =
      '<div><div data-video-id="1"><video></video></div></div><div><div>Reel description</div></div>';
    history.replaceState({}, "", "/reel/1");
    jest.mocked(getOptions).mockResolvedValue(JSON.stringify({ REELS_CONTROLS: true }));
  });
  afterEach(() => {
    jest.useRealTimers();
    history.replaceState({}, "", "/");
    document.body.replaceChildren();
    document.head.querySelectorAll("style").forEach((style) => style.remove());
  });

  test("keeps one optional manager menu and retargets it across restarts", async () => {
    const register = jest.fn<unknown, [string, () => void]>();
    globalThis.GM = { registerMenuCommand: register };
    const stop = await startUserscript();
    const open = register.mock.calls[0]?.[1];
    if (!open) throw new Error("Expected optional manager command");
    open();
    expect(toggleDialog).toHaveBeenCalledTimes(1);
    stop();
    open();
    expect(toggleDialog).toHaveBeenCalledTimes(1);
    const nextStop = await startUserscript();
    expect(register).toHaveBeenCalledTimes(1);
    open();
    expect(toggleDialog).toHaveBeenCalledTimes(2);
    nextStop();
    globalThis.GM = undefined;
  });

  test("late settings persistence cannot restart filtering after disposal", async () => {
    let finish: (() => void) | undefined;
    jest.mocked(setOptions).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    const stop = await startUserscript();
    const capabilities = jest.mocked(initDialog).mock.calls[0]?.[1];
    if (!capabilities) throw new Error("Expected dialog capabilities");
    const save = capabilities.saveOptions({ REELS_CONTROLS: true }, "file");
    stop();
    if (!finish) throw new Error("Expected pending storage write");
    finish();
    await save;
    expect(document.head.querySelectorAll("style")).toHaveLength(0);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("clears retained post markers when stopping on an unsupported SPA route", async () => {
    const stop = await startUserscript();
    const post = document.createElement("div");
    post.setAttribute("cmfr", "old filtering decision");
    document.body.appendChild(post);
    history.pushState({}, "", "/settings/privacy");
    window.dispatchEvent(new PopStateEvent("popstate"));
    stop();
    expect(post.hasAttribute("cmfr")).toBe(false);
    history.pushState({}, "", "/reel/1");
    const nextStop = await startUserscript();
    nextStop();
    expect(jest.getTimerCount()).toBe(0);
  });

  test("coalesces concurrent startup and cancels the real Reels chain before restart", async () => {
    const first = startUserscript();
    const duplicate = startUserscript();
    expect(duplicate).toBe(first);
    const stop = await first;
    expect(initDialog).toHaveBeenCalledTimes(1);
    expect(document.querySelector("video")?.hasAttribute("cmfrv")).toBe(true);
    expect(jest.getTimerCount()).toBeGreaterThanOrEqual(3);
    stop();
    stop();
    expect(jest.getTimerCount()).toBe(0);
    jest.advanceTimersByTime(3000);
    expect(jest.getTimerCount()).toBe(0);
    const nextStop = await startUserscript();
    expect(initDialog).toHaveBeenCalledTimes(2);
    expect(jest.getTimerCount()).toBeGreaterThanOrEqual(3);
    nextStop();
    expect(jest.getTimerCount()).toBe(0);
  });
});
