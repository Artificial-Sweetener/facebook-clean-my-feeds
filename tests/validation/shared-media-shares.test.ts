// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { getMosquitosQuery, swatTheMosquitos } from "../../src/dom/animated-gifs";
import {
  hasGroupsAnimatedGifContent,
  hasNewsAnimatedGifContent,
} from "../../src/feeds/shared/animated-gifs";
import { findNumberOfShares, hideNumberOfShares } from "../../src/feeds/shared/shares";
import { translations } from "../../src/i18n";
import { requireShared, sharedContentPost, sharedPost, sharedShares } from "./shared-fixtures";

/** Construct a GIF control and either supported overlay ancestry without mocking selectors or styles. */
function gifFixture(depth: 2 | 3, opacity: string | null) {
  const button = sharedPost("<i></i>");
  button.setAttribute("role", "button");
  button.setAttribute("aria-label", "Play GIF");
  const post = sharedPost();
  const wrapper = sharedPost();
  post.append(wrapper);
  if (depth === 2) wrapper.append(button);
  else {
    const inner = sharedPost();
    inner.append(button);
    wrapper.append(inner);
  }
  if (opacity !== null) {
    const anchor = document.createElement("a");
    anchor.href = "/media";
    anchor.style.opacity = opacity;
    wrapper.append(anchor);
  }
  return { post, button, icon: requireShared(button.querySelector("i")) };
}

describe("validation: shared GIF detection and pausing", () => {
  test.each(Object.entries(translations))(
    "news and groups return the historical group GIF reason in %s",
    (_locale, keywords) => {
      const { post } = sharedContentPost([
        "<span>Header</span>",
        '<div role="button" aria-label="GIF"><i></i></div>',
      ]);
      expect(hasNewsAnimatedGifContent(post, keywords)).toBe(keywords.GF_ANIMATED_GIFS_POSTS);
      expect(hasGroupsAnimatedGifContent(post, keywords)).toBe(keywords.GF_ANIMATED_GIFS_POSTS);
    }
  );

  test("empty scopes, insufficient blocks, and empty reasons do not report a GIF post", () => {
    const keywords = { GF_ANIMATED_GIFS_POSTS: "Animated GIFs" };
    for (const post of [sharedPost(), sharedContentPost(["<span>Only header</span>"]).post]) {
      expect(hasNewsAnimatedGifContent(post, keywords)).toBe("");
      expect(hasGroupsAnimatedGifContent(post, keywords)).toBe("");
    }
    const { post } = sharedContentPost(["", '<div role="button" aria-label="GIF"><i></i></div>']);
    expect(hasNewsAnimatedGifContent(post, { GF_ANIMATED_GIFS_POSTS: "" })).toBe("");
    expect(hasGroupsAnimatedGifContent(post, { GF_ANIMATED_GIFS_POSTS: "" })).toBe("");
  });

  test.each([8, 9] as const)(
    "GIF discovery bounds the second content block at depth %i",
    (depth) => {
      const keywords = { GF_ANIMATED_GIFS_POSTS: "Animated GIFs" };
      const gif = '<div role="button" aria-label="GIF"><i></i></div>';
      for (const attribute of ["aria-posinset", "aria-describedby"] as const) {
        const { post, blocks } = sharedContentPost(
          [gif, "<span>Body</span>", gif],
          depth,
          attribute
        );
        expect(hasNewsAnimatedGifContent(post, keywords)).toBe("");
        expect(hasGroupsAnimatedGifContent(post, keywords)).toBe("");
        requireShared(blocks[1]).innerHTML = gif;
        expect(hasNewsAnimatedGifContent(post, keywords)).toBe("Animated GIFs");
        expect(hasGroupsAnimatedGifContent(post, keywords)).toBe("Animated GIFs");
      }
    }
  );

  test.each([
    ['<div role="button" aria-label="GIF"><i></i></div>', 1],
    ['<div role="button" aria-label="Pause GIF animation"><i></i></div>', 1],
    ['<div role="button" aria-label="GIFT"><i></i></div>', 1],
    ['<div role="button" aria-label="gif"><i></i></div>', 0],
    ['<div role="button"><i></i></div>', 0],
    ['<div aria-label="GIF"><i></i></div>', 0],
    ['<button aria-label="GIF"><i></i></button>', 0],
    ['<div role="button" aria-label="GIF"><span><i></i></span></div>', 0],
    ['<div role="button" aria-label="GIF"><i data-visualcompletion="css-img"></i></div>', 0],
    [`<div role="button" aria-label="GIF" ${postAtt}="1"><i></i></div>`, 0],
  ])(
    "GIF controls use the existing case-sensitive substring and structural contract: %s",
    (markup, count) => {
      expect(sharedPost(markup).querySelectorAll(getMosquitosQuery())).toHaveLength(count);
    }
  );

  test.each([2, 3] as const)(
    "an invisible overlay at ancestor depth %i is clicked once across repeated scans",
    (depth) => {
      const { post, button } = gifFixture(depth, "0");
      const clicks = jest.fn();
      button.addEventListener("click", clicks);
      swatTheMosquitos(post);
      swatTheMosquitos(post);
      expect(clicks).toHaveBeenCalledTimes(1);
      expect(button.getAttribute(postAtt)).toBe("1");
      expect(post.hasAttribute(postAtt)).toBe(false);
    }
  );

  test("one GIF control with two unrealized icons is paused only once", () => {
    const { post, button } = gifFixture(2, "0");
    button.append(document.createElement("i"));
    const clicks = jest.fn();
    button.addEventListener("click", clicks);
    swatTheMosquitos(post);
    swatTheMosquitos(post);
    expect(clicks).toHaveBeenCalledTimes(1);
    expect(button.getAttribute(postAtt)).toBe("1");
  });

  test("a synchronous rescan during the pause click does not activate the control twice", () => {
    const { post, button } = gifFixture(2, "0");
    const clicks = jest.spyOn(button, "click");
    button.addEventListener("click", () => swatTheMosquitos(post));
    swatTheMosquitos(post);
    expect(clicks).toHaveBeenCalledTimes(1);
    clicks.mockRestore();
  });

  test.each(["1", "0.5", ""])(
    "visible or unspecified overlay opacity %p is marked without a click",
    (opacity) => {
      const { post, button } = gifFixture(2, opacity);
      const clicks = jest.fn();
      button.addEventListener("click", clicks);
      swatTheMosquitos(post);
      expect(clicks).not.toHaveBeenCalled();
      expect(button.getAttribute(postAtt)).toBe("1");
    }
  );

  test("absent overlay stays unmarked for later discovery; null and empty scopes are safe", () => {
    const { post, button } = gifFixture(2, null);
    const clicks = jest.fn();
    button.addEventListener("click", clicks);
    swatTheMosquitos(post);
    swatTheMosquitos(null);
    swatTheMosquitos(sharedPost());
    expect(clicks).not.toHaveBeenCalled();
    expect(button.hasAttribute(postAtt)).toBe(false);
  });

  test("processed controls and realized icons never receive pause clicks", () => {
    for (const processed of [true, false]) {
      const { post, button, icon } = gifFixture(2, "0");
      if (processed) button.setAttribute(postAtt, "1");
      else icon.setAttribute("data-visualcompletion", "css-img");
      const clicks = jest.fn();
      button.addEventListener("click", clicks);
      swatTheMosquitos(post);
      expect(clicks).not.toHaveBeenCalled();
    }
  });
});

describe("validation: share-indicator presentation", () => {
  test("counts structural indicators independently of locale, count, or missing label", () => {
    const { post, shares } = sharedShares([
      "",
      "1 share",
      "999M shares",
      "مشاركة",
      "共有",
      "not a number",
    ]);
    const before = post.outerHTML;
    expect(findNumberOfShares(post)).toBe(shares.length);
    expect(post.outerHTML).toBe(before);
  });

  test.each([false, true])(
    "hides all selected spans without hiding the post, debug=%s",
    (debug) => {
      const { post, shares } = sharedShares(["", "1M", "مشاركة"]);
      hideNumberOfShares(
        post,
        { cssHideNumberOfShares: "hide-shares", showAtt: "show" },
        { VERBOSITY_DEBUG: debug }
      );
      for (const share of shares) {
        expect(share.getAttribute(postAtt)).toBe("Shares");
        expect(share.hasAttribute("hide-shares")).toBe(true);
        expect(share.hasAttribute("show")).toBe(debug);
      }
      expect(post.hasAttribute(postAtt)).toBe(false);
      expect(post.hasAttribute("hide-shares")).toBe(false);
    }
  );

  test("ignores missing dir attributes, identified containers, and nearby unrelated spans", () => {
    const { post, shares } = sharedShares(["selected", "missing direction"]);
    requireShared(shares[1]).removeAttribute("dir");
    post.append(sharedPost('<span dir="auto">Unrelated shares</span>'));
    expect(findNumberOfShares(post)).toBe(1);
    requireShared(requireShared(shares[0]).parentElement).id = "not-a-share-counter";
    expect(findNumberOfShares(post)).toBe(0);
  });

  test("previously marked count spans retain their owner and are excluded on later scans", () => {
    const { post, shares } = sharedShares(["1 share", "2 shares"]);
    const owned = requireShared(shares[0]);
    const fresh = requireShared(shares[1]);
    owned.setAttribute(postAtt, "previous feature");
    const state = { cssHideNumberOfShares: "hide-shares", showAtt: "show" };
    expect(findNumberOfShares(post)).toBe(1);
    hideNumberOfShares(post, state, { VERBOSITY_DEBUG: true });
    expect(owned.getAttribute(postAtt)).toBe("previous feature");
    expect(owned.hasAttribute(state.cssHideNumberOfShares)).toBe(false);
    expect(fresh.getAttribute(postAtt)).toBe("Shares");
    expect(findNumberOfShares(post)).toBe(0);
    const before = post.outerHTML;
    hideNumberOfShares(post, state, { VERBOSITY_DEBUG: false });
    expect(post.outerHTML).toBe(before);
  });

  test("requires exact intermediate class placement and leaves empty scopes untouched", () => {
    const { post } = sharedShares(["1 share"]);
    requireShared(post.querySelector("[data-visualcompletion] > div")).className = "extra";
    expect(findNumberOfShares(post)).toBe(0);
    const empty = sharedPost();
    hideNumberOfShares(
      empty,
      { cssHideNumberOfShares: "hide-shares", showAtt: "show" },
      { VERBOSITY_DEBUG: true }
    );
    expect(empty.outerHTML).toBe("<div></div>");
    expect(findNumberOfShares(empty)).toBe(0);
  });
});
