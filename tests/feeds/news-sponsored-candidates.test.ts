// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { getSponsoredDiagnostics, isSponsored } from "../../src/feeds/shared/sponsored";
import { createNewsContext, requireElement } from "./news-fixtures";

const shortLink = '<span><a href="/publisher?__cft__[0]=short">贊助</a></span>';
const longHref = `/publisher?__cft__[0]=${"a".repeat(301)}`;
const longLink = `<span><a href="${longHref}">贊助</a></span>`;

/**
 * Model a supported, localized metadata layout with two short eligible controls before a third.
 * This is a synthetic regression for an ordering gap, not a reconstruction of the reporter's DOM.
 * @param tail Third control or authored-region negative whose ownership is evaluated by production.
 * @returns The concrete post inside a virtualized wrapper with no role=feed or ads-about links.
 */
function mountCandidatePost(tail = longLink): HTMLElement {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div data-virtualized="false"><div aria-posinset="1" id="candidate">${shortLink}${shortLink}${tail}</div></div></div>`;
  return requireElement(document.getElementById("candidate"));
}

describe("news sponsored candidate order", () => {
  afterEach(() => {
    clearDirtyTracking();
    document.body.replaceChildren();
  });

  test("hides a corroborated third tracking control in the no-feed-root localized layout", () => {
    const post = mountCandidatePost();
    const context = createNewsContext({
      options: { NF_SPONSORED: true },
      keyWords: { SPONSORED: "贊助" },
    });
    expect(document.querySelector('[role="feed"]')).toBeNull();
    expect(post.querySelector('a[href*="/ads/about/"]')).toBeNull();
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe("贊助");
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(post.parentElement?.hasAttribute(postAtt)).toBe(false);
  });

  test("leaves the same eligible card visible when sponsored filtering is disabled", () => {
    const post = mountCandidatePost();
    const context = createNewsContext({ options: { NF_SPONSORED: false } });
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
  });

  test("restores and reclassifies a reused virtualized post after equal-length signature changes", () => {
    const post = mountCandidatePost();
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    mopNewsFeed(context);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    const lastLink = requireElement(post.querySelector("span:last-child a"));
    const previousLength = post.innerHTML.length;
    lastLink.setAttribute("href", longHref.replace("__cft__[0]", "__cft__[1]"));
    expect(post.innerHTML.length).toBe(previousLength);
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    lastLink.setAttribute("href", longHref);
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
  });

  test.each([
    `<span><a href="${longHref}">Ordinary publisher</a></span>`,
    `<span><a href="https://example.test${longHref}">贊助</a></span>`,
    `<p>${longLink}</p>`,
    `<div data-ad-rendering-role="creative_body">${longLink}</div>`,
    `<div role="article">${longLink}</div>`,
    `<div role="comment">${longLink}</div>`,
    `<div cmfr="Independent feature">${longLink}</div>`,
    '<div data-ad-rendering-role="profile_name">贊助</div>',
    '<span><a href="/publisher?__cft__[0]=short&padding=aaaaaaaaaaaaaaaaaaaa">贊助</a></span>',
  ])("does not promote an ineligible later signal to sponsorship: %s", (tail) => {
    const post = mountCandidatePost(tail);
    const before = post.outerHTML;
    expect(isSponsored(post, { isNF: true })).toBe(false);
    expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks.meetsMinimumCount).toBe(0);
    expect(post.outerHTML).toBe(before);
    mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("keeps the rejection ceiling even when the final candidate would otherwise qualify", () => {
    const post = mountCandidatePost(`${shortLink.repeat(7)}${longLink}`);
    expect(isSponsored(post, { isNF: true })).toBe(false);
    expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks).toMatchObject({
      selectedCount: 10,
      inspectedCount: 0,
      rejectedForVolume: true,
    });
  });
});
