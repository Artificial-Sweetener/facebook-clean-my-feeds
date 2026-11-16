// SPDX-License-Identifier: GPL-3.0-only

import { collectProfilePosts } from "../../src/feeds/profile";
import { profileSelectors } from "../../src/selectors/profile";

describe("feeds/profile", () => {
  test("collectProfilePosts returns per-post containers", () => {
    document.body.innerHTML = `
      <div role="main">
        <div id="wrapper">
          <div id="post-one">
            <div class="post-header">
              <a href="/page/posts/abc123">Post 1</a>
            </div>
            <div class="post-body">Hello</div>
          </div>
          <div id="post-two">
            <div class="post-header">
              <a href="/page/posts/def456">Post 2</a>
            </div>
          </div>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(profileSelectors.mainColumn);
    const posts = collectProfilePosts(mainColumn);

    const ids = posts.map((post) => post.id);
    expect(ids).toContain("post-one");
    expect(ids).toContain("post-two");
    expect(ids).toHaveLength(2);
  });

  test("collectProfilePosts ignores non-post blocks", () => {
    document.body.innerHTML = `
      <div role="main">
        <div id="composer">
          <div>What's on your mind?</div>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(profileSelectors.mainColumn);
    const posts = collectProfilePosts(mainColumn);

    expect(posts).toHaveLength(0);
  });
});
