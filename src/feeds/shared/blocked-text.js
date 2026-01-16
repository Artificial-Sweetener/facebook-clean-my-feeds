const { findBlockedText } = require("../../core/filters/classifiers/blocked-text");
const { extractTextContent } = require("../../dom/walker");

const { getGroupsBlocksQuery, getNewsBlocksQuery } = require("./blocks");

function findNewsBlockedText(post, options, filters) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3)
    .join(" ")
    .toLowerCase();
  return findBlockedText(postTexts, filters.NF_BLOCKED_TEXT_LC, options.NF_BLOCKED_RE);
}

function findGroupsBlockedText(post, options, filters) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getGroupsBlocksQuery(post), 3)
    .join(" ")
    .toLowerCase();
  return findBlockedText(postTexts, filters.GF_BLOCKED_TEXT_LC, options.GF_BLOCKED_RE);
}

function findVideosBlockedText(post, options, filters, queryBlocks) {
  if (!post || !options || !filters || !queryBlocks) {
    return "";
  }

  const postTexts = extractTextContent(post, queryBlocks, 1).join(" ").toLowerCase();
  return findBlockedText(postTexts, filters.VF_BLOCKED_TEXT_LC, options.VF_BLOCKED_RE);
}

function findProfileBlockedText(post, options, filters) {
  if (!post || !options || !filters) {
    return "";
  }

  const postTexts = extractTextContent(post, getNewsBlocksQuery(post), 3)
    .join(" ")
    .toLowerCase();
  return findBlockedText(postTexts, filters.PP_BLOCKED_TEXT_LC, options.PP_BLOCKED_RE);
}

module.exports = {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
};
