// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../src/i18n";
import { getSponsoredDiagnostics, isSponsored } from "../../src/feeds/shared/sponsored";
import { sharedContentPost, sharedPost } from "./shared-fixtures";

const trackingUrl = `/publisher?__cft__[0]=${"a".repeat(400)}`;
const labels = Object.entries(translations).flatMap(([locale, catalog]) =>
  [catalog.SPONSORED, catalog.SPONSORED_EXTRA]
    .filter((label): label is string => typeof label === "string")
    .map((label) => ({ locale, label }))
);

/** Place a control in the existing news wrapper, independently from candidate selector construction. */
function trackedPost(label: string, attributes = ""): HTMLDivElement {
  return sharedPost(
    `<div aria-posinset="1"><span><a href="${trackingUrl}" ${attributes}>${label}</a></span></div>`
  );
}

/** Build a concrete owning post with independently addressable header and authored-message regions. */
function ownedPost(header: string, body = "Ordinary user prose"): HTMLDivElement {
  const post = sharedPost(`<h4>${header}</h4><div data-ad-preview="message">${body}</div>`);
  post.setAttribute("aria-posinset", "1");
  return post;
}

describe("sponsorship evidence precision", () => {
  test.each(labels)(
    "preserves owned disclosure and CFT positives for $locale: $label",
    ({ label }) => {
      expect(isSponsored(sharedPost(`<a href="/ads/about/">${label}</a>`), {})).toBe(true);
      expect(isSponsored(trackedPost(label), { isNF: true })).toBe(true);
      expect(isSponsored(trackedPost(`${label} explained`), { isNF: true })).toBe(false);
      expect(isSponsored(trackedPost(`Not ${label}`), { isNF: true })).toBe(false);
      expect(
        isSponsored(ownedPost("Person", `<a href="/ads/about/">${label}</a>`), { isNF: true })
      ).toBe(false);
    }
  );

  test.each([
    "/ads/about/?entry_product=ad_preferences",
    "https://www.facebook.com/ads/about/",
    "https://facebook.com/ads/about/?id=1",
    "//m.facebook.com/ads/about/",
    "http://www.facebook.com/ads/about/",
  ])("accepts an exact owned disclosure destination: %s", (href) => {
    const post = ownedPost(`<a href="${href}">Sponsored</a>`);
    expect(isSponsored(post, { isNF: true })).toBe(true);
    expect(getSponsoredDiagnostics(post, { isNF: true }).adsAboutLinkCount).toBe(1);
  });

  test.each([
    "https://example.test/ads/about/",
    "https://facebook.com.example.test/ads/about/",
    "https://notfacebook.com/ads/about/",
    "https://www.facebook.com@evil.test/ads/about/",
    "https://evil.test@www.facebook.com/ads/about/",
    "https://www.facebook.com/?next=/ads/about/",
    "https://www.facebook.com/#/ads/about/",
    "https://www.facebook.com/ads/about/not-a-disclosure",
    "https://www.facebook.com/ADS/ABOUT/",
    "https://www.facebook.com/other/ads/about/",
    "javascript:alert('/ads/about/')",
    "data:text/plain,/ads/about/",
    "https://[invalid/ads/about/",
  ])("rejects lookalike or unrelated disclosure destinations: %s", (href) => {
    expect(isSponsored(ownedPost(`<a href="${href}">Sponsored</a>`), { isNF: true })).toBe(false);
  });

  test.each([
    "p",
    "blockquote",
    'div data-ad-preview="message"',
    'div data-ad-comet-preview="message"',
    'div data-ad-rendering-role="story_message"',
    'div data-ad-rendering-role="creative_body"',
    'div contenteditable="true"',
    'div data-commentid="comment"',
    'div data-testid="UFI2Comment/body"',
    'div role="comment"',
    'div role="article"',
    'div aria-posinset="2"',
    'div cmfr="Independent feature"',
  ])("does not borrow disclosure or CFT evidence from an authored/nested region: %s", (region) => {
    for (const href of ["/ads/about/", trackingUrl]) {
      const post = ownedPost("Person");
      post.insertAdjacentHTML(
        "beforeend",
        `<${region}><span><a href="${href}">Sponsored</a></span></${region.split(" ")[0]}>`
      );
      expect(isSponsored(post, { isNF: true })).toBe(false);
    }
  });

  test.each(["aria-describedby", "data-virtualized"])(
    "nested articles cannot sponsor their %s owner",
    (attribute) => {
      const post = sharedPost('<div role="article"><a href="/ads/about/">Sponsored</a></div>');
      post.setAttribute(attribute, "true");
      expect(isSponsored(post, { isNF: true })).toBe(false);
    }
  );

  test("excludes unannotated body/footer links in both existing news depths", () => {
    for (const depth of [8, 9] as const) {
      for (const attribute of ["aria-posinset", "aria-describedby"] as const) {
        const disclosure = '<span><a href="/ads/about/">Sponsored</a></span>';
        const tracking = `<span><a href="${trackingUrl}">Sponsored</a></span>`;
        for (const label of [disclosure, tracking]) {
          expect(
            isSponsored(sharedContentPost([label, "Creative", "Comments"], depth, attribute).post, {
              isNF: true,
            })
          ).toBe(true);
          expect(
            isSponsored(sharedContentPost(["Person", label, "Comments"], depth, attribute).post, {
              isNF: true,
            })
          ).toBe(false);
          expect(
            isSponsored(sharedContentPost(["Person", "Body", label], depth, attribute).post, {
              isGF: true,
            })
          ).toBe(false);
        }
      }
    }
  });

  test.each(["Author", "", "Sponsored posts explained", "Not sponsored"])(
    "long ordinary tracking links need semantic corroboration: %s",
    (label) => {
      const post = trackedPost(label);
      expect(isSponsored(post, { isNF: true })).toBe(false);
      post.append(sharedPost("<p>Sponsored</p><button>Sponsored</button>"));
      expect(isSponsored(post, { isNF: true })).toBe(false);
      expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks.selectedCount).toBe(0);
    }
  );

  test.each([
    "<span>Spon</span><span>sored</span>",
    "Spon\u200bsored",
    "\u200fSponsored\u2069",
    "<span>Sponsored</span><span hidden>Noise</span>",
    '<span style="display:none">Noise</span><span>Sponsored</span>',
    '<span style="visibility:hidden">Noise</span><span>Sponsored</span>',
    '<span aria-hidden="true">Noise</span><span>Sponsored</span>',
    "<svg><text>Sponsored</text></svg>",
    "Ｓｐｏｎｓｏｒｅｄ",
  ])("preserves readable fragmented or display-obfuscated label evidence: %s", (markup) => {
    expect(isSponsored(trackedPost(markup), { isNF: true })).toBe(true);
  });

  test.each(['aria-label="Sponsored"', 'title="Sponsored"'])(
    "uses a control's explicit localized accessible label: %s",
    (attributes) => expect(isSponsored(trackedPost("", attributes), { isNF: true })).toBe(true)
  );

  test("accessible labels take precedence over conflicting visible prose", () => {
    expect(isSponsored(trackedPost("Sponsored", 'aria-label="Person"'), { isNF: true })).toBe(
      false
    );
    expect(isSponsored(trackedPost("Noise", 'aria-label="Anzeige"'), { isNF: true })).toBe(true);
  });

  test("aria-labelledby resolves only owned labels, never outside/body/nested post content", () => {
    const post = trackedPost("", 'aria-labelledby="sponsor-label"');
    post.append(sharedPost('<span id="sponsor-label">Sponsored</span>'));
    expect(isSponsored(post, { isNF: true })).toBe(true);
    post.lastElementChild?.remove();
    for (const wrapper of ["p", 'div data-ad-preview="message"']) {
      const label = sharedPost(
        `<${wrapper}><span id="sponsor-label">Sponsored</span></${wrapper.split(" ")[0]}>`
      );
      post.append(label);
      expect(isSponsored(post, { isNF: true })).toBe(false);
      label.remove();
    }
    document.body.innerHTML = '<span id="sponsor-label">Sponsored</span>';
    expect(isSponsored(post, { isNF: true })).toBe(false);
    document.body.innerHTML = "";
  });

  test("author links can be corroborated only by a control in that same author heading", () => {
    const author = `<span><a href="${trackingUrl}">Publisher</a></span>`;
    expect(isSponsored(ownedPost(`${author}<button>Sponsored</button>`), { isNF: true })).toBe(
      true
    );
    expect(isSponsored(ownedPost(`${author}<span>Sponsored</span>`), { isNF: true })).toBe(false);
    const differentHeader = ownedPost(author);
    differentHeader.append(sharedPost("<h4><button>Sponsored</button></h4>"));
    expect(isSponsored(differentHeader, { isNF: true })).toBe(false);
  });

  test("ordinary tracking links cannot displace an eligible Sponsored control from the inspection budget", () => {
    const post = trackedPost("Person");
    const wrapper = post.firstElementChild;
    if (!wrapper) throw new Error("Missing tracking fixture wrapper");
    wrapper.insertAdjacentHTML(
      "beforeend",
      `${`<span><a href="${trackingUrl}">Author</a></span>`.repeat(12)}<span><a href="${trackingUrl}">Sponsored</a></span>`
    );
    expect(isSponsored(post, { isNF: true })).toBe(true);
    expect(getSponsoredDiagnostics(post, { isNF: true }).cftLinks).toMatchObject({
      selectedCount: 1,
      inspectedCount: 1,
      rejectedForVolume: false,
    });
  });

  test.each([
    `/publisher?__cft__[0]=short&padding=${"a".repeat(400)}`,
    `/publisher?__cft__[0]=short#${"a".repeat(400)}`,
    `/publisher#?__cft__[0]=${"a".repeat(400)}`,
    `https://example.test/publisher?__cft__[0]=${"a".repeat(400)}`,
    `https://facebook.com.example.test/publisher?__cft__[0]=${"a".repeat(400)}`,
    `https://www.facebook.com/groups/example?__cft__[0]=${"a".repeat(400)}`,
  ])("rejects invalid CFT provenance and unrelated signature padding: %s", (href) => {
    const post = trackedPost("Sponsored");
    post.querySelector("a")?.setAttribute("href", href);
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("genuine disclosure evidence wins without tracking volume or feed flags", () => {
    const post = ownedPost('<a href="/ads/about/">Sponsored</a>');
    post.insertAdjacentHTML(
      "beforeend",
      `<p>${`<a href="${trackingUrl}">Author</a>`.repeat(20)}</p>`
    );
    expect(isSponsored(post, {})).toBe(true);
    expect(getSponsoredDiagnostics(post, {}).matchedBy).toBe("ads-about");
  });
});
