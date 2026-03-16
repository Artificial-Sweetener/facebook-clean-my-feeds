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
const { searchSelectors } = require("../selectors/search");

const { findNewsBlockedText } = require("./shared/blocked-text");
const { isSponsored } = require("./shared/sponsored");

function isSearchColumnDirty(state) {
  const mainColumn = document.querySelector(searchSelectors.mainColumn);
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
      return mainColumn;
    }
    if (isElementDirty(mainColumn)) {
      return mainColumn;
    }
  }

  if (state) {
    state.noChangeCounter += 1;
  }

  return null;
}

function mopSearchFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const mainColumn = isSearchColumnDirty(state);
  if (!mainColumn) {
    return null;
  }

  const mainColumnToken = getDirtyToken(mainColumn);

  if (options.NF_BLOCKED_ENABLED) {
    const posts = Array.from(document.querySelectorAll(searchSelectors.postsQuery));

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
        if (options.NF_SPONSORED && isSponsored(post, state)) {
          hideReason = keyWords.SPONSORED;
          isSponsoredPost = true;
        }
        if (hideReason === "" && options.NF_BLOCKED_ENABLED) {
          hideReason = findNewsBlockedText(post, options, filters);
        }
      }

      if (hideReason.length > 0) {
        state.echoCount += 1;
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
        state.echoCount = 0;
        if (options.NF_ANIMATED_GIFS_PAUSE) {
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
  }

  if (!mainColumn.hasAttribute(mainColumnAtt)) {
    mainColumn.setAttribute(mainColumnAtt, "1");
  }
  markElementCleanIfUnchanged(mainColumn, mainColumnToken);
  state.noChangeCounter = 0;

  return mainColumn;
}

module.exports = {
  mopSearchFeed,
};
