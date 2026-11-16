// SPDX-License-Identifier: GPL-3.0-only

import { isManusAiLink } from "../../src/feeds/ai-destinations";
import { getSidePanelAiTargets } from "../../src/feeds/news-features";
import { clearDirtyTracking } from "../../src/dom/dirty-check";

afterEach(() => {
  jest.restoreAllMocks();
  clearDirtyTracking();
  document.body.replaceChildren();
});

test.each([
  "https://manus.im/",
  "https://www.manus.im/app",
  "https://l.facebook.com/l.php?u=https%3A%2F%2Fmanus.im%2Fapp%3Fsource%3Dfacebook",
])("Manus navigation needs no matching caption: %s", (href) => {
  document.body.innerHTML = `<div role="navigation"><ul><li id="target"><a href="${href}">未知</a></li><li><a href="/friends/">Other</a></li></ul></div>`;
  expect(getSidePanelAiTargets().map((target) => target.id)).toEqual(["target"]);
});

test.each([
  "https://manus.im.example.org/",
  "https://example.org/?u=https://manus.im/",
  "https://manus.im@evil.example/",
  "https://user@manus.im/",
  "javascript:alert('manus.im')",
  "https://example.manus.space/",
  "https://l.facebook.com/l.php?u=https%3A%2F%2Fmanus.im.example.org%2F",
  "https://help.manus.im/",
])("Manus destination rejects unrelated or misleading URLs: %s", (href) => {
  const anchor = document.createElement("a");
  anchor.setAttribute("href", href);
  expect(isManusAiLink(anchor)).toBe(false);
});

test.each([
  "hidden",
  'aria-hidden="true"',
  'data-commentid="1"',
  'data-ad-preview="message"',
  'role="article"',
])("Manus sidebar detection rejects %s content", (attributes) => {
  document.body.innerHTML = `<div role="navigation"><li><div ${attributes}><a href="https://manus.im/">未知</a></div></li></div>`;
  expect(getSidePanelAiTargets()).toEqual([]);
});

test("a Manus caption cannot broaden a URL match over neighboring navigation", () => {
  document.body.innerHTML =
    '<div role="navigation"><li><a id="target" href="https://manus.im/">Manus AI</a><a href="/friends/"></a></li></div>';
  expect(getSidePanelAiTargets().map((target) => target.id)).toEqual(["target"]);
});

test("a successful Manus destination bypasses the literal-caption fallback", () => {
  document.body.innerHTML =
    '<div role="navigation"><li id="target"><a href="https://manus.im/">未知</a></li></div>';
  const item = document.querySelector("li");
  if (!item) throw new Error("Fixture requires a navigation item");
  const text = jest.spyOn(item, "textContent", "get");
  expect(getSidePanelAiTargets()).toEqual([item]);
  expect(text).not.toHaveBeenCalled();
});
