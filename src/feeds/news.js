const { cleanText } = require("../core/filters/text-normalize");
const { getFullNumber } = require("../core/filters/classifiers/shares-likes");
const { mainColumnAtt, postAtt, postAttChildFlag, postAttTab } = require("../dom/attributes");
const { swatTheMosquitos } = require("../dom/animated-gifs");
const { hasSizeChanged } = require("../dom/dirty-check");
const { doLightDusting } = require("../dom/dusting");
const { hideNewsPost, hideFeature } = require("../dom/hide");
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
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      arrReturn[0] = mainColumn;
    } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
      arrReturn[0] = mainColumn;
    }
  }

  const elDialog = document.querySelector(newsSelectors.dialog);
  if (elDialog) {
    if (!elDialog.hasAttribute(mainColumnAtt)) {
      arrReturn[1] = elDialog;
    } else if (hasSizeChanged(elDialog.getAttribute(mainColumnAtt), elDialog.innerHTML.length)) {
      arrReturn[1] = elDialog;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return arrReturn;
}

function getCollectionOfNewsPosts() {
  let posts = [];
  for (const query of newsSelectors.postQueries) {
    const nodeList = document.querySelectorAll(query);
    if (nodeList.length > 0) {
      posts = Array.from(nodeList);
      break;
    }
  }
  return posts;
}

function isNewsSuggested(post, state, keyWords) {
  const queries = [
    'div[aria-posinset] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)',
    'div[aria-describedby] > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > div > div:nth-of-type(2) > span > div > span:nth-of-type(1)',
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
  const querySPB = "div:nth-child(2) > div > div:nth-child(2) > span[class] > span[id] > div:nth-child(2)";
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
      return normalised !== "" && state.dictionaryFollow.some((keyword) => normalised.includes(keyword));
    };

    const followButton = Array.from(
      post.querySelectorAll('a[role="button"], div[role="button"], span[role="button"]')
    ).find((button) => {
      const ariaLabel =
        button && typeof button.getAttribute === "function" ? button.getAttribute("aria-label") : "";
      const buttonText = button && typeof button.textContent === "string" ? button.textContent : "";
      return hasFollowKeyword(ariaLabel) || hasFollowKeyword(buttonText);
    });
    if (followButton) {
      return keyWords.NF_FOLLOW;
    }

    const blocks = post.querySelectorAll(getNewsBlocksQuery(post));
    if (blocks.length > 0) {
      const headerText = normaliseToLower(scanTreeForText(blocks[0]).join(" "));
      if (headerText !== "" && state.dictionaryFollow.some((keyword) => headerText.includes(keyword))) {
        return keyWords.NF_FOLLOW;
      }
    }
  }

  return "";
}

function isNewsParticipate(post, keyWords) {
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

function cleanConsoleTable(findItem, context) {
  const { keyWords, state, options } = context;
  if (!keyWords || !state || !options) {
    return;
  }

  const query = 'div[role="complementary"] > div > div > div > div > div:not([data-visualcompletion])';
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

  const queryTabList = 'div[role="main"] > div > div > div > div > div > div > div > div[role="tablist"]';
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

  if (mainColumn) {
    if (options.NF_TABLIST_STORIES_REELS_ROOMS) {
      scrubTabbies(context);
    }
    if (options.NF_SURVEY) {
      scrubSurvey(context);
    }

    if (options.NF_SPONSORED) {
      cleanConsoleTable("Sponsored", context);
    }
    if (options.NF_SUGGESTIONS) {
      cleanConsoleTable("Suggestions", context);
    }

    const posts = getCollectionOfNewsPosts();
    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      let isSponsoredPost = false;

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
    }

    mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.NF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
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
  mopNewsFeed,
  postExceedsLikeCount,
};
