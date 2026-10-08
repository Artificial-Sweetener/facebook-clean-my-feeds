// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import {
  isNewsAiInfoPost,
  isNewsEventsYouMayLike,
  isNewsFollow,
  isNewsMetaAICard,
  isNewsPaidPartnership,
  isNewsParticipate,
  isNewsPeopleYouMayKnow,
  isNewsReelsAndShortVideos,
  isNewsShortReelVideo,
  isNewsSponsoredPaidBy,
  isNewsStoriesPost,
  isNewsSuggested,
  isNewsVerifiedBadge,
} from "../../src/feeds/news-detectors";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";
import { mountNewsPost, newsTextBlocks, suggestionHeader } from "./news-contract-fixtures";

const { keyWords } = createNewsContext();

describe("news-specific detector boundaries", () => {
  test.each(["1 h", "١ ساعة", "۱ ساعت", "१ घंटा", "১ ঘণ্টা", "၁ နာရီ", "๑ ชั่วโมง", "༡ ཆུ་ཚོད"])(
    "keeps a numeric legacy timestamp visible: %s",
    (timestamp) => {
      const { post } = mountNewsPost(suggestionHeader(timestamp));
      expect(isNewsSuggested(post, {}, keyWords)).toBe("");
    }
  );

  test("recognizes a suggested legacy header through aria-describedby", () => {
    const { post } = mountNewsPost(suggestionHeader("Suggested for you"));
    post.removeAttribute("aria-posinset");
    post.setAttribute("aria-describedby", "description");
    expect(isNewsSuggested(post, {}, keyWords)).toBe(keyWords.NF_SUGGESTIONS);
  });

  test("does not treat child-rich legacy header text as the leaf-label signature", () => {
    const { post } = mountNewsPost(suggestionHeader("<b>Suggested for you</b>"));
    expect(isNewsSuggested(post, {}, keyWords)).toBe("");
  });

  test("recognizes group-discovery cards without a legacy suggestion header", () => {
    const { post } = mountNewsPost(
      '<h3>Groups you might like</h3><a href="/groups/discover/">Browse groups</a>'
    );
    expect(isNewsSuggested(post, {}, keyWords)).toBe(keyWords.NF_SUGGESTIONS);
  });

  test.each([0, 1, 2, 3, 4, 5, 6])(
    "separates shelf and individual reel counts at %s links",
    (count) => {
      const markup = Array.from(
        { length: count },
        (_, index) => `<a href="/reel/${index}/"><img alt="Reel preview">Video</a>`
      ).join("");
      const { post } = mountNewsPost(markup);
      expect(isNewsReelsAndShortVideos(post, keyWords)).toBe(
        count > 4 ? keyWords.NF_REELS_SHORT_VIDEOS : ""
      );
      expect(isNewsShortReelVideo(post, keyWords)).toBe(
        count === 1 ? keyWords.NF_SHORT_REEL_VIDEO : ""
      );
    }
  );

  test("excludes a positively matched suggestion header when it is a reel shelf", () => {
    const { post } = mountNewsPost(suggestionHeader("Suggested for you"));
    expect(isNewsSuggested(post, {}, keyWords)).toBe(keyWords.NF_SUGGESTIONS);
    post.insertAdjacentHTML("beforeend", '<h3>Reels</h3><a href="/reel/?s=ifu_see_more">Reels</a>');
    expect(isNewsSuggested(post, {}, keyWords)).toBe("");
  });

  test.each([
    "<h4><a href='/alice'>Alice</a></h4>",
    "<h4><button>Follow</button></h4>",
    "<p><a href='/alice'>Alice</a><span role='button'>Follow</span></p>",
  ])("requires the supported link/control header rather than isolated pieces: %s", (markup) => {
    const { post } = mountNewsPost(markup);
    expect(isNewsFollow(post, keyWords)).toBe("");
    expect(isNewsParticipate(post, keyWords)).toBe("");
  });

  test("routes a group header to Participate rather than Follow", () => {
    const { post } = mountNewsPost(
      '<h4><a href="/groups/example/">Example</a><span role="button">Join</span></h4>'
    );
    expect(isNewsFollow(post, keyWords)).toBe("");
    expect(isNewsParticipate(post, keyWords)).toBe(keyWords.NF_PARTICIPATE);
  });

  test.each([
    '<h4 id="author"><span><div><span>Follow</span></div></span></h4>',
    '<h4 id="author"><span><span><div><span>Follow</span></div></span></span></h4>',
    '<h4 id="author"><div><span><span class="a"><div class="b"><span class="c">Follow</span></div></span></span></div></h4>',
  ])("recognizes the retained follow fallback: %s", (markup) => {
    const { post } = mountNewsPost(markup);
    expect(isNewsFollow(post, keyWords)).toBe(keyWords.NF_FOLLOW);
  });

  test("recognizes the retained participate fallback", () => {
    const { post } = mountNewsPost(
      '<h4><span><span class="join"><span>Join</span></span></span></h4>'
    );
    expect(isNewsParticipate(post, keyWords)).toBe(keyWords.NF_PARTICIPATE);
  });

  test.each(["AI info", "\n ai   INFO \t"])("normalizes exact disclosure buttons: %s", (label) => {
    const { post } = mountNewsPost(`<button>${label}</button>`);
    expect(isNewsAiInfoPost(post, keyWords)).toBe(keyWords.NF_AI_INFO_POSTS);
  });

  test.each(["AI information", "About AI info", "AI info and more", ""])(
    "rejects nonexact disclosure controls: %s",
    (label) => {
      const { post } = mountNewsPost(`<button>${label}</button>`);
      expect(isNewsAiInfoPost(post, keyWords)).toBe("");
    }
  );

  test.each([
    '<a aria-label="Visit Meta AI">Open</a>',
    '<a aria-label="Meta AI branding">Brand</a>',
    '<a href="https://www.meta.ai/">Create</a>',
  ])("recognizes the supported Meta AI link signature: %s", (markup) => {
    const { post } = mountNewsPost(markup);
    expect(isNewsMetaAICard(post, keyWords)).toBe(keyWords.NF_META_AI);
  });

  test.each(["TRY META AI", "Free AI creation tools"])(
    "recognizes creation-tool copy in supported body blocks: %s",
    (copy) => {
      const { post } = mountNewsPost(newsTextBlocks(copy));
      expect(isNewsMetaAICard(post, keyWords)).toBe(keyWords.NF_META_AI);
    }
  );

  test("does not use creation-tool copy from an already-hidden child feature", () => {
    const { post } = mountNewsPost(newsTextBlocks("Try Meta AI"));
    const feature = requireElement(post.querySelector("span"));
    feature.setAttribute(postAtt, "separately hidden feature");
    expect(isNewsMetaAICard(post, keyWords)).toBe("");
  });

  test.each(["/stories/123", "/stories/123?source=profile", "/story/123?source=from_feed"])(
    "rejects non-feed story destinations: %s",
    (href) => {
      const { post } = mountNewsPost(`<a href="${href}">Story</a>`);
      expect(isNewsStoriesPost(post, keyWords)).toBe("");
    }
  );

  test("ignores a decorative body SVG outside author headers", () => {
    const { post } = mountNewsPost('<p>Illustration <svg aria-label="drawing"></svg></p>');
    expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
  });

  test("requires a business-help link inside the disclosure wrapper", () => {
    const { post } = mountNewsPost(
      '<p><a href="/business/help/123">Partnership documentation</a></p>'
    );
    expect(isNewsPaidPartnership(post, keyWords)).toBe("");
  });

  test("requires the people-discovery link role and path together", () => {
    const { post } = mountNewsPost(
      '<a href="/friends/">Friends</a><a role="link" href="/alice">Alice</a>'
    );
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe("");
  });

  test("rejects plain event headings and paid-by text without their disclosure layout", () => {
    const { post } = mountNewsPost(
      "<h3><span>Events you may like</span></h3><p>Paid for by Example</p>"
    );
    expect(isNewsEventsYouMayLike(post, keyWords)).toBe("");
    expect(isNewsSponsoredPaidBy(post, keyWords)).toBe("");
  });
});
