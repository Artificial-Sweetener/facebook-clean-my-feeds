// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking, isElementDirty } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { createMetaAiPromptRow, createNewsContext, requireElement } from "./news-fixtures";

describe("News idle work and virtualized mutation delivery", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1000 });
    document.body.innerHTML = '<div role="navigation"></div><div role="main"></div>';
  });
  afterEach(() => {
    clearDirtyTracking();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.replaceChildren();
  });

  test("idle ticks never serialize a stable feed, including hidden posts and prompt rows", async () => {
    const root = requireElement(document.querySelector('[role="main"]'));
    const context = createNewsContext({
      options: { NF_SPONSORED: true, NF_META_AI_PROMPTS: true },
    });
    root.innerHTML =
      '<div aria-posinset="1"><a href="/ads/about/">Sponsored</a><p>Original</p></div>';
    root.append(createMetaAiPromptRow().outer);
    mopNewsFeed(context);
    await Promise.resolve();
    mopNewsFeed(context);
    await Promise.resolve();
    const read = jest.spyOn(Element.prototype, "innerHTML", "get");
    for (let index = 0; index < 100; index += 1) expect(mopNewsFeed(context)).toBeNull();
    expect(read).not.toHaveBeenCalled();
    expect(isElementDirty(root)).toBe(false);
  });

  test("same-turn equal-length replacement restores an ordinary recycled hidden post", () => {
    const root = requireElement(document.querySelector('[role="main"]'));
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    root.innerHTML = '<div aria-posinset="1"><a href="/ads/about/">Sponsored</a></div>';
    const post = requireElement(root.firstElementChild);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
    post.innerHTML = '<a href="/ordinary1/">Community</a>';
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(root.contains(post)).toBe(true);
  });

  test("attribute-only and text-node changes reach the next scan without a child-list mutation", async () => {
    const root = requireElement(document.querySelector('[role="main"]'));
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    root.innerHTML = '<div aria-posinset="1"><a href="/community/">Community</a></div>';
    const link = requireElement(root.querySelector("a"));
    const post = requireElement(link.parentElement);
    mopNewsFeed(context);
    await Promise.resolve();
    mopNewsFeed(context);
    link.setAttribute("href", "/ads/about/");
    const text = requireElement(link.firstChild);
    text.nodeValue = "Sponsored";
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);
  });

  test("hosts without observers keep serialized-size fallback and periodic discovery", () => {
    const original = Object.getOwnPropertyDescriptor(globalThis, "MutationObserver");
    if (!original) throw new Error("Expected the fixture observer capability");
    Reflect.deleteProperty(globalThis, "MutationObserver");
    try {
      const root = requireElement(document.querySelector('[role="main"]'));
      const context = createNewsContext({ options: { NF_SPONSORED: true } });
      root.innerHTML = '<div aria-posinset="1">Ordinary content</div>';
      mopNewsFeed(context);
      expect(mopNewsFeed(context)).toBeNull();
      root.innerHTML = '<div aria-posinset="2"><a href="/ads/about/">Sponsored</a></div>';
      mopNewsFeed(context);
      expect(root.querySelector(`[${postAtt}]`)).not.toBeNull();
    } finally {
      Object.defineProperty(globalThis, "MutationObserver", original);
    }
  });

  test("repeated no-caption filtering settles instead of feeding its own observer", async () => {
    const root = requireElement(document.querySelector('[role="main"]'));
    root.append(createMetaAiPromptRow().outer);
    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true, VERBOSITY_DEBUG: true },
    });
    mopNewsFeed(context);
    await Promise.resolve();
    mopNewsFeed(context);
    await Promise.resolve();
    expect(isElementDirty(root)).toBe(false);
    jest.advanceTimersByTime(800);
    expect(mopNewsFeed(context)).not.toBeNull();
    await Promise.resolve();
    expect(isElementDirty(root)).toBe(false);
  });
});
