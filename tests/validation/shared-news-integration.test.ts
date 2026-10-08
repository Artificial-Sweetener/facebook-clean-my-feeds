// SPDX-License-Identifier: GPL-3.0-only

import { buildFilters } from "../../src/core/options/build-filters";
import { postAtt } from "../../src/dom/attributes";
import { disconnectDirtyObserver } from "../../src/dom/dirty-check";
import { mopNewsFeed } from "../../src/feeds/news";
import { createNewsContext } from "../feeds/news-fixtures";
import { requireShared, sharedContentPost, sharedPost, sharedShares } from "./shared-fixtures";

const gifMarkup =
  '<div><div role="button" aria-label="GIF"><i></i></div><a href="/media" style="opacity:0"></a></div>';

/** Mount a single independently constructed post in the real news-discovery structure. */
function mountSharedNews(post: Element): void {
  document.body.innerHTML = '<div role="navigation"></div><div role="main"></div>';
  requireShared(document.querySelector('[role="main"]')).append(post);
}

/** Return the recognized aria post rather than the fixture's detached construction scope. */
function sharedNewsContent(contents: readonly string[]): Element {
  return requireShared(sharedContentPost(contents).post.firstElementChild);
}

afterEach(() => {
  document.querySelectorAll('[role="main"], [role="dialog"]').forEach(disconnectDirtyObserver);
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

describe("validation: shared filter wiring through the real news processor", () => {
  test.each([false, true])(
    "NF_ANIMATED_GIFS_POSTS=%s controls whole-post hiding with the historical GF reason",
    (enabled) => {
      const post = sharedNewsContent(["<span>Header</span>", gifMarkup]);
      mountSharedNews(post);
      const button = requireShared(post.querySelector('[role="button"]'));
      const clicks = jest.fn();
      button.addEventListener("click", clicks);
      const context = createNewsContext({
        options: { NF_ANIMATED_GIFS_POSTS: enabled, NF_ANIMATED_GIFS_PAUSE: false },
        keyWords: {
          NF_ANIMATED_GIFS_POSTS: "News reason",
          GF_ANIMATED_GIFS_POSTS: "Historical group reason",
        },
      });
      mopNewsFeed(context);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(enabled);
      expect(post.getAttribute(postAtt)).toBe(enabled ? "Historical group reason" : null);
      expect(clicks).not.toHaveBeenCalled();
    }
  );

  test.each([false, true])(
    "NF_ANIMATED_GIFS_PAUSE=%s controls pause clicks without hiding a visible post",
    (enabled) => {
      const post = sharedNewsContent(["<span>Header</span>", gifMarkup]);
      mountSharedNews(post);
      const button = requireShared(post.querySelector('[role="button"]'));
      const clicks = jest.fn();
      button.addEventListener("click", clicks);
      const context = createNewsContext({ options: { NF_ANIMATED_GIFS_PAUSE: enabled } });
      mopNewsFeed(context);
      context.state.forceProcess = true;
      mopNewsFeed(context);
      expect(clicks).toHaveBeenCalledTimes(enabled ? 1 : 0);
      expect(button.hasAttribute(postAtt)).toBe(enabled);
      expect(post.hasAttribute(postAtt)).toBe(false);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    }
  );

  test("a GIF post hidden by its post option is never also clicked by its pause option", () => {
    const post = sharedNewsContent(["<span>Header</span>", gifMarkup]);
    mountSharedNews(post);
    const button = requireShared(post.querySelector('[role="button"]'));
    const clicks = jest.fn();
    button.addEventListener("click", clicks);
    const context = createNewsContext({
      options: { NF_ANIMATED_GIFS_POSTS: true, NF_ANIMATED_GIFS_PAUSE: true },
    });
    mopNewsFeed(context);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
    expect(button.hasAttribute(postAtt)).toBe(false);
    expect(clicks).not.toHaveBeenCalled();
  });

  test.each([false, true])("dialog GIF pausing follows NF_ANIMATED_GIFS_PAUSE=%s", (enabled) => {
    document.body.innerHTML = `<div role="dialog">${gifMarkup}</div>`;
    const button = requireShared(document.querySelector('[role="button"]'));
    const clicks = jest.fn();
    button.addEventListener("click", clicks);
    const context = createNewsContext({ options: { NF_ANIMATED_GIFS_PAUSE: enabled } });
    mopNewsFeed(context);
    expect(clicks).toHaveBeenCalledTimes(enabled ? 1 : 0);
  });

  test.each([false, true])(
    "NF_SHARES=%s controls count hiding while preserving existing feature ownership",
    (enabled) => {
      const { post, shares } = sharedShares(["1K shares", "Externally handled"]);
      post.setAttribute("role", "article");
      const ordinary = requireShared(shares[0]);
      const owned = requireShared(shares[1]);
      owned.setAttribute(postAtt, "Other feature");
      mountSharedNews(post);
      const context = createNewsContext({ options: { NF_SHARES: enabled } });
      mopNewsFeed(context);
      context.state.forceProcess = true;
      mopNewsFeed(context);
      expect(ordinary.hasAttribute(context.state.cssHideNumberOfShares)).toBe(enabled);
      expect(ordinary.getAttribute(postAtt)).toBe(enabled ? "Shares" : null);
      expect(owned.getAttribute(postAtt)).toBe("Other feature");
      expect(owned.hasAttribute(context.state.cssHideNumberOfShares)).toBe(false);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
    }
  );

  test.each([
    { enabled: false, regex: false, pattern: "blocked", text: "BLOCKED", reason: null },
    { enabled: true, regex: false, pattern: "blocked", text: "BLOCKED", reason: "blocked" },
    { enabled: true, regex: true, pattern: "^\\D+$", text: "letters", reason: "^\\D+$" },
    { enabled: true, regex: true, pattern: "^\\D+$", text: "123", reason: null },
    { enabled: true, regex: false, pattern: "^\\D+$", text: "letters", reason: null },
  ])(
    "NF blocked pipeline enabled=$enabled regex=$regex pattern=$pattern text=$text",
    ({ enabled, regex, pattern, text, reason }) => {
      const post = sharedNewsContent(["", `<span>${text}</span>`, ""]);
      mountSharedNews(post);
      const context = createNewsContext({
        options: { NF_BLOCKED_ENABLED: enabled, NF_BLOCKED_TEXT: pattern, NF_BLOCKED_RE: regex },
      });
      context.filters = buildFilters(context.options);
      mopNewsFeed(context);
      expect(post.getAttribute(postAtt)).toBe(reason);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(reason !== null);
    }
  );

  test("an ordinary article with no shared signals stays unmarked when all shared options are enabled", () => {
    const post = sharedPost("<h4>Ordinary author</h4><p>A normal update</p>");
    post.setAttribute("role", "article");
    mountSharedNews(post);
    const context = createNewsContext({
      options: {
        NF_ANIMATED_GIFS_POSTS: true,
        NF_ANIMATED_GIFS_PAUSE: true,
        NF_SHARES: true,
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_TEXT: "unrelated",
      },
    });
    context.filters = buildFilters(context.options);
    mopNewsFeed(context);
    expect(post.hasAttribute(postAtt)).toBe(false);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(false);
  });
});
