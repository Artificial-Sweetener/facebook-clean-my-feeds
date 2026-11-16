// SPDX-License-Identifier: GPL-3.0-only

import { hasPageSuggestionShelf } from "../../src/feeds/page-suggestions";
import { isNewsSuggested } from "../../src/feeds/news-detectors";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import * as labels from "../../src/core/filters/labels";
import { pageSuggestionCards } from "./page-suggestion-fixture";
import { requireElement } from "./news-fixtures";

/** Mount two anonymized captured cards in an existing feed root beside an ordinary post. */
function mount(): HTMLElement {
  document.body.innerHTML = `<main><article id="shelf"><h3>α</h3><div role="list">${pageSuggestionCards.join("")}</div></article><article id="ordinary"><h4>β</h4><p>γ</p></article></main>`;
  return requireElement(document.getElementById("shelf"));
}

afterEach(() => {
  clearDirtyTracking();
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

test("captured page cards match without dictionary lookup and leave an ordinary post alone", () => {
  const post = mount();
  const fallback = jest.spyOn(labels, "matchesNewsLabel");
  expect(
    isNewsSuggested(post, {}, { NF_SUGGESTIONS: "reason", NF_REELS_SHORT_VIDEOS: "reels" })
  ).toBe("reason");
  expect(fallback).not.toHaveBeenCalled();
  expect(hasPageSuggestionShelf(requireElement(document.getElementById("ordinary")))).toBe(false);
});

test("a completed disabled follow control retains the same recommendation identity", () => {
  const post = mount();
  const actions = post.querySelectorAll("[role=listitem] [role=button]");
  actions.item(1).setAttribute("aria-disabled", "true");
  expect(hasPageSuggestionShelf(post)).toBe(true);
});

test.each([
  "one card",
  "duplicate card",
  "foreign URL",
  "foreign title",
  "navigation URL",
  "one image",
  "hidden image wrapper",
  "video cover",
  "php navigation",
  "unlinked image",
  "missing portrait",
  "wrong follow glyph",
  "wrong dismiss glyph",
  "wrong viewbox",
  "extra geometry",
  "hidden geometry",
  "definition geometry",
  "hidden card",
  "hidden link",
  "menu action",
  "toggle action",
  "disabled dismiss",
  "extra action",
  "nested article",
  "nested list",
  "authored body",
  "foreign author",
  "outside control",
  "outside link",
  "mixed ordinary item",
  "foreign list child",
  "ancestor post",
  "multiple lists",
])("rejects %s without hiding the surrounding section", (kind) => {
  const post = mount();
  const list = requireElement(post.querySelector("[role=list]"));
  const card = requireElement(list.firstElementChild);
  const links = card.querySelectorAll("a");
  const actions = card.querySelectorAll("[role=button]");
  const follow = actions.item(1);
  const dismiss = actions.item(0);
  if (kind === "one card") list.lastElementChild?.remove();
  if (kind === "duplicate card") list.innerHTML = card.outerHTML.repeat(2);
  if (kind === "foreign URL")
    links.forEach((link) => link.setAttribute("href", "https://evil.example/example.page0/"));
  if (kind === "foreign title") links.item(2).setAttribute("href", "/different/");
  if (kind === "navigation URL") links.forEach((link) => link.setAttribute("href", "/friends/"));
  if (kind === "one image") card.querySelector("img")?.remove();
  if (kind === "hidden image wrapper")
    card.querySelector("img")?.parentElement?.setAttribute("hidden", "");
  if (kind === "video cover")
    card.querySelector("img")?.replaceWith(document.createElement("video"));
  if (kind === "php navigation") links.forEach((link) => link.setAttribute("href", "/login.php"));
  if (kind === "unlinked image") card.append(requireElement(card.querySelector("img")));
  if (kind === "missing portrait") card.querySelector("image")?.remove();
  if (kind === "wrong follow glyph") follow.querySelector("path")?.setAttribute("d", "M0 0L1 1");
  if (kind === "wrong dismiss glyph") dismiss.querySelector("path")?.setAttribute("d", "M0 0L1 1");
  if (kind === "wrong viewbox") follow.querySelector("svg")?.setAttribute("viewBox", "0 0 20 20");
  if (kind === "extra geometry")
    follow.querySelector("svg")?.insertAdjacentHTML("beforeend", '<circle r="2"></circle>');
  if (kind === "hidden geometry")
    follow.querySelector("path")?.setAttribute("style", "display:none");
  if (kind === "definition geometry") {
    const svg = requireElement(follow.querySelector("svg"));
    svg.innerHTML = `<defs>${svg.innerHTML}</defs>`;
  }
  if (kind === "hidden card") card.setAttribute("hidden", "");
  if (kind === "hidden link") links.item(0).hidden = true;
  if (kind === "menu action") follow.setAttribute("aria-haspopup", "menu");
  if (kind === "toggle action") follow.setAttribute("aria-pressed", "false");
  if (kind === "disabled dismiss") dismiss.setAttribute("aria-disabled", "true");
  if (kind === "extra action") card.insertAdjacentHTML("beforeend", "<button>δ</button>");
  if (kind === "nested article") card.insertAdjacentHTML("beforeend", "<article>δ</article>");
  if (kind === "nested list") card.insertAdjacentHTML("beforeend", '<div role="list"></div>');
  if (kind === "authored body") post.insertAdjacentHTML("beforeend", "<p>δ</p>");
  if (kind === "foreign author") post.insertAdjacentHTML("afterbegin", "<h4>δ</h4>");
  if (kind === "outside control") post.insertAdjacentHTML("beforeend", "<button>δ</button>");
  if (kind === "outside link") post.insertAdjacentHTML("beforeend", '<a href="/other/">δ</a>');
  if (kind === "mixed ordinary item")
    list.insertAdjacentHTML("beforeend", '<div role="listitem"><a href="/ordinary/">δ</a></div>');
  if (kind === "foreign list child") list.insertAdjacentHTML("beforeend", "<div>δ</div>");
  if (kind === "ancestor post") {
    const outer = document.createElement("article");
    post.replaceWith(outer);
    outer.append(post);
  }
  if (kind === "multiple lists") post.insertAdjacentHTML("beforeend", '<div role="list"></div>');
  expect(hasPageSuggestionShelf(post)).toBe(false);
});

test("empty pending cards do not supply identities or block confirmed loaded recommendations", () => {
  const post = mount();
  post.querySelector("[role=list]")?.insertAdjacentHTML("beforeend", '<div role="listitem"></div>');
  expect(hasPageSuggestionShelf(post)).toBe(true);
});
