// SPDX-License-Identifier: GPL-3.0-only

import { getSponsoredDiagnostics } from "../../src/feeds/shared/sponsored";
import { getGroupsBlocks, getNewsBlocks } from "../../src/feeds/shared/blocks";
import { findGroupsBlockedText, findNewsBlockedText } from "../../src/feeds/shared/blocked-text";
import { isNewsFollow, isNewsVerifiedBadge, mopNewsFeed } from "../../src/feeds/news";
import { hydrateOptions } from "../../src/core/options/hydrate";
import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Model the captured extra wrapper and hidden decoys without retaining Facebook content or IDs. */
function mountSemanticPost(header: string, body = "Ordinary message"): HTMLElement {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1" id="post">
    ${"<div>".repeat(7)}
      <div aria-hidden="true" role="button"></div><div aria-hidden="true" role="button"></div>
      <div><div>
        <div><div aria-hidden="true"><blockquote>Decoy keyword</blockquote></div></div>
        <div id="header"><div data-ad-rendering-role="profile_name"><h4>${header}</h4></div></div>
        <div id="body" data-ad-rendering-role="story_message">${body}</div>
        <div id="footer">Comments</div>
      </div></div>
      <div aria-hidden="true" role="button"></div>
    ${"</div>".repeat(7)}
  </div></div>`;
  return requireElement(document.getElementById("post"));
}

describe("semantic content blocks with layout decoys", () => {
  afterEach(() => {
    clearDirtyTracking();
    document.body.replaceChildren();
  });

  test.each([getNewsBlocks, getGroupsBlocks])(
    "locates the actual header, message, and footer without counting hidden preambles",
    (getQuery) => {
      const post = mountSemanticPost('<a href="/author">Author</a>');
      const before = post.outerHTML;
      expect(Array.from(getQuery(post)).map((element) => element.id)).toEqual([
        "header",
        "body",
        "footer",
      ]);
      expect(post.outerHTML).toBe(before);
    }
  );

  test("filters an owned Follow header that the legacy depth misclassified as body", () => {
    const post = mountSemanticPost('<a href="/author">Author</a><div role="button">Follow</div>');
    const context = createNewsContext({ options: { NF_FOLLOW: true } });
    expect(isNewsFollow(post, context.keyWords)).toBe(context.keyWords.NF_FOLLOW);
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.NF_FOLLOW);
  });

  test("finds verification in the real author header", () => {
    const post = mountSemanticPost(
      '<a href="/author">Author</a><svg aria-label="Verified account"></svg>'
    );
    const context = createNewsContext({ options: { NF_FILTER_VERIFIED_BADGE: true } });
    expect(isNewsVerifiedBadge(post, context.keyWords)).toBe(
      context.keyWords.NF_FILTER_VERIFIED_BADGE
    );
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.NF_FILTER_VERIFIED_BADGE);
  });

  test("keeps embedded author actions and badges in the authored message excluded", () => {
    const post = mountSemanticPost(
      '<a href="/friend">Friend</a>',
      '<h4><a href="/original">Original</a><button>Follow</button><svg aria-label="Verified account"></svg></h4>'
    );
    const context = createNewsContext({
      options: { NF_FOLLOW: true, NF_FILTER_VERIFIED_BADGE: true },
    });
    expect(isNewsFollow(post, context.keyWords)).toBe("");
    expect(isNewsVerifiedBadge(post, context.keyWords)).toBe("");
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("keeps owned sponsored metadata eligible while rejecting body disclosures", () => {
    const post = mountSemanticPost('<a href="/ads/about/">Sponsored</a>');
    expect(getSponsoredDiagnostics(post, { isNF: true }).matchedBy).toBe("ads-about");
    const ordinary = mountSemanticPost(
      '<a href="/author">Author</a>',
      '<a href="/ads/about/">Sponsored</a>'
    );
    expect(getSponsoredDiagnostics(ordinary, { isNF: true }).matchedBy).toBe("none");
  });

  test("reads the actual message for blocked text without reading hidden preambles", () => {
    const post = mountSemanticPost(
      '<a href="/author">Author</a>',
      "<div><span>Actual keyword</span></div>"
    );
    const settings = hydrateOptions({
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "actual keyword",
    });
    expect(findNewsBlockedText(post, settings.options, settings.filters)).toBe("actual keyword");
    const decoySettings = hydrateOptions({
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_TEXT: "decoy keyword",
    });
    expect(findNewsBlockedText(post, decoySettings.options, decoySettings.filters)).toBe("");
  });

  test("uses the same owned blocks for group text filtering", () => {
    const post = mountSemanticPost(
      '<a href="/author">Author</a>',
      "<div><span>Group keyword</span></div>"
    );
    const settings = hydrateOptions({ GF_BLOCKED_ENABLED: true, GF_BLOCKED_TEXT: "group keyword" });
    expect(findGroupsBlockedText(post, settings.options, settings.filters)).toBe("group keyword");
  });

  test.each(['div role="article"', 'div data-ad-preview="message"', "blockquote"])(
    "does not infer the parent layout from nested semantic markers: %s",
    (wrapper) => {
      document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1" id="post"><${wrapper}>
        <div data-ad-rendering-role="profile_name"><h4><a href="/author">Author</a><button>Follow</button><svg aria-label="Verified account"></svg></h4></div>
        <div data-ad-rendering-role="story_message">Embedded message</div>
      </${wrapper.split(" ")[0]}></div></div>`;
      const post = requireElement(document.getElementById("post"));
      const context = createNewsContext({
        options: { NF_FOLLOW: true, NF_FILTER_VERIFIED_BADGE: true },
      });
      mopNewsFeed(context);
      expect(post.hasAttribute(postAtt)).toBe(false);
    }
  );

  test("falls back safely when either semantic signal is missing", () => {
    for (const selector of [
      '[data-ad-rendering-role="profile_name"]',
      '[data-ad-rendering-role="story_message"]',
    ]) {
      const post = mountSemanticPost('<a href="/author">Author</a>');
      requireElement(post.querySelector(selector)).removeAttribute("data-ad-rendering-role");
      const context = createNewsContext({
        options: { NF_FOLLOW: true, NF_FILTER_VERIFIED_BADGE: true },
      });
      mopNewsFeed(context);
      expect(post.hasAttribute(postAtt)).toBe(false);
    }
  });
});
