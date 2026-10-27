// SPDX-License-Identifier: GPL-3.0-only

import { defaults } from "../../src/core/options/defaults";
import { createDomState } from "../../src/dom/types";
import { addCSS, addExtraCSS } from "../../src/dom/styles";

/**
 * Activate only reduced-motion rule bodies for jsdom, which does not evaluate media queries.
 * The CSS parser and cascade still operate on the real generated declarations and selectors.
 * @param sheet Complete generated stylesheet, including base rules and motion media rules.
 * @returns The reduced-motion declarations as ordinary active CSS for deterministic tests.
 */
function activeReducedMotion(sheet: CSSStyleSheet): string {
  return Array.from(sheet.cssRules)
    .filter((rule) => rule.cssText.startsWith("@media (prefers-reduced-motion: reduce)"))
    .map((rule) => rule.cssText.replace(/^@media[^{]+\{/, "").replace(/\}$/, ""))
    .join("\n");
}

test("reduced motion overrides the complete topbar selector and footer feedback", () => {
  const state = { ...createDomState(), iconNewWindowClass: "motion-external-link" };
  state.cssID = "motion-fixture";
  const options = { CMF_BTN_OPTION: "1", CMF_DIALOG_OPTION: "1" };
  const style = addCSS(state, options, defaults);
  addExtraCSS(state, options, defaults);
  if (!(style instanceof HTMLStyleElement) || !style.sheet) throw new Error("Missing stylesheet");
  const reduced = activeReducedMotion(style.sheet);
  expect(reduced).toContain(".fb-cmf-toggle.fb-cmf-toggle-topbar");
  expect(reduced).toContain("#fbcmf footer > button::after");
  const override = document.createElement("style");
  override.textContent = reduced;
  document.head.appendChild(override);
  document.body.innerHTML =
    '<div class="fb-cmf-toggle fb-cmf-toggle-topbar"></div><div id="fbcmf"><footer><button class="cmf-action--confirm-blue"></button></footer></div>';
  const toggle = document.querySelector(".fb-cmf-toggle");
  const button = document.querySelector("button");
  if (!toggle || !button) throw new Error("Missing motion fixture controls");
  expect(window.getComputedStyle(toggle).transition).toBe("none");
  expect(window.getComputedStyle(button).transition).toBe("none");
  expect(window.getComputedStyle(button).animation).toBe("none");
  override.remove();
  style.remove();
  document.body.replaceChildren();
});
