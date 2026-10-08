// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopVideosFeed } from "../../src/feeds/videos";
import { resetFeedProcessing } from "../../src/feeds/reset";
import {
  cleanRouteDocument,
  element,
  mountVideos,
  nested,
  requireElement,
  routeContext,
  videoPost,
} from "./routes-fixtures";

/** Build only the known attribution shape; SVG ownership and accessible brand remain independent evidence. */
function attribution(icon: string): string {
  return nested(`<a href="#"><div>${icon}</div></a>`, 5);
}

/** Mount each historical embedded-ad candidate slot without adding any advertising evidence. */
function mountEmbeddedSlot(kind: string, content: string): void {
  mountVideos("/watch", videoPost("owner", "Community video") + videoPost("sibling", "Keep me"));
  const selector =
    kind === "third-block"
      ? ":scope > div > div > div > div > div:nth-of-type(2)"
      : ":scope > div > div > div > div > div > div:nth-of-type(2)";
  requireElement(element("owner").querySelector(selector)).insertAdjacentHTML("beforeend", content);
}

afterEach(cleanRouteDocument);

describe("Video attribution requires an owned Instagram name", () => {
  test.each([
    ["settings icon", attribution('<svg aria-label="Settings"></svg>')],
    ["unnamed icon", attribution("<svg></svg>")],
    ["brand mention", attribution('<svg aria-label="Settings for Instagram"></svg>')],
    [
      "comment attribution",
      `<div role="comment">${attribution('<svg aria-label="Instagram"></svg>')}</div>`,
    ],
    [
      "nested post attribution",
      `<div role="article">${attribution('<svg aria-label="Instagram"></svg>')}</div>`,
    ],
    [
      "authored attribution",
      `<div data-ad-preview="message">${attribution('<svg aria-label="Instagram"></svg>')}</div>`,
    ],
    [
      "conflicting explicit name",
      attribution('<svg aria-label="Settings"><title>Instagram</title></svg>'),
    ],
  ])("preserves %s", (_description, markup) => {
    const context = routeContext("/watch", { VF_INSTAGRAM: true });
    mountVideos("/watch", videoPost("ordinary", "Community video", markup));
    mopVideosFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  });

  test.each(['<svg aria-label="Instagram"></svg>', "<svg><title>Instagram</title></svg>"])(
    "gates and restores explicit attribution %s",
    (icon) => {
      const context = routeContext("/watch", { VF_INSTAGRAM: true });
      mountVideos(
        "/watch",
        videoPost("target", "Cross-posted video", attribution(icon)) +
          videoPost("sibling", "Keep me")
      );
      mopVideosFeed(context);
      expect(element("target").getAttribute(postAtt)).toBe(context.keyWords.VF_INSTAGRAM);
      expect(element("target").hasAttribute(context.state.hideAtt)).toBe(true);
      expect(element("sibling").hasAttribute(postAtt)).toBe(false);
      context.options.VF_INSTAGRAM = false;
      resetFeedProcessing(context.state);
      mopVideosFeed(context);
      expect(element("target").hasAttribute(postAtt)).toBe(false);
      expect(element("target").hasAttribute(context.state.hideAtt)).toBe(false);
    }
  );
});

describe("Video embedded advertising needs evidence and its option", () => {
  test.each([true, false])(
    "VF_SPONSORED=%s preserves ordinary transcript and help blocks",
    (enabled) => {
      const context = routeContext("/watch", { VF_SPONSORED: enabled });
      mountEmbeddedSlot(
        "third-block",
        '<div id="target"><span>Transcript of this community video</span></div>'
      );
      const helpContainer = requireElement(
        element("owner").querySelector(":scope > div > div > div > div > div > div:nth-of-type(2)")
      );
      helpContainer.insertAdjacentHTML(
        "beforeend",
        '<a id="help" href="/help/123/">Read transcript</a>'
      );
      mopVideosFeed(context);
      for (const id of ["owner", "target", "help", "sibling"]) {
        expect(element(id).hasAttribute(postAtt)).toBe(false);
        expect(element(id).hasAttribute(context.state.hideAtt)).toBe(false);
        expect(element(id).hasAttribute(context.state.cssHideEl)).toBe(false);
      }
    }
  );

  test.each(["third-block", "direct-anchor"])(
    "%s hides only proved advertising and restores it",
    (kind) => {
      const context = routeContext("/watch", { VF_SPONSORED: false });
      const content =
        kind === "third-block"
          ? '<div id="target"><a href="/ads/about/">Sponsored</a><span>Ad creative</span></div>'
          : '<a id="target" href="/ads/about/">Sponsored</a>';
      mountEmbeddedSlot(kind, content);
      const target = element("target");
      const contents = target.innerHTML;
      mopVideosFeed(context);
      expect(target.hasAttribute(postAtt)).toBe(false);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
      expect(target.hasAttribute(context.state.cssHideEl)).toBe(false);
      context.options.VF_SPONSORED = true;
      resetFeedProcessing(context.state);
      mopVideosFeed(context);
      expect(target.getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      expect(
        target.hasAttribute(
          kind === "third-block" ? context.state.hideAtt : context.state.cssHideEl
        )
      ).toBe(true);
      expect(element("owner").hasAttribute(postAtt)).toBe(false);
      expect(element("sibling").hasAttribute(postAtt)).toBe(false);
      context.options.VF_SPONSORED = false;
      resetFeedProcessing(context.state);
      mopVideosFeed(context);
      expect(element("target")).toBe(target);
      expect(target.hasAttribute(postAtt)).toBe(false);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
      expect(target.hasAttribute(context.state.cssHideEl)).toBe(false);
      expect(target.innerHTML).toBe(contents);
    }
  );

  test.each([
    '<div id="target"><a href="/ads/about/">Read advertising preferences</a></div>',
    '<div id="target"><a href="https://facebook.com.example.test/ads/about/">Sponsored</a></div>',
    '<div id="target"><div role="comment"><a href="/ads/about/">Sponsored</a></div></div>',
    '<div id="target"><div role="article"><a href="/ads/about/">Sponsored</a></div></div>',
    '<div id="target"><p><a href="/ads/about/">Sponsored</a></p></div>',
  ])("retains third-block false disclosures: %s", (content) => {
    const context = routeContext("/watch", { VF_SPONSORED: true });
    mountEmbeddedSlot("third-block", content);
    mopVideosFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("target").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("owner").hasAttribute(postAtt)).toBe(false);
  });
});
