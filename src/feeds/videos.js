const { mainColumnAtt, postAtt, postAttTab, postPropDS } = require("../dom/attributes");
const { swatTheMosquitos } = require("../dom/animated-gifs");
const { hasSizeChanged } = require("../dom/dirty-check");
const { doLightDusting } = require("../dom/dusting");
const { hideVideoPost } = require("../dom/hide");
const { scrubInfoBoxes } = require("../dom/info-boxes");
const { countDescendants } = require("../dom/walker");
const { climbUpTheTree } = require("../utils/dom");

const { findVideosBlockedText } = require("./shared/blocked-text");
const { isSponsored } = require("./shared/sponsored");

function isVideosDirty(state) {
  const arrReturn = [null, null];
  const mainColumnQuery =
    'div[role="navigation"] ~ div[role="main"] div[role="main"] > div > div > div > div > div';
  const mainColumns = document.querySelectorAll(mainColumnQuery);
  let mainColumn = null;
  if (mainColumns.length > 0) {
    mainColumn = mainColumns[mainColumns.length - 1];
  }

  if (mainColumn) {
    if (!mainColumn.hasAttribute(mainColumnAtt)) {
      arrReturn[0] = mainColumn;
    } else if (hasSizeChanged(mainColumn.getAttribute(mainColumnAtt), mainColumn.innerHTML.length)) {
      arrReturn[0] = mainColumn;
    }
  }

  const elDialog = document.querySelector('div[role="dialog"] div[role="main"]');
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

function isVideoLive(post, keyWords) {
  const liveRule = 'div[role="presentation"] ~ div > div:nth-of-type(1) > span';
  const elLive = post.querySelectorAll(liveRule);
  return elLive.length > 0 ? keyWords.VF_LIVE : "";
}

function isInstagram(post, keyWords) {
  const instagramRule = 'div > div > div > div > div > a[href="#"] > div > svg';
  const elInstagram = post.querySelectorAll(instagramRule);
  return elInstagram.length > 0 ? keyWords.VF_INSTAGRAM : "";
}

function findDuplicateVideos(urlQuery, postQuery, keyWords, context) {
  const watchVideos = document.querySelectorAll(urlQuery);
  if (watchVideos.length < 2) {
    return;
  }

  for (let i = 1; i < watchVideos.length; i += 1) {
    const videoPost = watchVideos[i].closest(postQuery);
    if (videoPost) {
      hideVideoPost(videoPost, keyWords.VF_DUPLICATE_VIDEOS, "", context);
    }
  }
}

function hideDuplicateVideos(post, postQuery, keyWords, context) {
  const elWatchVideo = post.querySelector('div > span > a[href*="/watch/?v="]');
  if (elWatchVideo) {
    const watchVideoVID = new URL(elWatchVideo.href).searchParams.get("v");
    if (watchVideoVID) {
      findDuplicateVideos(
        `div > span > a[href*="/watch/?v=${watchVideoVID}&"]`,
        postQuery,
        keyWords,
        context
      );
    }
  } else {
    const elUserVideo = post.querySelector('div > span > a[href*="/videos/"]');
    if (elUserVideo) {
      const watchVideoVID = elUserVideo.href.split("/videos/")[1].split("/")[0];
      if (watchVideoVID) {
        findDuplicateVideos(
          `div > span > a[href*="/videos/${watchVideoVID}/"]`,
          postQuery,
          keyWords,
          context
        );
      }
    }
  }
}

function hideSponsoredBlock(post, queryBlocks, state) {
  const videoBlocks = post.querySelectorAll(queryBlocks);
  if (videoBlocks.length < 3) {
    return;
  }
  const thirdBlock = videoBlocks[2];
  if (thirdBlock.hasAttribute("class")) {
    return;
  }
  if (thirdBlock.hasAttribute(state.hideAtt)) {
    return;
  }
  thirdBlock.setAttribute(state.hideAtt, "Sponsored Content");
}

function getVideoPublisherPathFromURL(videoURL) {
  const beginURL = videoURL.split("?")[0];
  if (!beginURL) {
    return "";
  }
  if (beginURL.includes("/watch/")) {
    return beginURL.replace("/watch/", "/");
  }
  return "";
}

function setPostLinkToOpenInNewTab(post, state) {
  try {
    if (post.querySelector(`.${state.iconNewWindowClass}`)) {
      return;
    }

    const postLinks = post.querySelectorAll('div > span > a[href*="/watch/?v="][role="link"]');
    if (postLinks.length > 0) {
      const postLink = postLinks[0];
      const elHeader = climbUpTheTree(postLink, 3);
      if (!elHeader) {
        return;
      }
      const blockOfIcons = elHeader.querySelector(":scope > div:nth-of-type(2) > span");
      let newLink = "";

      if (blockOfIcons) {
        const videoId = new URL(postLink.href).searchParams.get("v");
        if (videoId !== null) {
          const watchLink = post.querySelector('a[href*="/watch/"]');
          if (!watchLink) {
            return;
          }
          const publisherLink = getVideoPublisherPathFromURL(watchLink.href);
          if (publisherLink === "") {
            return;
          }
          newLink = `${publisherLink}videos/${videoId}/`;
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

function scrubSponsoredBlock(post, state, options) {
  const queryForContainer = ":scope > div > div > div > div > div > div:nth-of-type(2)";
  const blocksContainer = post.querySelector(queryForContainer);
  if (blocksContainer && blocksContainer.childElementCount > 0) {
    const adBlock = blocksContainer.querySelector(":scope > a");
    if (adBlock && !adBlock.hasAttribute(postAtt)) {
      adBlock.setAttribute(state.cssHideEl, "");
      adBlock.setAttribute(postAtt, "Sponsored");
      if (options.VERBOSITY_DEBUG) {
        adBlock.setAttribute(state.showAtt, "");
      }
    }
  }
}

function mopVideosFeed(context) {
  if (!context) {
    return null;
  }

  const { state, options, filters, keyWords, pathInfo } = context;
  if (!state || !options || !filters || !keyWords || !pathInfo) {
    return null;
  }

  const [mainColumn, elDialog] = isVideosDirty(state);
  if (!mainColumn && !elDialog) {
    return null;
  }

  const container = elDialog || mainColumn;
  if (container) {
    let query;
    let queryBlocks;
    if (state.vfType === "videos") {
      query = ":scope > div > div:not([class]) > div";
      queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
    } else if (state.vfType === "search") {
      query = 'div[role="feed"] > div[role="article"]';
      queryBlocks = ":scope > div > div > div > div > div > div > div:nth-of-type(2)";
    } else if (state.vfType === "item") {
      query =
        'div[id="watch_feed"] > div > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > div > div > div > div';
      queryBlocks = ":scope > div > div > div > div > div:nth-of-type(2) > div";
    } else {
      return null;
    }

    if (state.vfType !== "search") {
      const posts = container.querySelectorAll(query);
      for (const post of posts) {
        if (countDescendants(post) < 3) {
          continue;
        }

        let hideReason = "";

        if (state.vfType === "videos" && post[postPropDS] === undefined) {
          setPostLinkToOpenInNewTab(post, state);
        }

        if (post.hasAttribute(postAtt)) {
          hideReason = "hidden";
        } else {
          doLightDusting(post, state);

          if (hideReason === "" && options.VF_SPONSORED && isSponsored(post, state)) {
            hideReason = keyWords.SPONSORED;
          }
          if (hideReason === "" && options.VF_LIVE) {
            hideReason = isVideoLive(post, keyWords);
          }
          if (hideReason === "" && options.VF_INSTAGRAM) {
            hideReason = isInstagram(post, keyWords);
          }
          if (hideReason === "" && options.VF_DUPLICATE_VIDEOS) {
            hideDuplicateVideos(post, query, keyWords, context);
            if (post.hasAttribute(postAtt)) {
              hideReason = "hidden";
            }
          }
          if (hideReason === "" && options.VF_BLOCKED_ENABLED) {
            hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
          }
        }

        if (hideReason.length > 0) {
          if (hideReason !== "hidden") {
            hideVideoPost(post, hideReason, "", {
              options,
              keyWords,
              attributes: { postAtt, postAttTab },
              state,
            });
          }
        } else {
          if (options.VF_ANIMATED_GIFS_PAUSE) {
            swatTheMosquitos(post);
          }
          if (state.hideAnInfoBox) {
            scrubInfoBoxes(post, options, keyWords, pathInfo, state);
          }

          scrubSponsoredBlock(post, state, options);
        }

        hideSponsoredBlock(post, queryBlocks, state);
      }
    } else {
      const posts = document.querySelectorAll(query);
      for (const post of posts) {
        let hideReason = "";

        if (post.hasAttribute(postAtt)) {
          hideReason = "hidden";
        } else if (options.VF_BLOCKED_ENABLED) {
          hideReason = findVideosBlockedText(post, options, filters, queryBlocks);
        }

        if (hideReason.length > 0) {
          if (hideReason !== "hidden") {
            hideVideoPost(post, hideReason, "", {
              options,
              keyWords,
              attributes: { postAtt, postAttTab },
              state,
            });
          }
        }
      }
    }

    container.setAttribute(mainColumnAtt, container.innerHTML.length.toString());
    state.noChangeCounter = 0;
  }

  if (elDialog) {
    if (options.NF_ANIMATED_GIFS_PAUSE) {
      swatTheMosquitos(elDialog);
    }
  }

  return { mainColumn, elDialog };
}

module.exports = {
  isInstagram,
  isVideoLive,
  mopVideosFeed,
};
