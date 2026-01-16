const { mainColumnAtt, postAtt, postAttTab } = require("../dom/attributes");
const { swatTheMosquitos } = require("../dom/animated-gifs");
const { hasSizeChanged } = require("../dom/dirty-check");
const { hidePost } = require("../dom/hide");
const { scrubInfoBoxes } = require("../dom/info-boxes");

const { findProfileBlockedText } = require("./shared/blocked-text");
const { hasNewsAnimatedGifContent } = require("./shared/animated-gifs");

function isProfileColumnDirty(state) {
  const arrReturn = [null, null];
  const mainColumn = document.querySelector('div[role="main"]');
  if (mainColumn) {
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      arrReturn[0] = mainColumn;
    } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
      arrReturn[0] = mainColumn;
    }
  }

  const elDialog = document.querySelector('div[role="dialog"]');
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

function mopProfileFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const proceed =
    options.PP_BLOCKED_ENABLED ||
    options.PP_ANIMATED_GIFS_POSTS ||
    options.PP_ANIMATED_GIFS_PAUSE;
  if (!proceed) {
    return null;
  }

  const [mainColumn, elDialog] = isProfileColumnDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  if (mainColumn) {
    const query =
      'div[role="main"] > div > div > div > div:nth-of-type(2) > div:not([class]) > div > div[class]';
    const posts = Array.from(document.querySelectorAll(query));

    for (const post of posts) {
      if (post.innerHTML.length === 0) {
        continue;
      }

      let hideReason = "";
      const isSponsoredPost = false;

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
    }

    mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.PP_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  return { mainColumn, elDialog };
}

module.exports = {
  mopProfileFeed,
};
