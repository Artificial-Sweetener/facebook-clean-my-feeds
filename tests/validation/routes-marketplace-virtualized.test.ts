// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { collectMarketplaceListings } from "../../src/feeds/marketplace-discovery";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { getMarketplaceItems } from "../../src/diagnostics/collection";
import { buildMarketplaceMatches } from "../../src/diagnostics/matching";
import { cleanRouteDocument, element, routeContext } from "./routes-fixtures";
import { mountMarketplace } from "./routes-marketplace-fixtures";

/** Reproduce the live class-styled card without private listing text or generated Facebook classes. */
function virtualListing(id: string, price: string, title: string): string {
  return `<div id="${id}" data-virtualized="false"><div><div><a role="link" aria-label="Listing" href="/marketplace/item/${id}/"><div><div><div><img alt="" src="data:," /></div></div><div><div><span>${price}</span></div><div><span aria-hidden="true">${title}</span></div><div><span aria-hidden="true">Local pickup</span></div></div></div></a></div></div></div>`;
}

afterEach(cleanRouteDocument);

test.each(["/marketplace", "/marketplace/search", "/marketplace/category/furniture"])(
  "%s recognizes independently virtualized listing cards without inline styles",
  (route) => {
    const context = routeContext(route, {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    const root = mountMarketplace(
      virtualListing("101", "$50", "Chair") +
        virtualListing("102", "$500", "damaged desk") +
        virtualListing("103", "$500", "Chair")
    );
    const discovered = collectMarketplaceListings(root);
    expect(discovered).toHaveLength(3);
    expect(getMarketplaceItems(context.state).listings).toHaveLength(3);
    expect(
      discovered.map((listing) =>
        buildMarketplaceMatches(listing, context.filters, context.options)
      )
    ).toEqual([{ MP_BLOCKED_TEXT: true }, { MP_BLOCKED_TEXT_DESCRIPTION: true }, {}]);
    mopMarketplaceFeed(context);
    expect(element("101").getAttribute(postAtt)).toBe("$50");
    expect(element("102").getAttribute(postAtt)).toBe("damaged");
    expect(element("103").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(root.hasAttribute(postAtt)).toBe(false);
    expect(getMarketplaceItems(context.state).listings).toHaveLength(3);
    element("101").innerHTML = element("103").innerHTML;
    context.state.forceProcess = true;
    mopMarketplaceFeed(context);
    expect(element("101").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  }
);

test.each(["hidden", 'style="display:none"', 'style="visibility:hidden"'])(
  "virtualized metadata must remain physically visible: %s",
  (attribute) => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      virtualListing(
        "101",
        `<span ${attribute}>$50</span>$500`,
        `Desk<span ${attribute}>damaged</span>`
      )
    );
    mopMarketplaceFeed(context);
    expect(element("101").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  }
);

test("virtualized collections, authored links, and foreign item destinations cannot own a listing", () => {
  const root = mountMarketplace(
    `<div data-virtualized="false">${virtualListing("101", "$50", "Chair")}${virtualListing("102", "$500", "Desk")}</div>` +
      `<article role="article">${virtualListing("103", "$50", "An authored link")}</article>` +
      virtualListing("104", "$50", "Foreign").replace(
        'href="/marketplace/',
        'href="https://example.com/marketplace/'
      )
  );
  expect(collectMarketplaceListings(root).map(({ box }) => box.id)).toEqual(["101", "102"]);
});

test("disabled blocked-text filtering leaves every virtualized listing visible", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: false,
    MP_BLOCKED_TEXT: "$50",
  });
  mountMarketplace(virtualListing("101", "$50", "Chair"));
  mopMarketplaceFeed(context);
  expect(element("101").hasAttribute(postAtt)).toBe(false);
});
