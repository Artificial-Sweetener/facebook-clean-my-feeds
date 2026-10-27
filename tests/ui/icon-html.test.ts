// SPDX-License-Identifier: GPL-3.0-only

import { buildIconHTML } from "../../src/ui/icon-html";

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor"><path d="M4 4h12v12H4z"/></svg>';

describe("ui/icon-html", () => {
  test("inlines owned vector shapes and keeps them decorative and non-focusable", () => {
    document.body.innerHTML = buildIconHTML(svg, "extra");
    const wrapper = document.querySelector(".cmf-icon.extra");
    const icon = wrapper?.querySelector("svg");
    expect(wrapper?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    expect(icon?.getAttribute("focusable")).toBe("false");
    expect(icon?.getAttribute("fill")).toBe("currentColor");
    expect(icon?.querySelector("path")?.getAttribute("d")).toBe("M4 4h12v12H4z");
    expect(wrapper?.hasAttribute("style")).toBe(false);
    expect(document.querySelector("img")).toBeNull();
  });

  test("class tokens cannot escape the internal wrapper attribute", () => {
    const markup = buildIconHTML(svg, 'extra" onclick="alert(1)');
    expect(markup).not.toContain("onclick");
    expect(markup).toContain('class="cmf-icon"');
  });
});
