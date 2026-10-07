// SPDX-License-Identifier: GPL-3.0-only

import { getMosquitosQuery, swatTheMosquitos } from "../../src/dom/animated-gifs";
import { postAtt } from "../../src/dom/attributes";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("dom/animated-gifs", () => {
  test("getMosquitosQuery includes the post attribute", () => {
    expect(getMosquitosQuery()).toContain(postAtt);
  });

  test("swatTheMosquitos clicks hidden gifs and marks the parent", () => {
    const post = document.createElement("div");
    const wrapper = document.createElement("div");
    const gifButton = document.createElement("div");
    gifButton.setAttribute("role", "button");
    gifButton.setAttribute("aria-label", "GIF");
    const icon = document.createElement("i");
    gifButton.appendChild(icon);
    const link = document.createElement("a");
    const clickSpy = jest.fn();
    gifButton.click = clickSpy;
    wrapper.appendChild(gifButton);
    wrapper.appendChild(link);
    post.appendChild(wrapper);

    const original = window.getComputedStyle;
    const hiddenStyle = document.createElement("div").style;
    hiddenStyle.opacity = "0";
    jest.spyOn(window, "getComputedStyle").mockReturnValue(hiddenStyle);

    swatTheMosquitos(post);

    window.getComputedStyle = original;

    expect(clickSpy).toHaveBeenCalled();
    expect(gifButton.hasAttribute(postAtt)).toBe(true);
  });
});
