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
});
