// SPDX-License-Identifier: GPL-3.0-only

import { mopNewsFeed, getNewsPostDiscovery, isNewsStoriesPost } from "../../src/feeds/news";
import { isNewsStoryShelf } from "../../src/feeds/news-stories";
import { getNewsPostCollection } from "../../src/diagnostics/collection";
import { restoreFeedPresentation } from "../../src/feeds/reset";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { translations } from "../../src/i18n";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Build anonymous horizontal preview cards without depending on captions or feed-origin query values. */
function previews(source = "inline_story_tray"): string {
  return [1, 2, 3]
    .map(
      (id) =>
        `<div data-type="hscroll-child"><a href="/stories/${id}/${id + 10}/?source=${source}"><img><p>Private name</p></a></div>`
    )
    .join("");
}

/** Reproduce an article-less ribbon between posts while preserving a separate top-of-page creation tray. */
function mountShelf(heading = "Stories"): HTMLElement {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div id="top" data-virtualized><h3>Top tray</h3><a href="/stories/create/">Create</a>${previews()}</div><div id="before" role="article"><p>Ordinary post</p></div><div id="shelf" data-virtualized><h3>${heading}</h3><div>${previews()}</div></div><div id="after" role="article"><p>Neighbor</p></div></div>`;
  return requireElement(document.getElementById("shelf"));
}

afterEach(() => {
  releaseDirtyObservers();
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

test.each(["Stories", "قصص", "限時動態", "Історії", "Unrecognized locale", ""])(
  "discovers and hides the later ribbon without matching its heading %p",
  (heading) => {
    const shelf = mountShelf(heading);
    const context = createNewsContext({ options: { NF_STORIES: true, VERBOSITY_LEVEL: "0" } });
    expect(getNewsPostDiscovery().posts).toEqual([
      document.getElementById("before"),
      shelf,
      document.getElementById("after"),
    ]);
    expect(isNewsStoriesPost(shelf, translations.en)).toBe(translations.en.NF_STORIES);
    mopNewsFeed(context);
    expect(shelf.getAttribute(postAtt)).toBe(context.keyWords.NF_STORIES);
    expect(shelf.hasAttribute(context.state.hideAtt)).toBe(true);
    for (const id of ["top", "before", "after"])
      expect(requireElement(document.getElementById(id)).hasAttribute(postAtt)).toBe(false);
    expect(getNewsPostCollection().posts).toContain(shelf);
  }
);

test.each(["", "profile", "inline_story_tray", "unrecognized_future_source"])(
  "recognizes preview structure independently of source=%s",
  (source) => {
    const shelf = mountShelf();
    requireElement(shelf.querySelector("h3")).insertAdjacentHTML("afterend", previews(source));
    expect(isNewsStoryShelf(shelf)).toBe(true);
  }
);

test("leaves the shelf visible when Stories is disabled and restores it after an option reset", () => {
  const shelf = mountShelf();
  const context = createNewsContext({ options: { NF_STORIES: false, VERBOSITY_LEVEL: "0" } });
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(false);
  context.options.NF_STORIES = true;
  context.state.forceProcess = true;
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(true);
  context.options.NF_STORIES = false;
  restoreFeedPresentation({ ...context.state, isAF: true });
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(false);
  expect(shelf.hasAttribute(context.state.hideAtt)).toBe(false);
});

test("the first story tray stays outside post discovery even without its creation link", () => {
  mountShelf();
  const top = requireElement(document.getElementById("top"));
  requireElement(top.querySelector('a[href="/stories/create/"]')).remove();
  expect(getNewsPostDiscovery().posts).not.toContain(top);
});

test.each([
  "https://external.test/stories/123/",
  "https://facebook.com.external.test/stories/123/",
  "https://private@www.facebook.com/stories/123/",
  "/help/?next=/stories/123/",
  "/stories/",
  "/stories/create/",
  "javascript:void('/stories/123/')",
])("rejects carousel links that are not story previews: %s", (href) => {
  const shelf = mountShelf();
  for (const link of shelf.querySelectorAll("a")) link.setAttribute("href", href);
  expect(isNewsStoryShelf(shelf)).toBe(false);
  expect(getNewsPostDiscovery().posts).not.toContain(shelf);
});

test.each(["single", "one-card", "text-only", "no-cards", "hidden"])(
  "requires independent visible preview evidence: %s",
  (missing) => {
    const shelf = mountShelf();
    const links = Array.from(shelf.querySelectorAll("a"));
    if (missing === "single") links.slice(1).forEach((link) => link.parentElement?.remove());
    if (missing === "one-card") {
      const card = requireElement(shelf.querySelector('[data-type="hscroll-child"]'));
      links.slice(1).forEach((link) => card.append(link));
    }
    if (missing === "text-only") shelf.querySelectorAll("img").forEach((image) => image.remove());
    if (missing === "no-cards")
      shelf
        .querySelectorAll('[data-type="hscroll-child"]')
        .forEach((card) => card.removeAttribute("data-type"));
    if (missing === "hidden") links.slice(1).forEach((link) => link.setAttribute("hidden", ""));
    expect(isNewsStoryShelf(shelf)).toBe(false);
  }
);

test("a nonsemantic title and a virtualized body inside an ordinary feed slot match the live ribbon", () => {
  const shelf = mountShelf();
  shelf.removeAttribute("data-virtualized");
  shelf.setAttribute("aria-posinset", "2");
  requireElement(shelf.querySelector("h3")).replaceWith(document.createElement("span"));
  const body = requireElement(shelf.lastElementChild);
  body.setAttribute("data-virtualized", "");
  body.insertAdjacentHTML(
    "afterbegin",
    `<div aria-hidden="true">${"<blockquote>Decoy</blockquote>".repeat(22)}</div>`
  );
  const context = createNewsContext({ options: { NF_STORIES: true } });
  mopNewsFeed(context);
  expect(shelf.getAttribute(postAtt)).toBe(context.keyWords.NF_STORIES);
  expect(body.hasAttribute(postAtt)).toBe(false);
});

test("an ordinary author header prevents preview cards from defining its post as a story ribbon", () => {
  const shelf = mountShelf();
  shelf.insertAdjacentHTML("afterbegin", '<h4><a href="/ordinary-author">Author</a></h4>');
  expect(isNewsStoryShelf(shelf)).toBe(false);
});

test("preview identity equality does not suppress an otherwise complete story ribbon", () => {
  const shelf = mountShelf();
  shelf.querySelectorAll("a").forEach((link) => link.setAttribute("href", "/stories/1/"));
  expect(isNewsStoryShelf(shelf)).toBe(true);
});

test.each(["hidden", 'aria-hidden="true"', 'style="display:none"'])(
  "hidden authored decoys do not veto real preview cards: %s",
  (attribute) => {
    const shelf = mountShelf();
    shelf.insertAdjacentHTML(
      "afterbegin",
      `<div ${attribute}>${"<blockquote>Decoy</blockquote>".repeat(22)}</div>`
    );
    expect(isNewsStoryShelf(shelf)).toBe(true);
    const context = createNewsContext({ options: { NF_STORIES: true } });
    mopNewsFeed(context);
    expect(shelf.getAttribute(postAtt)).toBe(context.keyWords.NF_STORIES);
  }
);

test("a rendered authored block outside the preview cards prevents shelf classification", () => {
  const shelf = mountShelf();
  shelf.insertAdjacentHTML("afterbegin", "<blockquote>Ordinary shared content</blockquote>");
  expect(isNewsStoryShelf(shelf)).toBe(false);
});

test("the exported report retains enough structure to reproduce story shelf detection", async () => {
  const shelf = mountShelf();
  const snapshot = await captureDomSnapshot(document, { target: shelf });
  const region = requireElement(snapshot.regions[0]);
  document.body.replaceChildren();
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  );
  const reconstructed = requireElement(fixture.querySelector(`[data-cmf-node="${region.ref}"]`));
  expect(isNewsStoryShelf(reconstructed)).toBe(true);
  expect(JSON.stringify(snapshot).includes("Private name")).toBe(false);
});

test.each(["p", "blockquote", "article", "message", "nested-post"])(
  "does not hide story previews embedded in ordinary %s content",
  (boundary) => {
    const shelf = mountShelf();
    if (boundary === "p" || boundary === "blockquote") {
      const wrapper = document.createElement(boundary);
      shelf.replaceWith(wrapper);
      wrapper.append(shelf);
    } else if (boundary === "article") {
      requireElement(document.getElementById("before")).append(shelf);
    } else if (boundary === "message") {
      shelf.setAttribute("data-ad-rendering-role", "story_message");
    } else {
      requireElement(shelf.querySelector('[data-type="hscroll-child"]')).setAttribute(
        "role",
        "article"
      );
    }
    expect(isNewsStoryShelf(shelf)).toBe(false);
    expect(getNewsPostDiscovery().posts).not.toContain(shelf);
  }
);

test("a delayed ribbon enters discovery on the next periodic sweep", () => {
  const shelf = mountShelf();
  const parent = requireElement(shelf.parentElement);
  shelf.remove();
  const context = createNewsContext({ options: { NF_STORIES: true, VERBOSITY_LEVEL: "0" } });
  mopNewsFeed(context);
  context.state.forceProcess = false;
  parent.append(shelf);
  context.state.lastNewsPostSweepAt = Date.now() - 751;
  mopNewsFeed(context);
  expect(shelf.getAttribute(postAtt)).toBe(context.keyWords.NF_STORIES);
});

test("a partially hydrated ribbon is reconsidered when another preview arrives", () => {
  const shelf = mountShelf();
  const cards = Array.from(shelf.querySelectorAll('[data-type="hscroll-child"]'));
  cards.slice(1).forEach((card) => card.remove());
  const context = createNewsContext({ options: { NF_STORIES: true, VERBOSITY_LEVEL: "0" } });
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(false);
  shelf.append(requireElement(cards[1]));
  context.state.forceProcess = false;
  context.state.lastNewsPostSweepAt = Date.now() - 751;
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(true);
});

test("a virtualized ribbon recycled into an ordinary post loses its old hide markers", () => {
  const shelf = mountShelf();
  const context = createNewsContext({ options: { NF_STORIES: true, VERBOSITY_LEVEL: "0" } });
  mopNewsFeed(context);
  expect(shelf.hasAttribute(context.state.hideAtt)).toBe(true);
  shelf.innerHTML = "<h4>Ordinary author</h4><p>Ordinary replacement</p>";
  context.state.forceProcess = false;
  context.state.lastNewsPostSweepAt = Date.now() - 751;
  mopNewsFeed(context);
  expect(shelf.hasAttribute(postAtt)).toBe(false);
  expect(shelf.hasAttribute(context.state.hideAtt)).toBe(false);
});
