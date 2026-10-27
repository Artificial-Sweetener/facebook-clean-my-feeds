// SPDX-License-Identifier: GPL-3.0-only

import { mainColumnAtt, postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking, flushDirtyRecords, markElementClean } from "../../src/dom/dirty-check";
import {
  getCollectionOfNewsPosts,
  getOrphanSponsoredNewsPosts,
  isNewsDirty,
  mopNewsFeed,
  shouldSweepNewsPosts,
  findRightRailSponsoredSection,
  isPlausibleRightRailAdLink,
  isRightRailHeadingText,
  scrubRightRailSuggestions,
} from "../../src/feeds/news";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Mount a legacy rail child without changing its eligibility through a modern wrapper. */
function mountSuggestionRail(content: string) {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"></div><div role="complementary">${"<div>".repeat(4)}<div><div id="target">${content}</div></div>${"</div>".repeat(4)}</div>`;
  return requireElement(document.getElementById("target"));
}

/** Place a sponsored section beside a genuinely unrelated contact section. */
function mountSponsoredRail(heading: string, href: string) {
  document.body.innerHTML = `<div role="navigation"></div><div role="main"></div><div role="complementary"><section id="ad"><div><h3>${heading}</h3></div><div><a href="${href}">Example ad</a></div></section><section id="contacts"><h3>Contacts</h3><a href="/alice">Alice</a></section></div>`;
  return {
    ad: requireElement(document.getElementById("ad")),
    contacts: requireElement(document.getElementById("contacts")),
    heading: requireElement(document.querySelector("h3")),
    rail: requireElement(document.querySelector('[role="complementary"]')),
  };
}

describe("news discovery and sweep contract", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    clearDirtyTracking();
  });

  test.each([0, 749, 750, 751])(
    "uses the documented 750 ms sweep boundary at elapsed %s",
    (elapsed) => {
      jest.spyOn(Date, "now").mockReturnValue(5000 + elapsed);
      const main = document.createElement("div");
      expect(shouldSweepNewsPosts({ lastNewsPostSweepAt: 5000 }, main, false)).toBe(elapsed >= 750);
      expect(shouldSweepNewsPosts({ lastNewsPostSweepAt: 5000 }, main, true)).toBe(true);
    }
  );

  test("does not sweep absent main roots and initializes present roots without state", () => {
    expect(shouldSweepNewsPosts(null, null, true)).toBe(false);
    expect(shouldSweepNewsPosts(null, document.createElement("div"), false)).toBe(true);
    document.body.replaceChildren();
    expect(getCollectionOfNewsPosts()).toEqual([]);
    expect(isNewsDirty(null)).toEqual([null, null]);
    expect(mopNewsFeed(null)).toBeNull();
  });

  test("tracks main and dialog independently and honors forced processing", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><p>Main</p></div><div role="dialog"><p>Dialog</p></div>';
    const main = requireElement(document.querySelector('[role="main"]'));
    const dialog = requireElement(document.querySelector('[role="dialog"]'));
    const { state } = createNewsContext();
    expect(isNewsDirty(state)).toEqual([main, dialog]);
    // Mark ownership and acknowledge observed versions as the processor does after a settled pass.
    for (const root of [main, dialog]) {
      root.setAttribute(mainColumnAtt, "1");
      flushDirtyRecords(root);
      markElementClean(root);
    }
    expect(isNewsDirty(state)).toEqual([null, null]);
    dialog.append("This is a sufficiently long late dialog change");
    expect(isNewsDirty(state)).toEqual([null, dialog]);
    state.forceProcess = true;
    expect(isNewsDirty(state)).toEqual([main, dialog]);
    expect(state.noChangeCounter).toBe(4);
  });

  test("does not discover concrete posts outside the main feed", () => {
    document.body.innerHTML =
      '<div role="main"><div role="article" id="feed">Feed</div></div><div role="dialog"><div role="article" id="dialog">Dialog</div></div>';
    expect(getCollectionOfNewsPosts().map((post) => post.id)).toEqual(["feed"]);
  });

  test("deduplicates orphan ad links at their nearest virtualized container", () => {
    document.body.innerHTML =
      '<div role="main"><div data-virtualized="true" id="outer"><div data-virtualized="false" id="inner"><a href="/ads/about/1">Ad</a><a href="/ads/about/2">Options</a></div></div><div role="article"><div data-virtualized="true"><a href="/ads/about/3">Standard ad</a></div></div></div>';
    expect(
      getOrphanSponsoredNewsPosts(document.querySelector('[role="main"]')).map((post) => post.id)
    ).toEqual(["inner"]);
    expect(getOrphanSponsoredNewsPosts(null)).toEqual([]);
  });

  test("does not treat the main root as an orphan even if it has a virtualized attribute", () => {
    document.body.innerHTML =
      '<div role="main" data-virtualized="true"><a href="/ads/about/">Preferences</a></div>';
    expect(getOrphanSponsoredNewsPosts(document.querySelector('[role="main"]'))).toEqual([]);
  });

  test("keeps orphan advertising fixtures visible when sponsored filtering is disabled", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div data-virtualized="true" id="ad"><a href="/ads/about/">Ad</a></div></div>';
    mopNewsFeed(createNewsContext());
    expect(requireElement(document.getElementById("ad")).hasAttribute(postAtt)).toBe(false);
  });
});

describe("right-rail sponsored boundaries", () => {
  test.each([
    "utm_campaign=summer",
    "utm_source=facebook",
    "utm_medium=social",
    "utm_content=card",
    "utm_campaign%3Dsummer",
  ])(
    "recognizes supported UTM parameter names only below an exact sponsored heading: %s",
    (parameter) => {
      const { ad } = mountSponsoredRail("Sponsored", `https://advertiser.example/?${parameter}`);
      mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
      expect(ad.hasAttribute(postAtt)).toBe(true);
      const ordinary = mountSponsoredRail("Contacts", `https://ordinary.example/?${parameter}`).ad;
      mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
      expect(ordinary.hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(["utm_campaign", "utm_campaignish", "campaign=summer", "ordinary=value"])(
    "does not infer tracking evidence from unrelated parameter text: %s",
    (parameter) => {
      const { ad } = mountSponsoredRail("Sponsored", `https://ordinary.example/?${parameter}`);
      mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
      expect(ad.hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(["Sponsored", " SPONSORED\n", "Spon\u200bsored", "\u200dSponsored\ufeff"])(
    "recognizes normalized exact headings: %s",
    (label) => {
      const { ad, contacts } = mountSponsoredRail(label, "https://advertiser.example/?ad_id=123");
      mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
      expect(ad.hasAttribute(postAtt)).toBe(true);
      expect(contacts.hasAttribute(postAtt)).toBe(false);
    }
  );

  test("supports localized heading copy without relying on the English word", () => {
    const { ad } = mountSponsoredRail("Publicidad", "https://advertiser.example/?fbclid=example");
    mopNewsFeed(
      createNewsContext({ options: { NF_SPONSORED: true }, keyWords: { SPONSORED: "Publicidad" } })
    );
    expect(ad.getAttribute(postAtt)).toBe("Publicidad");
  });

  test.each(["Sponsored posts explained", "Not sponsored", "", "Contacts"])(
    "does not hide unmatched headings: %s",
    (label) => {
      const { ad } = mountSponsoredRail(label, "https://advertiser.example/?ad_id=123");
      mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
      expect(ad.hasAttribute(postAtt)).toBe(false);
    }
  );

  test("requires a plausible ad destination as well as a sponsored heading", () => {
    const { ad } = mountSponsoredRail("Sponsored", "/alice");
    mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
    expect(ad.hasAttribute(postAtt)).toBe(false);
    expect(isRightRailHeadingText(null, "Sponsored")).toBe(false);
    expect(isPlausibleRightRailAdLink(null)).toBe(false);
  });

  test("requires ad links after the heading and will not cross a neighboring heading", () => {
    const { rail, heading, ad } = mountSponsoredRail(
      "Sponsored",
      "https://advertiser.example/?ad_id=123"
    );
    const link = requireElement(ad.querySelector("a"));
    ad.prepend(link);
    expect(findRightRailSponsoredSection(rail, heading, "Sponsored")).toBeNull();
    ad.append(link);
    ad.insertAdjacentHTML("beforeend", "<h3>Contacts</h3>");
    expect(findRightRailSponsoredSection(rail, heading, "Sponsored")).toBeNull();
  });

  test("rescans late rail advertising independently of unchanged main markup", () => {
    const { ad } = mountSponsoredRail("Sponsored", "/alice");
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    mopNewsFeed(context);
    expect(ad.hasAttribute(postAtt)).toBe(false);
    requireElement(ad.querySelector("a")).href = "https://advertiser.example/?campaign_id=123";
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(ad.hasAttribute(postAtt)).toBe(true);
  });
});

describe("right-rail suggestion option boundaries", () => {
  test("hides a recommendation card only when suggestions are enabled", () => {
    let target = mountSuggestionRail(
      '<h3>Suggested for you</h3><a href="/example-page">Example page</a>'
    );
    mopNewsFeed(createNewsContext());
    expect(target.hasAttribute(postAtt)).toBe(false);
    target = mountSuggestionRail(
      '<h3>Suggested for you</h3><a href="/example-page">Example page</a>'
    );
    mopNewsFeed(createNewsContext({ options: { NF_SUGGESTIONS: true } }));
    expect(target.hasAttribute(postAtt)).toBe(true);
  });

  test.each([
    '<a href="/events/birthdays/">Alice has a birthday</a>',
    '<div><i data-visualcompletion="css-img"></i><i data-visualcompletion="css-img"></i></div>',
    "",
  ])("preserves excluded rail children: %s", (markup) => {
    const target = mountSuggestionRail(markup);
    scrubRightRailSuggestions(createNewsContext({ options: { NF_SUGGESTIONS: true } }));
    expect(target.hasAttribute(postAtt)).toBe(false);
  });
});
