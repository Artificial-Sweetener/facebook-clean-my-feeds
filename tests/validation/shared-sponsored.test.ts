// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../src/i18n";
import type { SponsoredState } from "../../src/feeds/types";
import { getSponsoredDiagnostics, isSponsored } from "../../src/feeds/shared/sponsored";
import { sharedPost } from "./shared-fixtures";

/** Build an exact-length signature, counting the parameter prefix as production does. */
function signature(length: number): string {
  const prefix = "__cft__[0]=";
  return `/advertiser?${prefix}${"a".repeat(Math.max(0, length - prefix.length))}`;
}

/** Model intended synthetic ads with explicit Sponsored controls; bare long publisher links are tested as negatives. */
function sponsorFixture(source: string, lengths: readonly number[]): HTMLDivElement {
  const links = lengths
    .map((length) => `<span><a href="${signature(length)}">Sponsored</a></span>`)
    .join("");
  if (source === "video-wrapper") {
    return sharedPost(
      `<div><div><div><div><span><span><div>${lengths.map((length) => `<a href="${signature(length)}">Sponsored</a>`).join("")}</div></span></span></div></div></div></div>`
    );
  }
  if (source === "nested-article") return sharedPost(`<div role="article">${links}</div>`);
  return sharedPost(`<div ${source}="1">${links}</div>`);
}

const routes: { name: string; state: SponsoredState; source: string; minimum: number }[] = [
  { name: "news-posinset", state: { isNF: true }, source: "aria-posinset", minimum: 311 },
  { name: "news-describedby", state: { isNF: true }, source: "aria-describedby", minimum: 311 },
  { name: "groups-posinset", state: { isGF: true }, source: "aria-posinset", minimum: 311 },
  { name: "groups-describedby", state: { isGF: true }, source: "aria-describedby", minimum: 311 },
  { name: "videos", state: { isVF: true }, source: "video-wrapper", minimum: 299 },
  { name: "search", state: { isSF: true }, source: "nested-article", minimum: 250 },
];

describe("validation: shared corroborated sponsorship", () => {
  test.each(routes)(
    "$name counts exact corroborated signature boundaries and returns private diagnostics",
    ({ state, source, minimum }) => {
      for (const length of [minimum - 1, minimum, minimum + 1]) {
        const post = sponsorFixture(source, [length]);
        const before = post.outerHTML;
        expect(isSponsored(post, state)).toBe(length >= minimum);
        const diagnostics = getSponsoredDiagnostics(post, state);
        expect(diagnostics.cftLinks).toMatchObject({
          minimumSignatureLength: minimum,
          selectedCount: 1,
          inspectedCount: 1,
          belowMinimumCount: Number(length < minimum),
          meetsMinimumCount: Number(length >= minimum),
          rejectedForVolume: false,
        });
        expect(diagnostics.matchedBy).toBe(length >= minimum ? "cft-link-signature" : "none");
        expect(JSON.stringify(diagnostics)).not.toMatch(/advertiser|__cft__|aaaa/);
        expect(post.outerHTML).toBe(before);
      }
    }
  );

  test.each(routes)(
    "$name rejects long ordinary tracking links without sponsorship",
    ({ state, source, minimum }) => {
      const post = sponsorFixture(source, [minimum, minimum + 100]);
      for (const link of post.querySelectorAll("a")) link.textContent = "Ordinary publisher";
      expect(isSponsored(post, state)).toBe(false);
      expect(getSponsoredDiagnostics(post, state).cftLinks.selectedCount).toBe(0);
    }
  );

  test.each(routes)("$name rejects ten or more candidate links", ({ state, source, minimum }) => {
    for (const count of [0, 1, 2, 9, 10, 11, 50]) {
      const post = sponsorFixture(
        source,
        Array.from({ length: count }, () => minimum)
      );
      expect(isSponsored(post, state)).toBe(count > 0 && count < 10);
      expect(getSponsoredDiagnostics(post, state).cftLinks).toMatchObject({
        selectedCount: count,
        inspectedCount: count >= 10 ? 0 : Math.min(count, 2),
        rejectedForVolume: count >= 10,
      });
    }
  });

  test.each(routes)(
    "$name inspects only the first two eligible links",
    ({ state, source, minimum }) => {
      expect(isSponsored(sponsorFixture(source, [1, 1, minimum]), state)).toBe(false);
      expect(isSponsored(sponsorFixture(source, [1, minimum, 1]), state)).toBe(true);
      expect(isSponsored(sponsorFixture(source, [minimum, 1, 1]), state)).toBe(true);
    }
  );

  test.each(Object.entries(translations))(
    "plain, overlaid, SVG, and obfuscated %s labels provide no standalone evidence",
    (_locale, catalog) => {
      const label = catalog.SPONSORED;
      const markups = [
        `<div><span><a role="link"><span>${label}</span></a></span></div>`,
        `<span aria-label="${label}"></span>`,
        `<span aria-labelledby="outside-label"></span><span id="outside-label">${label}</span>`,
        `<svg><text>${label}</text><title>${label}</title></svg>`,
        `<div>${Array.from(label)
          .map((letter) => `<span>${letter}</span>`)
          .join("")}</div>`,
        `<div><a href="/ordinary">${label}\u200b</a></div>`,
      ];
      for (const markup of markups)
        expect(isSponsored(sharedPost(markup), { isNF: true })).toBe(false);
    }
  );

  test("explicit ad disclosure outranks volume, short signatures, and absent feed flags", () => {
    const post = sponsorFixture(
      "aria-posinset",
      Array.from({ length: 12 }, () => 1)
    );
    post.append(sharedPost('<a href="/ads/about/?id=1">Sponsored</a>'));
    expect(isSponsored(post, {})).toBe(true);
    expect(getSponsoredDiagnostics(post, { isNF: true })).toMatchObject({
      matchedBy: "ads-about",
      adsAboutLinkCount: 1,
      cftLinks: { selectedCount: 0, inspectedCount: 0, rejectedForVolume: false },
    });
  });

  test("disclosure matching requires an anchor with the exact lowercase route fragment", () => {
    for (const markup of [
      '<span href="/ads/about/">Ad details</span>',
      '<a href="/ads/about">Ad details</a>',
      '<a href="/ADS/ABOUT/">Ad details</a>',
      "<p>/ads/about/</p>",
      '<!-- <a href="/ads/about/">Commented markup</a> -->',
    ])
      expect(isSponsored(sharedPost(markup), { isNF: true })).toBe(false);
  });

  test("null state disables even explicit disclosure and initializes stable diagnostics", () => {
    expect(isSponsored(sharedPost('<a href="/ads/about/">Ad</a>'), null)).toBe(false);
    expect(isSponsored(null, { isNF: true })).toBe(false);
    expect(getSponsoredDiagnostics(null, null)).toEqual({
      matchedBy: "none",
      adsAboutLinkCount: 0,
      rootContainer: false,
      rootRoleArticle: false,
      rootAriaPosinset: false,
      rootAriaDescribedby: false,
      cftLinks: {
        minimumSignatureLength: 0,
        selectedSource: "none",
        selectedCount: 0,
        inspectedCount: 0,
        belowMinimumCount: 0,
        meetsMinimumCount: 0,
        rejectedForVolume: false,
      },
    });
  });

  test("wrapper priority does not fall back after an eligible short posinset link", () => {
    const post = sponsorFixture("aria-posinset", [20]);
    post.append(...sponsorFixture("aria-describedby", [400]).children);
    expect(isSponsored(post, { isNF: true })).toBe(false);
    expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks.selectedCount).toBe(1);
  });

  test.each(["/groups/example?", "/author?section_header_type=group&"])(
    "excluded header/group prefix %s permits describedby fallback",
    (prefix) => {
      const post = sharedPost(
        `<div aria-posinset="1"><span><a href="${prefix}__cft__[0]=${"a".repeat(400)}">Group</a></span></div>`
      );
      post.append(...sponsorFixture("aria-describedby", [311]).children);
      expect(isSponsored(post, { isNF: true })).toBe(true);
      expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks.selectedCount).toBe(1);
    }
  );

  test("unsupported wrappers, indirect span anchors, and encoded parameter names remain unmatched", () => {
    for (const markup of [
      `<p><a href="${signature(400)}">Body link</a></p>`,
      `<div role="article"><span><a href="${signature(400)}">Search only</a></span></div>`,
      `<div aria-posinset="1"><span><strong><a href="${signature(400)}">Indirect</a></strong></span></div>`,
      `<div aria-posinset="1"><span><a href="/author?__cft__%5B0%5D=${"a".repeat(400)}">Encoded</a></span></div>`,
    ])
      expect(isSponsored(sharedPost(markup), { isNF: true })).toBe(false);
    expect(isSponsored(sponsorFixture("aria-posinset", [400]), {})).toBe(false);
  });
});
