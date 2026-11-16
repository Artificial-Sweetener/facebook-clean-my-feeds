// SPDX-License-Identifier: GPL-3.0-only

import * as news from "../../src/feeds/news-detectors";
import { isGroupsSuggested, isGroupsShortReelVideo } from "../../src/feeds/groups";
import { isSponsored } from "../../src/feeds/shared/sponsored";
import { translations } from "../../src/i18n";
import { createNewsContext } from "./news-fixtures";
import { peopleStructure, sponsoredStructure } from "./structural-disclosure-fixtures";
import { verifiedGlyph } from "./locale-structure-fixtures";

/** Each independent classifier is evaluated even when an earlier filter would win the production hiding reason. */
export const nonLocaleDetectors: Readonly<Record<string, (post: Element) => boolean>> = {
  /** Exercise the shared ad classifier in its news-feed route context. */
  sponsored: (post) => isSponsored(post, createNewsContext().state),
  /** Keep paid-by disclosure classification separate from ordinary ads. */
  paid: (post) => !!news.isNewsSponsoredPaidBy(post, translations.en),
  /** Evaluate partnership metadata independently of other paid-content reasons. */
  partnership: (post) => !!news.isNewsPaidPartnership(post, translations.en),
  /** Detect suggested content without allowing a preselected heading to bias discovery. */
  suggested: (post) => !!news.isNewsSuggested(post, null, translations.en),
  /** Verify the inline person/page action can establish its own filtering reason. */
  follow: (post) => !!news.isNewsFollow(post, translations.en),
  /** Verify the inline group action independently of suggested-group classification. */
  join: (post) => !!news.isNewsParticipate(post, translations.en),
  /** Exercise discovery-card ownership for suggested people. */
  people: (post) => !!news.isNewsPeopleYouMayKnow(post, translations.en),
  /** Distinguish event discovery shelves from other recommendation cards. */
  events: (post) => !!news.isNewsEventsYouMayLike(post, translations.en),
  /** Evaluate a multi-item Reel shelf independently of a single preview. */
  reels: (post) => !!news.isNewsReelsAndShortVideos(post, translations.en),
  /** Evaluate the news-feed single-Reel preview contract. */
  reel: (post) => !!news.isNewsShortReelVideo(post, translations.en),
  /** Cover both story shelves and explicitly feed-origin story links. */
  stories: (post) => !!news.isNewsStoriesPost(post, translations.en),
  /** Test AI destination evidence independently of disclosure controls. */
  metaAi: (post) => !!news.isNewsMetaAICard(post, translations.en),
  /** Keep AI-disclosure negatives checked even when their localized matcher is disabled. */
  aiInfo: (post) => !!news.isNewsAiInfoPost(post, translations.en),
  /** Classify author badge artwork without depending on its accessible name. */
  verified: (post) => !!news.isNewsVerifiedBadge(post, translations.en),
  /** Require group-feed discovery to obey the same foreign-content boundaries. */
  groupSuggestions: (post) => !!isGroupsSuggested(post, translations.en),
  /** Check group-feed Reel preview behavior separately from news-feed behavior. */
  groupReel: (post) => !!isGroupsShortReelVideo(post, translations.en),
};

/** Expected matches distinguish shared feature semantics from accidental cross-classification. */
export interface NonLocaleCase {
  name: string;
  markup: string;
  matches: readonly string[];
}

/** Preserve the observed inline author/action branches without words from any filter dictionary. */
function authorAction(group: boolean): string {
  return `<h4><span><span><a href="${group ? "/groups/123/" : "/profile.php?id=123"}">Person</a></span><span><span><span aria-hidden="true"> · </span></span><span><div role="button" tabindex="0"><span>Uncatalogued</span></div></span></span></span></h4>`;
}

/** Produce separately actionable discovery tiles with distinct known route families. */
function discovery(kind: "groups" | "events"): string {
  return (
    `<h3>Uncatalogued</h3><a href="/${kind}/discover/">Uncatalogued</a>` +
    [123, 456]
      .map(
        (id) =>
          `<div data-type="hscroll-child"><a href="/${kind}/${id}/"><img></a><button>Uncatalogued</button></div>`
      )
      .join("")
  );
}

/** Build all structural post signatures plus intact localized sentinels that must not match the audit build. */
export const nonLocalePostCases: readonly NonLocaleCase[] = [
  {
    name: "ordinary post with dictionary words",
    markup:
      '<h4><a href="/person">Author</a></h4><p>Sponsored Follow Join Suggested for you Meta AI AI info</p>',
    matches: [],
  },
  { name: "Follow", markup: authorAction(false), matches: ["follow"] },
  { name: "Join", markup: authorAction(true), matches: ["join"] },
  { name: "paid creative", markup: sponsoredStructure("paid"), matches: ["paid"] },
  { name: "ordinary ad creative", markup: sponsoredStructure("sponsored"), matches: ["sponsored"] },
  { name: "people discovery", markup: peopleStructure(), matches: ["people"] },
  {
    name: "group discovery",
    markup: discovery("groups"),
    matches: ["suggested", "groupSuggestions"],
  },
  { name: "event discovery", markup: discovery("events"), matches: ["events"] },
  {
    name: "verified artwork",
    markup: `<h4><a href="/person">Person</a>${verifiedGlyph}</h4>`,
    matches: ["verified"],
  },
  {
    name: "reel preview",
    markup: '<a href="/reel/123/"><img></a>',
    matches: ["reel", "groupReel"],
  },
  {
    name: "reel shelf",
    markup: [123, 456]
      .map((id) => `<div data-type="hscroll-child"><a href="/reel/${id}/"><img></a></div>`)
      .join(""),
    matches: ["reels"],
  },
  {
    name: "story shelf",
    markup: [123, 456]
      .map((id) => `<div data-type="hscroll-child"><a href="/stories/${id}/"><img></a></div>`)
      .join(""),
    matches: ["stories"],
  },
  {
    name: "feed story",
    markup: '<a href="/stories/123/?source=from_feed">Uncatalogued</a>',
    matches: ["stories"],
  },
  {
    name: "Meta AI destination",
    markup: '<a href="https://meta.ai/">Uncatalogued</a>',
    matches: ["metaAi"],
  },
  {
    name: "partnership help layout",
    markup:
      '<span dir="auto"><span id="partnership"><a href="/business/help/123">Uncatalogued</a></span></span>',
    matches: ["partnership"],
  },
  {
    name: "dictionary-only controls",
    markup:
      '<h4><a href="/person">Person</a><button>Follow</button><svg aria-label="Verified account"></svg></h4><button>AI info</button><h3>Suggested for you</h3><a href="/ads/about/">Sponsored</a>',
    matches: [],
  },
];

/** Embed complete signatures in contexts that cannot legitimately identify their owning parent post. */
export const nonLocaleBoundaries: Readonly<Record<string, (markup: string) => string>> = {
  /** Put evidence in authored body content that cannot classify the enclosing post. */
  message: (markup) => `<div data-ad-preview="message">${markup}</div>`,
  /** Put evidence in a comment owned by another author. */
  comment: (markup) => `<div data-commentid="123">${markup}</div>`,
  /** Give the signature a nested article owner instead of the tested outer post. */
  nested: (markup) => `<div role="article">${markup}</div>`,
  /** Preserve ownership when Facebook uses native article semantics instead of a div. */
  article: (markup) => `<article>${markup}</article>`,
  /** ARIA article ownership applies to every element type, not only div wrappers. */
  semanticArticle: (markup) => `<section role="article">${markup}</section>`,
  /** Suppress rendering on an ancestor rather than on the signature itself. */
  hidden: (markup) => `<div hidden>${markup}</div>`,
  /** Exclude an accessibility-hidden subtree from post evidence. */
  inaccessible: (markup) => `<div aria-hidden="true">${markup}</div>`,
};
