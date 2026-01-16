const { loadFunctions } = require("../tests/helpers/monolith-loader");
const {
  isGroupsYouMightLike,
  isNewsEventsYouMayLike,
  isNewsFollow,
  isNewsMetaAICard,
  isNewsPaidPartnership,
  isNewsParticipate,
  isNewsPeopleYouMayKnow,
  isNewsReelsAndShortVideos,
  isNewsSuggested,
  isNewsShortReelVideo,
  isNewsSponsoredPaidBy,
  isNewsStoriesPost,
  postExceedsLikeCount,
} = require("../src/feeds/news");
const { isGroupsShortReelVideo, isGroupsSuggested } = require("../src/feeds/groups");
const { mpGetBlockedPrices, mpGetBlockedTextDescription } = require("../src/feeds/marketplace");
const { isInstagram, isVideoLive } = require("../src/feeds/videos");
const { querySelectorAllNoChildren } = require("../src/utils/dom");

function buildPostWithLink(href, role) {
  const post = document.createElement("div");
  const link = document.createElement("a");
  link.setAttribute("href", href);
  if (role) {
    link.setAttribute("role", role);
  }
  post.appendChild(link);
  return post;
}

function buildPaidPartnershipPost() {
  const post = document.createElement("div");
  const spanDir = document.createElement("span");
  spanDir.setAttribute("dir", "auto");
  const spanId = document.createElement("span");
  spanId.setAttribute("id", "pp");
  const link = document.createElement("a");
  link.setAttribute("href", "/business/help/test");
  spanId.appendChild(link);
  spanDir.appendChild(spanId);
  post.appendChild(spanDir);
  return post;
}

function buildSuggestedPost(text) {
  const post = document.createElement("div");
  const root = document.createElement("div");
  root.setAttribute("aria-posinset", "1");
  post.appendChild(root);

  const d1 = document.createElement("div");
  const d2 = document.createElement("div");
  const d3 = document.createElement("div");
  const d4 = document.createElement("div");
  const d5 = document.createElement("div");
  const d6a = document.createElement("div");
  const d6b = document.createElement("div");
  const d7 = document.createElement("div");
  const d8 = document.createElement("div");
  const d9a = document.createElement("div");
  const d9b = document.createElement("div");
  const d10 = document.createElement("div");
  const d11a = document.createElement("div");
  const d11b = document.createElement("div");
  const d12 = document.createElement("div");
  const d13a = document.createElement("div");
  const d13b = document.createElement("div");
  const spanOuter = document.createElement("span");
  const divInner = document.createElement("div");
  const spanText = document.createElement("span");
  spanText.textContent = text;

  root.appendChild(d1);
  d1.appendChild(d2);
  d2.appendChild(d3);
  d3.appendChild(d4);
  d4.appendChild(d5);
  d5.appendChild(d6a);
  d5.appendChild(d6b);
  d6b.appendChild(d7);
  d7.appendChild(d8);
  d8.appendChild(d9a);
  d8.appendChild(d9b);
  d9b.appendChild(d10);
  d10.appendChild(d11a);
  d10.appendChild(d11b);
  d11b.appendChild(d12);
  d12.appendChild(d13a);
  d12.appendChild(d13b);
  d13b.appendChild(spanOuter);
  spanOuter.appendChild(divInner);
  divInner.appendChild(spanText);

  return post;
}

function buildFollowPost() {
  const post = document.createElement("div");
  const h4 = document.createElement("h4");
  h4.setAttribute("id", "follow");
  const span = document.createElement("span");
  const div = document.createElement("div");
  const inner = document.createElement("span");
  inner.textContent = "Follow";
  div.appendChild(inner);
  span.appendChild(div);
  h4.appendChild(span);
  post.appendChild(h4);
  return post;
}

function buildParticipatePost() {
  const post = document.createElement("div");
  const h4 = document.createElement("h4");
  const span = document.createElement("span");
  const spanClass = document.createElement("span");
  const inner = document.createElement("span");
  inner.textContent = "Participate";
  spanClass.appendChild(inner);
  span.appendChild(spanClass);
  h4.appendChild(span);
  post.appendChild(h4);
  return post;
}

function buildSponsoredPaidByPost() {
  const post = document.createElement("div");
  const first = document.createElement("div");
  const second = document.createElement("div");
  post.appendChild(first);
  post.appendChild(second);

  const secondChild1 = document.createElement("div");
  const secondChild2 = document.createElement("div");
  second.appendChild(secondChild1);
  second.appendChild(secondChild2);

  const spanClass = document.createElement("span");
  spanClass.className = "sponsored";
  const spanId = document.createElement("span");
  spanId.setAttribute("id", "paid");
  const label1 = document.createElement("div");
  const label2 = document.createElement("div");
  label2.textContent = "Paid by";
  spanId.appendChild(label1);
  spanId.appendChild(label2);
  spanClass.appendChild(spanId);
  secondChild2.appendChild(spanClass);

  return post;
}

function buildEventsPost() {
  const post = document.createElement("div");
  const root = document.createElement("div");
  const first = document.createElement("div");
  const second = document.createElement("div");
  const inner1 = document.createElement("div");
  const inner2 = document.createElement("div");
  const h3 = document.createElement("h3");
  const span = document.createElement("span");
  span.textContent = "Event";

  h3.appendChild(span);
  inner2.appendChild(h3);
  inner1.appendChild(inner2);
  second.appendChild(inner1);
  root.appendChild(first);
  root.appendChild(second);
  post.appendChild(root);
  return post;
}

function buildMetaAIPost() {
  const post = document.createElement("div");
  const link = document.createElement("a");
  link.setAttribute("href", "https://meta.ai/");
  link.setAttribute("aria-label", "Visit Meta AI");
  post.appendChild(link);
  return post;
}

function buildLikeCountPost(text) {
  const post = document.createElement("div");
  const toolbar = document.createElement("span");
  toolbar.setAttribute("role", "toolbar");
  const sibling = document.createElement("div");
  const button = document.createElement("div");
  button.setAttribute("role", "button");
  const spanClass = document.createElement("span");
  spanClass.setAttribute("class", "cls");
  spanClass.setAttribute("aria-hidden", "true");
  const spanPlain = document.createElement("span");
  const spanInner = document.createElement("span");
  spanInner.setAttribute("class", "inner");
  spanInner.textContent = text;
  spanPlain.appendChild(spanInner);
  spanClass.appendChild(spanPlain);
  button.appendChild(spanClass);
  sibling.appendChild(button);
  post.appendChild(toolbar);
  post.appendChild(sibling);
  return post;
}

function buildGroupsSuggestedPost() {
  const post = document.createElement("div");

  for (let i = 0; i < 2; i += 1) {
    const root = document.createElement("div");
    root.setAttribute("aria-posinset", String(i + 1));
    post.appendChild(root);
    let current = root;
    for (let depth = 0; depth < 8; depth += 1) {
      const node = document.createElement("div");
      current.appendChild(node);
      current = node;
    }
    if (i === 0) {
      const icon = document.createElement("i");
      icon.setAttribute("data-visualcompletion", "css-img");
      icon.setAttribute("style", "color: red;");
      current.appendChild(icon);
    }
  }

  return post;
}

function buildVideoLivePost() {
  const post = document.createElement("div");
  const present = document.createElement("div");
  present.setAttribute("role", "presentation");
  const sibling = document.createElement("div");
  const inner = document.createElement("div");
  const span = document.createElement("span");
  span.textContent = "Live";
  inner.appendChild(span);
  sibling.appendChild(inner);
  post.appendChild(present);
  post.appendChild(sibling);
  return post;
}

function buildInstagramPost() {
  const post = document.createElement("div");
  let current = post;
  for (let i = 0; i < 5; i += 1) {
    const node = document.createElement("div");
    current.appendChild(node);
    current = node;
  }
  const anchor = document.createElement("a");
  anchor.setAttribute("href", "#");
  const inner = document.createElement("div");
  const svg = document.createElement("svg");
  inner.appendChild(svg);
  anchor.appendChild(inner);
  current.appendChild(anchor);
  return post;
}

function buildMarketplaceBlock(text) {
  const block = document.createElement("div");
  block.appendChild(document.createTextNode(text));
  return block;
}

describe("feed filter decision parity", () => {
  const keyWords = {
    NF_PEOPLE_YOU_MAY_KNOW: "People You May Know",
    NF_PAID_PARTNERSHIP: "Paid Partnership",
    NF_SPONSORED_PAID: "Sponsored Paid",
    NF_REELS_SHORT_VIDEOS: "Reels Short Videos",
    NF_SHORT_REEL_VIDEO: "Short Reel",
    NF_EVENTS_YOU_MAY_LIKE: "Events You May Like",
    NF_PARTICIPATE: "Participate",
    NF_META_AI: "Meta AI",
    NF_STORIES: "Stories",
    NF_LIKES_MAXIMUM: "Too Many Likes",
    GF_SUGGESTIONS: "Group Suggestions",
    GF_SHORT_REEL_VIDEO: "Group Short Reel",
    VF_LIVE: "Live",
    VF_INSTAGRAM: "Instagram",
  };

  test("news people you may know parity", () => {
    const post = buildPostWithLink("/friends/123", "link");
    const monolith = loadFunctions(["nf_isPeopleYouMayKnow"], { document, KeyWords: keyWords });
    expect(isNewsPeopleYouMayKnow(post, keyWords)).toBe(monolith.nf_isPeopleYouMayKnow(post));
  });

  test("news paid partnership parity", () => {
    const post = buildPaidPartnershipPost();
    const monolith = loadFunctions(["nf_isPaidPartnership"], { document, KeyWords: keyWords });
    expect(isNewsPaidPartnership(post, keyWords)).toBe(monolith.nf_isPaidPartnership(post));
  });

  test("news sponsored paid by parity", () => {
    const post = buildSponsoredPaidByPost();
    const monolith = loadFunctions(["querySelectorAllNoChildren", "nf_isSponsoredPaidBy"], {
      document,
      KeyWords: keyWords,
    });
    expect(isNewsSponsoredPaidBy(post, keyWords)).toBe(monolith.nf_isSponsoredPaidBy(post));
  });

  test("news reels and short videos parity", () => {
    const post = buildPostWithLink("/reel/?s=ifu_see_more");
    const monolith = loadFunctions(["nf_isReelsAndShortVideos"], {
      document,
      KeyWords: keyWords,
      VARS: { dictionaryReelsAndShortVideos: [] },
    });
    expect(isNewsReelsAndShortVideos(post, { dictionaryReelsAndShortVideos: [] }, keyWords)).toBe(
      monolith.nf_isReelsAndShortVideos(post)
    );
  });

  test("news suggested parity", () => {
    const post = buildSuggestedPost("Suggested");
    const monolith = loadFunctions(
      [
        "cleanText",
        "querySelectorAllNoChildren",
        "nf_isGroupsYouMightLike",
        "nf_isReelsAndShortVideos",
        "nf_isSuggested",
      ],
      {
        document,
        KeyWords: keyWords,
        VARS: { dictionaryReelsAndShortVideos: [] },
      }
    );
    expect(isNewsSuggested(post, { dictionaryReelsAndShortVideos: [] }, keyWords)).toBe(
      monolith.nf_isSuggested(post)
    );
  });

  test("news follow parity", () => {
    const post = buildFollowPost();
    const monolith = loadFunctions(["querySelectorAllNoChildren", "nf_isFollow"], {
      document,
      KeyWords: keyWords,
      VARS: { dictionaryFollow: [] },
    });
    expect(isNewsFollow(post, { dictionaryFollow: [] }, keyWords)).toBe(
      monolith.nf_isFollow(post)
    );
  });

  test("news participate parity", () => {
    const post = buildParticipatePost();
    document.body.appendChild(post);
    const monolith = loadFunctions(["nf_isParticipate"], {
      document,
      KeyWords: keyWords,
      querySelectorAllNoChildren,
    });
    expect(isNewsParticipate(post, keyWords)).toBe(monolith.nf_isParticipate(post));
    document.body.removeChild(post);
  });

  test("news short reel video parity", () => {
    const post = buildPostWithLink("/reel/123");
    const monolith = loadFunctions(["nf_isShortReelVideo"], { document, KeyWords: keyWords });
    expect(isNewsShortReelVideo(post, keyWords)).toBe(monolith.nf_isShortReelVideo(post));
  });

  test("news events you may like parity", () => {
    const post = buildEventsPost();
    const monolith = loadFunctions(["querySelectorAllNoChildren", "nf_isEventsYouMayLike"], {
      document,
      KeyWords: keyWords,
    });
    expect(isNewsEventsYouMayLike(post, keyWords)).toBe(monolith.nf_isEventsYouMayLike(post));
  });

  test("news meta ai parity", () => {
    const post = buildMetaAIPost();
    const monolith = loadFunctions(
      [
        "cleanText",
        "countDescendants",
        "scanTreeForText",
        "scanImagesForAltText",
        "extractTextContent",
        "nf_getBlocksQuery",
        "nf_isMetaAICard",
      ],
      { document, NodeFilter, KeyWords: keyWords }
    );
    expect(isNewsMetaAICard(post, keyWords)).toBe(monolith.nf_isMetaAICard(post));
  });

  test("news stories parity", () => {
    const post = buildPostWithLink("/stories/123?source=from_feed");
    const monolith = loadFunctions(["nf_isStoriesPost"], { document, KeyWords: keyWords });
    expect(isNewsStoriesPost(post, keyWords)).toBe(monolith.nf_isStoriesPost(post));
  });

  test("news likes maximum parity", () => {
    const post = buildLikeCountPost("1.2K");
    const options = { NF_LIKES_MAXIMUM_COUNT: "1000" };
    const monolith = loadFunctions(["getFullNumber", "nf_postExceedsLikeCount"], {
      document,
      KeyWords: keyWords,
      VARS: { Options: options },
    });
    expect(postExceedsLikeCount(post, options, keyWords)).toBe(
      monolith.nf_postExceedsLikeCount(post)
    );
  });

  test("groups suggested parity", () => {
    const post = buildGroupsSuggestedPost();
    const monolith = loadFunctions(["gf_isSuggested"], { document, KeyWords: keyWords });
    expect(isGroupsSuggested(post, keyWords)).toBe(monolith.gf_isSuggested(post));
  });

  test("groups short reel video parity", () => {
    const post = buildPostWithLink("/reel/456");
    const monolith = loadFunctions(["gf_isShortReelVideo"], { document, KeyWords: keyWords });
    expect(isGroupsShortReelVideo(post, keyWords)).toBe(monolith.gf_isShortReelVideo(post));
  });

  test("news groups you might like parity", () => {
    const post = buildPostWithLink("/groups/discover");
    const monolith = loadFunctions(["nf_isGroupsYouMightLike"], { document });
    expect(isGroupsYouMightLike(post)).toBe(monolith.nf_isGroupsYouMightLike(post));
  });

  test("videos live parity", () => {
    const post = buildVideoLivePost();
    const monolith = loadFunctions(["vf_isVideoLive"], { document, KeyWords: keyWords });
    expect(isVideoLive(post, keyWords)).toBe(monolith.vf_isVideoLive(post));
  });

  test("videos instagram parity", () => {
    const post = buildInstagramPost();
    const monolith = loadFunctions(["vf_isInstagram"], { document, KeyWords: keyWords });
    expect(isInstagram(post, keyWords)).toBe(monolith.vf_isInstagram(post));
  });

  test("marketplace blocked prices parity", () => {
    const block = buildMarketplaceBlock("100");
    const filters = {
      MP_BLOCKED_TEXT: ["100"],
      MP_BLOCKED_TEXT_LC: ["100"],
    };
    const monolith = loadFunctions(
      ["cleanText", "findFirstMatch", "mp_scanTreeForText", "mp_getBlockedPrices"],
      { document, NodeFilter, VARS: { Filters: filters } }
    );
    expect(mpGetBlockedPrices(block, filters)).toBe(monolith.mp_getBlockedPrices(block));
  });

  test("marketplace blocked description parity", () => {
    const filters = {
      MP_BLOCKED_TEXT_DESCRIPTION: ["blue"],
      MP_BLOCKED_TEXT_DESCRIPTION_LC: ["blue"],
    };
    const blocks = [buildMarketplaceBlock("ignore"), buildMarketplaceBlock("Blue bike")];
    const monolith = loadFunctions(
      [
        "cleanText",
        "findFirstMatch",
        "mp_scanTreeForText",
        "mp_getBlockedTextDescription",
      ],
      { document, NodeFilter, VARS: { Filters: filters } }
    );
    expect(mpGetBlockedTextDescription(blocks, filters, true)).toBe(
      monolith.mp_getBlockedTextDescription(blocks, true)
    );
  });
});
