const { mainColumnAtt, postAtt, postAttTab } = require("../dom/attributes");
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
const { hidePost } = require("../dom/hide");
const { scrubInfoBoxes } = require("../dom/info-boxes");
const { profileSelectors } = require("../selectors/profile");

const { findProfileBlockedText } = require("./shared/blocked-text");
const { hasNewsAnimatedGifContent } = require("./shared/animated-gifs");

function isProfileColumnDirty(state) {
  const arrReturn = [null, null];
  const mainColumn = document.querySelector(profileSelectors.mainColumn);
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
    }
  }

  const elDialog = document.querySelector(profileSelectors.dialog);
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

const profilePermalinkSelectors = [
  'a[href*="/posts/"]',
  'a[href*="/story.php"]',
  'a[href*="/permalink/"]',
  'a[href*="permalink.php"]',
];

function getProfilePostsFromPermalinks(mainColumn) {
  if (!mainColumn) {
    return [];
  }

  const selector = profilePermalinkSelectors.join(",");
  const permalinks = Array.from(mainColumn.querySelectorAll(selector));
  if (permalinks.length === 0) {
    return [];
  }

  const containers = new Set();

  for (const link of permalinks) {
    let node = link.parentElement;
    let lastSingle = null;

    while (node && node !== mainColumn) {
      const count = node.querySelectorAll(selector).length;
      if (count === 1) {
        lastSingle = node;
      } else {
        break;
      }
      node = node.parentElement;
    }

    if (lastSingle) {
      containers.add(lastSingle);
    }
  }

  return Array.from(containers);
}

function mopProfileFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const proceed =
    options.PP_BLOCKED_ENABLED || options.PP_ANIMATED_GIFS_POSTS || options.PP_ANIMATED_GIFS_PAUSE;
  if (!proceed) {
    return null;
  }

  const [mainColumn, elDialog] = isProfileColumnDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  const mainColumnToken = mainColumn ? getDirtyToken(mainColumn) : null;
  const dialogToken = elDialog ? getDirtyToken(elDialog) : null;

  if (mainColumn) {
    const posts = getProfilePostsFromPermalinks(mainColumn);
    if (posts.length === 0) {
      return { mainColumn, elDialog };
    }

    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      const isSponsoredPost = false;

      const postChanged = hasPostChanged(post);
      if (postChanged) {
        resetPostState(post, state);
      }

      if (post.hasAttribute(postAtt)) {
        hideReason = "hidden";
      } else {
        if (hideReason === "" && options.PP_ANIMATED_GIFS_POSTS) {
          hideReason = hasNewsAnimatedGifContent(post, keyWords);
        }
        if (hideReason === "" && options.PP_BLOCKED_ENABLED) {
          hideReason = findProfileBlockedText(post, options, filters);
        }
      }

      if (hideReason.length > 0) {
        if (hideReason !== "hidden") {
          hidePost(post, hideReason, isSponsoredPost, {
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
        if (options.PP_ANIMATED_GIFS_PAUSE) {
          swatTheMosquitos(post);
        }
        if (state.hideAnInfoBox) {
          scrubInfoBoxes(post, options, keyWords, pathInfo, state);
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
    if (options.PP_ANIMATED_GIFS_PAUSE) {
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
  getProfilePostsFromPermalinks,
  mopProfileFeed,
};
