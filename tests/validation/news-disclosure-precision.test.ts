// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { isNewsEventsYouMayLike, isNewsSponsoredPaidBy, mopNewsFeed } from "../../src/feeds/news";
import { newsLabels } from "../../src/i18n/news-labels";
import { createNewsContext } from "../feeds/news-fixtures";
import { contextForOption, mountNewsPost } from "./news-contract-fixtures";

/** Render the legacy layout without assuming its generic div/span shape proves an event recommendation. */
function eventsCard(label: string): string {
  return `<div><div></div><div><div><div><h3><span>${label}</span></h3></div></div></div></div>`;
}

/** Render the legacy paid-by location so ordinary author/date metadata can be tested in the identical shape. */
function paidByCard(label: string): string {
  return `<div></div><div><div><div></div><div><span class="author-info"><span id="author-label"><div>Neighbour</div><div>${label}</div></span></span></div></div></div>`;
}

const { keyWords } = createNewsContext();

describe("event and paid-by semantic precision", () => {
  test("preserves an ordinary community heading in the old event-card shape", () => {
    const { post } = mountNewsPost(eventsCard("Community garden update"));
    mopNewsFeed(contextForOption("NF_EVENTS_YOU_MAY_LIKE"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test.each([
    "Yesterday at 3:45 PM",
    "Paid for by",
    "Paid for bystander",
    "We discussed paid for by Example",
  ])("preserves non-disclosure metadata: %s", (label) => {
    const { post } = mountNewsPost(paidByCard(label));
    mopNewsFeed(contextForOption("NF_SPONSORED_PAID"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test.each(Object.entries(newsLabels))(
    "retains expected event and paid-by aliases for %s",
    (_locale, labels) => {
      const { post } = mountNewsPost(eventsCard(labels[7].split("|")[0] || ""));
      expect(isNewsEventsYouMayLike(post, keyWords)).toBe(keyWords.NF_EVENTS_YOU_MAY_LIKE);
      for (const template of labels[8].split("|")) {
        post.innerHTML = paidByCard(template.replace("______", "Example"));
        expect(isNewsSponsoredPaidBy(post, keyWords)).toBe(keyWords.NF_SPONSORED_PAID);
      }
    }
  );

  test.each([
    'div role="article"',
    'div data-commentid="comment"',
    'div data-ad-preview="message"',
    "blockquote",
  ])("does not promote an exact label inside %s to its parent", (wrapper) => {
    const tag = wrapper.split(" ")[0];
    const { post } = mountNewsPost(
      `<${wrapper}>${eventsCard("Events you may like")}${paidByCard("Paid for by Example")}</${tag}>`
    );
    expect(isNewsEventsYouMayLike(post, keyWords)).toBe("");
    expect(isNewsSponsoredPaidBy(post, keyWords)).toBe("");
  });
});
