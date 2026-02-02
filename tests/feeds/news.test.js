const {
  findTopCardsForPagesContainer,
  isNewsFollow,
  isNewsParticipate,
  isNewsVerifiedBadge,
} = require("../../src/feeds/news");
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

  test("isNewsFollow detects header follow posts without group links", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const headerLink = document.createElement("a");
    headerLink.href = "https://www.facebook.com/StupidFish";
    headerLink.textContent = "Stupid Fish";
    const followButton = document.createElement("div");
    followButton.setAttribute("role", "button");
    followButton.textContent = "Follow";
    header.appendChild(headerLink);
    header.appendChild(followButton);
    post.appendChild(header);

    const state = { dictionaryFollow: [] };
    const keyWords = { NF_FOLLOW: "Follow" };

    expect(isNewsFollow(post, state, keyWords)).toBe("Follow");
  });

  test("isNewsParticipate detects header join posts with group links", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const groupLink = document.createElement("a");
    groupLink.href = "/groups/2211776349135268/";
    groupLink.textContent = "Elden Ring: The Community";
    const joinButton = document.createElement("div");
    joinButton.setAttribute("role", "button");
    joinButton.textContent = "Join";
    header.appendChild(groupLink);
    header.appendChild(joinButton);
    post.appendChild(header);

    const keyWords = { NF_PARTICIPATE: "Participate / Join" };

    expect(isNewsParticipate(post, keyWords)).toBe("Participate / Join");
  });

  test("isNewsVerifiedBadge detects verified badge in header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const badge = document.createElement("svg");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });

  test("isNewsVerifiedBadge detects verified badge in shared header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h5");
    const badge = document.createElement("svg");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });
});
