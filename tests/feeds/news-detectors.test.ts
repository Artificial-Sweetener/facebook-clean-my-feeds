// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";
import {
  findTopCardsForPagesContainer,
  isNewsAiInfoPost,
  isNewsFollow,
  isNewsParticipate,
  isNewsVerifiedBadge,
  getSidePanelAiTargets,
} from "../../src/feeds/news";
import { newsSelectors } from "../../src/selectors/news";

describe("feeds/news-detectors", () => {
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

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const container = findTopCardsForPagesContainer(mainColumn);

    expect(container).not.toBeNull();
    expect(requireElement(container).getAttribute("role")).toBe("region");
    expect(requireElement(container).querySelector('a[href="/stories/"]')).not.toBeNull();
    expect(requireElement(container).querySelector('a[href="/reel/"]')).not.toBeNull();
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

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
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

    const keyWords = { NF_FOLLOW: "Follow" };

    expect(isNewsFollow(post, keyWords)).toBe("Follow");
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

  test("isNewsFollow ignores follow text without structural follow signals", () => {
    const post = document.createElement("div");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    button.textContent = "Seguir";
    post.appendChild(button);

    const keyWords = { NF_FOLLOW: "Follow" };

    expect(isNewsFollow(post, keyWords)).toBe("");
  });

  test("isNewsParticipate ignores join text without structural participate signals", () => {
    const post = document.createElement("div");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    button.textContent = "Join";
    post.appendChild(button);

    const keyWords = { NF_PARTICIPATE: "Participate / Join" };

    expect(isNewsParticipate(post, keyWords)).toBe("");
  });

  test("isNewsVerifiedBadge detects verified badge in header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h4");
    const badge = document.createElement("svg");
    badge.setAttribute("aria-label", "Verified account");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });

  test("isNewsVerifiedBadge detects verified badge in shared header", () => {
    const post = document.createElement("div");
    const header = document.createElement("h5");
    const badge = document.createElement("svg");
    badge.setAttribute("aria-label", "Verified account");
    header.appendChild(badge);
    post.appendChild(header);

    const keyWords = { NF_FILTER_VERIFIED_BADGE: "Filter verified accounts" };

    expect(isNewsVerifiedBadge(post, keyWords)).toBe("Filter verified accounts");
  });

  test("isNewsAiInfoPost detects exact AI info button labels", () => {
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    const pageLink = document.createElement("a");
    pageLink.href = "/example";
    pageLink.textContent = "Example Page";
    const aiInfo = document.createElement("div");
    aiInfo.setAttribute("role", "button");
    aiInfo.textContent = "AI info";
    post.append(pageLink, aiInfo);

    const keyWords = { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' };

    expect(isNewsAiInfoPost(post, keyWords)).toBe('Posts labeled "AI info"');
  });

  test("isNewsAiInfoPost ignores AI info text outside button-like controls", () => {
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    const body = document.createElement("p");
    body.textContent = "This post discusses AI info labels.";
    post.appendChild(body);

    const keyWords = { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' };

    expect(isNewsAiInfoPost(post, keyWords)).toBe("");
  });

  test("isNewsAiInfoPost ignores unrelated button labels", () => {
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    const button = document.createElement("div");
    button.setAttribute("role", "button");
    button.textContent = "More";
    post.appendChild(button);

    const keyWords = { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' };

    expect(isNewsAiInfoPost(post, keyWords)).toBe("");
  });

  test("getSidePanelAiTargets finds Meta AI and Manus AI items", () => {
    document.body.innerHTML = `
      <div role="navigation">
        <ul>
          <li><a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.meta.ai%2F">Meta AI</a></li>
          <li>Manus AI</li>
          <li>Friends</li>
        </ul>
      </div>
      <div role="complementary">
        <ul>
          <li><a href="/messages/t/36327,2227039302/">Meta AI</a></li>
          <li><a href="/messages/t/12345/">Someone Else</a></li>
        </ul>
      </div>
    `;

    const targets = getSidePanelAiTargets();
    expect(targets.length).toBe(3);
  });
});
