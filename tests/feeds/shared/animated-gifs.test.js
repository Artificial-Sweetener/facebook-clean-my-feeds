jest.mock("../../../src/feeds/shared/blocks", () => ({
  getGroupsBlocksQuery: jest.fn(() => ".block"),
  getNewsBlocksQuery: jest.fn(() => ".block"),
}));

const {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
} = require("../../../src/feeds/shared/animated-gifs");

describe("feeds/shared/animated-gifs", () => {
  test("hasNewsAnimatedGifContent returns key when gif exists", () => {
    const post = document.createElement("div");
    post.innerHTML = `
      <div class="block"></div>
      <div class="block">
        <div role="button" aria-label="GIF"><i></i></div>
      </div>
    `;
    const keyWords = { GF_ANIMATED_GIFS_POSTS: "Animated GIFs" };

    expect(hasNewsAnimatedGifContent(post, keyWords)).toBe("Animated GIFs");
  });

  test("hasGroupsAnimatedGifContent returns empty when missing", () => {
    const post = document.createElement("div");
    post.innerHTML = `<div class="block"></div><div class="block"></div>`;
    const keyWords = { GF_ANIMATED_GIFS_POSTS: "Animated GIFs" };

    expect(hasGroupsAnimatedGifContent(post, keyWords)).toBe("");
  });
});
