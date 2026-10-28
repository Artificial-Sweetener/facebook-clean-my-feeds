// SPDX-License-Identifier: GPL-3.0-only

import { translations } from "../../src/i18n";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { isSponsored, getSponsoredDiagnostics } from "../../src/feeds/shared/sponsored";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext, requireElement } from "./news-fixtures";
import { mountSvgDisclosure } from "./svg-disclosure-fixtures";

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
});

test.each(Object.entries(translations))(
  "%s sponsorship SVG uses exact resolved copy independently of tracking length",
  (_locale, catalog) => {
    const post = mountSvgDisclosure(catalog.SPONSORED);
    expect(isSponsored(post, { isNF: true })).toBe(true);
    expect(getSponsoredDiagnostics(post, { isNF: true }).matchedBy).toBe("svg-disclosure");
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    mopNewsFeed(context);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(document.getElementById("ordinary")?.hasAttribute(context.state.hideAtt)).toBe(false);
  }
);

test.each(["Ad", "Publicidad", "贊助"])("abbreviated sponsorship SVG %s is recognized", (label) => {
  expect(isSponsored(mountSvgDisclosure(label), { isNF: true })).toBe(true);
});

test.each(["9 minutes ago", "Example Publisher", "Not sponsored", "Sponsored event tickets", ""])(
  "ordinary SVG copy remains visible: %s",
  (label) => {
    expect(isSponsored(mountSvgDisclosure(label), { isNF: true })).toBe(false);
  }
);

test.each(["hidden", 'style="display:none"', 'style="visibility:hidden"', 'aria-hidden="true"'])(
  "concealed instance controls never establish a disclosure: %s",
  (attribute) => {
    const post = mountSvgDisclosure();
    requireElement(document.getElementById("instance")).outerHTML =
      `<svg ${attribute}><use href="#glyph-0"></use></svg>`;
    expect(isSponsored(post, { isNF: true })).toBe(false);
  }
);

test.each(["message", "nested", "comment"])(
  "authored or independently owned SVGs cannot hide the parent: %s",
  (location) => {
    const post = mountSvgDisclosure();
    const control = requireElement(document.getElementById("disclosure"));
    if (location === "message") requireElement(document.getElementById("message")).append(control);
    else {
      const nested = document.createElement("div");
      nested.setAttribute("role", location === "nested" ? "article" : "comment");
      nested.append(control);
      requireElement(document.getElementById("header")).append(nested);
    }
    expect(isSponsored(post, { isNF: true })).toBe(false);
  }
);

test.each([
  "https://example.test/a.svg#glyph-0",
  "https://www.facebook.com/#glyph-0",
  "#missing",
  "javascript:alert(1)",
])("nonlocal or missing references fail closed: %s", (href) => {
  const post = mountSvgDisclosure();
  requireElement(document.querySelector("#instance use")).setAttribute("href", href);
  expect(isSponsored(post, { isNF: true })).toBe(false);
});

test("cycles, oversized labels, foreign markup and excessive chains remain unmatched", () => {
  const post = mountSvgDisclosure();
  requireElement(document.getElementById("glyph-7")).outerHTML =
    '<svg id="glyph-7"><use href="#glyph-0"></use></svg>';
  expect(isSponsored(post, { isNF: true })).toBe(false);
  expect(isSponsored(mountSvgDisclosure("Sponsored".repeat(100)), { isNF: true })).toBe(false);
  expect(isSponsored(mountSvgDisclosure("Sponsored", 40), { isNF: true })).toBe(false);
  mountSvgDisclosure();
  requireElement(document.getElementById("glyph-7")).outerHTML =
    '<foreignObject id="glyph-7"><div>Sponsored</div></foreignObject>';
  expect(isSponsored(requireElement(document.getElementById("post")), { isNF: true })).toBe(false);
});

test("late definitions and edits invalidate cached decisions, including a recycled hidden post", () => {
  const post = mountSvgDisclosure();
  const label = requireElement(document.getElementById("glyph-7"));
  label.remove();
  expect(isSponsored(post, { isNF: true })).toBe(false);
  requireElement(document.getElementById("definitions")).append(label);
  expect(isSponsored(post, { isNF: true })).toBe(true);
  const context = createNewsContext({ options: { NF_SPONSORED: true } });
  mopNewsFeed(context);
  expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
  label.textContent = "9 minutes ago";
  context.state.forceProcess = true;
  mopNewsFeed(context);
  expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
});

test("disabled sponsored filtering and conflicting accessible names remain authoritative", () => {
  const post = mountSvgDisclosure();
  mopNewsFeed(createNewsContext());
  expect(post.hasAttribute("cmfr")).toBe(false);
  requireElement(document.getElementById("disclosure")).setAttribute("aria-label", "9 minutes ago");
  expect(isSponsored(post, { isNF: true })).toBe(false);
});
