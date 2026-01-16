const { loadFunctions } = require("../tests/helpers/monolith-loader");
const { findGroupsBlockedText, findNewsBlockedText, findProfileBlockedText, findVideosBlockedText } = require("../src/feeds/shared/blocked-text");
const { hasGroupsAnimatedGifContent, hasNewsAnimatedGifContent } = require("../src/feeds/shared/animated-gifs");
const { getGroupsBlocksQuery, getNewsBlocksQuery } = require("../src/feeds/shared/blocks");
const { hideNumberOfShares } = require("../src/feeds/shared/shares");
const { isSponsored } = require("../src/feeds/shared/sponsored");

function buildPostWithBlocks(textBlocks, gifIndex = -1) {
  const post = document.createElement("div");
  const root = document.createElement("div");
  root.setAttribute("aria-posinset", "1");
  post.appendChild(root);

  let current = root;
  for (let i = 0; i < 8; i += 1) {
    const layer = document.createElement("div");
    current.appendChild(layer);
    current = layer;
  }

  textBlocks.forEach((text, index) => {
    const block = document.createElement("div");
    const inner = document.createElement("div");
    const span = document.createElement("span");
    span.textContent = text;
    inner.appendChild(span);
    block.appendChild(inner);
    if (index === gifIndex) {
      const gifButton = document.createElement("div");
      gifButton.setAttribute("role", "button");
      gifButton.setAttribute("aria-label", "GIF");
      const icon = document.createElement("i");
      gifButton.appendChild(icon);
      block.appendChild(gifButton);
    }
    current.appendChild(block);
  });

  return post;
}

function buildVideoPostWithBlock(text) {
  const post = document.createElement("div");
  const block = document.createElement("div");
  const span = document.createElement("span");
  span.textContent = text;
  block.appendChild(span);
  post.appendChild(block);
  return post;
}

function buildSponsoredPost() {
  const post = document.createElement("div");
  const container = document.createElement("div");
  container.id = "sponsor";
  const span = document.createElement("span");
  const link = document.createElement("a");
  link.setAttribute("role", "link");
  const label = document.createElement("span");
  label.textContent = "Sponsored";
  link.appendChild(label);
  span.appendChild(link);
  container.appendChild(span);
  post.appendChild(container);
  return post;
}

function buildBlocksPost(chainCount, depth) {
  const post = document.createElement("div");
  for (let i = 0; i < chainCount; i += 1) {
    const root = document.createElement("div");
    root.setAttribute("aria-posinset", String(i + 1));
    post.appendChild(root);
    let current = root;
    for (let level = 0; level < depth; level += 1) {
      const node = document.createElement("div");
      current.appendChild(node);
      current = node;
    }
  }
  return post;
}

function buildSharesPost() {
  const post = document.createElement("div");
  const root = document.createElement("div");
  root.setAttribute("data-visualcompletion", "ignore-dynamic");
  post.appendChild(root);

  const a = document.createElement("div");
  const b = document.createElement("div");
  const c = document.createElement("div");
  const d = document.createElement("div");
  d.className = "has-class";
  const e = document.createElement("div");
  const f = document.createElement("div");
  const g = document.createElement("div");
  const h = document.createElement("span");
  const i = document.createElement("div");
  const j = document.createElement("span");
  j.setAttribute("dir", "auto");
  j.textContent = "123 shares";

  root.appendChild(a);
  a.appendChild(b);
  b.appendChild(c);
  c.appendChild(d);
  d.appendChild(e);
  e.appendChild(f);
  f.appendChild(g);
  g.appendChild(h);
  h.appendChild(i);
  i.appendChild(j);

  return { post, target: j };
}

describe("feed helpers match monolith behavior", () => {
  test("news blocked text matches monolith", () => {
    const post = buildPostWithBlocks(["banme"]);
    const options = { NF_BLOCKED_RE: false };
    const filters = { NF_BLOCKED_TEXT_LC: ["banme"] };

    const VARS = { Options: options, Filters: filters };
    const monolith = loadFunctions(
      [
        "cleanText",
        "findFirstMatch",
        "findFirstMatchRegExp",
        "scanTreeForText",
        "scanImagesForAltText",
        "countDescendants",
        "extractTextContent",
        "nf_getBlocksQuery",
        "nf_isBlockedText",
      ],
      { document, NodeFilter, VARS }
    );

    expect(findNewsBlockedText(post, options, filters)).toBe(monolith.nf_isBlockedText(post));
  });

  test("groups blocked text matches monolith", () => {
    const post = buildPostWithBlocks(["banme"]);
    const options = { GF_BLOCKED_RE: false };
    const filters = { GF_BLOCKED_TEXT_LC: ["banme"] };

    const VARS = { Options: options, Filters: filters };
    const monolith = loadFunctions(
      [
        "cleanText",
        "findFirstMatch",
        "findFirstMatchRegExp",
        "scanTreeForText",
        "scanImagesForAltText",
        "countDescendants",
        "extractTextContent",
        "gf_getBlocksQuery",
        "gf_isBlockedText",
      ],
      { document, NodeFilter, VARS }
    );

    expect(findGroupsBlockedText(post, options, filters)).toBe(monolith.gf_isBlockedText(post));
  });

  test("profile blocked text matches monolith", () => {
    const post = buildPostWithBlocks(["banme"]);
    const options = { PP_BLOCKED_RE: false };
    const filters = { PP_BLOCKED_TEXT_LC: ["banme"] };

    const VARS = { Options: options, Filters: filters };
    const monolith = loadFunctions(
      [
        "cleanText",
        "findFirstMatch",
        "findFirstMatchRegExp",
        "scanTreeForText",
        "scanImagesForAltText",
        "countDescendants",
        "extractTextContent",
        "nf_getBlocksQuery",
        "pp_isBlockedText",
      ],
      { document, NodeFilter, VARS }
    );

    expect(findProfileBlockedText(post, options, filters)).toBe(monolith.pp_isBlockedText(post));
  });

  test("videos blocked text matches monolith", () => {
    const post = buildVideoPostWithBlock("banme");
    const options = { VF_BLOCKED_RE: false };
    const filters = { VF_BLOCKED_TEXT_LC: ["banme"] };
    const queryBlocks = ":scope > div";

    const VARS = { Options: options, Filters: filters };
    const monolith = loadFunctions(
      [
        "cleanText",
        "findFirstMatch",
        "findFirstMatchRegExp",
        "scanTreeForText",
        "scanImagesForAltText",
        "countDescendants",
        "extractTextContent",
        "vf_isBlockedText",
      ],
      { document, NodeFilter, VARS }
    );

    expect(findVideosBlockedText(post, options, filters, queryBlocks)).toBe(
      monolith.vf_isBlockedText(post, queryBlocks)
    );
  });

  test("animated gif detection matches monolith", () => {
    const post = buildPostWithBlocks(["first", "second"], 1);
    const KeyWords = { GF_ANIMATED_GIFS_POSTS: "Animated GIFs" };
    const monolith = loadFunctions(
      [
        "getMosquitosQuery",
        "cleanText",
        "scanTreeForText",
        "scanImagesForAltText",
        "countDescendants",
        "extractTextContent",
        "nf_getBlocksQuery",
        "gf_getBlocksQuery",
        "nf_hasAnimatedGifContent",
        "gf_hasAnimatedGifContent",
      ],
      { document, NodeFilter, KeyWords, postAtt: "cmfr" }
    );

    expect(hasNewsAnimatedGifContent(post, KeyWords)).toBe(monolith.nf_hasAnimatedGifContent(post));
    expect(hasGroupsAnimatedGifContent(post, KeyWords)).toBe(monolith.gf_hasAnimatedGifContent(post));
  });

  test("sponsored detection matches monolith", () => {
    const post = buildSponsoredPost();
    const KeyWords = { SPONSORED: "Sponsored" };
    const VARS = {
      dictionarySponsored: ["sponsored"],
      isNF: true,
      isSF: false,
      isVF: false,
      isGF: false,
    };

    const monolith = loadFunctions(
      ["nf_isSponsored_Plain", "nf_isSponsored_ShadowRoot1", "nf_isSponsored_ShadowRoot2", "isSponsored"],
      { document, VARS, KeyWords }
    );

    const state = {
      dictionarySponsored: ["sponsored"],
      isNF: true,
      isSF: false,
      isVF: false,
      isGF: false,
    };

    expect(isSponsored(post, state)).toBe(monolith.isSponsored(post));
  });

  test("blocks query selection matches monolith", () => {
    const monolith = loadFunctions(["nf_getBlocksQuery", "gf_getBlocksQuery"], { document });

    const newsPostMany = buildBlocksPost(2, 8);
    const newsPostSingle = buildBlocksPost(1, 8);
    expect(getNewsBlocksQuery(newsPostMany)).toBe(monolith.nf_getBlocksQuery(newsPostMany));
    expect(getNewsBlocksQuery(newsPostSingle)).toBe(monolith.nf_getBlocksQuery(newsPostSingle));

    const groupsPostMany = buildBlocksPost(2, 8);
    const groupsPostSingle = buildBlocksPost(1, 8);
    expect(getGroupsBlocksQuery(groupsPostMany)).toBe(monolith.gf_getBlocksQuery(groupsPostMany));
    expect(getGroupsBlocksQuery(groupsPostSingle)).toBe(monolith.gf_getBlocksQuery(groupsPostSingle));
  });

  test("hide number of shares matches monolith attributes", () => {
    const { post: monolithPost, target: monolithTarget } = buildSharesPost();
    const { post: modulePost, target: moduleTarget } = buildSharesPost();
    const VARS = {
      cssHideNumberOfShares: "hide-shares",
      showAtt: "show-share",
      Options: { VERBOSITY_DEBUG: true },
    };
    const monolith = loadFunctions(["nf_hideNumberOfShares", "gf_hideNumberOfShares"], {
      document,
      VARS,
      postAtt: "cmfr",
    });

    monolith.nf_hideNumberOfShares(monolithPost);
    hideNumberOfShares(modulePost, { cssHideNumberOfShares: "hide-shares", showAtt: "show-share" }, VARS.Options);

    expect(moduleTarget.hasAttribute("hide-shares")).toBe(monolithTarget.hasAttribute("hide-shares"));
    expect(moduleTarget.hasAttribute("show-share")).toBe(monolithTarget.hasAttribute("show-share"));
    expect(moduleTarget.getAttribute("cmfr")).toBe(monolithTarget.getAttribute("cmfr"));

    const { post: monolithPostGf, target: monolithTargetGf } = buildSharesPost();
    const { post: modulePostGf, target: moduleTargetGf } = buildSharesPost();
    monolith.gf_hideNumberOfShares(monolithPostGf);
    hideNumberOfShares(modulePostGf, { cssHideNumberOfShares: "hide-shares", showAtt: "show-share" }, VARS.Options);

    expect(moduleTargetGf.hasAttribute("hide-shares")).toBe(monolithTargetGf.hasAttribute("hide-shares"));
    expect(moduleTargetGf.hasAttribute("show-share")).toBe(monolithTargetGf.hasAttribute("show-share"));
    expect(moduleTargetGf.getAttribute("cmfr")).toBe(monolithTargetGf.getAttribute("cmfr"));
  });
});
