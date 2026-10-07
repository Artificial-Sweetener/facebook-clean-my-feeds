// SPDX-License-Identifier: GPL-3.0-only

import { createNewsContext, requireElement } from "./news-fixtures";
import { isNewsSuggested } from "../../src/feeds/news";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { mainColumnAtt, postAttMPSkip, postAtt } from "../../src/dom/attributes";
import { disconnectDirtyObserver } from "../../src/dom/dirty-check";

describe("approved feed regressions", () => {
  test("a reel shelf is not classified as a generic suggestion", () => {
    const post = document.createElement("div");
    post.setAttribute("aria-posinset", "1");
    post.innerHTML =
      '<div><div><div><div><div><div></div><div><div><div><div></div><div><div><div></div><div><div><div></div><div><span><div><span>Suggested for you</span></div></span></div></div></div></div></div></div></div></div></div></div></div></div></div><h3>Reels</h3><a href="/reel/?s=ifu_see_more">Reels</a>';
    const keywords = { NF_SUGGESTIONS: "Suggested", NF_REELS_SHORT_VIDEOS: "Reels" };
    expect(isNewsSuggested(post, {}, keywords)).toBe("");
  });

  test("Marketplace preserves an unchanged sponsored box skip marker", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div><div><div><div><div><div style="display:block"><span>Sponsored</span></div></div></div></div></div></div></div>';
    const mainColumn = requireElement(document.querySelector('div[role="main"]'));
    mainColumn.setAttribute(mainColumnAtt, "1");
    const box = requireElement(mainColumn.querySelector("div[style]"));
    box.setAttribute(postAttMPSkip, String(box.innerHTML.length));
    const context = createNewsContext({
      options: { MP_SPONSORED: true, MP_BLOCKED_ENABLED: false, VERBOSITY_DEBUG: false },
      keyWords: { SPONSORED: "Sponsored" },
    });
    context.state.mpType = "category";
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(box.hasAttribute(postAtt)).toBe(false);
    disconnectDirtyObserver(mainColumn);
  });

  test.each([true, false])(
    "Marketplace text filtering honors skip markers only when unchanged: %s",
    (unchanged) => {
      document.body.innerHTML =
        '<div role="navigation"></div><div role="main"><div style="display:block"><div><span><div><div><a href="/marketplace/item/1/"><div><div></div><div><div>10</div><div>Item description</div></div></div></a></div></div></span></div></div></div>';
      const mainColumn = requireElement(document.querySelector('div[role="main"]'));
      const box = requireElement(mainColumn.querySelector("div[style]"));
      box.setAttribute(postAttMPSkip, String(box.innerHTML.length + (unchanged ? 0 : 1)));
      const context = createNewsContext({
        options: { MP_SPONSORED: false, MP_BLOCKED_ENABLED: true },
      });
      context.state.mpType = "category";
      context.state.forceProcess = true;
      context.filters.MP_BLOCKED_TEXT = ["10"];
      context.filters.MP_BLOCKED_TEXT_LC = ["10"];

      mopMarketplaceFeed(context);

      expect(box.hasAttribute(postAtt)).toBe(!unchanged);
      if (!unchanged) expect(box.getAttribute(postAtt)).toBe("10");
      disconnectDirtyObserver(mainColumn);
    }
  );
});
