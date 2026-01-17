const { mainColumnAtt, postAtt, postPropDS } = require("../dom/attributes");
const { swatTheMosquitos } = require("../dom/animated-gifs");
const { hasSizeChanged } = require("../dom/dirty-check");
const { doLightDusting } = require("../dom/dusting");
const { hideFeature, hideGroupPost } = require("../dom/hide");
const { scrubInfoBoxes } = require("../dom/info-boxes");
const { climbUpTheTree } = require("../utils/dom");

const { findGroupsBlockedText } = require("./shared/blocked-text");
const { hasGroupsAnimatedGifContent } = require("./shared/animated-gifs");
const { isSponsored } = require("./shared/sponsored");
const { hideNumberOfShares } = require("./shared/shares");

function isGroupsColumnDirty(state) {
  const arrReturn = [null, null];
  const mainColumnQuery = 'div[role="navigation"] ~ div[role="main"]';
  const mainColumn = document.querySelector(mainColumnQuery);
  if (mainColumn) {
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      arrReturn[0] = mainColumn;
    } else if (
      hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)
    ) {
      arrReturn[0] = mainColumn;
    }
  } else {
    const mainColumnQueryGP = 'div[role="main"] div[role="feed"]';
    const mainColumnGP = document.querySelector(mainColumnQueryGP);
    if (mainColumnGP) {
      if (!mainColumnGP.hasAttribute(mainColumnAtt)) {
        arrReturn[0] = mainColumnGP;
      } else if (
        hasSizeChanged(mainColumnGP.getAttribute(mainColumnAtt), mainColumnGP.innerHTML.length)
      ) {
        arrReturn[0] = mainColumnGP;
      }
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

function isGroupsSuggested(post, keyWords) {
  let results = "";
  let blocksQuery =
    "div[aria-posinset] > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div";
  let blocks = post.querySelectorAll(blocksQuery);
  if (blocks.length <= 1) {
    blocksQuery =
      "div[aria-posinset] > div > div > div > div > div > div > div > div > div, div[aria-describedby] > div > div > div > div > div > div > div > div > div";
    blocks = post.querySelectorAll(blocksQuery);
  }
  if (blocks.length > 1) {
    const suggIcon = blocks[0].querySelector('i[data-visualcompletion="css-img"][style]');
    if (suggIcon) {
      results = keyWords.GF_SUGGESTIONS;
    } else {
      const query = "h3 > div > span ~ span > span > div > div";
      const sneakyGroupPost = blocks[1].querySelector(query);
      if (sneakyGroupPost) {
        results = keyWords.GF_SUGGESTIONS;
      }
    }
  }
  return results;
}

function isGroupsShortReelVideo(post, keyWords) {
  const querySRV = 'a[href*="/reel/"]';
  const elementsSRV = Array.from(post.querySelectorAll(querySRV));
  return elementsSRV.length !== 1 ? "" : keyWords.GF_SHORT_REEL_VIDEO;
}

function cleanGroupsSuggestions(findItem, context) {
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

  for (const asideBox of asideBoxes) {
    const elParent = climbUpTheTree(asideBox, 21);
    if (!elParent) {
      continue;
    }

    const link = asideBox.closest("a");
    if (link) {
      link.setAttribute(postAtt, keyWords.GF_SUGGESTIONS);
    }

    hideFeature(elParent, keyWords.GF_SUGGESTIONS, true, { options, keyWords, state });
  }
}

function setPostLinkToOpenInNewTab(post, state) {
  try {
    if (post.hasAttribute("class") && post.classList.length > 0) {
      return;
    }
    if (post.querySelector(`.${state.iconNewWindowClass}`)) {
      return;
    }

    const postLinks = post.querySelectorAll('div > div > a[href*="/groups/"][role="link"]');
    if (postLinks.length > 0) {
      const postLink = postLinks[0];
      const elHeader = climbUpTheTree(postLink, 4);
      if (!elHeader) {
        return;
      }
      const blockOfIcons = elHeader.querySelector(
        ":scope > div:nth-of-type(2) > div > div:nth-of-type(2) > span > span"
      );
      let newLink = "";

      if (blockOfIcons) {
        const postId = new URLSearchParams(postLink.href).get("multi_permalinks");
        if (postId !== null) {
          newLink = `${postLink.href.split("?")[0]}posts/${postId}/`;
        } else {
          return;
        }
      } else {
        return;
      }

      const spanSpacer = document.createElement("span");
      spanSpacer.innerHTML =
        '<span><span style="position:absolute;width:1px;height:1px;">&nbsp;</span><span aria-hidden="true"> ú </span></span>';
      blockOfIcons.appendChild(spanSpacer);

      const container = document.createElement("span");
      container.className = state.iconNewWindowClass;
      const span2 = document.createElement("span");
      const linkNew = document.createElement("a");
      linkNew.setAttribute("href", newLink);
      linkNew.innerHTML = state.iconNewWindow;
      linkNew.setAttribute("target", "_blank");
      span2.appendChild(linkNew);
      container.appendChild(span2);

      blockOfIcons.appendChild(container);
    }
  } catch (error) {
    return;
  }
}

function mopGroupsFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const [mainColumn, elDialog] = isGroupsColumnDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  if (mainColumn) {
    if (
      state.gfType === "groups" ||
      state.gfType === "groups-recent" ||
      state.gfType === "search"
    ) {
      if (options.GF_SUGGESTIONS) {
        cleanGroupsSuggestions("Suggestions", context);
      }

      const query =
        state.gfType === "groups-recent" ? 'h2[dir="auto"] + div > div' : 'div[role="feed"] > div';
      const posts = Array.from(document.querySelectorAll(query));
      if (posts.length > 0) {
        const count = posts.length;
        const start = count < 25 ? 0 : count - 25;

        for (let i = start; i < count; i += 1) {
          const post = posts[i];
          if (post.innerHTML.length === 0) {
            continue;
          }

          let hideReason = "";

          if (state.gfType === "groups" && post[postPropDS] === undefined) {
            setPostLinkToOpenInNewTab(post, state);
          }

          if (post.hasAttribute(postAtt)) {
            hideReason = "hidden";
          } else {
            doLightDusting(post, state);

            if (hideReason === "" && options.GF_SPONSORED && isSponsored(post, state)) {
              hideReason = keyWords.SPONSORED;
            }
            if (hideReason === "" && options.GF_SUGGESTIONS) {
              hideReason = isGroupsSuggested(post, keyWords);
            }
            if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
              hideReason = isGroupsShortReelVideo(post, keyWords);
            }
            if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
              hideReason = findGroupsBlockedText(post, options, filters);
            }
            if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
              hideReason = hasGroupsAnimatedGifContent(post, keyWords);
            }
          }

          if (hideReason.length > 0) {
            state.echoCount += 1;
            if (hideReason !== "hidden") {
              hideGroupPost(post, hideReason, "", {
                options,
                keyWords,
                state,
              });
            }
          } else {
            state.echoCount = 0;
            if (options.GF_ANIMATED_GIFS_PAUSE) {
              swatTheMosquitos(post);
            }
            if (state.hideAnInfoBox) {
              scrubInfoBoxes(post, options, keyWords, pathInfo, state);
            }
            if (options.GF_SHARES) {
              hideNumberOfShares(post, state, options);
            }
          }
        }
      }
    } else {
      const query = 'div[role="feed"] > div';
      const posts = Array.from(document.querySelectorAll(query));
      if (posts.length) {
        for (const post of posts) {
          if (post.innerHTML.length === 0) {
            continue;
          }

          let hideReason = "";
          if (post.hasAttribute(postAtt)) {
            hideReason = "hidden";
          } else {
            doLightDusting(post, state);
            if (hideReason === "" && options.GF_SHORT_REEL_VIDEO) {
              hideReason = isGroupsShortReelVideo(post, keyWords);
            }
            if (hideReason === "" && options.GF_BLOCKED_ENABLED) {
              hideReason = findGroupsBlockedText(post, options, filters);
            }
            if (hideReason === "" && options.GF_ANIMATED_GIFS_POSTS) {
              hideReason = hasGroupsAnimatedGifContent(post, keyWords);
            }
          }

          if (hideReason.length > 0) {
            state.echoCount += 1;
            if (hideReason !== "hidden") {
              hideGroupPost(post, hideReason, "", {
                options,
                keyWords,
                state,
              });
            }
          } else {
            state.echoCount = 0;
            if (options.GF_ANIMATED_GIFS_PAUSE) {
              swatTheMosquitos(post);
            }
            if (state.hideAnInfoBox) {
              scrubInfoBoxes(post, options, keyWords, pathInfo, state);
            }
            if (options.GF_SHARES) {
              hideNumberOfShares(post, state, options);
            }
          }
        }
      }
    }

    mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.GF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
    elDialog.setAttribute(mainColumnAtt, elDialog.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  return { mainColumn, elDialog };
}

module.exports = {
  isGroupsShortReelVideo,
  isGroupsSuggested,
  mopGroupsFeed,
};
