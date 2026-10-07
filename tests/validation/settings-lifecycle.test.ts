// SPDX-License-Identifier: GPL-3.0-only

import {
  buildPostSignature,
  clearDirtyTracking,
  ensureDirtyObserver,
  getDirtyToken,
  hasPostChanged,
  hasSizeChanged,
  isElementDirty,
  markElementClean,
  markElementCleanIfUnchanged,
  pruneDirtyObservers,
  resetPostState,
  trackPostSignature,
} from "../../src/dom/dirty-check";
import { postAtt, postAttTab, mainColumnAtt, postAttMPSkip } from "../../src/dom/attributes";
import { resetFeedProcessing, restoreFeedPresentation } from "../../src/feeds/reset";
import { setFeedSettings } from "../../src/runtime/routes";
import { UiLifecycle } from "../../src/ui/lifecycle";
import { initDialog } from "../../src/ui/dialog/dialog";
import { triggerActionFeedback } from "../../src/ui/dialog/action-feedback";
import { setOptions } from "../../src/storage/idb";
import { control, createSettingsFixture, mountSettings } from "./settings-fixtures";

jest.mock("../../src/storage/idb", () => ({ setOptions: jest.fn(), deleteOptions: jest.fn() }));

const mounted: ReturnType<typeof mountSettings>[] = [];

beforeEach(() => {
  jest.useFakeTimers();
  document.documentElement.lang = "en";
  document.body.innerHTML = '<div role="banner"></div>';
  jest.mocked(setOptions).mockReset().mockResolvedValue(undefined);
});
afterEach(() => {
  mounted.splice(0).forEach(({ state }) => state.destroyDialog?.());
  clearDirtyTracking();
  document.body.replaceChildren();
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("settings and feed lifecycle boundaries", () => {
  test("forty dialog generations retain one shell and stale footer handlers never save", async () => {
    const fixture = mountSettings({ CMF_BTN_OPTION: "0" });
    mounted.push(fixture);
    const staleButtons: HTMLButtonElement[] = [];
    let handlers = fixture.handlers;
    for (let generation = 0; generation < 40; generation += 1) {
      staleButtons.push(control<HTMLButtonElement>("#BTNSave"));
      handlers = initDialog(fixture.context, fixture.capabilities);
      expect(document.querySelectorAll("#fbcmf")).toHaveLength(1);
      expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
    }
    staleButtons.forEach((button) => button.click());
    await Promise.resolve();
    expect(setOptions).not.toHaveBeenCalled();
    handlers.destroyDialog();
    handlers.destroyDialog();
    expect(jest.getTimerCount()).toBe(0);
    expect(document.getElementById("fbcmf")).toBeNull();
  });

  test.each([0, 1, 599, 600, 601])(
    "cleanup at feedback boundary %i ms never alters a replacement",
    (elapsed) => {
      const fixture = mountSettings({ CMF_BTN_OPTION: "0" });
      mounted.push(fixture);
      triggerActionFeedback(fixture.state, "BTNSave", "cmf-action--confirm-blue");
      jest.advanceTimersByTime(elapsed);
      fixture.handlers.destroyDialog();
      initDialog(fixture.context, fixture.capabilities);
      const replacement = control("#BTNSave");
      replacement.classList.add("cmf-action--dirty");
      jest.advanceTimersByTime(1000);
      expect(replacement.classList.contains("cmf-action--dirty")).toBe(true);
      expect(replacement.classList.contains("cmf-action--confirm-blue")).toBe(false);
    }
  );

  test("disposed lifecycle suppresses a queued animation frame and runs late teardown immediately", () => {
    let queued: FrameRequestCallback | undefined;
    jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      queued = callback;
      return 7;
    });
    const cancel = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    const lifecycle = new UiLifecycle();
    const work = jest.fn();
    const lateCleanup = jest.fn();
    lifecycle.frame(work);
    lifecycle.dispose();
    lifecycle.add(lateCleanup);
    queued?.(0);
    expect(cancel).toHaveBeenCalledWith(7);
    expect(work).not.toHaveBeenCalled();
    expect(lateCleanup).toHaveBeenCalledTimes(1);
  });

  test.each([49, 50, 51])(
    "body readiness and disposal at %i ms do not resurrect old settings",
    (elapsed) => {
      const body = document.body;
      body.remove();
      const fixture = mountSettings({ CMF_BTN_OPTION: "0" });
      mounted.push(fixture);
      try {
        jest.advanceTimersByTime(elapsed);
        fixture.handlers.destroyDialog();
        document.documentElement.append(body);
        jest.advanceTimersByTime(200);
        expect(document.getElementById("fbcmf")).toBeNull();
        expect(jest.getTimerCount()).toBe(0);
      } finally {
        if (!document.body) document.documentElement.append(body);
      }
    }
  );

  test("real mutations update same-length recycled signatures and dirty tokens", async () => {
    document.body.innerHTML =
      '<main><article aria-posinset="1"><a href="/first">Alpha</a></article></main>';
    const root = control("main");
    const post = control("article");
    ensureDirtyObserver(root);
    trackPostSignature(post);
    const before = buildPostSignature(post);
    markElementClean(root);
    const token = getDirtyToken(root);
    control("article a").textContent = "Bravo";
    await Promise.resolve();
    expect(buildPostSignature(post)).not.toBe(before);
    expect(hasPostChanged(post)).toBe(true);
    expect(isElementDirty(root)).toBe(true);
    markElementCleanIfUnchanged(root, token);
    expect(isElementDirty(root)).toBe(true);
    markElementCleanIfUnchanged(root, getDirtyToken(root));
    expect(isElementDirty(root)).toBe(false);
  });

  test("dirty tracking resets identity caches and disconnects pre-reset mutation deliveries", async () => {
    const root = document.createElement("main");
    root.innerHTML = '<article aria-posinset="1">Alpha</article>';
    document.body.append(root);
    const post = control("article");
    ensureDirtyObserver(root);
    trackPostSignature(post);
    post.textContent = "Changed content";
    clearDirtyTracking();
    await Promise.resolve();
    expect(getDirtyToken(root)).toBe(0);
    expect(hasPostChanged(post)).toBe(false);
    ensureDirtyObserver(root);
    markElementClean(root);
    post.setAttribute("aria-posinset", "2");
    await Promise.resolve();
    expect(isElementDirty(root)).toBe(true);
    expect(hasPostChanged(post)).toBe(true);
    const observer = ensureDirtyObserver(root);
    if (!observer) throw new Error("Expected native DOM observer");
    const disconnect = jest.spyOn(observer, "disconnect");
    root.remove();
    pruneDirtyObservers();
    pruneDirtyObservers();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  test.each([15, 16, 17])("historical size tolerance boundary of %i characters", (delta) => {
    expect(hasSizeChanged(100, 100 + delta)).toBe(delta > 16);
    expect(hasSizeChanged("100", String(100 - delta))).toBe(delta > 16);
  });

  test("forced route refresh and active settings reset remove stale DOM filtering markers", () => {
    const { state } = createSettingsFixture({ NF_BLOCKED_ENABLED: true, NF_BLOCKED_TEXT: "Old" });
    const route = { href: "https://www.facebook.com/", pathname: "/", search: "" };
    setFeedSettings(state, state.options, true, route);
    document.body.innerHTML = `<main ${mainColumnAtt}="old"><details ${postAtt}="Old"><summary>Hidden</summary><div id="post" ${postAtt}="Old" ${state.hideAtt}><h6 ${postAttTab}>Old caption</h6>Keep me</div></details><div ${postAttMPSkip}="10"></div></main>`;
    const post = control("#post");
    state.options.NF_BLOCKED_ENABLED = false;
    state.noChangeCounter = 50;
    expect(setFeedSettings(state, state.options, false, route)).toBe(false);
    expect(setFeedSettings(state, state.options, true, route)).toBe(true);
    expect(state.noChangeCounter).toBe(0);
    expect(state.forceProcess).toBe(true);
    expect(resetFeedProcessing(state)).toBe(true);
    expect(post.textContent).toBe("Keep me");
    expect(post.hasAttribute(state.hideAtt)).toBe(false);
    expect(
      document.querySelector(
        `[${postAttMPSkip}], [${mainColumnAtt}], [${postAtt}], [${postAttTab}]`
      )
    ).toBeNull();
    setFeedSettings(state, state.options, false, {
      href: "https://www.facebook.com/settings/privacy",
      pathname: "/settings/privacy",
      search: "",
    });
    post.setAttribute(state.hideAtt, "");
    post.setAttribute(postAtt, "Old");
    restoreFeedPresentation(state);
    expect(state.isAF).toBe(false);
    expect(post.hasAttribute(state.hideAtt)).toBe(false);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("recycled post reset removes owned markers but preserves unrelated attributes and contents", () => {
    const { state } = createSettingsFixture();
    document.body.innerHTML = `<main><details ${postAtt}="Old"><summary>Old</summary><div id="post" data-host="keep" ${postAtt}="Old" ${state.hideAtt}><h6 ${postAttTab}>Old caption</h6><p>Keep content</p><span ${state.hideWithNoCaptionAtt} ${postAtt}="Nested">Keep nested</span></div></details></main>`;
    const post = control("#post");
    resetPostState(post, state);
    expect(post.parentElement?.tagName).toBe("MAIN");
    expect(post.getAttribute("data-host")).toBe("keep");
    expect(post.textContent).toBe("Keep contentKeep nested");
    expect(
      post.querySelector(`[${state.hideWithNoCaptionAtt}], [${postAtt}], [${postAttTab}]`)
    ).toBeNull();
    resetPostState(post, state);
    expect(post.textContent).toBe("Keep contentKeep nested");
  });
});
