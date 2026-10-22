// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { cleanRouteDocument, element, routeContext } from "./routes-fixtures";
import { listing, mountMarketplace, sponsoredListing } from "./routes-marketplace-fixtures";

afterEach(cleanRouteDocument);

test.each(["hidden", 'aria-hidden="true"', 'style="display:none"', 'style="visibility:hidden"'])(
  "concealed Marketplace price and description text cannot match: %s",
  (attribute) => {
    const context = routeContext("/marketplace", {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_TEXT: "$50",
      MP_BLOCKED_TEXT_DESCRIPTION: "damaged",
    });
    mountMarketplace(
      listing("price", `<span ${attribute}>$50</span>$500`, "Chair") +
        listing("description", "$500", `Chair<span ${attribute}>damaged</span>`) +
        listing("positive", "$50", "Chair")
    );
    mopMarketplaceFeed(context);
    expect(element("price").getAttribute(postAtt)).toBe("");
    expect(element("description").getAttribute(postAtt)).toBe("");
    expect(element("price").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(element("description").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
    expect(element("positive").getAttribute(postAtt)).toBe("$50");
  }
);

test.each(["Community recommendations", "$50 Chair", "Sponsored event merchandise"])(
  "the legacy Marketplace slot needs advertising evidence: %s",
  (label) => {
    const context = routeContext("/marketplace", { MP_SPONSORED: true });
    mountMarketplace(sponsoredListing("ordinary").replace("Sponsored", label));
    mopMarketplaceFeed(context);
    expect(element("ordinary").hasAttribute(postAtt)).toBe(false);
  }
);

test("recycling a sponsored slot into ordinary content clears its stale hide", () => {
  const context = routeContext("/marketplace", { MP_SPONSORED: true });
  mountMarketplace(sponsoredListing());
  mopMarketplaceFeed(context);
  expect(element("sponsored").hasAttribute(postAtt)).toBe(true);
  const span = element("sponsored").querySelector("span");
  if (!span) throw new Error("Missing disclosure span");
  span.textContent = "Community recommendations";
  context.state.forceProcess = true;
  mopMarketplaceFeed(context);
  expect(element("sponsored").hasAttribute(postAtt)).toBe(false);
  expect(element("sponsored").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});
