// SPDX-License-Identifier: GPL-3.0-only

import { buildBugReport } from "../../../src/diagnostics/bug-report";
import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { snapshotRegionHtml, testSnapshotSelector } from "../../../src/diagnostics/dom-fixture";
import { snapshotDestination } from "../../../src/diagnostics/dom-destinations";
import { hydrateOptions } from "../../../src/core/options/hydrate";
import { createFeedState } from "../../../src/feeds/state";
import { getRightRailFriendRequestPanels } from "../../../src/feeds/news-friend-requests";
import { isNewsStoriesPost } from "../../../src/feeds/news-detectors";
import { translations } from "../../../src/i18n";

afterEach(() => document.body.replaceChildren());

test.each([
  '<button aria-label="Message PrivateUnobservedPerson">Message PrivateUnobservedPerson</button>',
  "<h1>PrivateUnobservedPerson Support Circle</h1>",
  "<section><h3>PrivateUnobservedPerson Support Circle</h3></section>",
  '<div role="dialog"><h2>Chat with PrivateUnobservedPerson</h2></div>',
  '<button aria-labelledby="name"><svg></svg></button><span id="name">PrivateUnobservedPerson</span>',
  '<button title="PrivateUnobservedPerson">Sponsored</button>',
  '<button aria-label="Sponsored"><span title="PrivateUnobservedPerson">Sponsored</span></button>',
  '<button aria-label="Message PrivateUnobservedPerson">Sponsored</button>',
  "<button>إرسال إلى PrivateUnobservedPerson</button>",
  "<h3>与PrivateUnobservedPerson聊天</h3>",
])("the full report automatically redacts unobserved identities in %s", async (markup) => {
  document.body.innerHTML = `<main role="main">${markup}</main>`;
  const settings = hydrateOptions();
  const report = await buildBugReport({
    ...settings,
    pathInfo: {},
    state: {
      ...createFeedState(),
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
    },
  });
  expect(JSON.stringify(report.data).includes("PrivateUnobservedPerson")).toBe(false);
  expect(report.data.snapshot?.regions.length).toBeGreaterThan(0);
});

test.each(Object.values(translations).map((catalog) => catalog.SPONSORED))(
  "fixed interface copy remains usable independently of the selected language: %s",
  async (label) => {
    document.body.innerHTML = `<main role="main"><button></button></main>`;
    const button = document.querySelector("button");
    if (!button) throw new Error("Missing fixed-copy fixture");
    button.textContent = label;
    button.setAttribute("aria-label", label);
    const snapshot = await captureDomSnapshot(document);
    expect(JSON.stringify(snapshot).includes(label)).toBe(true);
  }
);

test.each(["Commercial notice beta", "محتوى ترويجي جديد", "新しいおすすめ", "Нова добірка"])(
  "unknown disclosure labels survive both capture orders and region locations: %s",
  async (label) => {
    for (const position of ["before", "after", "external", "another-region"]) {
      const leaf = `<span id="disclosure">${label}</span>`;
      const link = `<h4><a href="/publisher?__cft__[0]=${"x".repeat(400)}"><span aria-labelledby="disclosure"><svg></svg></span></a></h4>`;
      document.body.innerHTML = `<main role="main"><div role="article">${position === "before" ? leaf : ""}${link}${position === "after" ? leaf : ""}</div>${position === "another-region" ? `<section>${leaf}</section>` : ""}</main>${position === "external" ? leaf : ""}`;
      const snapshot = await captureDomSnapshot(document);
      const fixtures = snapshot.regions.map((region) => snapshotRegionHtml(snapshot, region));
      expect(fixtures[0]?.includes(label)).toBe(true);
      expect(snapshot.coverage.retainedLabelCharacters).toBeGreaterThanOrEqual(label.length);
    }
  }
);

test.each(["aria-labelledby", "aria-describedby"])(
  "generic controls cannot promote private reference targets through %s",
  async (attribute) => {
    document.body.innerHTML = `<main role="main"><button ${attribute}="private-label">Sponsored</button></main><span id="private-label">PrivateReferenceCanary</span>`;
    const snapshot = await captureDomSnapshot(document);
    expect(JSON.stringify(snapshot).includes("PrivateReferenceCanary")).toBe(false);
  }
);

test("a tracked profile link with an accessible badge does not publish its unobserved identity", async () => {
  document.body.innerHTML = `<main role="main"><div role="article"><h4><a href="/PrivateProfile?__cft__[0]=${"x".repeat(400)}">PrivateBadgeOwner<svg aria-label="Verified"></svg></a><a href="/PrivateProfile?__cft__[0]=${"x".repeat(400)}">${"PrivateLongOwner".repeat(20)}<span aria-labelledby="private-name"><svg></svg></span></a></h4></div></main><span id="private-name">PrivateReferencedOwner</span>`;
  const snapshot = await captureDomSnapshot(document);
  expect(JSON.stringify(snapshot).includes("Private")).toBe(false);
});

test.each([
  ["/friends/", "/friends/"],
  ["/friends/requests/?profile_id=PrivateAccount", "/friends/requests/"],
  ["/friends/requests/PrivateAccount", "/friends/requests/[segment]"],
  [
    "/stories/PrivateAccount/PrivateStory/?source=from_feed",
    "/stories/[profile]/[segment]/?source=from_feed",
  ],
  ["/ads/about/?ad_id=PrivateAd", "/ads/about/"],
  ["/help/PrivateQuestion", "/help/[segment]"],
])("destination projection retains route semantics without identifiers: %s", (raw, expected) => {
  const destination = snapshotDestination(raw || "");
  expect(destination.value).toBe(expected);
  expect(JSON.stringify(destination).includes("Private")).toBe(false);
});

test("production friend-request detection survives report-only reconstruction", async () => {
  document.body.innerHTML =
    '<main role="main"></main><div role="complementary"><div><div><h3><a href="/friends/">Friend requests</a></h3></div><div><a href="/friends/requests/?profile_id=PrivateAccount">PrivatePerson</a><button>Confirm</button><button>Delete</button></div></div></div>';
  expect(getRightRailFriendRequestPanels()).toHaveLength(1);
  const snapshot = await captureDomSnapshot(document);
  document.body.replaceChildren();
  let matches = 0;
  for (const region of snapshot.regions) {
    document.body.innerHTML = new DOMParser().parseFromString(
      snapshotRegionHtml(snapshot, region),
      "text/html"
    ).body.innerHTML;
    matches += getRightRailFriendRequestPanels().length;
  }
  expect(matches).toBe(1);
  const result = testSnapshotSelector(snapshot, 'a[href^="/friends/requests/"]', document);
  expect(result.regions.reduce((count, region) => count + region.matches.length, 0)).toBe(1);
  expect(result.warnings).toContain("destinations-are-redacted-structural-templates");
});

test("production story detection survives report-only reconstruction", async () => {
  document.body.innerHTML =
    '<main role="main"><div role="article"><h4><a href="/stories/PrivateAccount/PrivateStory/?source=from_feed">PrivateStoryTitle</a></h4></div></main>';
  const post = document.querySelector('[role="article"]');
  if (!post) throw new Error("Missing story fixture");
  expect(Boolean(isNewsStoriesPost(post, translations.en))).toBe(true);
  const snapshot = await captureDomSnapshot(document, { target: post });
  document.body.replaceChildren();
  const region = snapshot.regions[0];
  if (!region) throw new Error("Missing exported story region");
  document.body.innerHTML = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  ).body.innerHTML;
  const reconstructed = document.querySelector(`[data-cmf-node="${region.ref}"]`);
  if (!reconstructed) throw new Error("Missing reconstructed story");
  expect(Boolean(isNewsStoriesPost(reconstructed, translations.en))).toBe(true);
  expect(JSON.stringify(snapshot).includes("Private")).toBe(false);
});
