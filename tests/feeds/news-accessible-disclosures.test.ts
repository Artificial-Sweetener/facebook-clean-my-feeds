// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { getSponsoredDiagnostics, isSponsored } from "../../src/feeds/shared/sponsored";
import { createNewsContext, requireElement } from "./news-fixtures";

const trackingHref = `/publisher?__cft__[0]=${"a".repeat(360)}`;

/** Reproduce the live SVG disclosure: its graphic references a shared label outside the post. */
function mountGraphicDisclosure(label = "Ad", href = trackingHref): HTMLElement {
  document.body.innerHTML = `
    <div role="navigation"></div>
    <div role="main">
      <div aria-posinset="1" id="post"><div data-virtualized="false">
        <div><h4><a href="/publisher">Publisher</a></h4>
          <div><span><span><a href="${href}" id="disclosure" role="link">\u2060<span aria-labelledby="shared-label"><svg><use href="#ad-glyph"></use></svg></span></a></span></span></div>
        </div>
        <div data-ad-rendering-role="story_message">Ordinary creative</div>
      </div></div>
    </div>
    <span id="shared-label">${label}</span>`;
  return requireElement(document.getElementById("post"));
}

describe("news shared accessible advertising disclosures", () => {
  afterEach(() => {
    clearDirtyTracking();
    document.body.replaceChildren();
    jest.restoreAllMocks();
  });

  test.each(["Ad", "Sponsored", "Publicidad", "贊助"])(
    "recognizes a tracked SVG disclosure named %s without borrowing author text",
    (label) => {
      const post = mountGraphicDisclosure(label);
      expect(isSponsored(post, { isNF: true })).toBe(true);
      expect(getSponsoredDiagnostics(post, { isNF: true })).toMatchObject({
        matchedBy: "cft-link-signature",
        cftLinks: { selectedCount: 1, meetsMinimumCount: 1 },
      });
      const context = createNewsContext({ options: { NF_SPONSORED: true } });
      mopNewsFeed(context);
      expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
      expect(document.querySelector("[data-virtualized]")?.hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(["Ad settings", "Not sponsored", "Shop now", "9 minutes ago", ""])(
    "leaves a graphic with an unrelated shared label visible: %s",
    (label) => expect(isSponsored(mountGraphicDisclosure(label), { isNF: true })).toBe(false)
  );

  test.each(["/publisher", "/publisher?__cft__[0]=short", "https://example.org/?__cft__[0]=long"])(
    "does not classify a graphic name without a qualifying Facebook signature: %s",
    (href) => expect(isSponsored(mountGraphicDisclosure("Ad", href), { isNF: true })).toBe(false)
  );

  test("honors disabled sponsored filtering", () => {
    const post = mountGraphicDisclosure();
    mopNewsFeed(createNewsContext());
    expect(post.hasAttribute(postAtt)).toBe(false);
  });

  test("supports shared disclosure labels on the group route", () => {
    expect(isSponsored(mountGraphicDisclosure(), { isGF: true })).toBe(true);
  });

  test("supports shared disclosure labels on the search route", () => {
    const post = mountGraphicDisclosure();
    post.removeAttribute("aria-posinset");
    post.setAttribute("role", "article");
    expect(isSponsored(post, { isSF: true })).toBe(true);
  });

  test("supports shared disclosure labels in the video route's metadata wrapper", () => {
    const post = mountGraphicDisclosure();
    const disclosure = requireElement(document.getElementById("disclosure"));
    post.innerHTML =
      '<div><div><div><div><span><span><div id="video-metadata"></div></span></span></div></div></div></div>';
    requireElement(document.getElementById("video-metadata")).append(disclosure);
    expect(isSponsored(post, { isVF: true })).toBe(true);
  });

  test.each(["p", "blockquote", 'div data-ad-preview="message"', 'div role="article"'])(
    "does not use a shared disclosure inside authored or nested content: %s",
    (wrapper) => {
      const post = mountGraphicDisclosure();
      const disclosure = requireElement(document.getElementById("disclosure"));
      const container = document.createElement("div");
      container.innerHTML = `<${wrapper}></${wrapper.split(" ")[0]}>`;
      const nested = requireElement(container.firstElementChild);
      post.append(nested);
      nested.append(disclosure);
      expect(isSponsored(post, { isNF: true })).toBe(false);
    }
  );

  test("does not let a descendant graphic override the control's explicit accessible name", () => {
    const post = mountGraphicDisclosure();
    requireElement(document.getElementById("disclosure")).setAttribute("aria-label", "Author");
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("does not resolve a shared label inside another post or authored region", () => {
    for (const wrapper of ['div role="article"', 'div data-ad-preview="message"', "p"]) {
      const post = mountGraphicDisclosure();
      const label = requireElement(document.getElementById("shared-label"));
      label.outerHTML = `<${wrapper}><span id="shared-label">Ad</span></${wrapper.split(" ")[0]}>`;
      expect(isSponsored(post, { isNF: true })).toBe(false);
    }
  });

  test("does not read a shared label containing nested interactive content", () => {
    const post = mountGraphicDisclosure();
    requireElement(document.getElementById("shared-label")).innerHTML = '<a href="/author">Ad</a>';
    expect(isSponsored(post, { isNF: true })).toBe(false);
  });

  test("finds a late shared label on the independent sweep without a main-feed mutation", () => {
    const post = mountGraphicDisclosure("9 minutes ago");
    const context = createNewsContext({ options: { NF_SPONSORED: true } });
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    requireElement(document.getElementById("shared-label")).textContent = "Ad";
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  });
});
