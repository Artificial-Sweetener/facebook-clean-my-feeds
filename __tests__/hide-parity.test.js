const { loadFunctions } = require("../tests/helpers/monolith-loader");
const {
  addCaptionForHiddenPost,
  addMiniCaption,
  hideBlock,
  hideGroupPost,
  hidePost,
  sanitizeReason,
  toggleHiddenElements,
} = require("../src/dom/hide");

function buildPostWithChild() {
  const post = document.createElement("div");
  post.className = "post-class";
  const child = document.createElement("div");
  child.textContent = "child";
  post.appendChild(child);
  return post;
}

function buildContainerWithPost() {
  const container = document.createElement("div");
  const post = buildPostWithChild();
  container.appendChild(post);
  return { container, post };
}

function buildBlockAndLink() {
  const block = document.createElement("div");
  const link = document.createElement("a");
  return { block, link };
}

function buildHiddenElements(state) {
  const container = document.createElement("div");

  const hide = document.createElement("div");
  hide.setAttribute(state.hideAtt, "");
  container.appendChild(hide);

  const block = document.createElement("div");
  block.setAttribute(state.cssHideEl, "");
  container.appendChild(block);

  const share = document.createElement("div");
  share.setAttribute(state.cssHideNumberOfShares, "");
  container.appendChild(share);

  return { container, elements: [hide, block, share] };
}

describe("hide helpers match monolith behavior", () => {
  test("sanitizeReason matches monolith", () => {
    const monolith = loadFunctions(["sanitizeReason"]);
    const samples = ['He said "hi"', '""', "plain"];
    for (const sample of samples) {
      expect(sanitizeReason(sample)).toBe(monolith.sanitizeReason(sample));
    }
  });

  test("addCaptionForHiddenPost matches monolith structure", () => {
    const { container: monolithContainer, post: monolithPost } = buildContainerWithPost();
    const { container: moduleContainer, post: modulePost } = buildContainerWithPost();
    const keyWords = { VERBOSITY_MESSAGE: ["", "Hidden: "] };
    const state = { showAtt: "show-flag" };
    const options = { VERBOSITY_DEBUG: true };
    const attributes = { postAtt: "cmfr" };

    const VARS = { Options: { VERBOSITY_DEBUG: true }, showAtt: "show-flag" };
    const monolith = loadFunctions(["addCaptionForHiddenPost"], {
      document,
      KeyWords: keyWords,
      VARS,
      postAtt: "cmfr",
    });

    monolith.addCaptionForHiddenPost(monolithPost, "Reason", "x");
    addCaptionForHiddenPost(modulePost, "Reason", "x", keyWords, attributes, state, options);

    const monolithDetails = monolithContainer.querySelector("details");
    const moduleDetails = moduleContainer.querySelector("details");

    expect(moduleDetails).not.toBeNull();
    expect(moduleDetails.getAttribute("cmfr")).toBe(monolithDetails.getAttribute("cmfr"));
    expect(moduleDetails.className).toBe(monolithDetails.className);

    const monolithSummary = monolithDetails.querySelector("summary");
    const moduleSummary = moduleDetails.querySelector("summary");
    expect(moduleSummary.textContent).toBe(monolithSummary.textContent);

    expect(moduleDetails.hasAttribute("open")).toBe(monolithDetails.hasAttribute("open"));
    expect(modulePost.hasAttribute("show-flag")).toBe(monolithPost.hasAttribute("show-flag"));
  });

  test("addMiniCaption matches monolith structure", () => {
    const { post: monolithPost } = buildContainerWithPost();
    const { post: modulePost } = buildContainerWithPost();

    const VARS = { hideAtt: "hide-flag" };
    const monolith = loadFunctions(["addMiniCaption"], {
      document,
      VARS,
      postAttTab: "cmftsb",
    });

    monolith.addMiniCaption(monolithPost, "Reason");
    addMiniCaption(modulePost, "Reason", { postAttTab: "cmftsb" }, { hideAtt: "hide-flag" });

    const monolithTab = monolithPost.querySelector("h6");
    const moduleTab = modulePost.querySelector("h6");
    expect(moduleTab.textContent).toBe(monolithTab.textContent);
    expect(moduleTab.getAttribute("cmftsb")).toBe(monolithTab.getAttribute("cmftsb"));
    expect(modulePost.hasAttribute("hide-flag")).toBe(monolithPost.hasAttribute("hide-flag"));
  });

  test("hideBlock matches monolith attributes", () => {
    const { block: monolithBlock, link: monolithLink } = buildBlockAndLink();
    const { block: moduleBlock, link: moduleLink } = buildBlockAndLink();

    const VARS = {
      Options: { VERBOSITY_DEBUG: true },
      cssHideEl: "hide-el",
      showAtt: "show-el",
    };
    const monolith = loadFunctions(["hideBlock", "sanitizeReason"], {
      document,
      VARS,
      postAtt: "cmfr",
    });

    monolith.hideBlock(monolithBlock, monolithLink, "Reason");
    hideBlock(
      moduleBlock,
      moduleLink,
      "Reason",
      { cssHideEl: "hide-el", showAtt: "show-el" },
      { VERBOSITY_DEBUG: true },
      { postAtt: "cmfr" }
    );

    expect(moduleBlock.hasAttribute("hide-el")).toBe(monolithBlock.hasAttribute("hide-el"));
    expect(moduleBlock.hasAttribute("show-el")).toBe(monolithBlock.hasAttribute("show-el"));
    expect(moduleLink.getAttribute("cmfr")).toBe(monolithLink.getAttribute("cmfr"));
  });

  test("toggleHiddenElements matches monolith attributes", () => {
    const state = {
      hideAtt: "hide-flag",
      cssHideEl: "hide-el",
      cssHideNumberOfShares: "hide-shares",
      showAtt: "show-flag",
    };
    const { elements: monolithElements } = buildHiddenElements(state);
    const { elements: moduleElements } = buildHiddenElements(state);

    const VARS = {
      Options: { VERBOSITY_DEBUG: true },
      hideAtt: "hide-flag",
      cssHideEl: "hide-el",
      cssHideNumberOfShares: "hide-shares",
      showAtt: "show-flag",
    };
    const monolith = loadFunctions(["toggleHiddenElements"], { document, VARS });

    monolith.toggleHiddenElements();
    toggleHiddenElements(state, { VERBOSITY_DEBUG: true });

    for (let i = 0; i < monolithElements.length; i += 1) {
      expect(moduleElements[i].hasAttribute("show-flag")).toBe(
        monolithElements[i].hasAttribute("show-flag")
      );
    }
  });

  test("hidePost matches monolith nf_hidePost", () => {
    const { container: monolithContainer, post: monolithPost } = buildContainerWithPost();
    const { container: moduleContainer, post: modulePost } = buildContainerWithPost();
    const keyWords = { VERBOSITY_MESSAGE: ["", "Hidden: "] };

    const VARS = {
      Options: { VERBOSITY_LEVEL: "1", VERBOSITY_DEBUG: false },
      hideAtt: "hide-flag",
      showAtt: "show-flag",
    };
    const monolith = loadFunctions(["nf_hidePost", "addCaptionForHiddenPost", "sanitizeReason"], {
      document,
      KeyWords: keyWords,
      VARS,
      postAtt: "cmfr",
    });

    monolith.nf_hidePost(monolithPost, "Reason", "~");
    hidePost(modulePost, "Reason", "~", {
      options: { VERBOSITY_LEVEL: "1", VERBOSITY_DEBUG: false },
      keyWords,
      attributes: { postAtt: "cmfr", postAttTab: "cmftsb" },
      state: { hideAtt: "hide-flag", showAtt: "show-flag" },
    });

    const monolithDetails = monolithContainer.querySelector("details");
    const moduleDetails = moduleContainer.querySelector("details");
    expect(moduleDetails.getAttribute("cmfr")).toBe(monolithDetails.getAttribute("cmfr"));
  });

  test("hideGroupPost matches monolith gf_hidePost at verbosity 0", () => {
    const { post: monolithPost } = buildContainerWithPost();
    const { post: modulePost } = buildContainerWithPost();
    const keyWords = { VERBOSITY_MESSAGE: ["", "Hidden: "] };

    const VARS = {
      Options: { VERBOSITY_LEVEL: "0", VERBOSITY_DEBUG: true },
      hideAtt: "hide-flag",
      showAtt: "show-flag",
    };
    const monolith = loadFunctions(["gf_hidePost", "addMiniCaption", "sanitizeReason"], {
      document,
      KeyWords: keyWords,
      VARS,
      postAtt: "cmfr",
      postAttTab: "cmftsb",
    });

    monolith.gf_hidePost(monolithPost, "Reason", "~");
    hideGroupPost(modulePost, "Reason", "~", {
      options: { VERBOSITY_LEVEL: "0", VERBOSITY_DEBUG: true },
      keyWords,
      state: { hideAtt: "hide-flag", showAtt: "show-flag" },
    });

    expect(modulePost.hasAttribute("hide-flag")).toBe(monolithPost.hasAttribute("hide-flag"));
    expect(modulePost.hasAttribute("show-flag")).toBe(monolithPost.hasAttribute("show-flag"));
    expect(modulePost.getAttribute("cmfr")).toBe(monolithPost.getAttribute("cmfr"));
  });
});
