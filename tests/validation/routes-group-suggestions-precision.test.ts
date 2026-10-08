// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { newsLabels } from "../../src/i18n/news-labels";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  routeContext,
  textPost,
} from "./routes-fixtures";

/** Preserve the legacy styled icon shape while making its actual accessible status inspectable. */
function icon(label = ""): string {
  return `<i data-visualcompletion="css-img" style="background-image:url(icon.png)" aria-label="${label}"></i>`;
}

/** Preserve the alternate suggestion metadata layout without treating arbitrary nested copy as a label. */
function heading(label: string): string {
  return `<h3><div><span>Community group</span><span><span><div><div>${label}</div></div></span></span></div></h3>`;
}

afterEach(cleanRouteDocument);

describe("Groups recommendation evidence belongs to the current post", () => {
  test.each([
    ["ordinary privacy icon", "Community news", `Neighbour ${icon("Public")}`],
    ["icon without recommendation", "Community news", icon()],
    ["generic nested heading", heading("Community garden"), "Group"],
    ["recommendation prose", heading("I like Suggested groups"), "Group"],
    ["privacy icon and body label", "Suggested for you", icon("Public")],
    [
      "nested comment label",
      "Community news",
      `${icon()}<div role="comment">Suggested for you</div>`,
    ],
    [
      "quoted suggestion heading",
      `<blockquote>${heading("Suggested groups")}</blockquote>`,
      "Group",
    ],
    ["nested post heading", `<div role="article">${heading("Suggested groups")}</div>`, "Group"],
    ["comment heading", `<div data-commentid="c">${heading("Suggested groups")}</div>`, "Group"],
    [
      "message heading",
      `<div data-ad-preview="message">${heading("Suggested groups")}</div>`,
      "Group",
    ],
    ["comment inside label", heading('<span role="comment">Suggested groups</span>'), "Group"],
    ["hidden label", heading("<span hidden>Suggested groups</span>"), "Group"],
  ])("keeps %s and its sibling visible", (_description, body, header) => {
    const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
    mountGroups(
      "/groups/feed",
      textPost("ordinary", body, header) + textPost("sibling", "Keep me")
    );
    mopGroupsFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary").hasAttribute(context.state.hideAtt)).toBe(false);
    expect(element("sibling").hasAttribute(postAtt)).toBe(false);
  });

  test.each(Object.entries(newsLabels))(
    "%s expected translated aliases work independently of settings locale",
    (_locale, labels) => {
      const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
      const suggested = labels[3].split("|")[0] || "";
      const groups = labels[4].split("|")[0] || "";
      mountGroups(
        "/groups/feed",
        textPost("icon-post", "Group content", icon(suggested)) +
          textPost("heading-post", heading(groups)) +
          textPost("ordinary", groups)
      );
      mopGroupsFeed(context);
      for (const id of ["icon-post", "heading-post"]) {
        expect(element(id).getAttribute(postAtt)).toBe(context.keyWords.GF_SUGGESTIONS);
        expect(element(id).hasAttribute(context.state.hideAtt)).toBe(true);
      }
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );

  test.each(["/groups/feed", "/home.php?filter=groups", "/groups/search"])(
    "%s accepts adjacent exact icon copy, gates it and restores the same owner",
    (route) => {
      const context = routeContext(route, { GF_SUGGESTIONS: false });
      mountGroups(
        route,
        textPost(
          "target",
          "Group content",
          `<span>${icon()}<span>Suggested for you</span></span>`
        ) + textPost("ordinary", "Suggested for you is a phrase")
      );
      const target = element("target");
      const contents = target.innerHTML;
      mopGroupsFeed(context);
      expect(target.hasAttribute(postAtt)).toBe(false);
      context.options.GF_SUGGESTIONS = true;
      resetFeedProcessing(context.state);
      mopGroupsFeed(context);
      expect(target.getAttribute(postAtt)).toBe(context.keyWords.GF_SUGGESTIONS);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(true);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      context.options.GF_SUGGESTIONS = false;
      resetFeedProcessing(context.state);
      mopGroupsFeed(context);
      expect(element("target")).toBe(target);
      expect(target.hasAttribute(postAtt)).toBe(false);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
      expect(target.innerHTML).toBe(contents);
    }
  );

  test("recycling recommendation metadata into a privacy icon clears only the old post hide", () => {
    const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
    mountGroups("/groups/feed", textPost("target", "Group content", icon("Suggested for you")));
    mopGroupsFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(true);
    element("target").querySelector("i")?.setAttribute("aria-label", "Public");
    context.state.forceProcess = true;
    mopGroupsFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("target").hasAttribute(context.state.hideAtt)).toBe(false);
  });
});
