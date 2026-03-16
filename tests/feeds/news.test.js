const {
  findTopCardsForPagesContainer,
  findMetaAiPromptSuggestionRows,
  getMetaAiSuggestionChipSignal,
  hasMetaAiPromptSuggestionRow,
  hideMetaAiPromptSuggestionRows,
  inspectMetaAiPromptRows,
  isNewsFollow,
  isMetaAiPromptSuggestionRow,
  isNewsParticipate,
  isNewsVerifiedBadge,
  getSidePanelAiTargets,
  mopNewsFeed,
  scrubMetaAiPromptSuggestions,
} = require("../../src/feeds/news");
const { disconnectDirtyObserver } = require("../../src/dom/dirty-check");
const { postAtt } = require("../../src/dom/attributes");
const { newsSelectors } = require("../../src/selectors/news");

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

function createMetaAiPromptRow({
  includeSignals = true,
  includeSecondSignal = true,
  includePromptIcon = true,
  includeFeedbackIcon = true,
  feedbackAriaLabel = "Feedback",
  feedbackIconRole = "img",
} = {}) {
  const outer = document.createElement("div");
  const inner = document.createElement("div");
  const strip = document.createElement("div");
  const buttons = [];

  outer.appendChild(inner);
  inner.appendChild(strip);

  for (let index = 0; index < 3; index += 1) {
    const chip = document.createElement("div");
    chip.setAttribute("data-type", "hscroll-child");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    if (index === 0) {
      if (includePromptIcon) {
        const icon = document.createElement("i");
        icon.setAttribute("role", "img");
        button.appendChild(icon);
      }
      button.append("Prompt 1");
    } else if (index === 1) {
      button.textContent = "Prompt 2";
    } else {
      if (feedbackAriaLabel !== null) {
        button.setAttribute("aria-label", feedbackAriaLabel);
      }
      if (includeFeedbackIcon) {
        const icon = document.createElement("i");
        if (feedbackIconRole) {
          icon.setAttribute("role", feedbackIconRole);
        }
        button.appendChild(icon);
      }
    }
    chip.appendChild(button);
    strip.appendChild(chip);
    buttons.push(button);

    if (index < 2 && includeSignals && (includeSecondSignal || index === 0)) {
      attachSuggestionFiber(button, {
        promptId: `prompt-${index + 1}`,
        genAISessionID: "session-1",
        suggestionKey: `suggestion-${index}`,
      });
    }
  }

  return { outer, inner, buttons };
}

function createPostWithRow(row) {
  const post = document.createElement("div");
  post.setAttribute("aria-posinset", "1");
  const pageLink = document.createElement("a");
  pageLink.href = "/DemocraticSocialismNow";
  pageLink.textContent = "Democratic Socialism Now";
  post.append(pageLink, row);
  return post;
}

function createNewsContext({ options = {}, keyWords = {} } = {}) {
  const context = {
    state: {
      forceProcess: false,
      isNF: true,
      noChangeCounter: 0,
      lastNewsPostSweepAt: 0,
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      showAtt: "show",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
      cssHideVerifiedBadge: "hideBadge",
      hideAnInfoBox: false,
    },
    options: {
      VERBOSITY_LEVEL: "0",
      VERBOSITY_DEBUG: false,
      NF_META_AI_PROMPTS: false,
      NF_TABLIST_STORIES_REELS_ROOMS: false,
      NF_SURVEY: false,
      NF_TOP_CARDS_PAGES: false,
      NF_HIDE_VERIFIED_BADGE: false,
      NF_AI_SIDE_PANELS: false,
      NF_SPONSORED: false,
      NF_SUGGESTIONS: false,
      NF_REELS_SHORT_VIDEOS: false,
      NF_SHORT_REEL_VIDEO: false,
      NF_META_AI: false,
      NF_PAID_PARTNERSHIP: false,
      NF_PEOPLE_YOU_MAY_KNOW: false,
      NF_FOLLOW: false,
      NF_PARTICIPATE: false,
      NF_SPONSORED_PAID: false,
      NF_EVENTS_YOU_MAY_LIKE: false,
      NF_FILTER_VERIFIED_BADGE: false,
      NF_STORIES: false,
      NF_ANIMATED_GIFS_POSTS: false,
      NF_BLOCKED_ENABLED: false,
      NF_LIKES_MAXIMUM: false,
      NF_LIKES_MAXIMUM_COUNT: "",
      NF_ANIMATED_GIFS_PAUSE: false,
      NF_SHARES: false,
      ...options,
    },
    filters: {},
    keyWords,
    pathInfo: {},
  };

  context.state.options = context.options;
  return context;
}

function createSponsoredPost({ labelId = "sponsored-label" } = {}) {
  const post = document.createElement("div");
  post.setAttribute("aria-posinset", "1");

  const pageLink = document.createElement("a");
  pageLink.href = "/DemocraticSocialismNow";
  pageLink.textContent = "Democratic Socialism Now";

  const labelProxy = document.createElement("span");
  labelProxy.setAttribute("aria-labelledby", labelId);

  post.append(pageLink, labelProxy);
  return post;
}

function appendSponsoredLinkSignature(post, hrefLength = 320) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-posinset", "1");
  const span = document.createElement("span");
  const link = document.createElement("a");
  link.href = `/foo?__cft__[0]=${"a".repeat(hrefLength)}`;
  span.appendChild(link);
  wrapper.appendChild(span);
  post.appendChild(wrapper);
}

describe("feeds/news", () => {
  test("findTopCardsForPagesContainer finds the top cards region", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div role="region" aria-label="profile plus top of feed cards">
          <a href="/stories/">Stories</a>
          <a href="/reel/">Reels</a>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const container = findTopCardsForPagesContainer(mainColumn);

    expect(container).not.toBeNull();
    expect(container.getAttribute("role")).toBe("region");
    expect(container.querySelector('a[href="/stories/"]')).not.toBeNull();
    expect(container.querySelector('a[href="/reel/"]')).not.toBeNull();
  });

  test("findTopCardsForPagesContainer ignores links inside articles", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div role="article">
          <a href="/stories/">Stories</a>
          <a href="/reel/">Reels</a>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const container = findTopCardsForPagesContainer(mainColumn);

    expect(container).toBeNull();
  });

  test("isNewsFollow detects header follow posts without group links", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const headerLink = document.createElement("a");
    headerLink.href = "https://www.facebook.com/StupidFish";
    headerLink.textContent = "Stupid Fish";
    const followButton = document.createElement("div");
    followButton.setAttribute("role", "button");
    followButton.textContent = "Follow";
    header.appendChild(headerLink);
    header.appendChild(followButton);
    post.appendChild(header);

    const keyWords = { NF_FOLLOW: "Follow" };

    expect(isNewsFollow(post, keyWords)).toBe("Follow");
  });

  test("isNewsParticipate detects header join posts with group links", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const groupLink = document.createElement("a");
    groupLink.href = "/groups/2211776349135268/";
    groupLink.textContent = "Elden Ring: The Community";
    const joinButton = document.createElement("div");
    joinButton.setAttribute("role", "button");
    joinButton.textContent = "Join";
    header.appendChild(groupLink);
    header.appendChild(joinButton);
    post.appendChild(header);

    const keyWords = { NF_PARTICIPATE: "Participate / Join" };

    expect(isNewsParticipate(post, keyWords)).toBe("Participate / Join");
  });

  test("isNewsFollow ignores follow text without structural follow signals", () => {
    const post = document.createElement("div");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    button.textContent = "Seguir";
    post.appendChild(button);

    const keyWords = { NF_FOLLOW: "Follow" };

    expect(isNewsFollow(post, keyWords)).toBe("");
  });

  test("isNewsParticipate ignores join text without structural participate signals", () => {
    const post = document.createElement("div");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    button.textContent = "Join";
    post.appendChild(button);

    const keyWords = { NF_PARTICIPATE: "Participate / Join" };

    expect(isNewsParticipate(post, keyWords)).toBe("");
  });

  test("isNewsVerifiedBadge detects verified badge in header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const badge = document.createElement("svg");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });

  test("isNewsVerifiedBadge detects verified badge in shared header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h5");
    const badge = document.createElement("svg");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });

  test("getSidePanelAiTargets finds Meta AI and Manus AI items", () => {
    document.body.innerHTML = `
      <div role="navigation">
        <ul>
          <li><a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.meta.ai%2F">Meta AI</a></li>
          <li>Manus AI</li>
          <li>Friends</li>
        </ul>
      </div>
      <div role="complementary">
        <ul>
          <li><a href="/messages/t/36327,2227039302/">Meta AI</a></li>
          <li><a href="/messages/t/12345/">Someone Else</a></li>
        </ul>
      </div>
    `;

    const targets = getSidePanelAiTargets();
    expect(targets.length).toBe(3);
  });

  test("getMetaAiSuggestionChipSignal extracts the stable React chip props", () => {
    const { buttons } = createMetaAiPromptRow();

    expect(getMetaAiSuggestionChipSignal(buttons[0])).toEqual({
      promptId: "prompt-1",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-0",
    });
  });

  test("findMetaAiPromptSuggestionRows detects Meta AI prompt rows", () => {
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);

    const rows = findMetaAiPromptSuggestionRows(post);

    expect(rows).toEqual([outer]);
    expect(hasMetaAiPromptSuggestionRow(post)).toBe(true);
  });

  test("findMetaAiPromptSuggestionRows ignores similar chip rows without the prompt DOM signature", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const firstButtonIcon = outer.querySelector('i[role="img"]');
    firstButtonIcon.remove();
    const post = createPostWithRow(outer);

    expect(findMetaAiPromptSuggestionRows(post)).toEqual([]);
    expect(hasMetaAiPromptSuggestionRow(post)).toBe(false);
  });

  test("inspectMetaAiPromptRows returns confirmed rows and unresolved candidate state", () => {
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);

    const inspection = inspectMetaAiPromptRows(post);

    expect(inspection.confirmedRows).toEqual([outer]);
    expect(inspection.hasUnresolvedCandidates).toBe(false);
  });

  test("hideMetaAiPromptSuggestionRows hides the outermost matching row", () => {
    const { outer, inner } = createMetaAiPromptRow();
    const context = createNewsContext({
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    hideMetaAiPromptSuggestionRows([outer], context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute("hideNoCaption")).toBe(true);
    expect(inner.hasAttribute(postAtt)).toBe(false);
  });

  test("isMetaAiPromptSuggestionRow returns false when React fiber data is unavailable and the DOM shape does not match", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const firstButtonIcon = outer.querySelector('i[role="img"]');
    firstButtonIcon.remove();

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(false);
  });

  test("isMetaAiPromptSuggestionRow falls back to the DOM signature when React fiber data is unavailable", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(true);
  });

  test("isMetaAiPromptSuggestionRow accepts feedback chips that use a plain icon element", () => {
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      feedbackIconRole: null,
    });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(true);
  });

  test("isMetaAiPromptSuggestionRow rejects rows without a feedback marker", () => {
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      includeFeedbackIcon: false,
      feedbackAriaLabel: null,
    });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(false);
  });

  test("hideMetaAiPromptSuggestionRows adds the debug marker when highlighting is enabled", () => {
    const { outer } = createMetaAiPromptRow();
    const context = createNewsContext({
      options: { VERBOSITY_DEBUG: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    hideMetaAiPromptSuggestionRows([outer], context);

    expect(outer.hasAttribute(context.state.showAtt)).toBe(true);
  });

  test("scrubMetaAiPromptSuggestions hides rendered prompt rows from the feed root in one pass", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    expect(scrubMetaAiPromptSuggestions(context, mainColumn)).toBe(true);
    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
  });

  test("scrubMetaAiPromptSuggestions ignores similar chip rows that do not confirm", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      includeFeedbackIcon: false,
      feedbackAriaLabel: null,
    });
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    expect(scrubMetaAiPromptSuggestions(context, mainColumn)).toBe(false);
    expect(outer.hasAttribute(postAtt)).toBe(false);
  });

  test("mopNewsFeed scrubs prompt rows from the feed root without relying on post collection", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const { outer } = createMetaAiPromptRow();
    mainColumn.appendChild(outer);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed scrubs prompt rows nested inside posts through the root scrubber", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed hides prompt rows via the DOM fallback when direct fiber access is blocked", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true, VERBOSITY_DEBUG: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    expect(outer.hasAttribute(context.state.showAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed prefers real post selectors over fallback wrappers", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <h3 dir="auto">Feed</h3>
        <div>
          <div><div><div><div><div id="fallback-wrapper">Wrapper</div></div></div></div></div>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const post = createSponsoredPost({ labelId: "sponsored-label-priority" });
    appendSponsoredLinkSignature(post);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(post.getAttribute(postAtt)).toBe("Sponsored");
    expect(document.getElementById("fallback-wrapper").hasAttribute(postAtt)).toBe(false);
  });

  test("mopNewsFeed ignores sponsored labels that appear later without an agnostic signal", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
      <div id="outside-root"></div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const post = createSponsoredPost({ labelId: "sponsored-label-late" });
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);

    const outsideRoot = document.getElementById("outside-root");
    const sponsoredLabel = document.createElement("span");
    sponsoredLabel.id = "sponsored-label-late";
    sponsoredLabel.textContent = "Sponsored";
    outsideRoot.appendChild(sponsoredLabel);

    context.state.lastNewsPostSweepAt = 0;

    mopNewsFeed(context);

    expect(post.hasAttribute(postAtt)).toBe(false);
  });
});
