// SPDX-License-Identifier: GPL-3.0-only

import * as labels from "../../src/core/filters/labels";
import * as disclosureLabels from "../../src/core/filters/disclosure-labels";
import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopNewsFeed, isNewsPeopleYouMayKnow, isNewsSponsoredPaidBy } from "../../src/feeds/news";
import { hasPeopleDiscoveryStructure } from "../../src/feeds/news-people-structure";
import { getStructuralSponsoredKind } from "../../src/feeds/shared/sponsored-structure";
import { isSponsored, getSponsoredDiagnostics } from "../../src/feeds/shared/sponsored";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountStructuralFeed, peopleStructure } from "./structural-disclosure-fixtures";
import { mountNewsPost, postCases } from "../validation/news-contract-fixtures";

afterEach(() => {
  jest.restoreAllMocks();
  clearDirtyTracking();
  document.body.replaceChildren();
});

test.each(["paid", "sponsored"] as const)(
  "filters both report families together without consulting locale catalogs: %s",
  (kind) => {
    const { people, advertisement, ordinary } = mountStructuralFeed(kind);
    const context = createNewsContext({
      options: { NF_PEOPLE_YOU_MAY_KNOW: true, NF_SPONSORED_PAID: true, NF_SPONSORED: true },
    });
    const newsMatcher = jest.spyOn(labels, "matchesNewsLabel");
    const paidMatcher = jest.spyOn(labels, "matchesPaidByDisclosure");
    const adMatcher = jest.spyOn(disclosureLabels, "matchesSponsoredLabel");
    expect(isNewsPeopleYouMayKnow(people, context.keyWords)).toBe(
      context.keyWords.NF_PEOPLE_YOU_MAY_KNOW
    );
    if (kind === "paid")
      expect(isNewsSponsoredPaidBy(advertisement, context.keyWords)).toBe(
        context.keyWords.NF_SPONSORED_PAID
      );
    else
      expect(getSponsoredDiagnostics(advertisement, { isNF: true }).matchedBy).toBe(
        "creative-structure"
      );
    expect(newsMatcher).not.toHaveBeenCalled();
    expect(paidMatcher).not.toHaveBeenCalled();
    expect(adMatcher).not.toHaveBeenCalled();
    mopNewsFeed(context);
    expect(people.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(advertisement.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(ordinary.hasAttribute(postAtt)).toBe(false);
  }
);

test.each(["NF_PEOPLE_YOU_MAY_KNOW", "NF_SPONSORED_PAID", "NF_SPONSORED"] as const)(
  "keeps the structural route controlled by %s",
  (option) => {
    const { people, advertisement, ordinary } = mountStructuralFeed(
      option === "NF_SPONSORED" ? "sponsored" : "paid"
    );
    const context = createNewsContext({ options: { [option]: true } });
    context.state.isAF = true;
    mopNewsFeed(context);
    const target = option === "NF_PEOPLE_YOU_MAY_KNOW" ? people : advertisement;
    const other = option === "NF_PEOPLE_YOU_MAY_KNOW" ? advertisement : people;
    expect(target.hasAttribute(postAtt)).toBe(true);
    expect(other.hasAttribute(postAtt)).toBe(false);
    expect(ordinary.hasAttribute(postAtt)).toBe(false);
    context.options[option] = false;
    resetFeedProcessing(context.state);
    mopNewsFeed(context);
    expect(target.hasAttribute(postAtt)).toBe(false);
  }
);

test("retains the localized fallback for incomplete or older structures", () => {
  const context = createNewsContext();
  const people = mountNewsPost(
    '<h3>People you may know</h3><a role="link" href="/friends/">See all</a>'
  ).post;
  expect(hasPeopleDiscoveryStructure(people)).toBe(false);
  expect(isNewsPeopleYouMayKnow(people, context.keyWords)).toBe(
    context.keyWords.NF_PEOPLE_YOU_MAY_KNOW
  );
  const legacy = requireElement(postCases.find((entry) => entry.option === "NF_SPONSORED_PAID"));
  const paid = mountNewsPost(legacy.markup).post;
  expect(getStructuralSponsoredKind(paid)).toBeNull();
  expect(isNewsSponsoredPaidBy(paid, context.keyWords)).toBe(context.keyWords.NF_SPONSORED_PAID);
  const ad = mountNewsPost('<a href="/ads/about/">Sponsored</a>').post;
  expect(isSponsored(ad, { isNF: true })).toBe(true);
});

test.each([
  "p",
  "blockquote",
  'div role="comment"',
  'div role="article"',
  'div data-ad-preview="message"',
])("does not promote nested features inside %s", (tag) => {
  const { people, advertisement } = mountStructuralFeed();
  for (const post of [people, advertisement]) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<${tag}></${tag.split(" ")[0]}>`;
    const nested = requireElement(wrapper.firstElementChild);
    nested.append(...Array.from(post.childNodes));
    post.append(nested);
  }
  expect(hasPeopleDiscoveryStructure(people)).toBe(false);
  expect(getStructuralSponsoredKind(advertisement)).toBeNull();
});

test.each([
  "portrait",
  "actions",
  "destination",
  "one tile",
  "body",
  "author",
  "hidden",
  "external",
])("rejects incomplete or ordinary people-card evidence: %s", (missing) => {
  const { people } = mountStructuralFeed();
  if (missing === "portrait") people.querySelectorAll("img").forEach((e) => e.remove());
  if (missing === "actions") people.querySelectorAll("button").forEach((e) => e.remove());
  if (missing === "destination")
    people.querySelectorAll("a").forEach((e) => e.setAttribute("href", "/friends/"));
  if (missing === "one tile") people.querySelector('[data-type="hscroll-child"]')?.remove();
  if (missing === "body")
    people.insertAdjacentHTML(
      "afterbegin",
      '<div data-ad-rendering-role="story_message">Ordinary message</div>'
    );
  if (missing === "author") people.insertAdjacentHTML("afterbegin", "<h4>Ordinary author</h4>");
  if (missing === "hidden")
    people
      .querySelectorAll('[data-type="hscroll-child"]')
      .forEach((e) => e.setAttribute("hidden", ""));
  if (missing === "external")
    people
      .querySelectorAll("a")
      .forEach((e) => e.setAttribute("href", "https://example.org/friends/suggestions/"));
  expect(hasPeopleDiscoveryStructure(people)).toBe(false);
});

test("a normal post mentioning friend discovery cannot supply a standalone carousel", () => {
  const { post } = mountNewsPost(`<h4>Author</h4><p>Discussion</p>${peopleStructure()}`);
  expect(hasPeopleDiscoveryStructure(post)).toBe(false);
});

test.each([
  "cta",
  "media",
  "short tracking",
  "untracked author",
  "hidden cta",
  "nested media",
  "body tracking",
  "menu",
  "nested control",
  "profile disclaimer",
])("rejects insufficient advertising evidence: %s", (missing) => {
  const { advertisement: post } = mountStructuralFeed();
  const cta = requireElement(post.querySelector('[data-ad-rendering-role="cta-"]'));
  const media = requireElement(post.querySelector('[data-ad-rendering-role="image"]'));
  const disclosure = requireElement(post.querySelector("#disclosure"));
  if (missing === "cta") cta.removeAttribute("data-ad-rendering-role");
  if (missing === "media") media.remove();
  if (missing === "short tracking")
    post
      .querySelectorAll("a")
      .forEach((e) => e.setAttribute("href", "/publisher?__cft__[0]=short"));
  if (missing === "untracked author")
    post.querySelector("#author")?.setAttribute("href", "/publisher");
  if (missing === "hidden cta") cta.setAttribute("hidden", "");
  if (missing === "nested media") media.setAttribute("role", "article");
  if (missing === "body tracking")
    requireElement(post.querySelector('[data-ad-rendering-role="story_message"]')).append(
      requireElement(post.querySelector("#avatar"))
    );
  if (missing === "menu") disclosure.setAttribute("aria-haspopup", "menu");
  if (missing === "nested control")
    disclosure.firstElementChild?.insertAdjacentHTML("beforeend", "<button>Nested</button>");
  if (missing === "profile disclaimer")
    requireElement(post.querySelector('[data-ad-rendering-role="profile_name"]')).append(
      disclosure
    );
  expect(getStructuralSponsoredKind(post)).toBeNull();
});

test("long tracking and an organic link preview without an ad CTA remain unmatched", () => {
  const { advertisement: post } = mountStructuralFeed("sponsored");
  post.querySelector('[data-ad-rendering-role="cta-"]')?.remove();
  requireElement(post.querySelector("svg text")).textContent = "Yesterday";
  expect(isSponsored(post, { isNF: true })).toBe(false);
});

test.each(["paid", "sponsored"] as const)(
  "retains %s creative evidence while the CTA slot loads",
  (kind) => {
    const { advertisement: post } = mountStructuralFeed(kind);
    requireElement(post.querySelector('[data-ad-rendering-role="cta-"]')).replaceChildren();
    expect(getStructuralSponsoredKind(post)).toBe(kind);
  }
);

test("does not borrow disclaimer spans from authored descendants", () => {
  const { advertisement: post } = mountStructuralFeed();
  requireElement(post.querySelector("#disclosure span")).innerHTML = "<p>Authored copy</p>";
  expect(getStructuralSponsoredKind(post)).toBeNull();
});

test("revalidates both structural matches when Facebook recycles their DOM", () => {
  const { people, advertisement } = mountStructuralFeed();
  const context = createNewsContext({
    options: { NF_PEOPLE_YOU_MAY_KNOW: true, NF_SPONSORED_PAID: true },
  });
  mopNewsFeed(context);
  expect(people.hasAttribute(postAtt)).toBe(true);
  expect(advertisement.hasAttribute(postAtt)).toBe(true);
  people
    .querySelectorAll('a[href="/friends/suggestions/"]')
    .forEach((e) => e.setAttribute("href", "/publisher"));
  advertisement.querySelector('[data-ad-rendering-role="cta-"]')?.remove();
  context.state.lastNewsPostSweepAt = 0;
  mopNewsFeed(context);
  expect(people.hasAttribute(postAtt)).toBe(false);
  expect(advertisement.hasAttribute(postAtt)).toBe(false);
});
