jest.mock("../../../src/dom/tooltip", () => ({
  attachTooltip: jest.fn(() => () => {}),
}));

const { createToggleButton } = require("../../../src/ui/controls/toggle-button");
const { attachTooltip } = require("../../../src/dom/tooltip");

function buildState(btnOption) {
  return {
    options: { CMF_BTN_OPTION: btnOption },
    iconToggleHTML: "<svg></svg>",
    showAtt: "show",
    isAF: false,
  };
}

describe("ui/controls/toggle-button", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("creates a floating button by default", () => {
    const onToggle = jest.fn();
    const state = buildState("0");
    const btn = createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle);

    expect(btn.tagName).toBe("BUTTON");
    btn.click();
    expect(onToggle).toHaveBeenCalled();
    expect(attachTooltip).toHaveBeenCalledWith(btn, "Toggle", { placement: "right" });
  });

  test("creates a topbar button with keyboard support", () => {
    jest.useFakeTimers();
    const onToggle = jest.fn();
    const state = buildState("1");
    const btn = createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle);

    expect(btn.tagName).toBe("DIV");
    expect(btn.getAttribute("role")).toBe("button");
    expect(btn.getAttribute("tabindex")).toBe("0");

    btn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    expect(onToggle).toHaveBeenCalled();

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("clears inline color when dialog is open to allow active styling", async () => {
    const onToggle = jest.fn();
    const state = buildState("1");
    const originalRaf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => cb();
    const banner = document.createElement("div");
    banner.setAttribute("role", "banner");
    const menuButton = document.createElement("button");
    menuButton.setAttribute("aria-label", "Menu");
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
    banner.appendChild(menuButton);
    document.body.appendChild(banner);

    const btn = createToggleButton(state, { DLG_TITLE: "Toggle" }, onToggle);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(btn.style.color).not.toBe("");

    btn.setAttribute("data-cmf-open", "true");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(btn.style.color).toBe("");
    window.requestAnimationFrame = originalRaf;
  });
});
