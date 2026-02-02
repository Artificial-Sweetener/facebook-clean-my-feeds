const { findTopCardsForPagesContainer } = require("../../src/feeds/news");
const { newsSelectors } = require("../../src/selectors/news");

describe("feeds/news", () => {
  test("findTopCardsForPagesContainer finds the top cards region", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div role="region" aria-label="profile plus top of feed cards">
          <a href="/stories/">Stories</a>
          <a href="/reel/">Reels</a>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const container = findTopCardsForPagesContainer(mainColumn);

    expect(container).not.toBeNull();
    expect(container.getAttribute("role")).toBe("region");
    expect(container.querySelector('a[href="/stories/"]')).not.toBeNull();
    expect(container.querySelector('a[href="/reel/"]')).not.toBeNull();
  });

  test("findTopCardsForPagesContainer ignores links inside articles", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div role="article">
          <a href="/stories/">Stories</a>
          <a href="/reel/">Reels</a>
        </div>
      </div>
    `;

    const mainColumn = document.querySelector(newsSelectors.mainColumn);
    const container = findTopCardsForPagesContainer(mainColumn);

    expect(container).toBeNull();
  });
});
