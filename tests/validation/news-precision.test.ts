// SPDX-License-Identifier: GPL-3.0-only

import { getOrphanSponsoredNewsPosts } from "../../src/feeds/news-discovery";
import { postAtt } from "../../src/dom/attributes";
import {
  isGroupsYouMightLike,
  isNewsFollow,
  isNewsParticipate,
  isNewsPeopleYouMayKnow,
  isNewsReelsAndShortVideos,
  isNewsShortReelVideo,
  isNewsSuggested,
  isNewsVerifiedBadge,
  mopNewsFeed,
  scrubRightRailSuggestions,
} from "../../src/feeds/news";
import { newsLabels } from "../../src/i18n/news-labels";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";
import { mountNewsPost, newsTextBlocks, suggestionHeader } from "./news-contract-fixtures";

const { keyWords } = createNewsContext();

describe("exact author identities and actions", () => {
  test.each(["Public", "Friends", "More options", "Verified account settings", ""])(
    "keeps an unrelated or ambiguous header icon visible: %s",
    (name) => {
      const { post } = mountNewsPost(
        `<h4><a href="/author">Author</a><svg aria-label="${name}"></svg></h4>`
      );
      expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
      mopNewsFeed(
        createNewsContext({
          options: { NF_HIDE_VERIFIED_BADGE: true, NF_FILTER_VERIFIED_BADGE: true },
        })
      );
      expect(post.hasAttribute(postAtt)).toBe(false);
      expect(post.querySelector("svg")?.getAttribute("style")).toBeNull();
    }
  );

  test("supports the observed SVG title identity without depending on invented artwork paths", () => {
    const { post } = mountNewsPost(
      '<h4><span><span><svg role="img"><title>verified account</title><path d="M0 0"></path></svg></span></span></h4>'
    );
    expect(isNewsVerifiedBadge(post, keyWords)).toBe(keyWords.NF_FILTER_VERIFIED_BADGE);
  });

  test("rejects a conflicting fallback title when the badge's accessible name is Public", () => {
    const { post } = mountNewsPost(
      '<h4><span title="Verified account"><svg aria-label="Public"><title>Verified account</title></svg></span></h4>'
    );
    expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
  });

  test("ignores valid paragraph links without letting them become media or discovery cards", () => {
    const { post } = mountNewsPost(
      '<p><a href="/groups/discover/">Groups</a><a role="link" href="/friends/">Friends</a><a href="/reel/123/"><img alt="Preview"></a></p>'
    );
    expect(isGroupsYouMightLike(post)).toBe(false);
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe("");
    expect(isNewsShortReelVideo(post, keyWords)).toBe("");
  });

  test.each(["h4", "h5"])("resolves an explicit labelledby badge inside %s", (heading) => {
    const { post } = mountNewsPost(
      `<${heading}><svg aria-labelledby="verification"><title id="verification">Verified account</title></svg></${heading}>`
    );
    expect(isNewsVerifiedBadge(post, keyWords)).toBe(keyWords.NF_FILTER_VERIFIED_BADGE);
  });

  test("does not use a verified-looking author name or nested comment badge for the parent", () => {
    const { post } = mountNewsPost(
      '<h4><span aria-label="Verified account"><a href="/author">Verified account</a><svg aria-label="Public"></svg></span></h4><div role="article"><h5><svg><title>Verified account</title></svg></h5></div>'
    );
    expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
  });

  test.each(["More options", "Like", "Share", "Following", "Joined", "Follow this discussion"])(
    "rejects arbitrary header actions: %s",
    (label) => {
      for (const path of ["/author", "/groups/example"]) {
        const { post } = mountNewsPost(
          `<h4><a href="${path}">Author</a><span role="button">${label}</span></h4>`
        );
        expect(isNewsFollow(post, keyWords)).toBe("");
        expect(isNewsParticipate(post, keyWords)).toBe("");
      }
    }
  );

  test("requires the accessible control action rather than a hidden child word", () => {
    const { post } = mountNewsPost(
      '<h4><a href="/author">Author</a><button aria-label="More options"><span>Follow</span></button></h4>'
    );
    expect(isNewsFollow(post, keyWords)).toBe("");
  });

  test("accepts an accessible icon-only Follow control but rejects external group lookalikes", () => {
    const { post } = mountNewsPost(
      '<h4><a href="/author">Author</a><button aria-label="Follow"><svg></svg></button></h4>'
    );
    expect(isNewsFollow(post, keyWords)).toBe(keyWords.NF_FOLLOW);
    post.innerHTML =
      '<h4><a href="https://example.org/groups/test">Group</a><button>Join</button></h4>';
    expect(isNewsParticipate(post, keyWords)).toBe("");
  });

  test.each(Object.entries(newsLabels))(
    "retains expected localized semantic aliases for %s independently of settings language",
    (_locale, labels) => {
      const [follow, join, verified, suggested, groups, people, reels] = labels.map(
        (label) => label.split("|")[0]
      );
      const { post } = mountNewsPost(
        `<h4><a href="/author">Author</a><button>${follow}</button><svg aria-label="${verified}"></svg></h4>`
      );
      expect(isNewsFollow(post, keyWords)).toBe(keyWords.NF_FOLLOW);
      expect(isNewsVerifiedBadge(post, keyWords)).toBe(keyWords.NF_FILTER_VERIFIED_BADGE);
      post.innerHTML = `<h4><a href="/groups/example">Group</a><button>${join}</button></h4>`;
      expect(isNewsParticipate(post, keyWords)).toBe(keyWords.NF_PARTICIPATE);
      post.innerHTML = suggestionHeader(suggested || "");
      expect(isNewsSuggested(post, {}, keyWords)).toBe(keyWords.NF_SUGGESTIONS);
      post.innerHTML = `<h3>${groups}</h3><a href="/groups/discover/">Browse</a>`;
      expect(isGroupsYouMightLike(post)).toBe(true);
      post.innerHTML = `<h3>${people}</h3><a role="link" href="/friends/">Browse</a>`;
      expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe(keyWords.NF_PEOPLE_YOU_MAY_KNOW);
      post.innerHTML = `<h3>${reels}</h3><a href="/reel/?s=ifu_see_more">Browse</a>`;
      expect(isNewsReelsAndShortVideos(post, keyWords)).toBe(keyWords.NF_REELS_SHORT_VIDEOS);
    }
  );
});

describe("news card ownership and ordinary discussion", () => {
  test.each([
    "blockquote",
    'div data-ad-preview="message"',
    'div data-ad-comet-preview="message"',
    'div data-ad-rendering-role="story_message"',
    'div role="article"',
    'div data-commentid="comment"',
  ])("does not promote body/comment links or controls from %s", (wrapper) => {
    const tag = wrapper.split(" ")[0];
    const { post } = mountNewsPost(
      `<${wrapper}><h3>Groups you might like</h3><a href="/groups/discover/">Browse</a><h3>People you may know</h3><a role="link" href="/friends/">Friends</a><h3>Reels</h3><a href="/reel/?s=ifu_see_more">Browse</a><a href="/reel/123/"><img alt="Preview"></a><h4><a href="/author">Author</a><button>Follow</button><svg aria-label="Verified account"></svg></h4></${tag}>`
    );
    expect(isGroupsYouMightLike(post)).toBe(false);
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe("");
    expect(isNewsShortReelVideo(post, keyWords)).toBe("");
    expect(isNewsReelsAndShortVideos(post, keyWords)).toBe("");
    expect(isNewsFollow(post, keyWords)).toBe("");
    expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
  });

  test("rejects metadata in unannotated legacy body blocks while retaining owned reel media", () => {
    const fakeMetadata =
      '<h3>Groups you might like</h3><a href="/groups/discover/">Groups</a><h3>People you may know</h3><a role="link" href="/friends/">Friends</a><h4><a href="/author">Author</a><button>Follow</button><svg aria-label="Verified account"></svg></h4>';
    const { post } = mountNewsPost(newsTextBlocks("Author metadata", fakeMetadata));
    expect(isGroupsYouMightLike(post)).toBe(false);
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe("");
    expect(isNewsFollow(post, keyWords)).toBe("");
    expect(isNewsVerifiedBadge(post, keyWords)).toBe("");
    post.innerHTML = newsTextBlocks(
      "Author metadata",
      '<a href="/reel/123/"><img alt="Reel preview"></a>'
    );
    expect(isNewsShortReelVideo(post, keyWords)).toBe(keyWords.NF_SHORT_REEL_VIDEO);
  });

  test("does not classify bare discovery links or arbitrary nonnumeric legacy labels", () => {
    const { post } = mountNewsPost(
      '<a href="/groups/discover/">Groups</a><a role="link" href="/friends/">Friends</a><a href="/reel/123/">Video</a>'
    );
    expect(isGroupsYouMightLike(post)).toBe(false);
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe("");
    expect(isNewsShortReelVideo(post, keyWords)).toBe("");
    post.innerHTML = suggestionHeader("Yesterday");
    expect(isNewsSuggested(post, {}, keyWords)).toBe("");
  });

  test.each([
    "https://example.org/reel/123/",
    "https://facebook.com.example.org/reel/123/",
    "/notes/reel/123/",
    "javascript:/reel/123/",
  ])("rejects a non-Facebook reel destination: %s", (href) => {
    const { post } = mountNewsPost(`<a href="${href}"><img alt="Preview"></a>`);
    expect(isNewsShortReelVideo(post, keyWords)).toBe("");
  });

  test.each([
    '<p><a href="/ads/about/">Sponsored</a></p>',
    '<a href="/ads/about/">How ad preferences work</a>',
    '<a href="https://example.org/ads/about/">Sponsored</a>',
  ])("does not hide an orphan candidate without owned sponsorship semantics: %s", (markup) => {
    document.body.innerHTML = `<div role="navigation"></div><div role="main"><div id="orphan" data-virtualized="true">${markup}</div></div>`;
    const main = document.querySelector('[role="main"]');
    expect(getOrphanSponsoredNewsPosts(main)).toHaveLength(1);
    mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
    expect(requireElement(document.getElementById("orphan")).hasAttribute(postAtt)).toBe(false);
  });

  test("preserves Contacts and still finds the subsequent recommendation sibling", () => {
    document.body.innerHTML = `<div role="complementary">${"<div>".repeat(5)}<div id="contacts"><h3>Contacts</h3><a href="/friend">Friend</a></div><div id="suggestion"><h3>Suggested for you</h3><a href="/page">Page</a></div>${"</div>".repeat(5)}</div>`;
    scrubRightRailSuggestions(createNewsContext());
    expect(requireElement(document.getElementById("contacts")).hasAttribute(postAtt)).toBe(false);
    expect(requireElement(document.getElementById("suggestion")).hasAttribute(postAtt)).toBe(true);
  });

  test("keeps a rail wrapper containing both recommendation and Contacts headings visible", () => {
    document.body.innerHTML = `<div role="complementary">${"<div>".repeat(5)}<div id="combined"><h3>Suggested for you</h3><a href="/page">Page</a><h3>Contacts</h3><a href="/friend">Friend</a></div>${"</div>".repeat(5)}</div>`;
    scrubRightRailSuggestions(createNewsContext());
    expect(requireElement(document.getElementById("combined")).hasAttribute(postAtt)).toBe(false);
  });

  test.each(["0", "1", "2"])(
    "filters the legitimate blocked text hidden without confusing it with processed state at verbosity %s",
    (verbosity) => {
      const { post } = mountNewsPost(newsTextBlocks("hidden"));
      const context = createNewsContext({
        options: { NF_BLOCKED_ENABLED: true, VERBOSITY_LEVEL: verbosity },
      });
      context.filters.NF_BLOCKED_TEXT = ["hidden"];
      context.filters.NF_BLOCKED_TEXT_LC = ["hidden"];
      mopNewsFeed(context);
      expect(post.getAttribute(postAtt)).toBe("hidden");
      const markup = document.body.innerHTML;
      context.state.forceProcess = true;
      mopNewsFeed(context);
      expect(document.body.innerHTML).toBe(markup);
    }
  );
});
