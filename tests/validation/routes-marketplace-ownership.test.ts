// SPDX-License-Identifier: GPL-3.0-only

import { mainColumnAtt, postAtt, postAttMPSkip } from "../../src/dom/attributes";
import { clearDirtyTracking, pruneDirtyObservers } from "../../src/dom/dirty-check";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { restoreFeedPresentation, resetFeedProcessing } from "../../src/feeds/reset";
import { cleanRouteDocument, element, requireElement, routeContext } from "./routes-fixtures";
import { listing, mountMarketplace, sponsoredListing } from "./routes-marketplace-fixtures";

afterEach(cleanRouteDocument);

/** Keep ad headings separate from the independently styled tiles they explicitly precede. */
function sponsoredSection(id: string, deep = false): string {
  const link = '<a href="https://example.com/advert">Shop now</a>';
  const contents = deep ? `<div style="color:red">${link}</div>` : link;
  return `<div id="${id}-heading"><a href="/ads/about/?entry_product=ad_preferences">Sponsored</a></div><div id="${id}" style="display:block"><span><div>${contents}</div></span></div>`;
}

/** Match the former broad sponsored selector while remaining ordinary Facebook navigation. */
function navigationTile(id: string): string {
  return `<div id="${id}" style="display:flex"><span><div><a href="/groups/gardening/">Gardening group</a></div></span></div>`;
}

describe("Marketplace ownership and recycled-box restoration", () => {
  test.each([false, true])(
    "a local sponsored heading owns only its adjacent tile with deep=%s",
    (deep) => {
      const context = routeContext("/marketplace", { MP_SPONSORED: true });
      const root = mountMarketplace(
        `${sponsoredSection("ad", deep)}<aside>${navigationTile("navigation")}</aside><section id="ordinary">Ordinary listing</section>`
      );
      document.body.insertAdjacentHTML("beforeend", navigationTile("outside-navigation"));
      mopMarketplaceFeed(context);
      expect(element("ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      expect(element("ad-heading").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
      for (const id of ["navigation", "outside-navigation", "ordinary"]) {
        expect(element(id).hasAttribute(postAtt)).toBe(false);
        expect(element(id).hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
      }
      expect(root.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    }
  );

  test("an unrelated heading outside the active root cannot sponsor an ordinary tile", () => {
    const context = routeContext("/marketplace", { MP_SPONSORED: true });
    mountMarketplace(navigationTile("navigation"));
    document.body.insertAdjacentHTML(
      "beforeend",
      '<div id="outside-heading"><a href="/ads/about/?entry_product=ad_preferences">Sponsored</a></div>'
    );
    mopMarketplaceFeed(context);
    expect(element("navigation").hasAttribute(postAtt)).toBe(false);
    expect(element("outside-heading").hasAttribute(postAtt)).toBe(false);
  });

  test("separate sponsored sections support mixed shallow and deep tiles in one pass", () => {
    const context = routeContext("/marketplace", { MP_SPONSORED: true });
    mountMarketplace(
      `<section>${sponsoredSection("shallow")}</section><section>${sponsoredSection("deep", true)}</section>`
    );
    mopMarketplaceFeed(context);
    expect(element("shallow").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    expect(element("deep").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  });

  test("a processed heading still owns a later adjacent ad tile", () => {
    const context = routeContext("/marketplace", { MP_SPONSORED: true });
    mountMarketplace(sponsoredSection("first"));
    mopMarketplaceFeed(context);
    element("first").insertAdjacentHTML(
      "afterend",
      '<div id="later" style="display:block"><span><div><a href="https://example.com/second">Another ad</a></div></span></div>'
    );
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("later").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  });

  test.each(["/marketplace/category/furniture", "/marketplace/search"])(
    "%s retains its separate structural sponsored-card contract",
    (route) => {
      const context = routeContext(route, { MP_SPONSORED: true });
      mountMarketplace(sponsoredSection("heading-ad") + sponsoredListing("structural-ad"));
      mopMarketplaceFeed(context);
      expect(element("heading-ad").hasAttribute(postAtt)).toBe(false);
      expect(element("structural-ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    }
  );

  test("an active item dialog does not filter listings or sponsored tiles behind it", () => {
    const context = routeContext("/marketplace/item/100/", {
      MP_SPONSORED: true,
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      sponsoredSection("foreground-ad") + listing("foreground", "$50", "Damaged chair"),
      true
    );
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div role="navigation"></div><div role="main" id="background">${sponsoredSection("background-ad")}${listing("background-listing", "$50", "Damaged chair")}${sponsoredListing("background-structural")}</div>`
    );
    element("background").setAttribute(mainColumnAtt, "1");
    mopMarketplaceFeed(context);
    expect(element("foreground").getAttribute(postAtt)).toBe("damaged");
    expect(element("foreground-ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    for (const id of ["background-listing", "background-ad", "background-structural"]) {
      expect(element(id).hasAttribute(postAtt)).toBe(false);
      expect(element(id).hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    }
  });

  test.each(["/marketplace", "/marketplace/category/furniture", "/marketplace/search"])(
    "%s ignores a retained marker from a closed dialog",
    (route) => {
      const context = routeContext(route, {
        MP_BLOCKED_ENABLED: true,
        MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      });
      const root = mountMarketplace(listing("current-listing", "$50", "Damaged chair"));
      document.body.insertAdjacentHTML(
        "afterbegin",
        `<div id="retained-dialog" role="dialog" hidden ${mainColumnAtt}="1">Closed dialog from previous feed</div>`
      );
      expect(mopMarketplaceFeed(context)).toBe(root);
      expect(element("current-listing").getAttribute(postAtt)).toBe("damaged");
      expect(element("retained-dialog").hasAttribute(postAtt)).toBe(false);
    }
  );

  test("an unchanged active dialog never falls back to its dirty background page", () => {
    const context = routeContext("/marketplace/item/100/", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("foreground", "$50", "Perfect chair"), true);
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div role="navigation"></div><div role="main">${listing("background-listing", "$50", "Damaged chair")}</div>`
    );
    mopMarketplaceFeed(context);
    context.state.forceProcess = false;
    expect(mopMarketplaceFeed(context)).toBeNull();
    expect(element("background-listing").hasAttribute(postAtt)).toBe(false);
  });

  test("standalone item headings ignore an unrelated dialog elsewhere on the page", () => {
    const context = routeContext("/marketplace/item/100/", { MP_SPONSORED: true });
    mountMarketplace(
      '<span id="owned-heading"><h2><a href="/ads/about/">Sponsored</a></h2></span>'
    );
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div role="dialog"><span id="outside-heading"><h2><a href="/ads/about/">Sponsored</a></h2></span></div>'
    );
    mopMarketplaceFeed(context);
    expect(element("owned-heading").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
    expect(element("outside-heading").hasAttribute(postAtt)).toBe(false);
  });

  test("same-length listing destination changes invalidate manual skips", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("one", "$50", "Damaged chair"));
    const box = element("one");
    box.setAttribute(postAttMPSkip, String(box.innerHTML.length));
    mopMarketplaceFeed(context);
    const originalLength = box.innerHTML.length;
    requireElement(box.querySelector("a")).setAttribute("href", "/marketplace/item/two/");
    expect(box.innerHTML.length).toBe(originalLength);
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(box.hasAttribute(postAttMPSkip)).toBe(false);
    expect(box.getAttribute(postAtt)).toBe("damaged");
  });

  test.each([
    '<div><h3>Keep shopping</h3><a href="/marketplace/category/furniture/">Browse furniture</a></div>',
    "<div><p>Ordinary help panel without a listing link</p></div>",
    '<a href="/marketplace/item/2/">An unsupported standalone listing link</a>',
  ])("a blocked listing recycled into %s loses stale presentation", (replacement) => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      VERBOSITY_DEBUG: true,
    });
    mountMarketplace(listing("recycled", "$50", "Damaged chair"));
    mopMarketplaceFeed(context);
    const box = element("recycled");
    expect(box.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    box.innerHTML = replacement;
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(box.hasAttribute(postAtt)).toBe(false);
    expect(box.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(box.hasAttribute(context.state.showAtt)).toBe(false);
    expect(box.innerHTML).toBe(replacement);
  });

  test("a listing losing its styled wrapper is restored despite no longer matching discovery", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("recycled", "$50", "Damaged chair"));
    mopMarketplaceFeed(context);
    element("recycled").removeAttribute("style");
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("recycled").hasAttribute(postAtt)).toBe(false);
    expect(element("recycled").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });

  test("recycling a manually skipped listing clears the stale skip marker", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("recycled", "$50", "Damaged chair"));
    const box = element("recycled");
    box.setAttribute(postAttMPSkip, String(box.innerHTML.length));
    mopMarketplaceFeed(context);
    box.innerHTML = '<a href="/marketplace/category/furniture/">Browse furniture</a>';
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(box.hasAttribute(postAttMPSkip)).toBe(false);
    expect(box.hasAttribute(postAtt)).toBe(false);
  });

  test("a category card recycled back into a listing is independently classified", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("recycled", "$50", "Damaged chair"));
    const box = element("recycled");
    mopMarketplaceFeed(context);
    const original = box.innerHTML;
    box.innerHTML = '<a href="/marketplace/category/furniture/">Browse furniture</a>';
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(box.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    box.innerHTML = original;
    mopMarketplaceFeed(context);
    expect(box.getAttribute(postAtt)).toBe("damaged");
  });

  test.each(["options", "teardown"])(
    "%s resets scoped listing and sponsored presentation",
    (mode) => {
      const context = routeContext("/marketplace", {
        MP_SPONSORED: true,
        MP_BLOCKED_ENABLED: true,
        MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      });
      mountMarketplace(sponsoredSection("ad") + listing("blocked", "$50", "Damaged chair"));
      mopMarketplaceFeed(context);
      context.options.MP_SPONSORED = false;
      context.options.MP_BLOCKED_ENABLED = false;
      if (mode === "options") resetFeedProcessing(context.state);
      else {
        restoreFeedPresentation(context.state);
        clearDirtyTracking();
      }
      mopMarketplaceFeed(context);
      for (const id of ["ad", "ad-heading", "blocked"]) {
        expect(element(id).hasAttribute(postAtt)).toBe(false);
        expect(element(id).hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
      }
    }
  );

  test("replacement roots leave detached cards untouched and permit restored reuse", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    const firstRoot = mountMarketplace(listing("first", "$50", "Damaged chair"));
    const firstBox = element("first");
    mopMarketplaceFeed(context);
    const disconnect = jest.spyOn(MutationObserver.prototype, "disconnect");
    mountMarketplace(listing("second", "$50", "Damaged table"));
    firstBox.innerHTML = '<a href="/marketplace/category/furniture/">Browse furniture</a>';
    pruneDirtyObservers();
    expect(disconnect).toHaveBeenCalledTimes(1);
    mopMarketplaceFeed(context);
    expect(element("second").getAttribute(postAtt)).toBe("damaged");
    expect(firstBox.getAttribute(postAtt)).toBe("damaged");
    requireElement(document.querySelector('[role="main"]')).replaceWith(firstRoot);
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(firstBox.hasAttribute(postAtt)).toBe(false);
    expect(firstBox.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });
});
