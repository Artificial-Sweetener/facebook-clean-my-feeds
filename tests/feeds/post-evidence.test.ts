// SPDX-License-Identifier: GPL-3.0-only

import { clearDirtyTracking, hasPostChanged, trackPostSignature } from "../../src/dom/dirty-check";
import { pruneContentVersions } from "../../src/dom/content-version";
import { getPostEvidence } from "../../src/dom/post-evidence";
import { extractTextContent } from "../../src/dom/walker";
import { isSponsored } from "../../src/feeds/shared/sponsored";
import {
  isNewsAiInfoPost,
  isNewsFollow,
  isNewsParticipate,
  isNewsVerifiedBadge,
  isNewsSuggested,
  isNewsMetaAICard,
} from "../../src/feeds/news";
import { disclosureLabels } from "../../src/i18n/disclosure-labels";
import { newsLabels } from "../../src/i18n/news-labels";
import { createNewsContext, requireElement } from "./news-fixtures";

const trackingHref = `/publisher?__cft__[0]=${"a".repeat(360)}`;
const keywords = createNewsContext().keyWords;

/** Mount an owned semantic header and message with any number of unrelated layout wrappers. */
function mountPost(header: string, depth = 0): HTMLElement {
  document.body.innerHTML = `<div aria-posinset="1" id="post">${"<div><i hidden>Decoy</i>".repeat(depth)}<section><div><h4><a data-ad-rendering-role="profile_name" href="/publisher">Publisher</a>${header}</h4></div><div data-ad-rendering-role="story_message"><p>Ordinary update</p></div></section>${"</div>".repeat(depth)}</div>`;
  return requireElement(document.getElementById("post"));
}

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
  document.documentElement.removeAttribute("lang");
  jest.restoreAllMocks();
});

describe("post evidence transformations", () => {
  test.each([0, 1, 6, 12, 24])(
    "wrapper depth %s preserves independent metadata signals",
    (depth) => {
      const post = mountPost(
        `<a href="${trackingHref}"><span>Spon</span><span hidden>decoy</span><span>sored</span></a><button><span>Fol</span><span>low</span></button><svg aria-label="Verified account"></svg>`,
        depth
      );
      expect(isSponsored(post, { isNF: true })).toBe(true);
      expect(isNewsFollow(post, keywords)).toBe(keywords.NF_FOLLOW);
      expect(isNewsVerifiedBadge(post, keywords)).toBe(keywords.NF_FILTER_VERIFIED_BADGE);
    }
  );

  test.each([
    "p",
    "blockquote",
    'div role="comment"',
    'div role="article"',
    'div data-ad-preview="message"',
  ])("rejects copied metadata inside %s", (wrapper) => {
    const post = mountPost("");
    const tag = wrapper.split(" ")[0];
    const region = document.createElement(tag || "div");
    const heading = document.createElement("h4");
    heading.innerHTML = `<a href="${trackingHref}">Sponsored</a><button>Follow</button><button>AI info</button>`;
    for (const attribute of wrapper
      .slice((tag || "").length)
      .trim()
      .matchAll(/([\w-]+)="([^"]*)"/g))
      region.setAttribute(attribute[1] || "", attribute[2] || "");
    region.append(heading);
    post.append(region);
    expect(isSponsored(post, { isNF: true })).toBe(false);
    expect(isNewsFollow(post, keywords)).toBe("");
    expect(isNewsAiInfoPost(post, keywords)).toBe("");
  });

  test("tracks missing, replaced and edited shared graphic labels, including equal-length changes", () => {
    const post = mountPost(
      `<a href="${trackingHref}"><span aria-labelledby="shared"><svg></svg></span></a>`
    );
    expect(isSponsored(post, { isNF: true })).toBe(false);
    document.body.insertAdjacentHTML("beforeend", '<span id="shared">Ad</span>');
    expect(isSponsored(post, { isNF: true })).toBe(true);
    trackPostSignature(post);
    const label = requireElement(document.getElementById("shared"));
    label.textContent = "No";
    expect(hasPostChanged(post)).toBe(true);
    expect(isSponsored(post, { isNF: true })).toBe(false);
    label.outerHTML = '<span id="shared">広告</span>';
    expect(isSponsored(post, { isNF: true })).toBe(true);
    document.getElementById("shared")?.remove();
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("recycled controls invalidate queries, visible text, names and destinations synchronously", () => {
    const post = mountPost(`<a id="disclosure" href="${trackingHref}">Sponsored</a>`);
    expect(isSponsored(post, { isNF: true })).toBe(true);
    const control = requireElement(document.getElementById("disclosure"));
    control.setAttribute("href", "/ordinary");
    expect(isSponsored(post, { isNF: true })).toBe(false);
    control.setAttribute("href", trackingHref);
    control.textContent = "Community";
    expect(isSponsored(post, { isNF: true })).toBe(false);
    control.textContent = "Sponsored";
    expect(isSponsored(post, { isNF: true })).toBe(true);
    control.remove();
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("shares DOM queries and style reads across stable repeated classifications", () => {
    const post = mountPost(`<a href="${trackingHref}"><span>Spon</span><span>sored</span></a>`);
    expect(isSponsored(post, { isNF: true })).toBe(true);
    const queries = jest.spyOn(Element.prototype, "querySelectorAll");
    const styles = jest.spyOn(window, "getComputedStyle");
    const html = jest.spyOn(Element.prototype, "innerHTML", "get");
    for (let scan = 0; scan < 20; scan++) expect(isSponsored(post, { isNF: true })).toBe(true);
    expect(queries).not.toHaveBeenCalled();
    expect(styles).not.toHaveBeenCalled();
    expect(html).not.toHaveBeenCalled();
  });

  test("bounds pathological label traversal without using a partial prefix as evidence", () => {
    const post = mountPost(
      `<a href="${trackingHref}">Sponsored${"<span> </span>".repeat(500)}</a>`
    );
    const styles = jest.spyOn(window, "getComputedStyle");
    expect(isSponsored(post, { isNF: true })).toBe(false);
    expect(styles.mock.calls.length).toBeLessThanOrEqual(128);
  });

  test("a newly marked nested feature invalidates its parent's cached evidence", () => {
    const post = mountPost(`<div id="feature"><a href="${trackingHref}">Sponsored</a></div>`);
    expect(isSponsored(post, { isNF: true })).toBe(true);
    document.getElementById("feature")?.setAttribute("cmfr", "child feature");
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test.each(["hidden", 'aria-hidden="true"', 'style="display:none"'])(
    "concealed metadata cannot supply a label through %s",
    (concealment) => {
      const post = mountPost(
        `<span ${concealment}><a href="${trackingHref}" aria-label="Sponsored"></a><button aria-label="Follow"></button><button aria-label="AI info"></button><svg aria-label="Verified account"></svg></span>`
      );
      expect(isSponsored(post, { isNF: true })).toBe(false);
      expect(isNewsFollow(post, keywords)).toBe("");
      expect(isNewsAiInfoPost(post, keywords)).toBe("");
      expect(isNewsVerifiedBadge(post, keywords)).toBe("");
    }
  );

  test("media load events refresh cached image descriptions without a DOM mutation", () => {
    const post = mountPost("");
    const body = requireElement(post.querySelector('[data-ad-rendering-role="story_message"]'));
    const image = document.createElement("img");
    image.alt = "Loaded image description";
    const imageWrapper = document.createElement("span");
    imageWrapper.append(image);
    body.append(imageWrapper);
    const selector = '[data-ad-rendering-role="story_message"]';
    expect(extractTextContent(post, selector, 1)).not.toContain(image.alt);
    Object.defineProperty(image, "naturalWidth", { value: 100 });
    image.dispatchEvent(new Event("load"));
    expect(extractTextContent(post, selector, 1)).toContain(image.alt);
  });

  test("moving a post into a new wrapper refreshes ancestor-dependent facts", () => {
    const post = mountPost("");
    const previous = getPostEvidence(post);
    const wrapper = document.createElement("div");
    document.body.append(wrapper);
    wrapper.append(post);
    expect(getPostEvidence(post)).not.toBe(previous);
  });

  test("prunes detached subscriptions and establishes fresh evidence when a post is reattached", () => {
    const post = mountPost(`<a href="${trackingHref}">Sponsored</a>`);
    const previous = getPostEvidence(post);
    post.remove();
    pruneContentVersions();
    post.querySelector("a[href*='__cft__']")?.replaceChildren(document.createTextNode("Community"));
    document.body.append(post);
    expect(getPostEvidence(post)).not.toBe(previous);
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });
});

describe("language-independent semantic evidence", () => {
  test.each(Object.entries(disclosureLabels))(
    "recognizes %s labels with unrelated settings copy",
    (locale, labels) => {
      const post = mountPost(
        `<a href="${trackingHref}"><span aria-labelledby="shared"><svg></svg></span></a><button aria-label="${labels[1].split("|")[0]}"></button>`
      );
      document.documentElement.lang = locale;
      document.body.insertAdjacentHTML(
        "beforeend",
        `<span id="shared">${labels[0].split("|")[0]}</span>`
      );
      expect(isSponsored(post, { isNF: true })).toBe(true);
      expect(isNewsAiInfoPost(post, { NF_AI_INFO_POSTS: "Reason in another language" })).toBe(
        "Reason in another language"
      );
      post
        .querySelector("h4")
        ?.insertAdjacentHTML("beforeend", `<a aria-label="${labels[2].split("|")[0]}"></a>`);
      expect(isNewsMetaAICard(post, keywords)).toBe(keywords.NF_META_AI);
    }
  );

  test.each(Object.entries(newsLabels))(
    "retains %s actions, suggestions and badge labels under wrappers",
    (_locale, labels) => {
      const post = mountPost(
        `<button>${labels[0].split("|")[0]}</button><svg aria-label="${labels[2].split("|")[0]}"></svg>`,
        4
      );
      expect(isNewsFollow(post, keywords)).toBe(keywords.NF_FOLLOW);
      expect(isNewsVerifiedBadge(post, keywords)).toBe(keywords.NF_FILTER_VERIFIED_BADGE);
      post
        .querySelector("h4")
        ?.insertAdjacentHTML(
          "beforeend",
          `<a href="/groups/community">Group</a><button>${labels[1].split("|")[0]}</button>`
        );
      expect(isNewsParticipate(post, keywords)).toBe(keywords.NF_PARTICIPATE);
      post
        .querySelector("section > div")
        ?.insertAdjacentHTML("afterbegin", `<h3>${labels[3].split("|")[0]}</h3>`);
      expect(isNewsSuggested(post, null, keywords)).toBe(keywords.NF_SUGGESTIONS);
    }
  );
});
