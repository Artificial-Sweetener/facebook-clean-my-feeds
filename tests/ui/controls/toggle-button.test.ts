// SPDX-License-Identifier: GPL-3.0-only

import { createUIState } from "../../../src/ui/state";
import type { ToggleState } from "../../../src/ui/dialog/types";
import { requireValue, mockRect } from "../helpers";
jest.mock("../../../src/dom/tooltip", () => ({
  attachTooltip: jest.fn(() => () => {}),
}));

import {
  createToggleButton,
  destroyToggleButton,
  isFacebookPageDimmed,
  pageDimmedAtt,
} from "../../../src/ui/controls/toggle-button";
import { attachTooltip } from "../../../src/dom/tooltip";

/** Build only the state required to mount and tear down a toggle control. */
function buildState(btnOption: string): ToggleState {
  return {
    ...createUIState(),
    options: { CMF_BTN_OPTION: btnOption },
    iconToggleHTML: "<svg></svg>",
    showAtt: "show",
    isAF: false,
  };
}

/** Model Facebook modal geometry separately from transparent full-page containers. */
function createModalDimmerFixture({
  backgroundColor,
  transparent = false,
}: { backgroundColor?: string; transparent?: boolean } = {}) {
  const dialog = document.createElement("div");
  dialog.setAttribute("role", "dialog");
  dialog.textContent = "Modal";
  mockRect(dialog, { left: 300, top: 200, width: 400, height: 300 });

  const dimmer = document.createElement("div");
  dimmer.style.position = "fixed";
  dimmer.style.backgroundColor =
    backgroundColor || (transparent ? "rgba(0, 0, 0, 0)" : "rgba(11, 11, 11, 0.8)");
  mockRect(dimmer, {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  document.body.appendChild(dimmer);
  document.body.appendChild(dialog);

  return { dialog, dimmer };
}

describe("ui/controls/toggle-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("creates a floating button by default", () => {
    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(btn.tagName).toBe("BUTTON");
    expect(btn.getAttribute("aria-label")).toBe("Toggle");
    btn.click();
    expect(onToggle).toHaveBeenCalled();
    expect(attachTooltip).toHaveBeenCalledWith(btn, "Toggle", { placement: "right" });
    destroyToggleButton(state);
  });

  test("creates a topbar button with keyboard support", () => {
    jest.useFakeTimers();
    const onToggle = jest.fn();
    const state = buildState("1");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(btn.tagName).toBe("DIV");
    expect(btn.getAttribute("aria-label")).toBe("Toggle");
    expect(btn.getAttribute("role")).toBe("button");
    expect(btn.getAttribute("tabindex")).toBe("0");

    btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onToggle).toHaveBeenCalled();

    destroyToggleButton(state);
    jest.runOnlyPendingTimers();
  });

  test("matches the leftmost button in the rightmost header cluster without relying on labels", () => {
    jest.useFakeTimers();
    const onToggle = jest.fn();
    const state = buildState("1");
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");

    mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });
    const menuButton = document.createElement("button");
    menuButton.setAttribute("aria-label", "Localized entry");
    menuButton.style.color = "rgb(255, 255, 255)";
    menuButton.style.backgroundColor = "rgb(0, 0, 0)";
    menuButton.style.borderRadius = "999px";
    menuButton.style.setProperty("--secondary-icon", "rgb(255, 255, 255)");
    menuButton.style.setProperty("--secondary-button-background", "rgb(0, 0, 0)");
    menuButton.style.setProperty("--primary-button-background", "rgb(24, 119, 242)");
    menuButton.style.setProperty("--accent", "rgb(24, 119, 242)");
    menuButton.style.setProperty("--hover-overlay", "rgba(255, 255, 255, 0.1)");
    menuButton.style.setProperty("--press-overlay", "rgba(255, 255, 255, 0.2)");
    const menuIcon = document.createElement("svg");
    menuButton.appendChild(menuIcon);
    mockRect(menuButton, { left: 700, top: 8, width: 40, height: 40 });

    const profileButton = document.createElement("button");
    profileButton.setAttribute("aria-label", "Localized profile");
    mockRect(profileButton, { left: 748, top: 8, width: 40, height: 40 });

    banner.appendChild(menuButton);
    banner.appendChild(profileButton);
    document.body.appendChild(banner);

    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));
    expect(btn.style.left).toBe("652px");
    expect(btn.style.top).toBe("8px");
    expect(btn.style.width).toBe("40px");
    expect(btn.style.height).toBe("40px");

    destroyToggleButton(state);
    jest.runOnlyPendingTimers();
    window.requestAnimationFrame = originalRaf;
  });

  test("clears inline color when dialog is open to allow active styling", async () => {
    const onToggle = jest.fn();
    const state = buildState("1");
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    mockRect(banner, { left: 0, top: 0, width: 900, height: 56 });

    const menuButton = document.createElement("button");
    menuButton.setAttribute("aria-label", "Localized entry");
    menuButton.style.color = "rgb(255, 255, 255)";
    menuButton.style.backgroundColor = "rgb(0, 0, 0)";
    menuButton.style.borderRadius = "999px";
    menuButton.style.setProperty("--secondary-icon", "rgb(255, 255, 255)");
    menuButton.style.setProperty("--secondary-button-background", "rgb(0, 0, 0)");
    menuButton.style.setProperty("--primary-button-background", "rgb(24, 119, 242)");
    menuButton.style.setProperty("--accent", "rgb(24, 119, 242)");
    menuButton.style.setProperty("--hover-overlay", "rgba(255, 255, 255, 0.1)");
    menuButton.style.setProperty("--press-overlay", "rgba(255, 255, 255, 0.2)");
    const menuIcon = document.createElement("svg");
    menuButton.appendChild(menuIcon);
    mockRect(menuButton, { left: 700, top: 8, width: 40, height: 40 });

    const profileButton = document.createElement("button");
    profileButton.setAttribute("aria-label", "Localized profile");
    mockRect(profileButton, { left: 748, top: 8, width: 40, height: 40 });

    banner.appendChild(menuButton);
    banner.appendChild(profileButton);
    document.body.appendChild(banner);

    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(btn.style.color).not.toBe("");

    btn.setAttribute("data-cmf-open", "true");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.style.color).toBe("");
    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("marks the floating toggle dimmed when a full-page modal scrim is present", () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    createModalDimmerFixture();

    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(isFacebookPageDimmed()).toBe(true);
    expect(btn.getAttribute(pageDimmedAtt)).toBe("true");

    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("marks the topbar toggle dimmed when a full-page modal scrim is present", () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    createModalDimmerFixture();

    const onToggle = jest.fn();
    const state = buildState("1");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(btn.getAttribute(pageDimmedAtt)).toBe("true");

    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("marks the topbar toggle dimmed when a light-mode modal scrim is present", () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    createModalDimmerFixture({ backgroundColor: "rgba(244, 244, 244, 0.8)" });

    const onToggle = jest.fn();
    const state = buildState("1");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(isFacebookPageDimmed()).toBe(true);
    expect(btn.getAttribute(pageDimmedAtt)).toBe("true");

    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("removes dimmed state when the modal scrim is removed", async () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    const { dialog, dimmer } = createModalDimmerFixture();

    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(btn.getAttribute(pageDimmedAtt)).toBe("true");

    dialog.remove();
    dimmer.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.hasAttribute(pageDimmedAtt)).toBe(false);

    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("does not dim for unrelated transparent fixed overlays", () => {
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      cb(0);
      return 0;
    };
    createModalDimmerFixture({ transparent: true });

    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));

    expect(isFacebookPageDimmed()).toBe(false);
    expect(btn.hasAttribute(pageDimmedAtt)).toBe(false);

    destroyToggleButton(state);
    window.requestAnimationFrame = originalRaf;
  });

  test("ignores activation while the toggle is dimmed", () => {
    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = requireValue(createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle));
    btn.setAttribute(pageDimmedAtt, "true");

    btn.click();

    expect(onToggle).not.toHaveBeenCalled();
    destroyToggleButton(state);
  });
});
