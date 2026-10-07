// SPDX-License-Identifier: GPL-3.0-only

import { postAtt, postAttMPSkip } from "../../src/dom/attributes";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { cleanRouteDocument, element, routeContext } from "./routes-fixtures";
import { listing, mountMarketplace, sponsoredListing } from "./routes-marketplace-fixtures";
import type { ListingLayout } from "./routes-marketplace-fixtures";

const listingRoutes = [
  "/marketplace",
  "/marketplace/search",
  "/marketplace/category/furniture",
  "/marketplace/london/furniture",
];
const itemRoutes = ["/marketplace/item/100/", "/commerce/listing/100/"];
const layouts: ListingLayout[] = ["shallow", "middle", "deep"];

afterEach(cleanRouteDocument);

describe("Marketplace route option integration", () => {
  test.each(listingRoutes.flatMap((route) => [true, false].map((enabled) => ({ route, enabled }))))(
    "$route MP_SPONSORED=$enabled preserves ordinary Sponsored prose outside the card selector",
    ({ route, enabled }) => {
      const context = routeContext(route, { MP_SPONSORED: enabled });
      mountMarketplace(
        sponsoredListing() + '<section id="ordinary">I sell sponsored event merchandise</section>'
      );
      mopMarketplaceFeed(context);
      expect(element("sponsored").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.SPONSORED : null
      );
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("marketplace-root").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(
        false
      );
    }
  );

  test.each(
    itemRoutes.flatMap((route) =>
      [true, false].flatMap((dialog) =>
        [true, false].map((enabled) => ({ route, dialog, enabled }))
      )
    )
  )(
    "$route dialog=$dialog MP_SPONSORED=$enabled hides the ad heading alone",
    ({ route, dialog, enabled }) => {
      const context = routeContext(route, { MP_SPONSORED: enabled });
      mountMarketplace(
        '<span id="heading"><h2><a href="/ads/about/">Sponsored</a></h2></span><section id="product">Chair in good condition</section>',
        dialog
      );
      mopMarketplaceFeed(context);
      expect(element("heading").getAttribute(postAtt)).toBe(
        enabled ? context.keyWords.SPONSORED : null
      );
      expect(element("product").hasAttribute(postAtt)).toBe(false);
      expect(element("marketplace-root").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(
        false
      );
    }
  );

  test.each(
    [...listingRoutes, ...itemRoutes].flatMap((route) =>
      [true, false].map((enabled) => ({ route, enabled }))
    )
  )("$route MP_BLOCKED_ENABLED=$enabled integrates exact-price filtering", ({ route, enabled }) => {
    const context = routeContext(route, { MP_BLOCKED_ENABLED: enabled, MP_BLOCKED_TEXT: "$50" });
    mountMarketplace(listing("blocked", "$50", "Chair") + listing("ordinary", "$500", "Desk"));
    mopMarketplaceFeed(context);
    expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "$50" : null);
    expect(element("blocked").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(enabled);
    expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(element("ordinary").textContent).toBe("$500Desk");
  });

  test.each(
    layouts.flatMap((layout) => ["item", "np/item"].map((namespace) => ({ layout, namespace })))
  )(
    "$layout $namespace listing layout integrates description filtering",
    ({ layout, namespace }) => {
      const context = routeContext("/marketplace/search", {
        MP_BLOCKED_ENABLED: true,
        MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      });
      mountMarketplace(
        listing("blocked", "$50", "Slightly damaged chair", layout, namespace) +
          listing("ordinary", "$50", "Excellent chair", layout, namespace)
      );
      mopMarketplaceFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe("damaged");
      expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    }
  );

  test.each([true, false])(
    "MP_BLOCKED_ENABLED=%s gates description text independently from prices",
    (enabled) => {
      const context = routeContext("/marketplace", {
        MP_BLOCKED_ENABLED: enabled,
        MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
      });
      mountMarketplace(
        listing("blocked", "$50", "Damaged chair") +
          listing("price-only", "damaged", "Good chair") +
          listing("safe", "$50", "Unmarked chair")
      );
      mopMarketplaceFeed(context);
      expect(element("blocked").getAttribute(postAtt)).toBe(enabled ? "damaged" : null);
      expect(element("price-only").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
      expect(element("safe").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    }
  );

  test("price matches take precedence over description matches", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(listing("both", "$50", "Damaged chair"));
    mopMarketplaceFeed(context);
    expect(element("both").getAttribute(postAtt)).toBe("$50");
  });

  test("standalone product and ads links do not become listing or modal targets", () => {
    const context = routeContext("/marketplace", {
      MP_SPONSORED: true,
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      '<section id="ordinary"><a href="/marketplace/item/1/">Damaged collectible</a><a href="/ads/about/">How sponsored posts work</a></section>'
    );
    mopMarketplaceFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
    expect(element("ordinary").textContent).toBe("Damaged collectibleHow sponsored posts work");
  });

  test("unchanged skip markers are respected until saved settings explicitly invalidate them", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
    });
    mountMarketplace(listing("blocked", "$50", "Chair"));
    element("blocked").setAttribute(postAttMPSkip, String(element("blocked").innerHTML.length));
    mopMarketplaceFeed(context);
    expect(element("blocked").hasAttribute(postAtt)).toBe(false);
    resetFeedProcessing(context.state);
    mopMarketplaceFeed(context);
    expect(element("blocked").getAttribute(postAtt)).toBe("$50");
    context.options.MP_BLOCKED_ENABLED = false;
    resetFeedProcessing(context.state);
    mopMarketplaceFeed(context);
    expect(element("blocked").hasAttribute(postAtt)).toBe(false);
    expect(element("blocked").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  });

  test("a replacement Marketplace root is discovered and independently filtered", () => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
    });
    mountMarketplace(listing("first", "$50", "Chair"));
    mopMarketplaceFeed(context);
    expect(element("first").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
    mountMarketplace(listing("second", "$50", "Table"));
    mopMarketplaceFeed(context);
    expect(element("second").getAttribute(postAtt)).toBe("$50");
  });
  test.each(
    ["shallow", "deep"].flatMap((layout) => [true, false].map((enabled) => ({ layout, enabled })))
  )(
    "Marketplace $layout sponsored tile option=$enabled never hides the main feed or siblings",
    ({ layout, enabled }) => {
      const context = routeContext("/marketplace", { MP_SPONSORED: enabled });
      const link = '<a href="https://example.com/advert">Shop now</a>';
      const tileContents = layout === "shallow" ? link : `<div style="color:red;">${link}</div>`;
      mountMarketplace(
        `<div id="heading"><a href="/ads/about/?entry_product=ad_preferences">Sponsored</a></div><div id="ad" style="display:block"><span><div>${tileContents}</div></span></div><section id="ordinary">Ordinary listing</section>`
      );
      mopMarketplaceFeed(context);
      expect(element("marketplace-root").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(
        false
      );
      expect(element("ad").getAttribute(postAtt)).toBe(enabled ? context.keyWords.SPONSORED : null);
      expect(element("ad").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(enabled);
      expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
      expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
      expect(element("ordinary").textContent).toBe("Ordinary listing");
    }
  );
});
