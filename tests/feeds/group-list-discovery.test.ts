// SPDX-License-Identifier: GPL-3.0-only

import { hasDiscoveryShelf } from "../../src/feeds/discovery-structure";
import { isNewsSuggested } from "../../src/feeds/news-detectors";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { requireElement } from "./news-fixtures";
import * as labels from "../../src/core/filters/labels";

/** Reproduce issue #26's list cards with paired cover/title links and two caption actions; wording is arbitrary. */
function tile(id: string): string {
  return `<li><div><div><a role="link" href="/groups/${id}/"><div><img></div></a>
    <div><span><a role="link" href="/groups/${id}/">α</a></span><span>β</span></div>
    <div><div role="button" tabindex="0"><div><span>γ</span></div></div>
    <div role="button" tabindex="0"><div><span>δ</span></div></div></div></div></div></li>`;
}

/** Mount the reported non-carousel structure beside an ordinary post, keeping region ownership explicit. */
function mount(): HTMLElement {
  document.body.innerHTML = `<div role="main"><article id="shelf"><div><span>ε</span></div>
    <div><ul>${tile("123")}${tile("named.group")}</ul></div>
    <a href="/groups/">ζ</a><a href="/groups/discover/">η</a></article>
    <article id="neighbor"><h4>Ordinary author</h4><p>Ordinary post</p></article></div>`;
  return requireElement(document.getElementById("shelf"));
}

afterEach(() => {
  clearDirtyTracking();
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

test("list suggestions use destinations and paired actions without consulting the locale dictionary", () => {
  const shelf = mount();
  const fallback = jest.spyOn(labels, "matchesNewsLabel");
  expect(
    isNewsSuggested(shelf, {}, { NF_SUGGESTIONS: "reason", NF_REELS_SHORT_VIDEOS: "reels" })
  ).toBe("reason");
  expect(fallback).not.toHaveBeenCalled();
  expect(hasDiscoveryShelf(requireElement(document.getElementById("neighbor")), "groups")).toBe(
    false
  );
  expect(hasDiscoveryShelf(shelf, "events")).toBe(false);
});

test("an independent icon-only dismiss overlay does not become a third caption action", () => {
  const shelf = mount();
  shelf
    .querySelector("li")
    ?.insertAdjacentHTML(
      "beforeend",
      '<div role="button"><svg><path d="M0 0L2 2"></path></svg></div>'
    );
  expect(hasDiscoveryShelf(shelf, "groups")).toBe(true);
});

test.each([
  "no discovery",
  "foreign discovery",
  "discovery inside card",
  "hidden discovery",
  "one tile",
  "different lists",
  "no image",
  "two image links",
  "different title group",
  "foreign group",
  "navigation destination",
  "one action",
  "menu action",
  "toggle action",
  "disabled action",
  "hidden action",
  "icon action",
  "extra caption action",
  "nested list",
  "nested article",
  "authored list",
  "authored post",
  "ordinary author",
  "outside post",
  "hidden card",
  "unrelated authored list item",
  "unrelated list author",
])("rejects the %s near-match", (variant) => {
  const shelf = mount();
  const tile = requireElement(shelf.querySelector("li"));
  const action = requireElement(tile.querySelector('[role="button"]'));
  const discovery = requireElement(shelf.querySelector('a[href="/groups/discover/"]'));
  if (variant === "no discovery") discovery.remove();
  if (variant === "foreign discovery")
    discovery.setAttribute("href", "https://evil.example/groups/discover/");
  if (variant === "discovery inside card") tile.append(discovery);
  if (variant === "hidden discovery") discovery.setAttribute("hidden", "");
  if (variant === "one tile") tile.remove();
  if (variant === "different lists") {
    const list = document.createElement("ul");
    list.append(tile);
    shelf.append(list);
  }
  if (variant === "no image") tile.querySelector("img")?.remove();
  if (variant === "two image links")
    tile.querySelectorAll("a")[1]?.append(document.createElement("img"));
  if (variant === "different title group")
    tile.querySelectorAll("a")[1]?.setAttribute("href", "/groups/456/");
  if (variant === "foreign group")
    for (const link of tile.querySelectorAll("a"))
      link.setAttribute("href", "https://evil.example/groups/123/");
  if (variant === "navigation destination")
    for (const link of tile.querySelectorAll("a")) link.setAttribute("href", "/groups/discover/");
  if (variant === "one action") action.remove();
  if (variant === "menu action") action.setAttribute("aria-haspopup", "menu");
  if (variant === "toggle action") action.setAttribute("aria-pressed", "false");
  if (variant === "disabled action") action.setAttribute("aria-disabled", "true");
  if (variant === "hidden action") action.setAttribute("hidden", "");
  if (variant === "icon action") action.append(document.createElement("img"));
  if (variant === "extra caption action") tile.append(action.cloneNode(true));
  if (variant === "nested list")
    tile.insertAdjacentHTML("beforeend", "<ul><li>Nested item</li></ul>");
  if (variant === "nested article") tile.setAttribute("role", "article");
  if (variant === "authored list") tile.setAttribute("data-ad-preview", "message");
  if (variant === "authored post")
    shelf.insertAdjacentHTML("afterbegin", "<p>Ordinary authored content</p>");
  if (variant === "ordinary author") shelf.insertAdjacentHTML("afterbegin", "<h4>Author</h4>");
  if (variant === "outside post") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = shelf.innerHTML;
    shelf.replaceWith(wrapper);
    expect(hasDiscoveryShelf(wrapper, "groups")).toBe(false);
    return;
  }
  if (variant === "hidden card") tile.setAttribute("hidden", "");
  if (variant === "unrelated authored list item")
    shelf.insertAdjacentHTML("beforeend", "<ul><li><p>Ordinary authored content</p></li></ul>");
  if (variant === "unrelated list author")
    shelf.insertAdjacentHTML("afterbegin", "<ul><li><h4>Ordinary author</h4></li></ul>");
  expect(hasDiscoveryShelf(shelf, "groups")).toBe(false);
});
