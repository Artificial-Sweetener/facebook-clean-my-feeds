// SPDX-License-Identifier: GPL-3.0-only

import type { HydratedOptions } from "../../src/core/options/types";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Only post-level news toggles are included; shared text/GIF/like classifiers have their own audit. */
export type NewsPostOption =
  | "NF_SPONSORED"
  | "NF_SPONSORED_PAID"
  | "NF_PAID_PARTNERSHIP"
  | "NF_SUGGESTIONS"
  | "NF_FOLLOW"
  | "NF_PARTICIPATE"
  | "NF_PEOPLE_YOU_MAY_KNOW"
  | "NF_EVENTS_YOU_MAY_LIKE"
  | "NF_REELS_SHORT_VIDEOS"
  | "NF_SHORT_REEL_VIDEO"
  | "NF_META_AI"
  | "NF_AI_INFO_POSTS"
  | "NF_STORIES"
  | "NF_FILTER_VERIFIED_BADGE";

/** Controlled DOM fixtures represent explicit semantic contracts; they are not claims of live Facebook observations. */
export interface NewsPostCase {
  option: NewsPostOption;
  markup: string;
}

/** Produce the supported legacy suggestion header without putting recommendation text in the body. */
export function suggestionHeader(label: string): string {
  return `<div><div><div><div><div><div></div><div><div><div><div></div><div><div><div></div><div><div><div></div><div><span><div><span>${label}</span></div></span></div></div></div></div></div></div></div></div></div></div></div></div></div>`;
}

/** Supported post signatures exercise real DOM matching rather than mocking selector return values. */
export const postCases: readonly NewsPostCase[] = [
  {
    option: "NF_SPONSORED",
    markup: '<a href="/ads/about/?entry_product=ad_preferences">Sponsored</a>',
  },
  {
    option: "NF_SPONSORED_PAID",
    markup:
      '<div></div><div><div><div></div><div><span class="disclosure"><span id="paid-label"><div></div><div>Paid for by Example</div></span></span></div></div></div>',
  },
  {
    option: "NF_PAID_PARTNERSHIP",
    markup:
      '<span dir="auto"><span id="partnership"><a href="/business/help/123">Paid partnership with Example</a></span></span>',
  },
  { option: "NF_SUGGESTIONS", markup: suggestionHeader("Suggested for you") },
  {
    option: "NF_FOLLOW",
    markup: '<h4><a href="/example-page">Example Page</a><span role="button">Follow</span></h4>',
  },
  {
    option: "NF_PARTICIPATE",
    markup: '<h4><a href="/groups/example">Example Group</a><span role="button">Join</span></h4>',
  },
  {
    option: "NF_PEOPLE_YOU_MAY_KNOW",
    markup: '<h3>People you may know</h3><a role="link" href="/friends/">See all</a>',
  },
  {
    option: "NF_EVENTS_YOU_MAY_LIKE",
    markup:
      "<div><div></div><div><div><div><h3><span>Events you may like</span></h3></div></div></div></div>",
  },
  {
    option: "NF_REELS_SHORT_VIDEOS",
    markup: '<h3>Reels</h3><a href="/reel/?s=ifu_see_more">See more</a>',
  },
  {
    option: "NF_SHORT_REEL_VIDEO",
    markup: '<a href="/reel/123456/"><img alt="Reel preview">Watch this reel</a>',
  },
  {
    option: "NF_META_AI",
    markup: '<a href="https://www.meta.ai/" aria-label="Visit Meta AI">Try Meta AI</a>',
  },
  { option: "NF_AI_INFO_POSTS", markup: '<div role="button">AI info</div>' },
  { option: "NF_STORIES", markup: '<a href="/stories/123?source=from_feed">View story</a>' },
  {
    option: "NF_FILTER_VERIFIED_BADGE",
    markup:
      '<h4><a href="/verified-page">Example</a><svg aria-label="Verified account"></svg></h4>',
  },
];

/** Mount one concrete post and an adjacent ordinary post so accidental ancestor hiding is observable. */
export function mountNewsPost(markup: string) {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1" id="subject">${markup}</div><div aria-posinset="2" id="neighbor"><h4><a href="/alice">Alice</a></h4><p>Our weekend photos</p></div></div>`;
  return {
    main: requireElement(document.querySelector('div[role="main"]')),
    post: requireElement(document.getElementById("subject")),
    neighbor: requireElement(document.getElementById("neighbor")),
  };
}

/** Isolate a single option while retaining the fully hydrated runtime context required by the pipeline. */
export function contextForOption(option: NewsPostOption, enabled = true) {
  const options: Partial<HydratedOptions> = { [option]: enabled };
  return createNewsContext({ options });
}

/** Make body and comment wording intentionally noisy while omitting every structural filter signal. */
export function ordinaryDiscussion() {
  return '<h4><a href="/alice">Alice</a></h4><div data-ad-preview="message"><p>Sponsored, paid partnership, suggested for you, people you may know, events you may like, reels, Follow, Join, Meta AI, AI info, Stories, verified account</p></div><div aria-label="Comment"><span>We discussed Sponsored and Suggested for you labels yesterday.</span><button>Reply</button></div>';
}

/** Build the shallower supported content-block layout with at least two blocks to avoid fallback depth. */
export function newsTextBlocks(first: string, second = "Ordinary continuation") {
  return `${"<div>".repeat(7)}<div><span>${first}</span></div><div><span>${second}</span></div>${"</div>".repeat(7)}`;
}
