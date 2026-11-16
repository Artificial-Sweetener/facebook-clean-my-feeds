// SPDX-License-Identifier: GPL-3.0-only

import {
  findTopCardsForPagesContainer,
  getSidePanelAiTargets,
  scrubSurvey,
  scrubTabbies,
} from "../../src/feeds/news-features";
import { findStructuralRailAdSection } from "../../src/feeds/news-rail-structure";
import { createNewsContext, requireElement } from "./news-fixtures";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";

afterEach(() => {
  releaseDirtyObservers();
  document.body.replaceChildren();
});

test("top-card discovery does not swallow ordinary posts beneath navigation links", () => {
  document.body.innerHTML =
    '<div role="main"><div role="region"><a href="/reel/">Reels</a><a href="/stories/">Stories</a><div aria-posinset="1"><h4>Author</h4><p>Ordinary post</p></div></div></div>';
  expect(findTopCardsForPagesContainer(document.querySelector('[role="main"]'))).toBeNull();
});

test("top-card discovery ignores story and reel links inside authored content", () => {
  document.body.innerHTML =
    '<div role="main"><div role="region"><p><a href="/reel/">Reels</a><a href="/stories/">Stories</a></p></div></div>';
  expect(findTopCardsForPagesContainer(document.querySelector('[role="main"]'))).toBeNull();
});

test.each([
  "https://external.invalid/messages/t/36327,2227039302/",
  "/person?next=/messages/t/36327,2227039302/",
])("AI thread detection rejects a lookalike destination: %s", (href) => {
  document.body.innerHTML = `<div role="complementary"><ul><li><a href="${href}">Ordinary contact</a></li></ul></div>`;
  expect(getSidePanelAiTargets()).toEqual([]);
});

test("structural rail ads cannot hide a neighboring level-five heading", () => {
  document.body.innerHTML =
    '<div role="complementary"><section><h3>Advertising</h3><a attributionsrc href="https://l.facebook.com/l.php?u=destination"><img></a><h5>Contacts</h5><div>Ordinary contact</div></section></div>';
  const rail = requireElement(document.querySelector('[role="complementary"]'));
  expect(findStructuralRailAdSection(rail, requireElement(rail.querySelector("h3")))).toBeNull();
});

test("structural rail ads require a visible image rather than a hidden image wrapper", () => {
  document.body.innerHTML =
    '<div role="complementary"><section><h3>Other section</h3><a attributionsrc href="https://l.facebook.com/l.php?u=destination"><span hidden><img></span></a></section></div>';
  const rail = requireElement(document.querySelector('[role="complementary"]'));
  expect(findStructuralRailAdSection(rail, requireElement(rail.querySelector("h3")))).toBeNull();
});

test.each(["/survey/?session=123", "https://external.invalid/survey/?session=123"])(
  "survey cleanup does not hide an ordinary post containing a survey link: %s",
  (href) => {
    document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1" id="post"><h4>Author</h4><div><div><div style="border-radius:8px"><a href="${href}"><div role="none">Survey link</div></a></div></div></div></div></div>`;
    const context = createNewsContext({ options: { NF_SURVEY: true } });
    scrubSurvey(context);
    expect(document.getElementById("post")?.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(document.getElementById("post")?.hasAttribute("cmfr")).toBe(false);
  }
);

test("tab-strip cleanup cannot hide a post containing a tabbed embedded card", () => {
  document.body.innerHTML = `<div role="main"><div><div><div><div aria-posinset="1" id="post"><div><div><div><div role="tablist"><button role="tab">Details</button></div></div></div></div></div></div></div></div></div>`;
  const context = createNewsContext({ options: { NF_TABLIST_STORIES_REELS_ROOMS: true } });
  scrubTabbies(context);
  expect(document.getElementById("post")?.hasAttribute("cmfr")).toBe(false);
});
