// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../../src/core/options/types";
import { postAtt, postAttChildFlag } from "../../src/dom/attributes";
import {
  findTopCardsForPagesContainer,
  getSidePanelAiTargets,
  getStoriesParent,
  mopNewsFeed,
} from "../../src/feeds/news";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Layout options mutate individual feature nodes rather than classify every post. */
type LayoutOption =
  | "NF_TABLIST_STORIES_REELS_ROOMS"
  | "NF_SURVEY"
  | "NF_TOP_CARDS_PAGES"
  | "NF_HIDE_VERIFIED_BADGE"
  | "NF_AI_SIDE_PANELS";

/** Construct the legacy tab strip depth while identifying precisely the four-level hide ancestor. */
function tabStrip() {
  return (
    Array.from({ length: 7 }, (_, index) => (index === 3 ? '<div id="target">' : "<div>")).join(
      ""
    ) +
    '<div role="tablist"><span role="tab">Stories</span><span role="tab">Reels</span></div>' +
    "</div>".repeat(7)
  );
}

/** Mount a feature beside an ordinary post; sidebars are kept outside the main feed boundary. */
function mountLayout(option: LayoutOption) {
  const markup: Record<LayoutOption, string> = {
    NF_TABLIST_STORIES_REELS_ROOMS: tabStrip(),
    NF_SURVEY:
      '<div id="target"><div><div><div style="border-radius:8px"><a href="/survey/?session=example"><div role="none">Take survey</div></a></div></div></div></div>',
    NF_TOP_CARDS_PAGES:
      '<div id="target" role="region" aria-label="profile plus top of feed cards"><a href="/stories/">Stories</a><a href="/reel/">Reels</a></div>',
    NF_HIDE_VERIFIED_BADGE:
      '<div role="article"><h4><a href="/example">Example</a><span id="badge-wrapper"><svg id="target" aria-label="Verified account"></svg></span></h4></div>',
    NF_AI_SIDE_PANELS: "",
  };
  document.body.innerHTML = `<div role="navigation">${option === "NF_AI_SIDE_PANELS" ? '<ul><li id="target"><a href="https://www.meta.ai/">Meta AI</a></li><li id="nav-neighbor">Friends</li></ul>' : ""}</div><div role="main">${markup[option]}<div aria-posinset="1" id="ordinary"><h4><a href="/alice">Alice</a></h4><p>Weekend photos</p></div></div>`;
  return requireElement(document.getElementById("target"));
}

/** Identify the observable mutation for each feature, including badge-specific styling. */
function isCollapsed(target: Element, option: LayoutOption) {
  return option === "NF_HIDE_VERIFIED_BADGE" || option === "NF_AI_SIDE_PANELS"
    ? target.getAttribute("style")?.includes("display: none") === true
    : target.hasAttribute(postAtt);
}

const options: readonly LayoutOption[] = [
  "NF_TABLIST_STORIES_REELS_ROOMS",
  "NF_SURVEY",
  "NF_TOP_CARDS_PAGES",
  "NF_HIDE_VERIFIED_BADGE",
  "NF_AI_SIDE_PANELS",
];

describe.each(options)("news layout option %s", (option) => {
  test("collapses its supported feature without hiding the ordinary neighboring post", () => {
    const target = mountLayout(option);
    const enabled: Partial<HydratedOptions> = { [option]: true };
    mopNewsFeed(createNewsContext({ options: enabled }));
    expect(isCollapsed(target, option)).toBe(true);
    expect(requireElement(document.getElementById("ordinary")).hasAttribute(postAtt)).toBe(false);
    expect(requireElement(document.querySelector('[role="main"]')).hasAttribute(postAtt)).toBe(
      false
    );
  });

  test("does not collapse its feature when disabled", () => {
    const target = mountLayout(option);
    mopNewsFeed(createNewsContext());
    expect(isCollapsed(target, option)).toBe(false);
  });

  test("finds a feature inserted after the first feed pass", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><p>Feed loading</p></div>';
    const enabled: Partial<HydratedOptions> = { [option]: true };
    const context = createNewsContext({ options: enabled });
    mopNewsFeed(context);
    const target = mountLayout(option);
    mopNewsFeed(context);
    expect(isCollapsed(target, option)).toBe(true);
  });
});

describe("news layout boundaries", () => {
  test.each(["0", "1", "2"])("does not duplicate survey captions at verbosity %s", (verbosity) => {
    mountLayout("NF_SURVEY");
    const context = createNewsContext({
      options: { NF_SURVEY: true, VERBOSITY_LEVEL: verbosity, VERBOSITY_DEBUG: true },
    });
    mopNewsFeed(context);
    const initialMarkup = document.body.innerHTML;
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(document.body.innerHTML).toBe(initialMarkup);
    expect(document.querySelectorAll(`details[${postAtt}]`)).toHaveLength(
      verbosity === "0" ? 0 : 1
    );
  });

  test("does not wrap a survey inside an independently hidden feature", () => {
    const target = mountLayout("NF_SURVEY");
    target.setAttribute(postAtt, "another filter");
    mopNewsFeed(createNewsContext({ options: { NF_SURVEY: true, VERBOSITY_LEVEL: "1" } }));
    expect(target.getAttribute(postAtt)).toBe("another filter");
    expect(document.querySelectorAll(`details[${postAtt}]`)).toHaveLength(0);
  });

  test("retains the survey child-marker guard even when its wrapper has been reparented", () => {
    const target = mountLayout("NF_SURVEY");
    requireElement(target.querySelector('[role="none"]')).setAttribute(postAttChildFlag, "Survey");
    mopNewsFeed(createNewsContext({ options: { NF_SURVEY: true, VERBOSITY_LEVEL: "1" } }));
    expect(target.hasAttribute(postAtt)).toBe(false);
    expect(document.querySelectorAll(`details[${postAtt}]`)).toHaveLength(0);
  });

  test("uses the create-story fallback when the tab strip is absent", () => {
    const wrappers = Array.from({ length: 8 }, (_, index) =>
      index === 1 ? '<div id="target">' : "<div>"
    ).join("");
    document.body.innerHTML = `<div role="navigation"></div><div role="main">${wrappers}<a href="/stories/create/">Create story</a>${"</div>".repeat(8)}</div>`;
    const context = createNewsContext({ options: { NF_TABLIST_STORIES_REELS_ROOMS: true } });
    mopNewsFeed(context);
    expect(requireElement(document.getElementById("target")).hasAttribute(postAtt)).toBe(true);
    expect(
      requireElement(document.querySelector('a[href="/stories/create/"]')).getAttribute(
        postAttChildFlag
      )
    ).toBe("1");
  });

  test("uses the labelled-region ancestry for a multi-story strip", () => {
    document.body.innerHTML =
      '<div id="target"><div><div><div><div role="region" aria-label="Stories"><div><div><div><a id="create" href="/stories/create/">Create</a><a href="/stories/123/">Friend story</a></div></div></div></div></div></div></div></div>';
    expect(getStoriesParent(document.getElementById("create"))).toBe(
      document.getElementById("target")
    );
  });

  test("keeps plain Stories and Survey wording in ordinary posts untouched", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div role="article" id="ordinary"><p>Stories, Reels, Survey, Meta AI, Manus AI and verified badges</p><a href="/stories/">Stories</a><a href="/reel/">Reels</a></div></div>';
    mopNewsFeed(
      createNewsContext({
        options: {
          NF_TABLIST_STORIES_REELS_ROOMS: true,
          NF_SURVEY: true,
          NF_TOP_CARDS_PAGES: true,
          NF_HIDE_VERIFIED_BADGE: true,
          NF_AI_SIDE_PANELS: true,
        },
      })
    );
    expect(requireElement(document.getElementById("ordinary")).hasAttribute(postAtt)).toBe(false);
  });

  test("falls back to a shared top-cards region and then to a common wrapper", () => {
    document.body.innerHTML =
      '<div role="main"><div id="cards" role="region"><a href="/stories/">Stories</a><div><a href="/reel/">Reels</a></div></div></div>';
    const main = requireElement(document.querySelector('[role="main"]'));
    const cards = requireElement(document.getElementById("cards"));
    expect(findTopCardsForPagesContainer(main)).toBe(cards);
    cards.removeAttribute("role");
    expect(findTopCardsForPagesContainer(main)).toBe(cards);
  });

  test("will not collapse the main feed just because its separate children contain story and reel links", () => {
    document.body.innerHTML =
      '<div role="main"><div><a href="/stories/">Stories</a></div><div><a href="/reel/">Reels</a></div></div>';
    expect(findTopCardsForPagesContainer(document.querySelector('[role="main"]'))).toBeNull();
    expect(findTopCardsForPagesContainer(null)).toBeNull();
  });

  test("requires both fallback top-card destinations", () => {
    document.body.innerHTML =
      '<div role="main"><div role="region"><a href="/stories/">Stories</a></div></div>';
    expect(findTopCardsForPagesContainer(document.querySelector('[role="main"]'))).toBeNull();
  });

  test("marks the exact tablist child to avoid repeating caption insertion", () => {
    mountLayout("NF_TABLIST_STORIES_REELS_ROOMS");
    const context = createNewsContext({
      options: { NF_TABLIST_STORIES_REELS_ROOMS: true, VERBOSITY_LEVEL: "1" },
    });
    mopNewsFeed(context);
    const tablist = requireElement(document.querySelector('[role="tablist"]'));
    expect(tablist.getAttribute(postAttChildFlag)).toBe("tablist");
    const before = document.body.innerHTML;
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(document.body.innerHTML).toBe(before);
  });

  test("does not climb beyond a detached create-story link", () => {
    const link = document.createElement("a");
    link.href = "/stories/create/";
    expect(getStoriesParent(link)).toBeNull();
    expect(getStoriesParent(null)).toBeNull();
  });

  test("preserves an interactive verified-badge wrapper and the author link", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div role="article"><h4><span id="author"><a href="/alice">Alice</a><svg id="badge" aria-label="Verified"></svg></span></h4></div></div>';
    mopNewsFeed(createNewsContext({ options: { NF_HIDE_VERIFIED_BADGE: true } }));
    expect(requireElement(document.getElementById("badge")).getAttribute("style")).toContain(
      "display: none"
    );
    expect(requireElement(document.getElementById("author")).getAttribute("style")).toBeNull();
    expect(
      requireElement(document.querySelector('a[href="/alice"]')).getAttribute("style")
    ).toBeNull();
  });

  test("hides badges in dialog post headers when the main feed is dirty", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"></div><div role="dialog"><div role="article"><h5><svg id="badge" role="img"><title>Verified account</title></svg></h5></div></div>';
    mopNewsFeed(createNewsContext({ options: { NF_HIDE_VERIFIED_BADGE: true } }));
    expect(requireElement(document.getElementById("badge")).getAttribute("style")).toContain(
      "display: none"
    );
  });

  test("deduplicates Meta AI navigation targets and preserves non-AI neighbors", () => {
    document.body.innerHTML =
      '<div role="navigation"><ul><li id="ai"><a href="https://www.meta.ai/">Meta AI</a><a href="https://www.meta.ai/create">Create</a></li><li id="person">AI researcher</li><li id="manus">Manus AI</li></ul></div><div role="complementary"><ul><li id="thread"><a href="/messages/t/36327,2227039302/">Assistant</a></li><li id="contact">Alice</li></ul></div>';
    expect(getSidePanelAiTargets().map((target) => target.id)).toEqual(["ai", "manus", "thread"]);
  });
});
