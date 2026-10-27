// SPDX-License-Identifier: GPL-3.0-only

jest.mock("../../../src/feeds/shared/blocks", () => ({
  getGroupsBlocks: jest.fn((post: Element) => Array.from(post.querySelectorAll(".block"))),
  getNewsBlocks: jest.fn((post: Element) => Array.from(post.querySelectorAll(".block"))),
}));

import {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
} from "../../../src/feeds/shared/animated-gifs";

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
