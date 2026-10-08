// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopVideosFeed } from "../../src/feeds/videos";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { translations } from "../../src/i18n";
import {
  cleanRouteDocument,
  element,
  mountVideos,
  routeContext,
  videoPost,
} from "./routes-fixtures";

/** Reproduce the player/status sibling shape without asserting its text is a live status. */
function status(label: string): string {
  return `<div role="presentation"><video></video></div><div><div><span>${label}</span></div></div>`;
}

afterEach(cleanRouteDocument);

describe("Video LIVE requires an owned exact status label", () => {
  test.each([
    ["recorded duration", status("03:45")],
    ["ordinary prose", status("Live music from last year")],
    ["premiere is not live", status("ESTRENO")],
    ["English premiere", status("PREMIERE")],
    ["label without player structure", "<span>LIVE</span>"],
    ["comment status", `<div role="comment">${status("LIVE")}</div>`],
    ["identified comment", `<div data-commentid="c">${status("LIVE")}</div>`],
    ["nested post status", `<div role="article">${status("LIVE")}</div>`],
    ["nested positioned post", `<div aria-posinset="2">${status("LIVE")}</div>`],
    ["authored message", `<div data-ad-preview="message">${status("LIVE")}</div>`],
    ["quoted content", `<blockquote>${status("LIVE")}</blockquote>`],
    ["nested comment within status", status('<span role="comment">LIVE</span>')],
    ["hidden status", status('<span aria-hidden="true">LIVE</span>')],
  ])("keeps %s and adjacent ordinary video visible", (_description, markup) => {
    const context = routeContext("/watch", { VF_LIVE: true });
    mountVideos(
      "/watch",
      videoPost("ordinary", "Recorded concert", markup) + videoPost("sibling", "Local news")
    );
    mopVideosFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("sibling").hasAttribute(postAtt)).toBe(false);
  });

  test.each(Object.entries(translations))(
    "%s expected live alias is independent of the settings language",
    (locale, catalog) => {
      const label = locale === "es" ? "EN DIRECTO" : catalog.VF_LIVE;
      const context = routeContext("/watch", { VF_LIVE: true });
      mountVideos(
        "/watch",
        videoPost("live", "Concert", status(label)) + videoPost("ordinary", label)
      );
      mopVideosFeed(context);
      expect(element("live").getAttribute(postAtt)).toBe(context.keyWords.VF_LIVE);
      expect(element("live").hasAttribute(context.state.hideAtt)).toBe(true);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(["EN VIVO", "AO VIVO", " \u200eLiVe\u00a0 "])(
    "supports the exact translated/normalized alias %s",
    (label) => {
      const context = routeContext("/watch", { VF_LIVE: true });
      mountVideos("/watch", videoPost("live", "Concert", status(label)));
      mopVideosFeed(context);
      expect(element("live").getAttribute(postAtt)).toBe(context.keyWords.VF_LIVE);
    }
  );

  test.each(["/watch", "/watch/?v=100", "/watch/?ref=seach"])(
    "%s gates, hides, and restores only the live owner",
    (route) => {
      const context = routeContext(route, { VF_LIVE: false });
      mountVideos(
        route,
        videoPost("live", "Concert", status("LIVE")) +
          videoPost("ordinary", "Recorded concert", status("03:45"))
      );
      const target = element("live");
      const contents = target.innerHTML;
      mopVideosFeed(context);
      expect(target.hasAttribute(postAtt)).toBe(false);
      context.options.VF_LIVE = true;
      resetFeedProcessing(context.state);
      mopVideosFeed(context);
      expect(target.getAttribute(postAtt)).toBe(context.keyWords.VF_LIVE);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(true);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      context.options.VF_LIVE = false;
      resetFeedProcessing(context.state);
      mopVideosFeed(context);
      expect(element("live")).toBe(target);
      expect(target.hasAttribute(postAtt)).toBe(false);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
      expect(target.innerHTML).toBe(contents);
    }
  );

  test("a recycled live status becomes a visible recorded duration", () => {
    const context = routeContext("/watch", { VF_LIVE: true });
    mountVideos("/watch", videoPost("target", "Concert", status("LIVE")));
    mopVideosFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(true);
    const label = element("target").querySelector('div[role="presentation"] ~ div > div > span');
    if (!label) throw new Error("Expected status span");
    label.textContent = "03:45";
    context.state.forceProcess = true;
    mopVideosFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("target").hasAttribute(context.state.hideAtt)).toBe(false);
  });
});
