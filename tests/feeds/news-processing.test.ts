// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";
import { mopNewsFeed } from "../../src/feeds/news";
import { disconnectDirtyObserver } from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";
import { newsSelectors } from "../../src/selectors/news";
import {
  createMetaAiPromptRow,
  createPostWithRow,
  createNewsContext,
  createSponsoredPost,
  appendSponsoredLinkSignature,
} from "./news-fixtures";

describe("feeds/news-processing", () => {
  test("mopNewsFeed scrubs prompt rows from the feed root without relying on post collection", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const { outer } = createMetaAiPromptRow();
    mainColumn.appendChild(outer);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed scrubs prompt rows nested inside posts through the root scrubber", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed hides prompt rows via the DOM fallback when direct fiber access is blocked", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true, VERBOSITY_DEBUG: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    mopNewsFeed(context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    expect(outer.hasAttribute(context.state.showAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed hides posts labeled AI info when the option is enabled", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    const aiInfo = document.createElement("div");
    aiInfo.setAttribute("role", "button");
    aiInfo.textContent = "AI info";
    post.appendChild(aiInfo);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_AI_INFO_POSTS: true },
      keyWords: { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' },
    });

    mopNewsFeed(context);

    expect(post.getAttribute(postAtt)).toBe("Posts labeled AI info");
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed leaves posts labeled AI info visible when the option is disabled", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    const aiInfo = document.createElement("div");
    aiInfo.setAttribute("role", "button");
    aiInfo.textContent = "AI info";
    post.appendChild(aiInfo);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_AI_INFO_POSTS: false },
      keyWords: { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' },
    });

    mopNewsFeed(context);

    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    disconnectDirtyObserver(mainColumn);
  });

  test("mopNewsFeed prefers real post selectors over fallback wrappers", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <h3 dir="auto">Feed</h3>
        <div>
          <div><div><div><div><div id="fallback-wrapper">Wrapper</div></div></div></div></div>
        </div>
      </div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const post = createSponsoredPost({ labelId: "sponsored-label-priority" });
    appendSponsoredLinkSignature(post);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "Sponsored" },
    });

    mopNewsFeed(context);

    expect(post.getAttribute(postAtt)).toBe("Sponsored");
    expect(requireElement(document.getElementById("fallback-wrapper")).hasAttribute(postAtt)).toBe(
      false
    );
  });
});
