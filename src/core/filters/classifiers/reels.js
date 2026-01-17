function isReelLink(href) {
  return typeof href === "string" && href.includes("/reel/");
}

function isReelsAndShortVideosLink(href) {
  return href === "/reel/?s=ifu_see_more";
}

module.exports = {
  isReelLink,
  isReelsAndShortVideosLink,
};
