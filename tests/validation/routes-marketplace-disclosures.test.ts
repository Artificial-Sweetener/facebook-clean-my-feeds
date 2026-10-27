// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { cleanRouteDocument, element, routeContext } from "./routes-fixtures";
import { listing, mountMarketplace } from "./routes-marketplace-fixtures";

afterEach(cleanRouteDocument);

test("referral cleanup preserves identity parameters and leaves external and background links intact", () => {
  const context = routeContext("/marketplace");
  mountMarketplace(
    '<a id="identity" href="/watch/?ref=marketplace&v=123#clip">Video</a><a id="external" href="https://example.com/?ref=keep&item=5">External</a>'
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    '<a id="outside" href="/watch/?ref=keep&v=321">Outside</a>'
  );
  mopMarketplaceFeed(context);
  const identity = new URL(
    element("identity").getAttribute("href") || "",
    "https://www.facebook.com"
  );
  expect(identity.searchParams.has("ref")).toBe(false);
  expect(identity.searchParams.get("v")).toBe("123");
  expect(identity.hash).toBe("#clip");
  expect(element("external").getAttribute("href")).toBe("https://example.com/?ref=keep&item=5");
  expect(element("outside").getAttribute("href")).toBe("/watch/?ref=keep&v=321");
});

/** Preserve the supported adjacent-tile shape while varying only the disclosure evidence. */
function section(href: string, label = "Sponsored", attributes = ""): string {
  return `<div id="heading"><a ${attributes} href="${href}">${label}</a></div><div id="ad" style="display:block"><span><div><a href="https://example.com/advert">Shop</a></div></span></div>`;
}

test.each(["/marketplace", "/marketplace/search", "/marketplace/category/furniture"])(
  "%s recognizes an absolute localized disclosure without depending on parameter order",
  (route) => {
    const context = routeContext(route, { MP_SPONSORED: true });
    mountMarketplace(
      section(
        "https://www.facebook.com/ads/about/?ref=rail&entry_product=ad_preferences",
        "Gesponsert"
      )
    );
    mopMarketplaceFeed(context);
    expect(element("ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  }
);

test.each([
  {
    href: "/ads/about/?entry_product=ad_preferences",
    label: "Advertising preferences",
    attributes: "",
  },
  { href: "/ads/about/?entry_product=ad_preferences", label: "Sponsored", attributes: "hidden" },
  {
    href: "https://example.com/ads/about/?entry_product=ad_preferences",
    label: "Sponsored",
    attributes: "",
  },
])(
  "unrelated or concealed ad-help headings cannot hide a tile: $href $label $attributes",
  ({ href, label, attributes }) => {
    const context = routeContext("/marketplace", { MP_SPONSORED: true });
    mountMarketplace(section(href, label, attributes));
    mopMarketplaceFeed(context);
    expect(element("ad").hasAttribute(postAtt)).toBe(false);
  }
);

test("item dialogs inspect every heading and reject lookalike paths and ordinary help labels", () => {
  const context = routeContext("/marketplace/item/100/", { MP_SPONSORED: true });
  mountMarketplace(
    '<span id="one"><h2><a href="/ads/about/">Sponsored</a></h2></span><span id="two"><h2><a href="/ads/about/">Gesponsert</a></h2></span><span id="external"><h2><a href="https://example.com/ads/about/">Sponsored</a></h2></span><span id="help"><h2><a href="/ads/about/">Advertising preferences</a></h2></span>',
    true
  );
  mopMarketplaceFeed(context);
  expect(element("one").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  expect(element("two").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  expect(element("external").hasAttribute(postAtt)).toBe(false);
  expect(element("help").hasAttribute(postAtt)).toBe(false);
});

test("a tile is restored when its adjacent disclosure disappears without changing the tile", () => {
  const context = routeContext("/marketplace", { MP_SPONSORED: true });
  mountMarketplace(section("/ads/about/?entry_product=ad_preferences"));
  mopMarketplaceFeed(context);
  expect(element("ad").getAttribute(postAtt)).toBe(context.keyWords.SPONSORED);
  element("heading").remove();
  context.state.forceProcess = true;
  mopMarketplaceFeed(context);
  expect(element("ad").hasAttribute(postAtt)).toBe(false);
  expect(element("ad").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});

test("visibility-only changes invalidate an earlier negative listing decision", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: true,
    MP_BLOCKED_TEXT: "$50",
  });
  mountMarketplace(listing("chair", '<span id="price" hidden>$50</span>$500', "Chair"));
  mopMarketplaceFeed(context);
  expect(element("chair").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  element("price").removeAttribute("hidden");
  context.state.forceProcess = true;
  mopMarketplaceFeed(context);
  expect(element("chair").getAttribute(postAtt)).toBe("$50");
  element("price").setAttribute("hidden", "");
  mopMarketplaceFeed(context);
  expect(element("chair").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});

test("a price concealed by its listing's inner ancestor cannot match", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: true,
    MP_BLOCKED_TEXT: "$50",
  });
  mountMarketplace(listing("chair", "$50", "Chair"));
  element("chair").querySelector("a > div")?.setAttribute("hidden", "");
  mopMarketplaceFeed(context);
  expect(element("chair").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});
