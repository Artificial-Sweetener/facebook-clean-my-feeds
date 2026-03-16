const { buildBugReport, getSupportUrl } = require("../../../src/ui/reporting/bug-report");
const { postAtt } = require("../../../src/dom/attributes");

function attachSuggestionFiber(button, { promptId, genAISessionID, suggestionKey }) {
  const suggestionFiber = {
    key: suggestionKey,
    memoizedProps: {
      promptId,
      genAISessionID,
    },
    return: null,
  };
  button.__reactFiber$test = {
    key: "button",
    memoizedProps: {},
    return: suggestionFiber,
  };
}

describe("ui/reporting/bug-report", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    delete global.GM;
  });

  test("getSupportUrl falls back without GM", () => {
    expect(getSupportUrl()).toContain("github.com");
  });

  test("getSupportUrl reads GM support url when available", () => {
    global.GM = { info: { script: { supportURL: "https://example.com/support" } } };
    expect(getSupportUrl()).toBe("https://example.com/support");
  });

  test("buildBugReport returns error without context", () => {
    const report = buildBugReport(null);
    expect(report.data.error).toBe("No context available.");
    expect(report.text).toBe("");
  });

  test("buildBugReport redacts blocked options and filters", () => {
    const state = {
      isNF: false,
      isGF: false,
      isVF: false,
      isMF: false,
      isSF: false,
      isRF: false,
      isPP: false,
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
    };
    const options = {
      NF_BLOCKED_TEXT: "secret",
      MP_BLOCKED_TEXT_DESCRIPTION: "secret2",
    };
    const filters = {
      NF_BLOCKED_TEXT_LC: ["secret"],
      MP_BLOCKED_TEXT_DESCRIPTION_LC: ["secret2"],
    };
    const keyWords = { SOME_REASON: "Hidden" };
    const pathInfo = {};

    const hidden = document.createElement("div");
    hidden.setAttribute(postAtt, "Hidden");
    const hiddenContainer = document.createElement("div");
    hiddenContainer.setAttribute(state.hideAtt, "");
    const hiddenRow = document.createElement("div");
    hiddenRow.setAttribute(state.hideWithNoCaptionAtt, "");
    document.body.append(hidden, hiddenContainer, hiddenRow);

    const report = buildBugReport({ state, options, filters, keyWords, pathInfo });

    expect(report.data.options.NF_BLOCKED_TEXT).toBe("[redacted]");
    expect(report.data.filters.NF_BLOCKED_TEXT_LC).toBe("[redacted]");
    expect(report.data.blockedFilters.NF_BLOCKED_TEXT_LC.count).toBe(1);
    expect(report.data.hidden.reasonCounts.Hidden).toBe(1);
    expect(report.data.hidden.hiddenElements.hiddenNoCaptionRows).toBe(1);
    expect(report.text).toContain('"generatedAt"');
  });

  test("buildBugReport includes NF_META_AI_PROMPTS sample matches", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div aria-posinset="1">
          <a href="/DemocraticSocialismNow">Democratic Socialism Now</a>
          <div class="prompt-row">
            <div class="prompt-strip">
              <div data-type="hscroll-child"><div role="button">Prompt 1</div></div>
              <div data-type="hscroll-child"><div role="button">Prompt 2</div></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const buttons = document.querySelectorAll('[data-type="hscroll-child"] [role="button"]');
    attachSuggestionFiber(buttons[0], {
      promptId: "prompt-1",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-0",
    });
    attachSuggestionFiber(buttons[1], {
      promptId: "prompt-2",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-1",
    });

    const state = {
      isNF: true,
      isGF: false,
      isVF: false,
      isMF: false,
      isSF: false,
      isRF: false,
      isPP: false,
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
      vfType: "",
      gfType: "",
      mpType: "",
    };
    const options = {
      NF_SPONSORED: false,
      NF_SUGGESTIONS: false,
      NF_REELS_SHORT_VIDEOS: false,
      NF_SHORT_REEL_VIDEO: false,
      NF_META_AI: false,
      NF_META_AI_PROMPTS: true,
      NF_PAID_PARTNERSHIP: false,
      NF_PEOPLE_YOU_MAY_KNOW: false,
      NF_FOLLOW: false,
      NF_PARTICIPATE: false,
      NF_SPONSORED_PAID: false,
      NF_EVENTS_YOU_MAY_LIKE: false,
      NF_STORIES: false,
      NF_ANIMATED_GIFS_POSTS: false,
      NF_BLOCKED_ENABLED: false,
      NF_LIKES_MAXIMUM: false,
      NF_SHARES: false,
    };
    const report = buildBugReport({
      state,
      options,
      filters: {},
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
      pathInfo: {},
    });

    expect(report.data.samples.summary.NF_META_AI_PROMPTS).toBe(1);
  });
});
