const { cleanText } = require("../core/filters/text-normalize");
const { getFullNumber } = require("../core/filters/classifiers/shares-likes");
const { mainColumnAtt, postAtt, postAttChildFlag, postAttTab } = require("../dom/attributes");
const { swatTheMosquitos } = require("../dom/animated-gifs");
const {
  ensureDirtyObserver,
  getDirtyToken,
  hasPostChanged,
  isElementDirty,
  markElementCleanIfUnchanged,
  markElementDirty,
  resetPostState,
  trackPostSignature,
} = require("../dom/dirty-check");
const { doLightDusting } = require("../dom/dusting");
const { hideNewsPost, hideFeature, hideFeatureNoCaption } = require("../dom/hide");
const { scrubInfoBoxes } = require("../dom/info-boxes");
const { extractTextContent, scanTreeForText } = require("../dom/walker");
const { climbUpTheTree, querySelectorAllNoChildren } = require("../utils/dom");
const { newsSelectors } = require("../selectors/news");

const { findNewsBlockedText } = require("./shared/blocked-text");
const { hasNewsAnimatedGifContent } = require("./shared/animated-gifs");
const { getNewsBlocksQuery } = require("./shared/blocks");
const { isSponsored } = require("./shared/sponsored");
const { hideNumberOfShares } = require("./shared/shares");

function isNewsDirty(state) {
  const arrReturn = [null, null];
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  if (mainColumn) {
    ensureDirtyObserver(mainColumn);
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
      markElementDirty(mainColumn);
    }
    if (state && state.forceProcess) {
      markElementDirty(mainColumn);
    }
    if (state && state.forceProcess) {
      arrReturn[0] = mainColumn;
    } else if (isElementDirty(mainColumn)) {
      arrReturn[0] = mainColumn;
    } else if (state) {
      const currentCount = getNewsPostCount(state);
      if (currentCount !== state.lastNewsPostCount) {
        state.lastNewsPostCount = currentCount;
        markElementDirty(mainColumn);
        arrReturn[0] = mainColumn;
      }
    }
  }

  const elDialog = document.querySelector(newsSelectors.dialog);
  if (elDialog) {
    ensureDirtyObserver(elDialog);
    if (!elDialog.hasAttribute(mainColumnAtt)) {
      elDialog.setAttribute(mainColumnAtt, "1");
      markElementDirty(elDialog);
    }
    if (state && state.forceProcess) {
      markElementDirty(elDialog);
    }
    if (state && state.forceProcess) {
      arrReturn[1] = elDialog;
    } else if (isElementDirty(elDialog)) {
      arrReturn[1] = elDialog;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return arrReturn;
}

function getCollectionOfNewsPosts(state) {
  if (state && typeof state.newsPostQuery === "string" && state.newsPostQuery !== "") {
    const cachedNodeList = document.querySelectorAll(state.newsPostQuery);
    if (cachedNodeList.length > 0) {
      return Array.from(cachedNodeList);
    }
  }

  let posts = [];
  for (const query of newsSelectors.postQueries) {
    const nodeList = document.querySelectorAll(query);
    if (nodeList.length > 0) {
      posts = Array.from(nodeList);
      if (state) {
        state.newsPostQuery = query;
      }
      break;
    }
  }
  if (posts.length === 0 && state) {
    state.newsPostQuery = "";
  }
  return posts;
}

function getNewsPostCount(state) {
  if (state && typeof state.newsPostQuery === "string" && state.newsPostQuery !== "") {
    return document.querySelectorAll(state.newsPostQuery).length;
  }

  return document.querySelectorAll(
    'div[role="main"] div[aria-posinset], div[role="main"] div[role="article"]'
  ).length;
}

function isNewsSuggested(post, state, keyWords) {
  const queries = [
    "div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
    "div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)",
  ];

  const elSuggestion = querySelectorAllNoChildren(post, queries, 1);
  if (elSuggestion.length > 0) {
    if (isNewsReelsAndShortVideos(post, state, keyWords).length > 0) {
      return "";
    }
    const pattern =
      /([0-9]|[\u0660-\u0669]|[\u06F0-\u06F9]|[\u0966-\u096F]|[\u09E6-\u09EF]|[\u1040-\u1049]|[\u0E50-\u0E59]|[\u0F20-\u0F29])/;
    const firstCharacter = cleanText(elSuggestion[0].textContent).trim().slice(0, 1);
    return pattern.test(firstCharacter) ? "" : keyWords.NF_SUGGESTIONS;
  }
  if (isGroupsYouMightLike(post)) {
    return keyWords.NF_SUGGESTIONS;
  }
  return "";
}

function isGroupsYouMightLike(post) {
  const query = 'a[href*="/groups/discover"]';
  const results = post.querySelectorAll(query);
  return results.length > 0;
}

function isNewsPeopleYouMayKnow(post, keyWords) {
  const queryPYMK = 'a[href*="/friends/"][role="link"]';
  const linksPYMK = post.querySelectorAll(queryPYMK);
  return linksPYMK.length === 0 ? "" : keyWords.NF_PEOPLE_YOU_MAY_KNOW;
}

function isNewsPaidPartnership(post, keyWords) {
  const queryPP = 'span[dir] > span[id] a[href^="/business/help/"]';
  const elPaidPartnership = post.querySelector(queryPP);
  return elPaidPartnership === null ? "" : keyWords.NF_PAID_PARTNERSHIP;
}

function isNewsSponsoredPaidBy(post, keyWords) {
  const querySPB =
    "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)";
  const sponsoredPaidBy = querySelectorAllNoChildren(post, querySPB, 1);
  return sponsoredPaidBy.length === 0 ? "" : keyWords.NF_SPONSORED_PAID;
}

function isNewsReelsAndShortVideos(post, state, keyWords) {
  const queryReelsAndShortVideos = 'a[href="/reel/?s=ifu_see_more"]';
  const elReelsAndShortVideos = post.querySelector(queryReelsAndShortVideos);
  if (elReelsAndShortVideos !== null) {
    return keyWords.NF_REELS_SHORT_VIDEOS;
  }

  const queryManyReels = 'a[href*="/reel/"]';
  const manyReels = post.querySelectorAll(queryManyReels);
  if (manyReels.length > 4) {
    return keyWords.NF_REELS_SHORT_VIDEOS;
  }

  const buttonDiv = post.querySelector('div[role="button"] > i ~ div');
  if (buttonDiv && buttonDiv.textContent) {
    const buttonText = buttonDiv.textContent.trim().toLowerCase();
    if (state.dictionaryReelsAndShortVideos.find((item) => item === buttonText)) {
      return keyWords.NF_REELS_SHORT_VIDEOS;
    }
  }

  return "";
}

function isNewsShortReelVideo(post, keyWords) {
  const querySRV = 'a[href*="/reel/"]';
  const elementsSRV = Array.from(post.querySelectorAll(querySRV));
  return elementsSRV.length !== 1 ? "" : keyWords.NF_SHORT_REEL_VIDEO;
}

function isNewsEventsYouMayLike(post, keyWords) {
  const query = ":scope div > div:nth-of-type(2) > div > div >  h3 > span";
  const events = querySelectorAllNoChildren(post, query, 0);
  return events.length === 0 ? "" : keyWords.NF_EVENTS_YOU_MAY_LIKE;
}

function isNewsFollow(post, state, keyWords) {
  const header = post.querySelector("h4");
  if (header) {
    const headerButtons = header.querySelectorAll('[role="button"]');
    if (headerButtons.length > 0) {
      const headerLinks = Array.from(header.querySelectorAll("a[href]"))
        .map((link) => link.getAttribute("href"))
        .filter((href) => typeof href === "string" && href !== "");
      const hasGroupLink = headerLinks.some((href) => href.includes("/groups/"));
      const hasPageLink = headerLinks.some((href) => !href.includes("/groups/"));
      if (hasPageLink && !hasGroupLink) {
        return keyWords.NF_FOLLOW;
      }
    }
  }

  const queryFollow = [
    ":scope h4[id] > span > div > span",
    ":scope h4[id] > span > span > div > span",
    ":scope h4[id] > div > span > span[class] > div[class] > span[class]",
  ];
  const elementsFollow = querySelectorAllNoChildren(post, queryFollow, 0, false);
  if (elementsFollow.length === 1) {
    return keyWords.NF_FOLLOW;
  }

  if (Array.isArray(state.dictionaryFollow) && state.dictionaryFollow.length > 0) {
    const normaliseToLower = (value) => {
      if (!value || typeof value !== "string") {
        return "";
      }
      try {
        return value.normalize("NFKC").toLowerCase();
      } catch (err) {
        return value.toLowerCase();
      }
    };

    const hasFollowKeyword = (value) => {
      const normalised = normaliseToLower(value);
      return (
        normalised !== "" && state.dictionaryFollow.some((keyword) => normalised.includes(keyword))
      );
    };

    const followButton = Array.from(
      post.querySelectorAll('a[role="button"], div[role="button"], span[role="button"]')
    ).find((button) => {
      const ariaLabel =
        button && typeof button.getAttribute === "function"
          ? button.getAttribute("aria-label")
          : "";
      const buttonText = button && typeof button.textContent === "string" ? button.textContent : "";
      return hasFollowKeyword(ariaLabel) || hasFollowKeyword(buttonText);
    });
    if (followButton) {
      return keyWords.NF_FOLLOW;
    }

    const blocks = post.querySelectorAll(getNewsBlocksQuery(post));
    if (blocks.length > 0) {
      const headerText = normaliseToLower(scanTreeForText(blocks[0]).join(" "));
      if (
        headerText !== "" &&
        state.dictionaryFollow.some((keyword) => headerText.includes(keyword))
      ) {
        return keyWords.NF_FOLLOW;
      }
    }
  }

  return "";
}

function isNewsParticipate(post, keyWords) {
  const header = post.querySelector("h4");
  if (header) {
    const headerButtons = header.querySelectorAll('[role="button"]');
    if (headerButtons.length > 0) {
      const headerLinks = Array.from(header.querySelectorAll("a[href]"))
        .map((link) => link.getAttribute("href"))
        .filter((href) => typeof href === "string" && href !== "");
      const hasGroupLink = headerLinks.some((href) => href.includes("/groups/"));
      if (hasGroupLink) {
        return keyWords.NF_PARTICIPATE;
      }
    }
  }

  const query = ":scope h4 > span > span[class] > span";
  const elements = querySelectorAllNoChildren(post, query, 0);
  if (elements.length === 1) {
    return keyWords.NF_PARTICIPATE;
  }

  const keywords = [keyWords.NF_PARTICIPATE, "Join"]
    .filter((value) => typeof value === "string" && value.trim() !== "")
    .map((value) => value.toLowerCase());
  if (keywords.length === 0) {
    return "";
  }

  const hasKeyword = (value) => {
    if (!value || typeof value !== "string") {
      return false;
    }
    const normalised = value.toLowerCase();
    return keywords.some((keyword) => normalised.includes(keyword));
  };

  const participateButton = Array.from(
    post.querySelectorAll('a[role="button"], div[role="button"], span[role="button"]')
  ).find((button) => {
    const ariaLabel =
      button && typeof button.getAttribute === "function" ? button.getAttribute("aria-label") : "";
    const buttonText = button && typeof button.textContent === "string" ? button.textContent : "";
    return hasKeyword(ariaLabel) || hasKeyword(buttonText);
  });
  if (participateButton) {
    return keyWords.NF_PARTICIPATE;
  }

  const blocks = post.querySelectorAll(getNewsBlocksQuery(post));
  if (blocks.length > 0) {
    const headerText = scanTreeForText(blocks[0]).join(" ").toLowerCase();
    if (headerText && keywords.some((keyword) => headerText.includes(keyword))) {
      return keyWords.NF_PARTICIPATE;
    }
  }

  return "";
}

function isNewsMetaAICard(post, keyWords) {
  const selectors = [
    'a[aria-label="Visit Meta AI"]',
    'a[aria-label="Meta AI branding"]',
    'a[href*="meta.ai"]',
  ];
  if (selectors.some((selector) => post.querySelector(selector))) {
    return keyWords.NF_META_AI;
  }

  const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3).join(" ").toLowerCase();
  if (postTexts.includes("try meta ai") || postTexts.includes("free ai creation tools")) {
    return keyWords.NF_META_AI;
  }

  return "";
}

function isNewsStoriesPost(post, keyWords) {
  const queryForStory = '[href^="/stories/"][href*="source=from_feed"]';
  const elStory = post.querySelector(queryForStory);
  return elStory ? keyWords.NF_STORIES : "";
}

function isNewsVerifiedBadge(post, keyWords) {
  const headerBadge = post.querySelector("h4 svg, h5 svg");
  if (!headerBadge) {
    return "";
  }

  return keyWords.NF_FILTER_VERIFIED_BADGE;
}

function findTopCardsForPagesContainer(mainColumn) {
  if (!mainColumn) {
    return null;
  }

  const labelledRegion = mainColumn.querySelector(
    'div[role="region"][aria-label="profile plus top of feed cards"]'
  );
  if (labelledRegion) {
    return labelledRegion;
  }

  const anchors = Array.from(mainColumn.querySelectorAll('a[href="/reel/"], a[href="/stories/"]'));
  if (anchors.length === 0) {
    return null;
  }

  const candidates = new Set();
  anchors.forEach((anchor) => {
    if (anchor.closest('div[role="article"], div[aria-posinset]')) {
      return;
    }
    const region = anchor.closest('div[role="region"]');
    if (region && mainColumn.contains(region)) {
      candidates.add(region);
    }
  });

  for (const region of candidates) {
    if (region.querySelector('a[href="/reel/"]') && region.querySelector('a[href="/stories/"]')) {
      return region;
    }
  }

  const reelsLink = anchors.find(
    (anchor) =>
      anchor.getAttribute("href") === "/reel/" &&
      !anchor.closest('div[role="article"], div[aria-posinset]')
  );
  const storiesLink = anchors.find(
    (anchor) =>
      anchor.getAttribute("href") === "/stories/" &&
      !anchor.closest('div[role="article"], div[aria-posinset]')
  );
  if (!reelsLink || !storiesLink) {
    return null;
  }

  let node = reelsLink.parentElement;
  while (node && node !== mainColumn) {
    if (node.contains(storiesLink)) {
      return node;
    }
    node = node.parentElement;
  }

  return null;
}

function cleanConsoleTable(findItem, context) {
  const { keyWords, state, options } = context;
  if (!keyWords || !state || !options) {
    return;
  }

  const query =
    'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
  const asideBoxes = document.querySelectorAll(query);
  if (asideBoxes.length === 0) {
    return;
  }

  const asideContainer = asideBoxes[0];
  if (asideContainer.childElementCount === 0) {
    return;
  }

  let elItem = null;
  let reason = "";
  if (findItem === "Sponsored") {
    elItem = asideContainer.querySelector(`:scope > span:not([${postAtt}])`);
    if (elItem && elItem.innerHTML.length > 0) {
      reason = keyWords.SPONSORED;
    }
  } else if (findItem === "Suggestions") {
    elItem = asideContainer.querySelector(`:scope > div:not([${postAtt}])`);
    if (elItem && elItem.innerHTML.length > 0) {
      const birthdays = elItem.querySelectorAll('a[href="/events/birthdays/"]').length > 0;
      const pagesAndProfiles =
        elItem.querySelectorAll('div > i[data-visualcompletion="css-img"]').length > 1;

      if (!birthdays && !pagesAndProfiles) {
        reason = keyWords.NF_SUGGESTIONS;
      }
    }
  }

  if (reason.length > 0) {
    hideNewsPost(elItem, reason, false, {
      options,
      keyWords,
      attributes: {
        postAtt,
        postAttTab,
      },
      state,
    });
  }
}

function scrubTabbies(context) {
  const { keyWords, state } = context;
  if (!keyWords || !state) {
    return;
  }

  const tabLabel =
    keyWords.NF_TABLIST_STORIES_REELS_ROOMS &&
    typeof keyWords.NF_TABLIST_STORIES_REELS_ROOMS === "object"
      ? keyWords.NF_TABLIST_STORIES_REELS_ROOMS[state.language]
      : keyWords.NF_TABLIST_STORIES_REELS_ROOMS;

  const queryTabList =
    'div[role="main"] > div > div > div > div > div > div > div > div[role="tablist"]';
  const elTabList = document.querySelector(queryTabList);
  if (elTabList) {
    if (elTabList.hasAttribute(postAttChildFlag)) {
      return;
    }
    const elParent = climbUpTheTree(elTabList, 4);
    if (elParent) {
      if (tabLabel) {
        hideFeature(elParent, tabLabel.replaceAll('"', ""), false, context);
      }
      elTabList.setAttribute(postAttChildFlag, "tablist");
      return;
    }
  } else {
    const queryForCreateStory =
      'div[role="main"] > div > div > div > div > div > div > div > div a[href*="/stories/create"]';
    const elCreateStory = document.querySelector(queryForCreateStory);
    if (elCreateStory && !elCreateStory.hasAttribute(postAttChildFlag)) {
      const elParent = getStoriesParent(elCreateStory);
      if (elParent !== null) {
        hideFeature(elParent, keyWords.NF_TABLIST_STORIES_REELS_ROOMS, false, context);
        elCreateStory.setAttribute(postAttChildFlag, "1");
      }
    }
  }
}

function getStoriesParent(element) {
  const elAFewBranchesUp = climbUpTheTree(element, 4);
  const moreStories = elAFewBranchesUp.querySelectorAll('a[href*="/stories/"]');
  let elParent = null;
  if (moreStories.length > 1) {
    elParent = climbUpTheTree(element.closest('div[aria-label][role="region"]'), 4);
  } else {
    elParent = climbUpTheTree(element, 7);
  }
  return elParent;
}

function scrubSurvey(context) {
  const { keyWords } = context;
  const btnSurvey = document.querySelector(`${newsSelectors.surveyButton}:not([${postAtt}])`);
  if (btnSurvey) {
    const elContainer = climbUpTheTree(btnSurvey.closest('[style*="border-radius"]'), 3);
    if (elContainer) {
      hideFeature(elContainer, "Survey", false, context);
      btnSurvey.setAttribute(postAttChildFlag, keyWords.NF_SURVEY);
    }
  }
}

function scrubTopCardsForPages(context) {
  const { keyWords } = context;
  const mainColumn = document.querySelector(newsSelectors.mainColumn);
  if (!mainColumn) {
    return;
  }

  const container = findTopCardsForPagesContainer(mainColumn);
  if (!container || container.hasAttribute(postAttChildFlag)) {
    return;
  }

  hideFeature(container, keyWords.NF_TOP_CARDS_PAGES, false, context);
  container.setAttribute(postAttChildFlag, keyWords.NF_TOP_CARDS_PAGES);
}

function scrubVerifiedBadges(context) {
  const { state } = context;
  if (!state) {
    return;
  }

  const hideBadge = (badge) => {
    badge.setAttribute(state.cssHideVerifiedBadge, "");
    badge.style.display = "none";
    badge.style.width = "0";
    badge.style.height = "0";
    badge.style.margin = "0";
    badge.style.padding = "0";
    let wrapper = badge.parentElement;
    let candidate = null;
    while (wrapper && wrapper.tagName === "SPAN") {
      const hasLink = wrapper.querySelector("a[href]");
      const hasButton =
        wrapper.getAttribute("role") === "button" || wrapper.querySelector('[role="button"]');
      if (!hasLink && !hasButton) {
        candidate = wrapper;
      }
      wrapper = wrapper.parentElement;
    }
    if (candidate) {
      candidate.setAttribute(state.cssHideVerifiedBadge, "");
      candidate.style.display = "none";
      candidate.style.margin = "0";
      candidate.style.padding = "0";
    }
  };

  const mainColumn = document.querySelector(newsSelectors.mainColumn);

  if (mainColumn) {
    const badges = mainColumn.querySelectorAll(
      'div[role="article"] h4 svg, div[aria-posinset] h4 svg, div[role="article"] h5 svg, div[aria-posinset] h5 svg'
    );
    badges.forEach(hideBadge);
  }

  const elDialog = document.querySelector(newsSelectors.dialog);
  if (elDialog) {
    const badges = elDialog.querySelectorAll(
      'div[role="article"] h4 svg, div[aria-posinset] h4 svg, div[role="article"] h5 svg, div[aria-posinset] h5 svg'
    );
    badges.forEach(hideBadge);
  }
}

function getSidePanelAiTargets() {
  const targets = new Set();

  const navs = Array.from(document.querySelectorAll('div[role="navigation"]'));
  navs.forEach((nav) => {
    const metaLinks = nav.querySelectorAll('a[href*="meta.ai"]');
    metaLinks.forEach((link) => {
      const li = link.closest("li");
      targets.add(li || link);
    });

    const navItems = Array.from(nav.querySelectorAll("li"));
    navItems.forEach((li) => {
      const text = li.textContent ? li.textContent.trim() : "";
      if (text === "Manus AI") {
        targets.add(li);
      }
    });
  });

  const rightPanel = document.querySelector('div[role="complementary"]');
  if (rightPanel) {
    const metaThreads = rightPanel.querySelectorAll('a[href*="/messages/t/36327,2227039302/"]');
    metaThreads.forEach((link) => {
      const li = link.closest("li");
      targets.add(li || link);
    });

    const rightItems = Array.from(rightPanel.querySelectorAll("li"));
    rightItems.forEach((li) => {
      const text = li.textContent ? li.textContent.trim() : "";
      if (text.includes("Meta AI")) {
        targets.add(li);
      }
    });
  }

  return Array.from(targets);
}

function scrubSidePanelAi(context) {
  const { state } = context;
  if (!state) {
    return;
  }

  const targets = getSidePanelAiTargets();
  targets.forEach((target) => {
    target.setAttribute(state.hideAtt, "");
    target.style.display = "none";
    target.style.margin = "0";
    target.style.padding = "0";
  });
}

function getReactFiberFromElement(element) {
  let current = element;
  let depth = 0;

  while (current && depth < 4) {
    const reactFiberKey = Object.getOwnPropertyNames(current).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
    );
    if (reactFiberKey && current[reactFiberKey]) {
      return current[reactFiberKey];
    }
    current = current.parentElement;
    depth += 1;
  }

  return null;
}

function findAncestorFiber(fiber, predicate) {
  let current = fiber;
  let safetyCounter = 0;

  while (current && safetyCounter < 50) {
    if (predicate(current)) {
      return current;
    }
    current = current.return;
    safetyCounter += 1;
  }

  return null;
}

function isMetaAiSuggestionFiber(fiber) {
  if (!fiber || typeof fiber.key !== "string" || !fiber.key.startsWith("suggestion-")) {
    return false;
  }

  const props = fiber.memoizedProps || fiber.pendingProps;
  if (!props || typeof props !== "object") {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(props, "promptId") &&
    Object.prototype.hasOwnProperty.call(props, "genAISessionID")
  );
}

function getMetaAiSuggestionChipSignal(button) {
  const fiber = getReactFiberFromElement(button);
  if (!fiber) {
    return null;
  }

  const suggestionFiber = findAncestorFiber(fiber, isMetaAiSuggestionFiber);
  const props = suggestionFiber ? suggestionFiber.memoizedProps || suggestionFiber.pendingProps : null;
  if (!suggestionFiber || !props) {
    return null;
  }

  const { promptId, genAISessionID } = props;
  if (!promptId || !genAISessionID) {
    return null;
  }

  return {
    promptId,
    genAISessionID,
    suggestionKey: suggestionFiber.key,
  };
}

function isButtonLike(element) {
  if (!element || typeof element.getAttribute !== "function") {
    return false;
  }

  return element.tagName === "BUTTON" || element.getAttribute("role") === "button";
}

function getMetaAiPromptChipButtons(row) {
  if (!row || typeof row.querySelectorAll !== "function") {
    return [];
  }

  return Array.from(
    row.querySelectorAll(
      '[data-type="hscroll-child"] button, [data-type="hscroll-child"] [role="button"]'
    )
  );
}

function getMetaAiPromptButtonText(button) {
  if (!button || typeof button.textContent !== "string") {
    return "";
  }

  return cleanText(button.textContent).trim();
}

function hasMetaAiPromptButtonIcon(button) {
  if (!button || typeof button.querySelector !== "function") {
    return false;
  }

  return button.querySelector("i, img, svg") !== null;
}

function hasMetaAiPromptButtonLabel(button) {
  if (!button || typeof button.getAttribute !== "function") {
    return false;
  }

  return ["aria-label", "title"].some((attributeName) => {
    const attributeValue = button.getAttribute(attributeName);
    return typeof attributeValue === "string" && attributeValue.trim() !== "";
  });
}

// Fallback for userscript sandboxes where Facebook's React fibers are not readable.
function hasMetaAiPromptDomSignature(row) {
  const chipButtons = getMetaAiPromptChipButtons(row);
  if (chipButtons.length !== 3) {
    return false;
  }

  const buttonTexts = chipButtons.map((button) => getMetaAiPromptButtonText(button));
  if (buttonTexts[0] === "" || buttonTexts[1] === "" || buttonTexts[2] !== "") {
    return false;
  }

  const firstButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[0]);
  const lastButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[2]);
  const lastButtonHasLabel = hasMetaAiPromptButtonLabel(chipButtons[2]);

  return firstButtonHasIcon && (lastButtonHasIcon || lastButtonHasLabel);
}

function isMetaAiPromptCandidateRow(row, root) {
  if (!row || !root || row === root || typeof row.querySelectorAll !== "function") {
    return false;
  }

  const hscrollChildren = row.querySelectorAll('[data-type="hscroll-child"]');
  if (hscrollChildren.length < 2) {
    return false;
  }

  const chipButtons = getMetaAiPromptChipButtons(row);
  if (chipButtons.length < 2) {
    return false;
  }

  const contentLinks = Array.from(row.querySelectorAll("a[href]")).filter((link) => {
    if (isButtonLike(link)) {
      return false;
    }

    const buttonAncestor = link.closest('[role="button"], button');
    return !buttonAncestor;
  });

  return contentLinks.length === 0;
}

function findMetaAiPromptCandidateRows(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }

  const candidateRows = new Set();
  const chips = root.querySelectorAll('[data-type="hscroll-child"]');

  chips.forEach((chip) => {
    let current = chip.parentElement;
    while (current && current !== root) {
      if (isMetaAiPromptCandidateRow(current, root)) {
        candidateRows.add(current);
      }
      current = current.parentElement;
    }
  });

  const rows = Array.from(candidateRows);
  return rows.filter((row) => !rows.some((other) => other !== row && other.contains(row)));
}

function isMetaAiPromptSuggestionRow(row) {
  const sessionMatches = new Map();
  const signals = getMetaAiPromptChipButtons(row)
    .map((button) => getMetaAiSuggestionChipSignal(button))
    .filter(Boolean);

  signals.forEach((signal) => {
    if (!sessionMatches.has(signal.genAISessionID)) {
      sessionMatches.set(signal.genAISessionID, new Set());
    }

    sessionMatches.get(signal.genAISessionID).add(`${signal.suggestionKey}:${signal.promptId}`);
  });

  if (Array.from(sessionMatches.values()).some((signalSet) => signalSet.size >= 2)) {
    return true;
  }

  return hasMetaAiPromptDomSignature(row);
}

function inspectMetaAiPromptRows(root) {
  const candidateRows = findMetaAiPromptCandidateRows(root);
  if (candidateRows.length === 0) {
    return {
      candidateRows: [],
      confirmedRows: [],
      hasUnresolvedCandidates: false,
    };
  }

  const confirmedRows = candidateRows.filter((row) => isMetaAiPromptSuggestionRow(row));
  const confirmedSet = new Set(confirmedRows);

  return {
    candidateRows,
    confirmedRows,
    hasUnresolvedCandidates: candidateRows.some((row) => !confirmedSet.has(row)),
  };
}

function findMetaAiPromptSuggestionRows(root) {
  return inspectMetaAiPromptRows(root).confirmedRows;
}

function hideMetaAiPromptSuggestionRows(rows, context) {
  if (!Array.isArray(rows) || !context || rows.length === 0) {
    return false;
  }

  const { keyWords } = context;
  if (!keyWords) {
    return false;
  }

  rows.forEach((row) => hideFeatureNoCaption(row, keyWords.NF_META_AI_PROMPTS, context));
  return true;
}

function hasMetaAiPromptSuggestionRow(root) {
  return findMetaAiPromptSuggestionRows(root).length > 0;
}

function scrubMetaAiPromptSuggestions(context, root = null) {
  if (!context) {
    return false;
  }

  const { options } = context;
  if (!options || options.NF_META_AI_PROMPTS !== true) {
    return false;
  }

  const scanRoot = root || document.querySelector(newsSelectors.mainColumn);
  if (!scanRoot) {
    return false;
  }

  const promptInspection = inspectMetaAiPromptRows(scanRoot);
  return hideMetaAiPromptSuggestionRows(promptInspection.confirmedRows, context);
}

function postExceedsLikeCount(post, options, keyWords) {
  const queryLikes =
    'span[role="toolbar"] ~ div div[role="button"] > span[class][aria-hidden] > span:not([class]) > span[class]';
  const elLikes = post.querySelectorAll(queryLikes);
  if (elLikes.length > 0) {
    const maxLikes = parseInt(options.NF_LIKES_MAXIMUM_COUNT, 10);
    const postLikesCount = getFullNumber(elLikes[0].textContent.trim());
    return postLikesCount >= maxLikes ? keyWords.NF_LIKES_MAXIMUM : "";
  }
  return false;
}

function mopNewsFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const [mainColumn, elDialog] = isNewsDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }
  const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
  const dialogToken = elDialog ? getDirtyToken(elDialog) : null;

  if (mainColumn) {
    if (options.NF_TABLIST_STORIES_REELS_ROOMS) {
      scrubTabbies(context);
    }
    if (options.NF_SURVEY) {
      scrubSurvey(context);
    }
    if (options.NF_TOP_CARDS_PAGES) {
      scrubTopCardsForPages(context);
    }
    if (options.NF_HIDE_VERIFIED_BADGE) {
      scrubVerifiedBadges(context);
    }
    if (options.NF_AI_SIDE_PANELS) {
      scrubSidePanelAi(context);
    }
    if (options.NF_META_AI_PROMPTS) {
      scrubMetaAiPromptSuggestions(context, mainColumn);
    }

    if (options.NF_SPONSORED) {
      cleanConsoleTable("Sponsored", context);
    }
    if (options.NF_SUGGESTIONS) {
      cleanConsoleTable("Suggestions", context);
    }

    const posts = getCollectionOfNewsPosts(state);
    if (state) {
      state.lastNewsPostCount = posts.length;
    }
    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      let isSponsoredPost = false;

      const postChanged = hasPostChanged(post);
      if (postChanged) {
        resetPostState(post, state);
      }

      if (post.hasAttribute(postAtt)) {
        hideReason = "hidden";
      } else {
        doLightDusting(post, state);

        if (hideReason === "" && options.NF_REELS_SHORT_VIDEOS) {
          hideReason = isNewsReelsAndShortVideos(post, state, keyWords);
        }
        if (hideReason === "" && options.NF_SHORT_REEL_VIDEO) {
          hideReason = isNewsShortReelVideo(post, keyWords);
        }
        if (hideReason === "" && options.NF_META_AI) {
          hideReason = isNewsMetaAICard(post, keyWords);
        }
        if (hideReason === "" && options.NF_PAID_PARTNERSHIP) {
          hideReason = isNewsPaidPartnership(post, keyWords);
        }
        if (hideReason === "" && options.NF_PEOPLE_YOU_MAY_KNOW) {
          hideReason = isNewsPeopleYouMayKnow(post, keyWords);
        }
        if (hideReason === "" && options.NF_SUGGESTIONS) {
          hideReason = isNewsSuggested(post, state, keyWords);
        }
        if (hideReason === "" && options.NF_FOLLOW) {
          hideReason = isNewsFollow(post, state, keyWords);
        }
        if (hideReason === "" && options.NF_PARTICIPATE) {
          hideReason = isNewsParticipate(post, keyWords);
        }
        if (hideReason === "" && options.NF_SPONSORED_PAID) {
          hideReason = isNewsSponsoredPaidBy(post, keyWords);
        }
        if (hideReason === "" && options.NF_EVENTS_YOU_MAY_LIKE) {
          hideReason = isNewsEventsYouMayLike(post, keyWords);
        }
        if (hideReason === "" && options.NF_FILTER_VERIFIED_BADGE) {
          hideReason = isNewsVerifiedBadge(post, keyWords);
        }
        if (hideReason === "" && options.NF_STORIES) {
          hideReason = isNewsStoriesPost(post, keyWords);
        }
        if (hideReason === "" && options.NF_ANIMATED_GIFS_POSTS) {
          hideReason = hasNewsAnimatedGifContent(post, keyWords);
        }
        if (hideReason === "" && options.NF_SPONSORED && isSponsored(post, state)) {
          isSponsoredPost = true;
          hideReason = keyWords.SPONSORED;
        }
        if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
          hideReason = findNewsBlockedText(post, options, filters);
        }
        if (hideReason === "" && options.NF_LIKES_MAXIMUM && options.NF_LIKES_MAXIMUM !== "") {
          hideReason = postExceedsLikeCount(post, options, keyWords);
        }
      }

      if (hideReason.length > 0) {
        if (hideReason !== "hidden") {
          hideNewsPost(post, hideReason, isSponsoredPost, {
            options,
            keyWords,
            attributes: {
              postAtt,
              postAttTab,
            },
            state,
          });
        }
      } else {
        if (options.NF_ANIMATED_GIFS_PAUSE) {
          swatTheMosquitos(post);
        }
        if (state.hideAnInfoBox) {
          scrubInfoBoxes(post, options, keyWords, pathInfo, state);
        }
        if (options.NF_SHARES) {
          hideNumberOfShares(post, state, options);
        }
      }

      if (!postChanged) {
        trackPostSignature(post);
      }
    }

    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      mainColumn.setAttribute(mainColumnAtt, "1");
    }
    if (mainColumnToken !== null) {
      markElementCleanIfUnchanged(mainColumn, mainColumnToken);
    }
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.NF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    if (!elDialog.hasAttribute(mainColumnAtt)) {
      elDialog.setAttribute(mainColumnAtt, "1");
    }
    if (dialogToken !== null) {
      markElementCleanIfUnchanged(elDialog, dialogToken);
    }
    state.noChangeCounter = 0;
  }

  return { mainColumn, elDialog };
}

module.exports = {
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
  isNewsVerifiedBadge,
  getSidePanelAiTargets,
  getMetaAiSuggestionChipSignal,
  hasMetaAiPromptSuggestionRow,
  findTopCardsForPagesContainer,
  findMetaAiPromptSuggestionRows,
  hideMetaAiPromptSuggestionRows,
  inspectMetaAiPromptRows,
  isNewsDirty,
  isMetaAiPromptSuggestionRow,
  mopNewsFeed,
  postExceedsLikeCount,
  scrubMetaAiPromptSuggestions,
};
