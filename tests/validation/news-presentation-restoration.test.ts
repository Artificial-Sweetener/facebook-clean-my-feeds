// SPDX-License-Identifier: GPL-3.0-only

import { createState } from "../../src/runtime/state";
import { setFeedSettings } from "../../src/runtime/routes";
import { processPage } from "../../src/runtime/process-page";
import { postAtt } from "../../src/dom/attributes";
import { mopNewsFeed, scrubSidePanelAi, scrubVerifiedBadges } from "../../src/feeds/news";
import { restoreNewsPresentation } from "../../src/feeds/news-presentation";
import { resetFeedProcessing, restoreFeedPresentation } from "../../src/feeds/reset";
import { createNewsContext, requireElement } from "../feeds/news-fixtures";

/** Mount both independently reversible features with native inline styles and visible neighbors. */
function mountPresentation() {
  document.body.innerHTML =
    '<div role="navigation"><ul><li id="sidebar" style="display:flex!important; margin-left:7px; color:red"><a href="https://meta.ai/">Meta AI</a></li><li id="contact">Contact</li></ul></div><div role="main"><div role="article"><h4><span id="author"><a href="/author">Author</a><span id="badge-wrapper" style="margin-right:3px"><svg id="badge" role="img" style="display:inline!important; width:18px; height:18px; color:blue"><title>Verified account</title></svg></span><svg id="audience" aria-label="Public"></svg></span></h4></div></div>';
  return {
    badge: requireElement(document.querySelector<SVGElement>("#badge")),
    wrapper: requireElement(document.getElementById("badge-wrapper")),
    sidebar: requireElement(document.getElementById("sidebar")),
    author: requireElement(document.getElementById("author")),
    audience: requireElement(document.querySelector<SVGElement>("#audience")),
  };
}

describe("owned badge and sidebar presentation restoration", () => {
  afterEach(() => restoreNewsPresentation());

  test.each([true, false])(
    "restores exact native declarations and markers on an options reset when active=%s",
    (isAF) => {
      const { badge, wrapper, sidebar, author, audience } = mountPresentation();
      const original = [badge, wrapper, sidebar].map((element) => element.getAttribute("style"));
      const context = createNewsContext({
        options: { NF_HIDE_VERIFIED_BADGE: true, NF_AI_SIDE_PANELS: true },
      });
      context.state.isAF = isAF;
      mopNewsFeed(context);
      expect(badge.style.display).toBe("none");
      expect(sidebar.style.display).toBe("none");
      expect(author.getAttribute("style")).toBeNull();
      expect(audience.getAttribute("style")).toBeNull();
      context.options.NF_HIDE_VERIFIED_BADGE = false;
      context.options.NF_AI_SIDE_PANELS = false;
      resetFeedProcessing(context.state);
      expect([badge, wrapper, sidebar].map((element) => element.getAttribute("style"))).toEqual(
        original
      );
      expect(badge.hasAttribute(context.state.cssHideVerifiedBadge)).toBe(false);
      expect(wrapper.hasAttribute(context.state.cssHideVerifiedBadge)).toBe(false);
      expect(sidebar.hasAttribute(context.state.hideAtt)).toBe(false);
    }
  );

  test("preserves page changes to owned and unrelated declarations when the lifecycle stops", () => {
    const { badge, sidebar } = mountPresentation();
    const context = createNewsContext({
      options: { NF_HIDE_VERIFIED_BADGE: true, NF_AI_SIDE_PANELS: true },
    });
    mopNewsFeed(context);
    badge.style.setProperty("display", "block", "important");
    badge.style.color = "green";
    sidebar.style.marginLeft = "23px";
    sidebar.style.setProperty("opacity", "0.5");
    restoreFeedPresentation(context.state);
    expect(badge.style.display).toBe("block");
    expect(badge.style.getPropertyPriority("display")).toBe("important");
    expect(badge.style.color).toBe("green");
    expect(badge.style.width).toBe("18px");
    expect(sidebar.style.marginLeft).toBe("23px");
    expect(sidebar.style.opacity).toBe("0.5");
    expect(sidebar.style.display).toBe("flex");
  });

  test("preserves shorthand spacing priorities when native code changes another property", () => {
    const { sidebar } = mountPresentation();
    sidebar.setAttribute(
      "style",
      "margin: 1px 2px 3px 4px !important; padding: 5px 6px; color: red"
    );
    const context = createNewsContext();
    scrubSidePanelAi(context);
    sidebar.style.color = "blue";
    restoreNewsPresentation();
    expect(sidebar.style.marginTop).toBe("1px");
    expect(sidebar.style.marginRight).toBe("2px");
    expect(sidebar.style.marginBottom).toBe("3px");
    expect(sidebar.style.marginLeft).toBe("4px");
    expect(
      sidebar.style.getPropertyPriority("margin-top") || sidebar.style.getPropertyPriority("margin")
    ).toBe("important");
    expect(sidebar.style.paddingTop).toBe("5px");
    expect(sidebar.style.paddingRight).toBe("6px");
    expect(sidebar.style.color).toBe("blue");
  });

  test("restores and releases retired nodes when they leave the discovered layout", () => {
    const { badge, wrapper, sidebar } = mountPresentation();
    const original = [badge, wrapper, sidebar].map((element) => element.getAttribute("style"));
    const context = createNewsContext();
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    wrapper.remove();
    sidebar.remove();
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    expect([badge, wrapper, sidebar].map((element) => element.getAttribute("style"))).toEqual(
      original
    );
  });

  test("retains the newest native baseline after an enabled feature reapplies its collapse", () => {
    const { badge, sidebar } = mountPresentation();
    const context = createNewsContext({
      options: { NF_HIDE_VERIFIED_BADGE: true, NF_AI_SIDE_PANELS: true },
    });
    mopNewsFeed(context);
    badge.style.width = "24px";
    sidebar.style.marginTop = "11px";
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    expect(badge.style.width).toBe("0px");
    restoreFeedPresentation(context.state);
    expect(badge.style.width).toBe("24px");
    expect(sidebar.style.marginTop).toBe("11px");
  });

  test("does not capture its own styles as the native baseline on repeated passes", () => {
    const { badge, wrapper, sidebar } = mountPresentation();
    const original = [badge, wrapper, sidebar].map((element) => element.getAttribute("style"));
    const context = createNewsContext();
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    const hidden = document.body.innerHTML;
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    expect(document.body.innerHTML).toBe(hidden);
    restoreFeedPresentation(context.state);
    expect([badge, wrapper, sidebar].map((element) => element.getAttribute("style"))).toEqual(
      original
    );
  });

  test.each(["/groups/feed", "/watch", "/settings/privacy"])(
    "restores News-owned nodes before route reuse on %s",
    (destination) => {
      const { badge, sidebar } = mountPresentation();
      const context = createNewsContext({
        options: { NF_HIDE_VERIFIED_BADGE: true, NF_AI_SIDE_PANELS: true },
      });
      const state = Object.assign(createState(), context.state);
      context.state = state;
      setFeedSettings(state, context.options, true, new URL("https://www.facebook.com/"));
      processPage(context);
      expect(sidebar.style.display).toBe("none");
      expect(badge.style.display).toBe("none");
      setFeedSettings(
        state,
        context.options,
        false,
        new URL(destination, "https://www.facebook.com/")
      );
      sidebar.innerHTML = '<a href="/groups/gardening">Gardening group</a>';
      requireElement(badge.querySelector("title")).textContent = "Public";
      processPage(context);
      expect(sidebar.style.display).toBe("flex");
      expect(sidebar.hasAttribute(state.hideAtt)).toBe(false);
      expect(badge.style.display).toBe("inline");
      expect(badge.hasAttribute(state.cssHideVerifiedBadge)).toBe(false);
    }
  );

  test("restores features independently when their options are disabled without a feed mutation", () => {
    const { badge, sidebar } = mountPresentation();
    const context = createNewsContext({
      options: { NF_HIDE_VERIFIED_BADGE: true, NF_AI_SIDE_PANELS: true },
    });
    mopNewsFeed(context);
    context.options.NF_HIDE_VERIFIED_BADGE = false;
    mopNewsFeed(context);
    expect(badge.style.display).toBe("inline");
    expect(sidebar.style.display).toBe("none");
    context.options.NF_AI_SIDE_PANELS = false;
    mopNewsFeed(context);
    expect(sidebar.style.display).toBe("flex");
  });

  test("restores replaced badge and sidebar identities rather than keeping stale collapse styles", () => {
    const { badge, sidebar } = mountPresentation();
    const context = createNewsContext();
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    requireElement(badge.querySelector("title")).textContent = "Public";
    requireElement(sidebar.querySelector("a")).setAttribute("href", "/friend");
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    expect(badge.style.display).toBe("inline");
    expect(sidebar.style.display).toBe("flex");
  });

  test("keeps inline author text visible when the verified SVG shares its span", () => {
    const { badge, wrapper } = mountPresentation();
    wrapper.append("Author suffix");
    scrubVerifiedBadges(createNewsContext());
    expect(badge.style.display).toBe("none");
    expect(wrapper.style.display).toBe("");
    expect(wrapper.textContent).toContain("Author suffix");
  });

  test("retains independently filtered children and preexisting marker values on direct restoration", () => {
    const { badge, sidebar } = mountPresentation();
    const context = createNewsContext();
    badge.setAttribute(context.state.cssHideVerifiedBadge, "native");
    sidebar.setAttribute(postAtt, "independent");
    scrubVerifiedBadges(context);
    scrubSidePanelAi(context);
    restoreNewsPresentation();
    expect(badge.getAttribute(context.state.cssHideVerifiedBadge)).toBe("native");
    expect(sidebar.getAttribute(postAtt)).toBe("independent");
  });
});
