// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { cleanRouteDocument, element, nested, routeContext, textPost } from "./routes-fixtures";

/** Place independent complementary cards next to the feed inside the exact ancestor the old 21-level climb hid. */
function mountRail(label: string): void {
  document.body.innerHTML = `<section id="group-app"><div role="navigation"></div><div role="main"><div role="feed">${textPost("ordinary", "Community gardening")}</div></div>${nested(`<div role="complementary" id="rail">${nested(`<div id="target"><span>${label}</span></div><div id="chat"><span>Group chats</span></div>`, 4)}</div>`, 15)}</section>`;
}

afterEach(cleanRouteDocument);

describe("Group suggestion rail never takes ownership of the app or feed", () => {
  test.each(["Group chats", "I read Suggested groups", "Friends online"])(
    "preserves ordinary complementary content %s",
    (label) => {
      const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
      mountRail(label);
      mopGroupsFeed(context);
      for (const id of ["group-app", "rail", "ordinary", "target", "chat"]) {
        expect(element(id).hasAttribute(postAtt)).toBe(false);
        expect(element(id).hasAttribute(context.state.hideAtt)).toBe(false);
      }
    }
  );

  test("hides the labeled feature within its rail, gates it and restores it", () => {
    const context = routeContext("/groups/feed", { GF_SUGGESTIONS: false });
    mountRail("Suggested groups");
    const target = element("target");
    const contents = target.innerHTML;
    mopGroupsFeed(context);
    expect(target.hasAttribute(postAtt)).toBe(false);
    context.options.GF_SUGGESTIONS = true;
    resetFeedProcessing(context.state);
    mopGroupsFeed(context);
    expect(target.getAttribute(postAtt)).toBe(context.keyWords.GF_SUGGESTIONS);
    expect(target.hasAttribute(context.state.hideAtt)).toBe(true);
    for (const id of ["group-app", "rail", "ordinary", "chat"]) {
      expect(element(id).hasAttribute(postAtt)).toBe(false);
      expect(element(id).hasAttribute(context.state.hideAtt)).toBe(false);
    }
    context.options.GF_SUGGESTIONS = false;
    resetFeedProcessing(context.state);
    mopGroupsFeed(context);
    expect(element("target")).toBe(target);
    expect(target.hasAttribute(postAtt)).toBe(false);
    expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
    expect(target.innerHTML).toBe(contents);
  });

  test.each(["0", "2"])(
    "recycled rail content clears old recommendation presentation at verbosity %s",
    (verbosity) => {
      const context = routeContext("/groups/feed", {
        GF_SUGGESTIONS: true,
        VERBOSITY_LEVEL: verbosity,
      });
      mountRail("Suggested groups");
      const target = element("target");
      mopGroupsFeed(context);
      expect(target.hasAttribute(postAtt)).toBe(true);
      target.innerHTML = "<span>Group chats</span>";
      context.state.forceProcess = true;
      mopGroupsFeed(context);
      expect(target.hasAttribute(postAtt)).toBe(false);
      expect(target.hasAttribute(context.state.hideAtt)).toBe(false);
      expect(target.closest("details")).toBeNull();
      expect(element("rail").querySelector("summary")).toBeNull();
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    }
  );
});
