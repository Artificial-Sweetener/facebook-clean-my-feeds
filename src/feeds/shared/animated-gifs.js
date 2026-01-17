const { getMosquitosQuery } = require("../../dom/animated-gifs");

const { getGroupsBlocksQuery, getNewsBlocksQuery } = require("./blocks");

function hasNewsAnimatedGifContent(post, keyWords) {
  if (!post || !keyWords) {
    return "";
  }

  const postBlocks = post.querySelectorAll(getNewsBlocksQuery(post));
  if (postBlocks.length >= 2) {
    const contentBlock = postBlocks[1];
    const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
    return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
  }

  return "";
}

function hasGroupsAnimatedGifContent(post, keyWords) {
  if (!post || !keyWords) {
    return "";
  }

  const postBlocks = post.querySelectorAll(getGroupsBlocksQuery(post));
  if (postBlocks.length >= 2) {
    const contentBlock = postBlocks[1];
    const animatedGIFs = contentBlock.querySelectorAll(getMosquitosQuery());
    return animatedGIFs.length > 0 ? keyWords.GF_ANIMATED_GIFS_POSTS : "";
  }

  return "";
}

module.exports = {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
};
