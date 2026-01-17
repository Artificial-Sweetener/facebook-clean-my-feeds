const {
  isReelLink,
  isReelsAndShortVideosLink,
} = require("../../../src/core/filters/classifiers/reels");

describe("core/filters/classifiers/reels", () => {
  test("isReelLink checks for reel paths", () => {
    expect(isReelLink("/reel/123")).toBe(true);
    expect(isReelLink("/video/123")).toBe(false);
    expect(isReelLink(null)).toBe(false);
  });

  test("isReelsAndShortVideosLink matches exact path", () => {
    expect(isReelsAndShortVideosLink("/reel/?s=ifu_see_more")).toBe(true);
    expect(isReelsAndShortVideosLink("/reel/")).toBe(false);
  });
});
