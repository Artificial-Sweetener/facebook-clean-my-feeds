const { postAtt } = require("../../dom/attributes");

function hideNumberOfShares(post, state, options) {
  if (!post || !state || !options) {
    return;
  }

  const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not(${postAtt})`;
  const shares = post.querySelectorAll(query);
  for (const share of shares) {
    share.setAttribute(state.cssHideNumberOfShares, "");
    if (options.VERBOSITY_DEBUG) {
      share.setAttribute(state.showAtt, "");
    }
    share.setAttribute(postAtt, "Shares");
  }
}

function findNumberOfShares(post) {
  if (!post) {
    return 0;
  }
  const query = `div[data-visualcompletion="ignore-dynamic"] > div:not([class]) > div:not([class]) > div:not([class]) > div[class] > div:nth-of-type(1) > div > div > span > div:not([id]) > span[dir]:not(${postAtt})`;
  return post.querySelectorAll(query).length;
}

module.exports = {
  findNumberOfShares,
  hideNumberOfShares,
};
