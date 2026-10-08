// SPDX-License-Identifier: GPL-3.0-only

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
