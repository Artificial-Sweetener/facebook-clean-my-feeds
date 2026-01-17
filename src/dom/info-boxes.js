const { climbUpTheTree } = require("../utils/dom");

const { postAtt } = require("./attributes");
const { hideBlock } = require("./hide");

function scrubInfoBoxes(post, options, keyWords, pathInfo, state) {
  if (!post || !options || !keyWords || !pathInfo || !state) {
    return;
  }

  let hiding = false;

  if (
    options.OTHER_INFO_BOX_CLIMATE_SCIENCE &&
    pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE &&
    pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE.pathMatch
  ) {
    const elLink = post.querySelector(
      `a[href*="${pathInfo.OTHER_INFO_BOX_CLIMATE_SCIENCE.pathMatch}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CLIMATE_SCIENCE, state, options, {
        postAtt,
      });
      hiding = true;
    }
  }

  if (
    !hiding &&
    options.OTHER_INFO_BOX_CORONAVIRUS &&
    pathInfo.OTHER_INFO_BOX_CORONAVIRUS &&
    pathInfo.OTHER_INFO_BOX_CORONAVIRUS.pathMatch
  ) {
    const elLink = post.querySelector(
      `a[href*="${pathInfo.OTHER_INFO_BOX_CORONAVIRUS.pathMatch}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_CORONAVIRUS, state, options, {
        postAtt,
      });
      hiding = true;
    }
  }

  if (
    !hiding &&
    options.OTHER_INFO_BOX_SUBSCRIBE &&
    pathInfo.OTHER_INFO_BOX_SUBSCRIBE &&
    pathInfo.OTHER_INFO_BOX_SUBSCRIBE.pathMatch
  ) {
    const elLink = post.querySelector(
      `a[href*="${pathInfo.OTHER_INFO_BOX_SUBSCRIBE.pathMatch}"]:not([${postAtt}])`
    );
    if (elLink) {
      const block = climbUpTheTree(elLink, 5);
      hideBlock(block, elLink, keyWords.OTHER_INFO_BOX_SUBSCRIBE, state, options, {
        postAtt,
      });
    }
  }
}

module.exports = {
  scrubInfoBoxes,
};
