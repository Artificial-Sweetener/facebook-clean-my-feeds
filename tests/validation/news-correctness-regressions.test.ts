// SPDX-License-Identifier: GPL-3.0-only

import { mainColumnAtt, postAtt, postAttTab } from "../../src/dom/attributes";
import {
  getCollectionOfNewsPosts,
  getNewsPostDiscovery,
  isMetaAiLink,
  mopNewsFeed,
} from "../../src/feeds/news";
import { createMetaAiPromptRow, createNewsContext, requireElement } from "../feeds/news-fixtures";
import { mountNewsPost } from "./news-contract-fixtures";

describe("news audit correctness regressions", () => {
  test.each([
    "https://meta.ai/",
    "https://www.meta.ai/create",
    "https://META.AI/",
    "http://meta.ai/",
    "https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.meta.ai%2Fcreate",
  ])("retains valid Meta AI destinations: %s", (href) => {
    const { post } = mountNewsPost(`<a href="${href}">Create</a>`);
    mopNewsFeed(createNewsContext({ options: { NF_META_AI: true } }));
    expect(post.hasAttribute(postAtt)).toBe(true);
  });

  test.each([
    "https://meta.ai.example.org/review",
    "https://notmeta.ai/",
    "https://meta.ai@ordinary.example/",
    "https://ordinary.example/?q=meta.ai",
    "/notes/meta.ai",
    "javascript:meta.ai",
    "https://l.facebook.com/l.php?u=https%3A%2F%2Fmeta.ai.example.org%2F",
    "https://redirect.example/?u=https%3A%2F%2Fmeta.ai%2F",
    "https://[malformed",
  ])("preserves ordinary posts containing lookalike Meta AI destinations: %s", (href) => {
    const { post } = mountNewsPost(`<h4>Alice</h4><a href="${href}">Article</a>`);
    mopNewsFeed(createNewsContext({ options: { NF_META_AI: true } }));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("does not treat an anchor without a destination as a Meta AI URL", () => {
    expect(isMetaAiLink(document.createElement("a"))).toBe(false);
  });

  test("applies the same URL boundary to side-panel links", () => {
    document.body.innerHTML =
      '<div role="navigation"><ul><li id="ordinary"><a href="https://meta.ai.example.org/">Reference</a></li><li id="ai"><a href="https://meta.ai/">Meta AI</a></li></ul></div><div role="main"></div>';
    const context = createNewsContext({ options: { NF_AI_SIDE_PANELS: true } });
    mopNewsFeed(context);
    expect(
      requireElement(document.getElementById("ordinary")).hasAttribute(context.state.hideAtt)
    ).toBe(false);
    expect(requireElement(document.getElementById("ai")).hasAttribute(context.state.hideAtt)).toBe(
      true
    );
  });

  test("does not promote an already-hidden AI disclosure feature to the parent post", () => {
    const { post } = mountNewsPost(
      `<h4>Alice</h4><p>Ordinary update</p><div ${postAtt}="child"><button>AI info</button></div>`
    );
    mopNewsFeed(createNewsContext({ options: { NF_AI_INFO_POSTS: true } }));
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(requireElement(post.querySelector("[cmfr]")).getAttribute(postAtt)).toBe("child");
  });

  test("still classifies an independent visible AI disclosure beside a hidden child", () => {
    const { post } = mountNewsPost(
      `<div ${postAtt}="child"><button>Other</button></div><button>AI info</button>`
    );
    mopNewsFeed(createNewsContext({ options: { NF_AI_INFO_POSTS: true } }));
    expect(post.hasAttribute(postAtt)).toBe(true);
  });

  test("discovers mixed concrete roots in order and excludes nested comment/article duplicates", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div role="article" id="first"><div role="article" aria-label="Comment" id="comment">Reply</div></div><div aria-posinset="2" id="second"><div role="article" id="shared">Shared content</div></div><div aria-posinset="3" role="article" id="third">Both markers</div></div>';
    expect(getCollectionOfNewsPosts().map((post) => post.id)).toEqual(["first", "second", "third"]);
    expect(getNewsPostDiscovery().query).toContain(",");
  });

  test("classifies eligible posts from both independent concrete layouts", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div role="article" id="first"><button>AI info</button></div><div aria-posinset="2" id="second"><button>AI info</button></div></div>';
    mopNewsFeed(createNewsContext({ options: { NF_AI_INFO_POSTS: true } }));
    expect(requireElement(document.getElementById("first")).hasAttribute(postAtt)).toBe(true);
    expect(requireElement(document.getElementById("second")).hasAttribute(postAtt)).toBe(true);
  });

  test.each(["0", "1", "2"])("restores a recycled ordinary post at verbosity %s", (verbosity) => {
    const { post } = mountNewsPost("<button>AI info</button>");
    const context = createNewsContext({
      options: { NF_AI_INFO_POSTS: true, VERBOSITY_LEVEL: verbosity, VERBOSITY_DEBUG: true },
    });
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    post.innerHTML = "<h4>Alice</h4><p>Replacement ordinary post</p>";
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(post.hasAttribute(context.state.showAtt)).toBe(false);
    expect(post.closest(`details[${postAtt}]`)).toBeNull();
    expect(post.querySelector(`h6[${postAttTab}]`)).toBeNull();
    expect(post.textContent).toBe("AliceReplacement ordinary post");
  });

  test("detects equal-length recycled content on the next periodic sweep", () => {
    const { post, main } = mountNewsPost("<button>AI info</button>");
    const context = createNewsContext({ options: { NF_AI_INFO_POSTS: true } });
    mopNewsFeed(context);
    const beforeLength = main.innerHTML.length;
    post.innerHTML = "<button>My info</button>";
    expect(main.innerHTML.length).toBe(beforeLength);
    expect(Number(main.getAttribute(mainColumnAtt))).toBe(beforeLength);
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("removes stale markers even when a recycled root becomes empty", () => {
    const { post } = mountNewsPost("<button>AI info</button>");
    const context = createNewsContext({ options: { NF_AI_INFO_POSTS: true } });
    mopNewsFeed(context);
    post.replaceChildren();
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("reclassifies replacement filtered content with its current reason", () => {
    const { post } = mountNewsPost("<button>AI info</button>");
    const context = createNewsContext({ options: { NF_AI_INFO_POSTS: true, NF_STORIES: true } });
    mopNewsFeed(context);
    post.innerHTML = '<a href="/stories/123?source=from_feed">Story</a>';
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.NF_STORIES);
  });

  test("does not react to CMF root-marker changes or duplicate its own caption", () => {
    const { post } = mountNewsPost("<button>AI info</button>");
    const context = createNewsContext({
      options: { NF_AI_INFO_POSTS: true, VERBOSITY_DEBUG: true },
    });
    mopNewsFeed(context);
    const before = post.innerHTML;
    post.removeAttribute(context.state.showAtt);
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.innerHTML).toBe(before);
    expect(post.querySelectorAll(`h6[${postAttTab}]`)).toHaveLength(1);
    expect(post.hasAttribute(context.state.showAtt)).toBe(false);
  });

  test("restores a recycled virtualized orphan even after its ad link disappears", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div data-virtualized="true" id="orphan"><a href="/ads/about/">Sponsored</a></div></div>';
    const post = requireElement(document.getElementById("orphan"));
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    post.innerHTML = "<p>Now an ordinary virtualized card</p>";
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test.each(["role", "position"])(
    "hides only prompt rows inside a linkless %s post",
    (rootType) => {
      document.body.innerHTML = '<div role="navigation"></div><div role="main"></div>';
      const main = requireElement(document.querySelector('[role="main"]'));
      const post = document.createElement("div");
      post.setAttribute(
        rootType === "role" ? "role" : "aria-posinset",
        rootType === "role" ? "article" : "1"
      );
      post.innerHTML = "<h4>Alice</h4><p>Unrelated linkless post text</p>";
      const { outer } = createMetaAiPromptRow();
      post.append(outer);
      main.append(post);
      const context = createNewsContext({ options: { NF_META_AI_PROMPTS: true } });
      mopNewsFeed(context);
      expect(outer.hasAttribute(postAtt)).toBe(true);
      expect(post.hasAttribute(postAtt)).toBe(false);
      expect(post.textContent).toContain("Unrelated linkless post text");
    }
  );

  test("preserves unrelated linkless text beside a prompt strip without concrete post markers", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div id="wrapper"><p>Ordinary paragraph</p></div></div>';
    const wrapper = requireElement(document.getElementById("wrapper"));
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    wrapper.append(outer);
    mopNewsFeed(createNewsContext({ options: { NF_META_AI_PROMPTS: true } }));
    expect(outer.hasAttribute(postAtt)).toBe(true);
    expect(wrapper.hasAttribute(postAtt)).toBe(false);
  });
});
