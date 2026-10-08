// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";
import { mopNewsFeed } from "../../src/feeds/news";
import { disconnectDirtyObserver } from "../../src/dom/dirty-check";
import { mainColumnAtt, postAtt } from "../../src/dom/attributes";
import { newsSelectors } from "../../src/selectors/news";
import {
  createNewsContext,
  createSponsoredPost,
  createRightRailSponsoredFixture,
} from "./news-fixtures";

describe("feeds/news-sponsored", () => {
  test("mopNewsFeed hides the current right-rail sponsored section", () => {
    const { mainColumn, sponsoredSection, oldSponsoredSelector } =
      createRightRailSponsoredFixture();

    expect(document.querySelector(oldSponsoredSelector)).toBeNull();

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(sponsoredSection.getAttribute(postAtt)).toBe("Sponsored");
    expect(sponsoredSection.hasAttribute(context.state.hideAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed leaves right-rail birthdays visible when hiding sponsored ads", () => {
    const { mainColumn, sponsoredSection, birthdaysSection } = createRightRailSponsoredFixture();

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(sponsoredSection.getAttribute(postAtt)).toBe("Sponsored");
    expect(birthdaysSection.hasAttribute(postAtt)).toBe(false);
    expect(birthdaysSection.hasAttribute(context.state.hideAtt)).toBe(false);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed leaves right-rail sponsored ads visible when NF_SPONSORED is disabled", () => {
    const { mainColumn, sponsoredSection, birthdaysSection } = createRightRailSponsoredFixture();

    const context = createNewsContext({
      options: { NF_SPONSORED: false },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(sponsoredSection.hasAttribute(postAtt)).toBe(false);
    expect(sponsoredSection.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(birthdaysSection.hasAttribute(postAtt)).toBe(false);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed checks right-rail sponsored ads during periodic sweeps", () => {
    const { mainColumn, sponsoredSection } = createRightRailSponsoredFixture();
    mainColumn.setAttribute(mainColumnAtt, mainColumn.innerHTML.length.toString());

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(sponsoredSection.getAttribute(postAtt)).toBe("Sponsored");
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed hides orphan sponsored virtualized posts", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <h3 dir="auto">Feed</h3>
        <div>
          <div role="article" id="ordinary-post">Ordinary post</div>
          <div data-virtualized="false" id="orphan-sponsored">
            <a href="/ads/about/?entry_product=ad_preferences">Sponsored</a>
          </div>
        </div>
      </div>
    `;

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(requireElement(document.getElementById("orphan-sponsored")).getAttribute(postAtt)).toBe(
      "Sponsored"
    );
    expect(requireElement(document.getElementById("ordinary-post")).hasAttribute(postAtt)).toBe(
      false
    );
  });

  test("mopNewsFeed ignores virtualized containers without an ads-about link", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div data-virtualized="false" id="not-an-ad">
          <div data-ad-rendering-role="profile_name">Ordinary content</div>
          <div data-ad-rendering-role="creative_body">Ordinary content</div>
        </div>
      </div>
    `;

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(requireElement(document.getElementById("not-an-ad")).hasAttribute(postAtt)).toBe(false);
  });

  test("mopNewsFeed ignores sponsored labels that appear later without an agnostic signal", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
      <div id="outside-root"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const post = createSponsoredPost({ labelId: "sponsored-label-late" });
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);

    const outsideRoot = requireElement(document.getElementById("outside-root"));
    const sponsoredLabel = document.createElement("span");
    sponsoredLabel.id = "sponsored-label-late";
    sponsoredLabel.textContent = "Sponsored";
    outsideRoot.appendChild(sponsoredLabel);

    context.state.lastNewsPostSweepAt = 0;

    mopNewsFeed(context);

    expect(post.hasAttribute(postAtt)).toBe(false);
  });
});
