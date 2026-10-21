// SPDX-License-Identifier: GPL-3.0-only

import { mopNewsFeed, isNewsDirty } from "../../src/feeds/news";
import { getRightRailFriendRequestPanels } from "../../src/feeds/news-friend-requests";
import { restoreNewsPresentation } from "../../src/feeds/news-presentation";
import { restoreFeedPresentation } from "../../src/feeds/reset";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Supply public route evidence and anonymous paired controls while retaining a neighboring rail section. */
function mountPanel(heading = "طلبات الصداقة") {
  document.body.innerHTML = `
    <div role="navigation"><a href="/friends/requests/">Navigation</a></div>
    <div role="main"><div role="article"><a href="/friends/requests/">Ordinary post</a></div></div>
    <div role="complementary"><div>
      <div id="requests" style="color: red"><div><h3><a href="/friends/">${heading}</a></h3></div>
        <div id="card"><a href="/friends/requests/?profile_id=123"><img alt="Private name"></a>
          <div><div role="button">✓</div><div role="button">×</div></div>
        </div>
      </div>
      <section id="contacts"><h3>連絡先</h3><button>⋯</button><a href="/events/birthdays/">Birthday</a></section>
    </div></div>`;
  return requireElement(document.getElementById("requests"));
}

afterEach(() => {
  restoreNewsPresentation();
  releaseDirtyObservers();
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

describe("right-rail friend requests", () => {
  test.each(["طلبات الصداقة", "好友请求", "Запити на дружбу", "Unrecognized interface label", ""])(
    "detects destination and action structure with heading %p",
    (heading) => {
      const panel = mountPanel(heading);
      expect(getRightRailFriendRequestPanels()).toEqual([panel]);
      const context = createNewsContext({ options: { NF_FRIEND_REQUESTS: true } });
      mopNewsFeed(context);
      expect(panel.style.display).toBe("none");
      expect(panel.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
      expect(requireElement(document.getElementById("contacts")).getAttribute("style")).toBeNull();
      expect(document.querySelector(`[role="main"] [${postAtt}]`)).toBeNull();
      expect(
        document.querySelector(`[role="navigation"] [${context.state.hideWithNoCaptionAtt}]`)
      ).toBeNull();
    }
  );

  test.each([
    "https://www.facebook.com/friends/requests/?ref=rail",
    "https://facebook.com/friends/requests",
    "https://m.facebook.com/friends/requests/",
    "https://web.facebook.com/friends/requests/",
  ])("accepts the exact Facebook request destination %s", (href) => {
    const panel = mountPanel();
    requireElement(panel.querySelector("#card a")).setAttribute("href", href);
    expect(getRightRailFriendRequestPanels()).toEqual([panel]);
  });

  test.each([
    "https://example.org/friends/requests/",
    "https://facebook.com.example.org/friends/requests/",
    "/friends/requests-extra/",
    "/friends/suggestions/",
    "/help/?next=/friends/requests/",
    "javascript:void('/friends/requests/')",
    "http://[invalid/friends/requests/",
  ])("rejects unrelated or deceptive request destinations %s", (href) => {
    const panel = mountPanel();
    requireElement(panel.querySelector("#card a")).setAttribute("href", href);
    expect(getRightRailFriendRequestPanels()).toEqual([]);
  });

  test.each(["header", "actions", "request", "heading"])(
    "requires independent %s evidence",
    (part) => {
      const panel = mountPanel();
      if (part === "header")
        requireElement(panel.querySelector("h3 a")).setAttribute("href", "/friends/suggestions/");
      if (part === "actions") requireElement(panel.querySelector('[role="button"]')).remove();
      if (part === "request") requireElement(panel.querySelector("#card a")).remove();
      if (part === "heading") requireElement(panel.querySelector("h3")).remove();
      expect(getRightRailFriendRequestPanels()).toEqual([]);
    }
  );

  test("ignores request destinations embedded in authored content", () => {
    const panel = mountPanel();
    requireElement(panel.querySelector("#card")).setAttribute("data-ad-preview", "message");
    expect(getRightRailFriendRequestPanels()).toEqual([]);
  });

  test("does not combine the header with controls in another headed section", () => {
    const panel = mountPanel();
    requireElement(panel.querySelector("#card")).insertAdjacentHTML(
      "afterbegin",
      "<h3>Contacts</h3>"
    );
    expect(getRightRailFriendRequestPanels()).toEqual([]);
  });

  test.each(["article", "navigation", "dialog", "feed"])(
    "excludes panels inside %s content",
    (role) => {
      const panel = mountPanel();
      panel.setAttribute("role", role);
      expect(getRightRailFriendRequestPanels()).toEqual([]);
    }
  );

  test("leaves the default-disabled panel and unrelated settings intact", () => {
    const panel = mountPanel();
    const context = createNewsContext();
    const before = { ...context.options };
    mopNewsFeed(context);
    expect(panel.style.display).toBe("");
    expect(context.options).toEqual(before);
  });

  test("discovers delayed panels on periodic sweeps without main-column changes", () => {
    const panel = mountPanel();
    const rail = requireElement(document.querySelector('[role="complementary"] > div'));
    panel.remove();
    const context = createNewsContext({ options: { NF_FRIEND_REQUESTS: true } });
    mopNewsFeed(context);
    context.state.forceProcess = false;
    mopNewsFeed(context);
    expect(isNewsDirty(context.state)).toEqual([null, null]);
    rail.prepend(panel);
    context.state.lastNewsPostSweepAt = Date.now() - 751;
    mopNewsFeed(context);
    expect(panel.style.display).toBe("none");
  });

  test("avoids rescanning unchanged rails before the existing sweep interval", () => {
    const panel = mountPanel();
    const context = createNewsContext({ options: { NF_FRIEND_REQUESTS: true } });
    mopNewsFeed(context);
    context.state.forceProcess = false;
    mopNewsFeed(context);
    const query = jest.spyOn(document, "querySelectorAll");
    mopNewsFeed(context);
    expect(query.mock.calls.some(([selector]) => selector === '[role="complementary"]')).toBe(
      false
    );
    expect(panel.style.display).toBe("none");
  });

  test("restores recycled panels while preserving Facebook style edits", () => {
    const panel = mountPanel();
    const context = createNewsContext({ options: { NF_FRIEND_REQUESTS: true } });
    mopNewsFeed(context);
    panel.style.color = "blue";
    panel.replaceChildren(document.createElement("h3"));
    context.state.lastNewsPostSweepAt = Date.now() - 751;
    mopNewsFeed(context);
    expect(panel.style.display).toBe("");
    expect(panel.style.color).toBe("blue");
    expect(panel.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });

  test("restores disabled, detached and lifecycle-disposed panels", () => {
    const panel = mountPanel();
    const context = createNewsContext({ options: { NF_FRIEND_REQUESTS: true } });
    mopNewsFeed(context);
    context.options.NF_FRIEND_REQUESTS = false;
    mopNewsFeed(context);
    expect(panel.getAttribute("style")).toBe("color: red");
    context.options.NF_FRIEND_REQUESTS = true;
    context.state.lastNewsPostSweepAt = Date.now() - 751;
    mopNewsFeed(context);
    panel.remove();
    restoreFeedPresentation({ ...context.state, isAF: true });
    expect(panel.getAttribute("style")).toBe("color: red");
    expect(panel.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });
});
