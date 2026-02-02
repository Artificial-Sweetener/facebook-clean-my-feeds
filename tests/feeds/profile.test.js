const { getProfilePostsFromPermalinks } = require("../../src/feeds/profile");
const { profileSelectors } = require("../../src/selectors/profile");

describe("feeds/profile", () => {
  test("getProfilePostsFromPermalinks returns per-post containers", () => {
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
    const posts = getProfilePostsFromPermalinks(mainColumn);

    const ids = posts.map((post) => post.id);
    expect(ids).toContain("post-one");
    expect(ids).toContain("post-two");
    expect(ids).toHaveLength(2);
  });

  test("getProfilePostsFromPermalinks ignores non-post blocks", () => {
    document.body.innerHTML = `
      <div role="main">
        <div id="composer">
          <div>What's on your mind?</div>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(profileSelectors.mainColumn);
    const posts = getProfilePostsFromPermalinks(mainColumn);

    expect(posts).toHaveLength(0);
  });
});
