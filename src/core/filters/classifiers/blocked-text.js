const { findFirstMatch, findFirstMatchRegExp } = require("../matching");

function findBlockedText(postText, patterns, useRegExp) {
  if (!Array.isArray(patterns) || patterns.length === 0) {
    return "";
  }

  if (useRegExp) {
    return findFirstMatchRegExp(postText, patterns);
  }

  return findFirstMatch(postText, patterns);
}

module.exports = {
  findBlockedText,
};
