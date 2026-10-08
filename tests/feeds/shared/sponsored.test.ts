// SPDX-License-Identifier: GPL-3.0-only

import { getSponsoredDiagnostics, isSponsored } from "../../../src/feeds/shared/sponsored";

describe("feeds/shared/sponsored", () => {
  test("isSponsored requires a semantic disclosure as well as a cft link signature", () => {
    const post = document.createElement("div");
    post.innerHTML =
      '<div aria-posinset="1"><span><a href="/foo?__cft__[0]=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">Sponsored</a></span></div>';

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(true);
  });

  test("isSponsored does not broaden cft detection to article roots", () => {
    const post = document.createElement("div");
    post.setAttribute("role", "article");
    post.innerHTML = `<span><a href="/foo?__cft__[0]=${"a".repeat(320)}">Sponsored</a></span>`;

    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("isSponsored does not broaden cft detection for an unrecognized wrapper", () => {
    const post = document.createElement("div");
    post.innerHTML = `<span><a href="/foo?__cft__[0]=${"a".repeat(320)}">Sponsored</a></span>`;

    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("isSponsored rejects short cft links in an article root", () => {
    const post = document.createElement("div");
    post.setAttribute("role", "article");
    post.innerHTML = '<span><a href="/foo?__cft__[0]=short">Sponsored</a></span>';

    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("getSponsoredDiagnostics exposes only structural cft details", () => {
    const post = document.createElement("div");
    post.innerHTML = `<div aria-posinset="1"><span><a href="/private-advertiser?__cft__[0]=${"secret".repeat(60)}">Sponsored</a></span></div>`;

    const diagnostics = getSponsoredDiagnostics(post, { isNF: true });

    expect(diagnostics).toEqual({
      matchedBy: "cft-link-signature",
      adsAboutLinkCount: 0,
      rootContainer: false,
      rootRoleArticle: false,
      rootAriaPosinset: false,
      rootAriaDescribedby: false,
      cftLinks: {
        minimumSignatureLength: 311,
        selectedSource: "nested-wrapper",
        selectedCount: 1,
        inspectedCount: 1,
        belowMinimumCount: 0,
        meetsMinimumCount: 1,
        rejectedForVolume: false,
      },
    });
    expect(JSON.stringify(diagnostics)).not.toContain("private-advertiser");
    expect(JSON.stringify(diagnostics)).not.toContain("secret");
  });

  test("isSponsored rejects plain sponsored labels without structural evidence", () => {
    const post = document.createElement("div");
    const wrapper = document.createElement("div");
    wrapper.id = "id1";
    const span1 = document.createElement("span");
    const link = document.createElement("a");
    link.setAttribute("role", "link");
    const spanText = document.createElement("span");
    spanText.textContent = "Sponsored";
    link.appendChild(spanText);
    span1.appendChild(link);
    wrapper.appendChild(span1);
    post.appendChild(wrapper);

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(false);
  });

  test("isSponsored detects ads about links", () => {
    const post = document.createElement("div");
    const link = document.createElement("a");
    link.setAttribute("href", "/ads/about/?foo=bar");
    link.textContent = "Sponsored";
    post.appendChild(link);

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(true);
  });

  test("isSponsored ignores aria-labelledby sponsored labels without an agnostic signal", () => {
    const post = document.createElement("div");
    const label = document.createElement("span");
    label.id = "sponsored-label";
    label.textContent = "Sponsored";
    document.body.appendChild(label);

    const labelled = document.createElement("span");
    labelled.setAttribute("aria-labelledby", "sponsored-label");
    post.appendChild(labelled);

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(false);

    label.remove();
  });

  test("isSponsored returns false when no agnostic signal exists", () => {
    const post = document.createElement("div");
    const state = { isNF: true };
    expect(isSponsored(post, state)).toBe(false);
  });
});
