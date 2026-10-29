// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountSvgDisclosure } from "./svg-disclosure-fixtures";

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
});

test("two ads sharing definitions in their feed do not invalidate each other's captions forever", () => {
  const first = mountSvgDisclosure();
  const second = first.cloneNode(true);
  if (!(second instanceof Element)) throw new Error("Post clone must retain element identity");
  second.removeAttribute("id");
  for (const element of second.querySelectorAll("[id]")) element.removeAttribute("id");
  second.setAttribute("aria-posinset", "2");
  const main = requireElement(first.parentElement);
  main.append(second, requireElement(document.getElementById("definitions")));
  const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
  mopNewsFeed(context);
  const wrappers = [first.parentElement, second.parentElement];
  const observer = new MutationObserver(() => {});
  observer.observe(main, { subtree: true, childList: true });
  for (let index = 0; index < 12; index++) {
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(first.parentElement).toBe(wrappers[0]);
    expect(second.parentElement).toBe(wrappers[1]);
  }
  expect(observer.takeRecords()).toHaveLength(0);
  observer.disconnect();
});

test("debug mini captions are updated once and cannot keep an ordinary replacement filtered", () => {
  document.body.innerHTML =
    '<div role="navigation"></div><div role="main"><div aria-posinset="1"><button>AI info</button></div></div>';
  const post = requireElement(document.querySelector("[aria-posinset]"));
  const context = createNewsContext({ options: { NF_AI_INFO_POSTS: true, VERBOSITY_DEBUG: true } });
  mopNewsFeed(context);
  const caption = requireElement(post.querySelector("h6"));
  for (let index = 0; index < 4; index++) {
    requireElement(post.querySelector("button")).setAttribute("data-render-version", String(index));
    mopNewsFeed(context);
    expect(post.querySelectorAll("h6")).toHaveLength(1);
    expect(post.querySelector("h6")).toBe(caption);
  }
  requireElement(post.querySelector("button")).remove();
  mopNewsFeed(context);
  expect(post.querySelector("h6")).toBeNull();
  expect(post.hasAttribute(postAtt)).toBe(false);
  expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
});

test.each([false, true])(
  "SVG ad captions retain their identity and open=%s across live updates",
  (open) => {
    const post = mountSvgDisclosure();
    const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
    mopNewsFeed(context);
    const wrapper = requireElement(post.parentElement);
    wrapper.toggleAttribute("open", open);
    const observer = new MutationObserver(() => {});
    observer.observe(wrapper.parentNode || document, { subtree: true, childList: true });
    for (let index = 0; index < 8; index++) {
      requireElement(document.getElementById("disclosure")).setAttribute(
        "data-render-version",
        String(index)
      );
      requireElement(document.getElementById("message")).textContent = `Authored update ${index}`;
      context.state.forceProcess = true;
      mopNewsFeed(context);
      expect(post.parentElement).toBe(wrapper);
      expect(wrapper.hasAttribute("open")).toBe(open);
      expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    }
    expect(
      observer.takeRecords().some((record) => [...record.removedNodes].includes(wrapper))
    ).toBe(false);
    observer.disconnect();
  }
);

test("a changing rule updates one caption without replacing the post or its disclosure control", () => {
  document.body.innerHTML =
    '<div role="navigation"></div><div role="main"><div aria-posinset="1"><h4><a href="/publisher">Publisher</a><button>Follow</button></h4><div data-ad-rendering-role="story_message">Body</div></div></div>';
  const post = requireElement(document.querySelector("[aria-posinset]"));
  const context = createNewsContext({
    options: { NF_FOLLOW: true, NF_SPONSORED: true, VERBOSITY_LEVEL: "1" },
  });
  mopNewsFeed(context);
  const wrapper = requireElement(post.parentElement);
  wrapper.setAttribute("open", "");
  requireElement(post.querySelector("h4")).innerHTML = '<a href="/ads/about/">Sponsored</a>';
  mopNewsFeed(context);
  expect(post.parentElement).toBe(wrapper);
  expect(wrapper.hasAttribute("open")).toBe(true);
  expect(wrapper.querySelector("summary")?.textContent).toContain(context.keyWords.SPONSORED);
  expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  expect(post.textContent).toContain("Body");
});

test.each(["ordinary", "empty", "orphan"])(
  "recycled %s content loses its old caption and filtering markers",
  (replacement) => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div id="before"></div><div id="post" aria-posinset="1" data-virtualized="true"><h4><a href="/ads/about/">Sponsored</a></h4></div><div id="after"></div></div>';
    const post = requireElement(document.getElementById("post"));
    if (replacement === "orphan") post.removeAttribute("aria-posinset");
    const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
    mopNewsFeed(context);
    expect(post.parentElement?.localName).toBe("details");
    if (replacement === "empty") post.removeAttribute("data-virtualized");
    post.innerHTML = replacement === "empty" ? "" : "<p>Ordinary replacement</p>";
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(post.parentElement?.getAttribute("role")).toBe("main");
    expect(post.previousElementSibling?.id).toBe("before");
    expect(post.nextElementSibling?.id).toBe("after");
    expect(document.querySelector(`details[${postAtt}]`)).toBeNull();
  }
);

test.each(["0", "1"])(
  "virtualized unload/reload retains filtering at verbosity %s until real content returns",
  (verbosity) => {
    const post = mountSvgDisclosure();
    const context = createNewsContext({
      options: { NF_SPONSORED: true, VERBOSITY_LEVEL: verbosity },
    });
    mopNewsFeed(context);
    const parent = post.parentElement;
    const loaded = post.innerHTML;
    for (let index = 0; index < 5; index++) {
      post.innerHTML =
        index % 2
          ? '<div><div data-virtualized="true"><div></div><span><!-- unloaded --></span></div></div>'
          : '<div data-virtualized="true"></div>';
      context.state.forceProcess = true;
      mopNewsFeed(context);
      expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      expect(post.parentElement).toBe(parent);
      post.innerHTML = loaded;
      mopNewsFeed(context);
      expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      expect(post.parentElement).toBe(parent);
    }
    post.innerHTML = '<div data-virtualized="false"><p>New ordinary content</p></div>';
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(post.parentElement?.getAttribute("role")).toBe("main");
  }
);

test.each([
  '<div data-virtualized="true">Ordinary text</div>',
  '<div data-virtualized="true"><img alt="Ordinary image"></div>',
  '<div data-virtualized="true"></div><p>Ordinary sibling</p>',
  '<div data-virtualized="true"></div>Ordinary direct text',
  '<div data-virtualized="false"></div>',
  '<div><div data-virtualized="true"><div role="img" aria-label="Ordinary image"></div></div></div>',
  '<div><div data-virtualized="true"><svg></svg></div></div>',
  '<div><div data-virtualized="true"><button aria-label="Ordinary action"></button></div></div>',
  `<div data-virtualized="true">${"<div></div>".repeat(70)}</div>`,
])("virtualization flags cannot keep real ordinary content hidden: %s", (replacement) => {
  const post = mountSvgDisclosure();
  const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
  mopNewsFeed(context);
  post.innerHTML = replacement;
  mopNewsFeed(context);
  expect(post.hasAttribute(postAtt)).toBe(false);
  expect(post.parentElement?.getAttribute("role")).toBe("main");
});
