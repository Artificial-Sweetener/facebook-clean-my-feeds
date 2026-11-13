// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { isNewsPeopleYouMayKnow, mopNewsFeed } from "../../src/feeds/news";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { newsLabels } from "../../src/i18n/news-labels";
import { contextForOption, mountNewsPost } from "./news-contract-fixtures";

const peopleHeading = "<h3><span> People you may know</span></h3>";
const friendsLink = '<a role="link" href="/friends/">See all</a>';
const suggestionLink = '<a role="link" href="/friends/suggestions/">Suggested person</a>';

/**
 * Reduce issue #25's captured card to its heading, carousel and footer siblings.
 * Eight layout wrappers preserve the observed legacy block-depth match that previously
 * excluded every discovery link. Identities, artwork and unrelated controls are omitted.
 */
function peopleCarousel(heading: string, carousel: string, footer: string): string {
  return `${"<div>".repeat(8)}<div>${heading}</div><div><div role="region"><div data-type="hscroll-child">${carousel}</div></div></div><div>${footer}</div>${"</div>".repeat(8)}`;
}

const layouts = [
  { name: "header link", markup: `${peopleHeading}${friendsLink}` },
  {
    name: "carousel links",
    markup: peopleCarousel(peopleHeading, suggestionLink, ""),
  },
  { name: "footer link", markup: peopleCarousel(peopleHeading, "", friendsLink) },
  {
    name: "carousel and footer links",
    markup: peopleCarousel(peopleHeading, suggestionLink, friendsLink),
  },
];

describe("people-discovery cards across news layouts", () => {
  test.each(layouts)("honors enabled and disabled filtering for $name", ({ markup }) => {
    const { main, post, neighbor } = mountNewsPost(markup);
    const context = contextForOption("NF_PEOPLE_YOU_MAY_KNOW", false);
    context.state.isAF = true;

    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);

    context.options.NF_PEOPLE_YOU_MAY_KNOW = true;
    resetFeedProcessing(context.state);
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.NF_PEOPLE_YOU_MAY_KNOW);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
    expect(main.hasAttribute(postAtt)).toBe(false);

    context.options.NF_PEOPLE_YOU_MAY_KNOW = false;
    resetFeedProcessing(context.state);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test.each(Object.entries(newsLabels))(
    "recognizes a carousel heading in %s independently of the settings language",
    (_locale, labels) => {
      const heading = labels[5]?.split("|")[0];
      expect(heading).toBeTruthy();
      const { post } = mountNewsPost(peopleCarousel(`<h3>${heading}</h3>`, suggestionLink, ""));
      const context = contextForOption("NF_PEOPLE_YOU_MAY_KNOW");
      expect(isNewsPeopleYouMayKnow(post, context.keyWords)).toBe(
        context.keyWords.NF_PEOPLE_YOU_MAY_KNOW
      );
    }
  );

  test.each([
    "p",
    "blockquote",
    'div data-ad-preview="message"',
    'div data-ad-comet-preview="message"',
    'div data-ad-rendering-role="story_message"',
    'div data-ad-rendering-role="creative_body"',
    'div contenteditable="true"',
    'div role="article"',
    'div aria-posinset="2"',
    'div data-commentid="comment"',
    'div data-testid="UFI2Comment/body"',
    'div role="comment"',
    `div ${postAtt}="another feature"`,
  ])("does not borrow a discovery link from %s", (wrapper) => {
    const tag = wrapper.split(" ")[0];
    const { post } = mountNewsPost(
      peopleCarousel(peopleHeading, `<${wrapper}>${suggestionLink}</${tag}>`, "")
    );
    mopNewsFeed(contextForOption("NF_PEOPLE_YOU_MAY_KNOW"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test.each([
    '<div hidden><a role="link" href="/friends/">See all</a></div>',
    '<div style="display:none"><a role="link" href="/friends/">See all</a></div>',
    '<div style="visibility:hidden"><a role="link" href="/friends/">See all</a></div>',
    '<div aria-hidden="true"><a role="link" href="/friends/">See all</a></div>',
    '<a role="link" href="https://example.org/friends/">See all</a>',
    '<a role="link" href="https://facebook.com.example.org/friends/">See all</a>',
    '<a role="link" href="/profile?next=/friends/">See all</a>',
    '<a role="link" href="/friends-lookalike/">See all</a>',
    '<a href="/friends/">See all</a>',
    '<a role="link" href="/person">Suggested person</a>',
  ])("rejects an unusable carousel destination: %s", (link) => {
    const { post } = mountNewsPost(peopleCarousel(peopleHeading, link, ""));
    mopNewsFeed(contextForOption("NF_PEOPLE_YOU_MAY_KNOW"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test.each([
    "",
    "<h3>Discussing People you may know</h3>",
    "<p>People you may know</p>",
    `<div hidden>${peopleHeading}</div>`,
    `<div data-ad-preview="message">${peopleHeading}</div>`,
    `<div role="article">${peopleHeading}</div>`,
  ])("requires the card's own visible exact heading: %s", (heading) => {
    const { post } = mountNewsPost(peopleCarousel(heading, suggestionLink, friendsLink));
    mopNewsFeed(contextForOption("NF_PEOPLE_YOU_MAY_KNOW"));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("restores a carousel root recycled into an ordinary post", () => {
    const { post, neighbor } = mountNewsPost(
      peopleCarousel(peopleHeading, suggestionLink, friendsLink)
    );
    const context = contextForOption("NF_PEOPLE_YOU_MAY_KNOW");
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(true);

    post.innerHTML = '<h4><a href="/author">Author</a></h4><p>Weekend photos</p>';
    context.state.forceProcess = true;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(neighbor.hasAttribute(postAtt)).toBe(false);
  });
});
