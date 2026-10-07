// SPDX-License-Identifier: GPL-3.0-only

import { required } from "./fixtures";
import { attachTooltip } from "../../src/dom/tooltip";

describe("dom/tooltip", () => {
  const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

  beforeEach(() => {
    jest.useFakeTimers();
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      x: 10,
      y: 10,
      /** Satisfy the DOMRect serialization contract without introducing unrelated fixture state. */
      toJSON: () => null,
      top: 10,
      left: 10,
      width: 50,
      height: 20,
      right: 60,
      bottom: 30,
    }));
  });

  afterEach(() => {
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    jest.useRealTimers();
  });

  test("attachTooltip shows and hides tooltip", () => {
    const target = document.createElement("button");
    document.body.appendChild(target);

    const cleanup = attachTooltip(target, "Hello");
    target.dispatchEvent(new Event("pointerenter"));
    jest.advanceTimersByTime(400);

    const tooltip = required(document.querySelector(".fb-cmf-tooltip"));
    expect(tooltip).not.toBeNull();
    expect(target.getAttribute("aria-describedby")).toBe(tooltip.id);

    cleanup();
    expect(document.querySelector(".fb-cmf-tooltip")).toBeNull();
    target.remove();
  });

  test("attachTooltip returns noop for missing args", () => {
    const cleanup = attachTooltip(null, "");
    expect(typeof cleanup).toBe("function");
  });
});
