// SPDX-License-Identifier: GPL-3.0-only

import { isNewsReelsAndShortVideos, mopNewsFeed } from "../../src/feeds/news";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { postAtt } from "../../src/dom/attributes";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { translations } from "../../src/i18n";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Reproduce the live carousel's independently loaded cards and heading without a see-more destination. */
function mountReelShelf(label = "Reels", count = 2): HTMLElement {
  const cards = Array.from(
    { length: count },
    (_, index) =>
      `<div data-type="hscroll-child" role="gridcell"><a href="/reel/${index + 1}/"><img></a></div>`
  ).join("");
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1"><h4><a href="/friend">Private author</a></h4><p>Private ordinary post</p></div><div aria-posinset="2" id="shelf"><div data-virtualized="false"><h3>${label}</h3><div role="grid"><div role="row">${cards}</div></div></div></div></div>`;
  return requireElement(document.getElementById("shelf"));
}

afterEach(() => {
  releaseDirtyObservers();
  document.body.replaceChildren();
});

test.each(["Reels", "مقاطع", "短片", "Нова добірка", "", "Unknown label"])(
  "two independently loaded preview cards identify the shelf regardless of heading %p",
  (label) => {
    const shelf = mountReelShelf(label);
    expect(isNewsReelsAndShortVideos(shelf, translations.en)).toBe(
      translations.en.NF_REELS_SHORT_VIDEOS
    );
  }
);

test("the shelf option hides a two-card carousel while leaving an ordinary neighboring post visible", () => {
  const shelf = mountReelShelf();
  const context = createNewsContext({
    options: { NF_REELS_SHORT_VIDEOS: true, NF_SHORT_REEL_VIDEO: false, VERBOSITY_LEVEL: "0" },
  });
  mopNewsFeed(context);
  expect(shelf.getAttribute(postAtt)).toBe(context.keyWords.NF_REELS_SHORT_VIDEOS);
  expect(shelf.hasAttribute(context.state.hideAtt)).toBe(true);
  expect(document.querySelector('[aria-posinset="1"]')?.hasAttribute(postAtt)).toBe(false);
});

test.each(["author", "body", "nested-owner", "one-card", "hidden", "external", "text-links"])(
  "rejects insufficient or authored carousel evidence: %s",
  (variant) => {
    const shelf = mountReelShelf();
    if (variant === "author")
      shelf.insertAdjacentHTML("afterbegin", '<h4><a href="/friend">Private author</a></h4>');
    if (variant === "body")
      shelf.insertAdjacentHTML("afterbegin", "<p>Private authored caption</p>");
    if (variant === "nested-owner") shelf.firstElementChild?.setAttribute("role", "article");
    const links = Array.from(shelf.querySelectorAll("a"));
    if (variant === "one-card") links[0]?.parentElement?.append(requireElement(links[1]));
    if (variant === "hidden") links[1]?.setAttribute("hidden", "");
    if (variant === "external")
      for (const link of links) link.href = "https://example.test/reel/1/";
    if (variant === "text-links") shelf.querySelectorAll("img").forEach((image) => image.remove());
    expect(isNewsReelsAndShortVideos(shelf, translations.en)).toBe("");
  }
);

test("a one-card partial shelf is reclassified when its second preview arrives", () => {
  const shelf = mountReelShelf("", 1);
  expect(isNewsReelsAndShortVideos(shelf, translations.en)).toBe("");
  shelf
    .querySelector('[role="row"]')
    ?.insertAdjacentHTML(
      "beforeend",
      '<div data-type="hscroll-child"><a href="/reel/2/"><video></video></a></div>'
    );
  expect(isNewsReelsAndShortVideos(shelf, translations.en)).toBe(
    translations.en.NF_REELS_SHORT_VIDEOS
  );
});

test("redacted report reconstruction preserves the same two-card filter decision", async () => {
  const shelf = mountReelShelf("Unknown label");
  const snapshot = await captureDomSnapshot(document, { target: shelf });
  const region = snapshot.regions[0];
  if (!region) throw new Error("Missing captured reel shelf");
  document.body.innerHTML = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  ).body.innerHTML;
  const restored = requireElement(document.querySelector(`[data-cmf-node="${region.ref}"]`));
  expect(isNewsReelsAndShortVideos(restored, translations.en)).toBe(
    translations.en.NF_REELS_SHORT_VIDEOS
  );
  expect(JSON.stringify(snapshot)).not.toContain("Private");
});
