// SPDX-License-Identifier: GPL-3.0-only

import { createUIState } from "../../../src/ui/state";
import { createToggleButton, destroyToggleButton } from "../../../src/ui/controls/toggle-button";
import { createTopbarPositioning } from "../../../src/ui/controls/toggle-position";
import { mockRect } from "../helpers";

/**
 * Model the right header cluster without depending on a locale label or live Facebook account.
 * @param activeBackground Facebook's selected-button background, independent of the CTA token.
 * @param activeIcon Facebook's selected-button foreground, independent of the generic accent.
 * @returns Host anchor and CMF control for theme changes and repeated open/closed checks.
 */
function mountControls(activeBackground: string, activeIcon: string) {
  const banner = document.createElement("div");
  banner.setAttribute("role", "banner");
  mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });
  const menu = document.createElement("button");
  menu.setAttribute("aria-label", "Native menu");
  mockRect(menu, { left: 700, top: 8, width: 40, height: 40 });
  menu.style.color = "rgb(228, 230, 235)";
  menu.style.setProperty("--primary-deemphasized-button-background", activeBackground);
  menu.style.setProperty("--primary-deemphasized-button-text", activeIcon);
  menu.style.setProperty("--primary-button-background", "#0866ff");
  menu.style.setProperty("--accent", "#0866ff");
  menu.style.setProperty("--secondary-button-background", "#3a3b3c");
  menu.style.setProperty("--hover-overlay", "rgba(255, 255, 255, 0.1)");
  menu.style.setProperty("--press-overlay", "rgba(255, 255, 255, 0.2)");
  menu.innerHTML = '<svg width="20" height="20"></svg>';
  const profile = document.createElement("button");
  profile.setAttribute("aria-label", "Native profile");
  mockRect(profile, { left: 748, top: 8, width: 40, height: 40 });
  banner.append(menu, profile);
  const toggle = document.createElement("div");
  toggle.innerHTML = '<span class="cmf-icon"><svg fill="currentColor"></svg></span>';
  document.body.replaceChildren(banner, toggle);
  return { menu, toggle };
}

describe("native selected-button theme", () => {
  afterEach(() => document.body.replaceChildren());

  test.each([
    ["rgba(29, 133, 252, 0.2)", "#75B6FF"],
    ["#E7F3FF", "#0866FF"],
  ])("uses native selected tokens rather than guessed accent alpha", (background, foreground) => {
    const { toggle } = mountControls(background, foreground);
    const positioning = createTopbarPositioning(toggle);
    expect(positioning.updatePosition()).toBe(true);
    expect(toggle.style.getPropertyValue("--cmf-active-bg")).toBe(background);
    expect(toggle.style.getPropertyValue("--cmf-active-icon")).toBe(foreground);
    expect(toggle.style.getPropertyValue("--cmf-btn-hover")).toBe("rgba(255, 255, 255, 0.1)");
    toggle.setAttribute("data-cmf-open", "true");
    positioning.updatePosition();
    expect(toggle.style.color).toBe("");
    expect(toggle.style.getPropertyValue("--cmf-active-bg")).toBe(background);
  });

  test("refreshes selected tokens across a theme change without caching the old accent", () => {
    const { menu, toggle } = mountControls("rgba(29, 133, 252, 0.2)", "#75B6FF");
    const positioning = createTopbarPositioning(toggle);
    positioning.updatePosition();
    menu.style.setProperty("--primary-deemphasized-button-background", "#E7F3FF");
    menu.style.setProperty("--primary-deemphasized-button-text", "#0866FF");
    positioning.invalidateTheme(true);
    positioning.updatePosition();
    expect(toggle.style.getPropertyValue("--cmf-active-bg")).toBe("#E7F3FF");
    expect(toggle.style.getPropertyValue("--cmf-active-icon")).toBe("#0866FF");
  });

  test.each(["auto", "300px", "0px"])(
    "rejects unresolved or oversized native icon dimensions: %s",
    (size) => {
      const { menu, toggle } = mountControls("#E7F3FF", "#0866FF");
      const nativeIcon = menu.querySelector("svg");
      if (!nativeIcon) throw new Error("Expected native icon");
      nativeIcon.style.width = size;
      nativeIcon.style.height = size;
      createTopbarPositioning(toggle).updatePosition();
      const icon = toggle.querySelector<HTMLElement>(".cmf-icon");
      expect(icon?.style.width).toBe("");
      expect(icon?.style.height).toBe("");
    }
  );

  test("theme refresh while the native menu is expanded keeps the neutral icon token", () => {
    const { menu, toggle } = mountControls("#E7F3FF", "#0866FF");
    const positioning = createTopbarPositioning(toggle);
    positioning.updatePosition();
    menu.setAttribute("aria-expanded", "true");
    menu.style.color = "rgb(8, 102, 255)";
    menu.style.setProperty("--secondary-icon", "rgb(101, 103, 107)");
    positioning.invalidateTheme(true);
    positioning.updatePosition();
    expect(toggle.style.color).toBe("rgb(101, 103, 107)");
  });

  test("keeps inherited semantic fallback tokens when the host anchor omits explicit values", () => {
    const { toggle } = mountControls("", "");
    createTopbarPositioning(toggle).updatePosition();
    expect(toggle.style.getPropertyValue("--cmf-active-bg")).toContain(
      "--primary-deemphasized-button-background"
    );
    expect(toggle.style.getPropertyValue("--cmf-active-icon")).toContain(
      "--primary-deemphasized-button-text"
    );
  });
});

/** Mount the real lifecycle against deterministic host layout and animation frames. */
function mountLifecycle() {
  const state = {
    ...createUIState(),
    options: { CMF_BTN_OPTION: "1" },
    iconToggleHTML: "<svg></svg>",
    showAtt: "show",
    isAF: true,
  };
  const toggle = createToggleButton(state, { DLG_TITLE: "Settings" }, jest.fn());
  if (!toggle) throw new Error("Expected mounted toggle");
  return { state, toggle };
}

/** Deliver observer records and their coalesced frame without running the polling interval. */
async function flushUpdates() {
  await Promise.resolve();
  jest.advanceTimersByTime(32);
  await Promise.resolve();
}

describe("topbar lifecycle under host replacement", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    document.body.replaceChildren();
    jest.useRealTimers();
  });

  test("forty replacements dispose listeners and pending updates without duplicate controls", async () => {
    mountControls("#E7F3FF", "#0866FF");
    const { state } = mountLifecycle();
    const onToggle = jest.fn();
    for (let index = 0; index < 40; index += 1) {
      const previous = state.btnToggleEl;
      const current = createToggleButton(state, { DLG_TITLE: "Settings" }, onToggle);
      previous?.click();
      expect(onToggle).not.toHaveBeenCalled();
      expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
      current?.setAttribute("data-cmf-open", "true");
      current?.removeAttribute("data-cmf-open");
      window.dispatchEvent(new Event("resize"));
      state.syncToggleButtonTheme?.();
      await flushUpdates();
    }
    state.btnToggleEl?.click();
    expect(onToggle).toHaveBeenCalledTimes(1);
    destroyToggleButton(state);
    await flushUpdates();
    expect(jest.getTimerCount()).toBe(0);
    expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(0);
  });

  test("ignores feed churn but follows a native control after resize", async () => {
    const { menu } = mountControls("#E7F3FF", "#0866FF");
    const { state, toggle } = mountLifecycle();
    await flushUpdates();
    const geometry = jest.fn(menu.getBoundingClientRect);
    Object.defineProperty(menu, "getBoundingClientRect", { configurable: true, value: geometry });
    for (let index = 0; index < 50; index += 1)
      document.body.append(document.createElement("article"));
    await flushUpdates();
    expect(geometry).not.toHaveBeenCalled();
    mockRect(menu, { left: 650, top: 10, width: 36, height: 36 });
    const profile = menu.nextElementSibling;
    if (!profile) throw new Error("Expected adjacent profile control");
    mockRect(profile, { left: 694, top: 10, width: 36, height: 36 });
    window.dispatchEvent(new Event("resize"));
    await flushUpdates();
    expect(toggle.style.left).toBe("606px");
    expect(toggle.style.width).toBe("36px");
    destroyToggleButton(state);
  });

  test("recovers a host-removed toggle without resurrecting a disposed generation", async () => {
    mountControls("#E7F3FF", "#0866FF");
    const { state, toggle } = mountLifecycle();
    await flushUpdates();
    toggle.remove();
    await flushUpdates();
    expect(toggle.isConnected).toBe(true);
    expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(1);
    state.isAF = false;
    toggle.remove();
    await flushUpdates();
    expect(toggle.isConnected).toBe(false);
    state.isAF = true;
    document.body.append(document.createElement("article"));
    await flushUpdates();
    expect(toggle.isConnected).toBe(true);
    destroyToggleButton(state);
    document.body.append(document.createElement("article"));
    jest.advanceTimersByTime(2500);
    await flushUpdates();
    expect(toggle.isConnected).toBe(false);
    expect(jest.getTimerCount()).toBe(0);
  });

  test("does not recover a disabled-placement toggle after host removal", async () => {
    const { state } = mountLifecycle();
    state.options.CMF_BTN_OPTION = "2";
    const toggle = createToggleButton(state, { DLG_TITLE: "Settings" }, jest.fn());
    if (!toggle) throw new Error("Expected disabled-placement control");
    try {
      toggle.remove();
      await flushUpdates();
      expect(toggle.isConnected).toBe(false);
      expect(document.querySelectorAll("#fbcmfToggle")).toHaveLength(0);
    } finally {
      destroyToggleButton(state);
    }
  });

  test("positions a fallback immediately when the header is delayed", async () => {
    const { state, toggle } = mountLifecycle();
    await flushUpdates();
    expect(toggle.style.right).toBe("0.5rem");
    destroyToggleButton(state);
  });

  test("refreshes native colors without movement or an explicit theme callback", async () => {
    const { menu } = mountControls("#E7F3FF", "#0866FF");
    const { state, toggle } = mountLifecycle();
    await flushUpdates();
    menu.style.color = "rgb(10, 20, 30)";
    menu.style.setProperty("--secondary-button-background", "#eeeeee");
    await flushUpdates();
    expect(toggle.style.color).toBe("rgb(10, 20, 30)");
    expect(toggle.style.getPropertyValue("--cmf-btn-bg")).toBe("#eeeeee");
    destroyToggleButton(state);
  });

  test("observer-driven theme refresh updates neutral colors while the native menu stays expanded", async () => {
    const { menu } = mountControls("#E7F3FF", "#0866FF");
    const { state, toggle } = mountLifecycle();
    try {
      await flushUpdates();
      menu.setAttribute("aria-expanded", "true");
      menu.style.color = "rgb(8, 102, 255)";
      menu.style.setProperty("--secondary-icon", "rgb(101, 103, 107)");
      menu.style.setProperty("--secondary-button-background", "#eeeeee");
      await flushUpdates();
      expect(toggle.style.color).toBe("rgb(101, 103, 107)");
      expect(toggle.style.getPropertyValue("--cmf-btn-bg")).toBe("#eeeeee");
    } finally {
      destroyToggleButton(state);
    }
  });

  test("refreshes a replacement banner at identical geometry before the next poll", async () => {
    mountControls("#E7F3FF", "#0866FF");
    const { state, toggle } = mountLifecycle();
    await flushUpdates();
    const banner = document.querySelector('[role="banner"]');
    if (!banner) throw new Error("Expected banner");
    const replacement = banner.cloneNode(true);
    if (!(replacement instanceof HTMLElement)) throw new Error("Expected cloned banner");
    mockRect(replacement, { left: 0, top: 0, width: 900, height: 56 });
    replacement.querySelectorAll("button").forEach((button, index) => {
      mockRect(button, { left: 700 + index * 48, top: 8, width: 40, height: 40 });
      button.style.color = "rgb(11, 22, 33)";
    });
    banner.replaceWith(replacement);
    await flushUpdates();
    expect(toggle.style.color).toBe("rgb(11, 22, 33)");
    destroyToggleButton(state);
    expect(jest.getTimerCount()).toBe(0);
  });
});
