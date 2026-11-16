// SPDX-License-Identifier: GPL-3.0-only

import * as labels from "../../src/core/filters/labels";
import * as disclosures from "../../src/core/filters/disclosure-labels";
import { translations } from "../../src/i18n";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import {
  isNewsEventsYouMayLike,
  isNewsSuggested,
  isNewsVerifiedBadge,
  isNewsMetaAICard,
  isNewsReelsAndShortVideos,
} from "../../src/feeds/news-detectors";
import { hasDiscoveryShelf } from "../../src/feeds/discovery-structure";
import { findStructuralRailAdSection } from "../../src/feeds/news-rail-structure";
import { scrubRightRailSponsored } from "../../src/feeds/news-right-rail";
import { isSponsored } from "../../src/feeds/shared/sponsored";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountNewsPost } from "../validation/news-contract-fixtures";
import { mountStructuralFeed } from "./structural-disclosure-fixtures";
import { verifiedGlyph } from "./locale-structure-fixtures";

/** Fail the fast-path test if localized heading evaluation reads the successful structural candidate. */
function forbidFallbackRead(): never {
  throw new Error("Fallback heading read");
}

/** Conservative destination-led shelf contract; these controls are synthetic, not an asserted live Facebook capture. */
export function discoveryShelf(kind: "groups" | "events"): string {
  return (
    `<h3>unknown-language</h3><a href="/${kind}/discover/">unknown-language</a>` +
    [101, 102]
      .map(
        (id) =>
          `<div data-type="hscroll-child"><a href="/${kind}/${id}/"><img></a><button>unknown-language</button></div>`
      )
      .join("")
  );
}

afterEach(() => {
  jest.restoreAllMocks();
  clearDirtyTracking();
  document.body.replaceChildren();
});

test("observed verification geometry bypasses all dictionary and accessible-name reads", () => {
  const { post } = mountNewsPost(`<h4><a href="/page">private</a>${verifiedGlyph}</h4>`);
  const matcher = jest.spyOn(labels, "matchesNewsLabel");
  expect(isNewsVerifiedBadge(post, translations.en)).toBe(translations.en.NF_FILTER_VERIFIED_BADGE);
  expect(matcher).not.toHaveBeenCalled();
});

test.each([
  `<p>${verifiedGlyph}</p>`,
  `<div role="article"><h4>${verifiedGlyph}</h4></div>`,
  `<h4 hidden>${verifiedGlyph}</h4>`,
  `<h4>${verifiedGlyph.replace("0 0 12 12", "0 0 24 24")}</h4>`,
  `<h4>${verifiedGlyph.replace("M7.198", "M8.198")}</h4>`,
  `<h4>${verifiedGlyph.replace("</svg>", '<circle r="5"/></svg>')}</h4>`,
])("rejects foreign, concealed, and different verification artwork", (markup) => {
  expect(isNewsVerifiedBadge(mountNewsPost(markup).post, translations.en)).toBe("");
});

test("unknown badge artwork retains the translated fallback", () => {
  const { post } = mountNewsPost('<h4><svg aria-label="Verified account"></svg></h4>');
  expect(isNewsVerifiedBadge(post, translations.en)).toBe(translations.en.NF_FILTER_VERIFIED_BADGE);
});

test.each(["groups", "events"] as const)("%s discovery is independent of every label", (kind) => {
  const { post } = mountNewsPost(discoveryShelf(kind));
  const matcher = jest.spyOn(labels, "matchesNewsLabel");
  expect(hasDiscoveryShelf(post, kind)).toBe(true);
  expect(
    kind === "groups"
      ? isNewsSuggested(post, null, translations.en)
      : isNewsEventsYouMayLike(post, translations.en)
  ).toBe(
    kind === "groups" ? translations.en.NF_SUGGESTIONS : translations.en.NF_EVENTS_YOU_MAY_LIKE
  );
  expect(matcher).not.toHaveBeenCalled();
});

test.each(["groups", "events"] as const)(
  "%s discovery rejects missing corroboration and authored references",
  (kind) => {
    for (const markup of [
      discoveryShelf(kind).replace(`/${kind}/discover/`, `/${kind}/calendar/`),
      discoveryShelf(kind).replaceAll("<img>", ""),
      discoveryShelf(kind).replaceAll("<button>unknown-language</button>", ""),
      discoveryShelf(kind).replaceAll(`href="/${kind}/`, `href="https://external.invalid/${kind}/`),
      `<p>${discoveryShelf(kind)}</p>`,
      `<h4>Author</h4>${discoveryShelf(kind)}`,
      `<div role="article">${discoveryShelf(kind)}</div>`,
    ])
      expect(hasDiscoveryShelf(mountNewsPost(markup).post, kind)).toBe(false);
  }
);

test("Meta AI destination bypasses brand and body-copy fallback", () => {
  const { post } = mountNewsPost(
    '<a href="https://meta.ai/" aria-label="unknown-language">unknown-language</a>'
  );
  const brand = jest.spyOn(disclosures, "matchesDisclosureLabel");
  const copy = jest.spyOn(disclosures, "containsMetaAiCopy");
  expect(isNewsMetaAICard(post, translations.en)).toBe(translations.en.NF_META_AI);
  expect(brand).not.toHaveBeenCalled();
  expect(copy).not.toHaveBeenCalled();
});

test("sidebar discovery cannot absorb a neighboring section or duplicate a single tile", () => {
  document.body.innerHTML = `<div role="complementary"><section>${discoveryShelf("groups")}<h3>Contacts</h3></section></div>`;
  expect(hasDiscoveryShelf(requireElement(document.querySelector("section")), "groups")).toBe(
    false
  );
  const { post } = mountNewsPost(discoveryShelf("events").replace("/events/102/", "/events/101/"));
  expect(hasDiscoveryShelf(post, "events")).toBe(false);
});

test("larger reel previews bypass headings even outside the carousel variant", () => {
  const { post } = mountNewsPost(
    Array.from({ length: 5 }, (_, i) => `<a href="/reel/${i}/"><img></a>`).join("")
  );
  const matcher = jest.spyOn(labels, "matchesNewsLabel");
  expect(isNewsReelsAndShortVideos(post, translations.en)).toBe(
    translations.en.NF_REELS_SHORT_VIDEOS
  );
  expect(matcher).not.toHaveBeenCalled();
});

test.each([{ isNF: true }, { isGF: true }, { isVF: true }, { isSF: true }])(
  "the complete creative signature is shared by feed %j",
  (state) => {
    const { advertisement, ordinary } = mountStructuralFeed("sponsored");
    const matcher = jest.spyOn(disclosures, "matchesSponsoredLabel");
    expect(isSponsored(advertisement, state)).toBe(true);
    expect(matcher).not.toHaveBeenCalled();
    expect(isSponsored(ordinary, state)).toBe(false);
  }
);

test("attributed sidebar image ads bypass heading text and preserve adjacent sections", () => {
  document.body.innerHTML =
    '<div role="complementary"><section id="ad"><h3>unknown-language</h3><a attributionsrc href="https://l.facebook.com/l.php?u=https%3A%2F%2Fexternal.invalid"><img></a></section><section id="other"><h3>unknown-neighbor</h3><a href="/events/birthdays/">unknown</a></section></div>';
  const heading = requireElement(document.querySelector("#ad h3"));
  Object.defineProperty(heading, "textContent", {
    get: forbidFallbackRead,
  });
  const context = createNewsContext();
  expect(scrubRightRailSponsored(context)).toBe(true);
  expect(requireElement(document.getElementById("ad")).hasAttribute(context.state.hideAtt)).toBe(
    true
  );
  expect(requireElement(document.getElementById("other")).hasAttribute(context.state.hideAtt)).toBe(
    false
  );
});

test.each([
  '<a href="https://l.facebook.com/l.php?u=x"><img></a>',
  '<a attributionsrc href="https://external.invalid/l.php?u=x"><img></a>',
  '<a attributionsrc href="https://l.facebook.com/l.php?u=x"></a>',
  '<a hidden attributionsrc href="https://l.facebook.com/l.php?u=x"><img></a>',
  '<h3>Neighbor</h3><a attributionsrc href="https://l.facebook.com/l.php?u=x"><img></a>',
  '<p><a attributionsrc href="https://l.facebook.com/l.php?u=x"><img></a></p>',
])("sidebar advertising requires the complete owned signature", (markup) => {
  document.body.innerHTML = `<div role="complementary"><section><h3 id="heading">unknown</h3>${markup}</section></div>`;
  expect(
    findStructuralRailAdSection(
      requireElement(document.querySelector('[role="complementary"]')),
      requireElement(document.getElementById("heading"))
    )
  ).toBeNull();
});
