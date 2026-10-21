// SPDX-License-Identifier: GPL-3.0-only

import {
  isNewsMetaAICard,
  isNewsPaidPartnership,
  isNewsStoriesPost,
} from "../../src/feeds/news-detectors";
import { catalog } from "../../src/i18n/locales/en";
import { requireShared, sharedContentPost, sharedPost } from "./shared-fixtures";

const disclosures = [
  {
    name: "partnership",
    markup:
      '<span dir="auto"><span id="disclosure"><a href="/business/help/123">Disclosure</a></span></span>',
    classify: isNewsPaidPartnership,
    reason: catalog.NF_PAID_PARTNERSHIP,
  },
  {
    name: "story",
    markup: '<a href="/stories/123/?source=from_feed">Story</a>',
    classify: isNewsStoriesPost,
    reason: catalog.NF_STORIES,
  },
  {
    name: "Meta AI destination",
    markup: '<a href="https://www.meta.ai/">Reference</a>',
    classify: isNewsMetaAICard,
    reason: catalog.NF_META_AI,
  },
];

describe.each(disclosures)("$name evidence stays with its owning metadata", (disclosure) => {
  test.each([
    "p",
    "blockquote",
    'div data-ad-preview="message"',
    'div data-ad-comet-preview="message"',
    'div data-ad-rendering-role="story_message"',
    'div role="comment"',
    'div role="article"',
    'div aria-posinset="2"',
    'div cmfr="Independent feature"',
  ])("preserves a parent containing the same destination in %s", (wrapper) => {
    const post = sharedPost(
      `<h4>Ordinary author</h4><${wrapper}>${disclosure.markup}</${wrapper.split(" ")[0]}>`
    );
    post.setAttribute("role", "article");
    expect(disclosure.classify(post, catalog)).toBe("");
  });

  test.each([8, 9] as const)("ignores unannotated body and footer at depth %s", (depth) => {
    for (const position of [1, 2]) {
      const blocks = ["Author", "Ordinary message", "Comments"];
      blocks[position] = disclosure.markup;
      const { post } = sharedContentPost(blocks, depth);
      expect(disclosure.classify(requireShared(post.firstElementChild), catalog)).toBe("");
    }
  });

  test.each([8, 9] as const)("retains the owned header at depth %s", (depth) => {
    const { post } = sharedContentPost([disclosure.markup, "Body", "Comments"], depth);
    expect(disclosure.classify(requireShared(post.firstElementChild), catalog)).toBe(
      disclosure.reason
    );
  });

  test.each(["hidden", 'style="display:none"', 'style="visibility:hidden"'])(
    "ignores a concealed disclosure with %s",
    (attribute) => {
      const post = sharedPost(`<h4><span ${attribute}>${disclosure.markup}</span></h4>`);
      post.setAttribute("role", "article");
      expect(disclosure.classify(post, catalog)).toBe("");
    }
  );

  test("does not let an unrelated first candidate mask a later owned disclosure", () => {
    const post = sharedPost(`<p>${disclosure.markup}</p><h4>${disclosure.markup}</h4>`);
    post.setAttribute("role", "article");
    expect(disclosure.classify(post, catalog)).toBe(disclosure.reason);
  });
});

describe("story destinations", () => {
  test.each([
    "/stories/123?source=from_feed_extra",
    "/stories/123?next_source=from_feed",
    "/stories/123?next=source=from_feed",
    "/stories?source=from_feed",
    "https://example.test/stories/123?source=from_feed",
    "https://facebook.com.example.test/stories/123?source=from_feed",
  ])("rejects a destination that does not identify the owning story: %s", (href) => {
    expect(isNewsStoriesPost(sharedPost(`<a href="${href}">Story</a>`), catalog)).toBe("");
  });

  test.each(["See story", "عرض القصة", "查看動態", "Unknown locale"])(
    "recognizes the destination independently of its label: %s",
    (label) => {
      for (const path of ["/stories/123/", "/stories/123/456/"]) {
        const post = sharedPost(
          `<a href="https://www.facebook.com${path}?source=from_feed">${label}</a>`
        );
        expect(isNewsStoriesPost(post, catalog)).toBe(catalog.NF_STORIES);
      }
    }
  );
});
