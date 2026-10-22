// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { resolveRegexFilters } from "../../src/core/options/regex-validation";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { cleanRouteDocument, element, routeContext } from "./routes-fixtures";
import { listing, mountMarketplace } from "./routes-marketplace-fixtures";

afterEach(cleanRouteDocument);

test.each(["/marketplace", "/marketplace/search", "/marketplace/category/furniture"])(
  "%s honors the regex preference for prices and descriptions without matching neighboring listings",
  (route) => {
    const context = routeContext(route, {
      MP_BLOCKED_ENABLED: true,
      MP_BLOCKED_RE: true,
      MP_BLOCKED_TEXT: "^\\$5[0-9]$",
      MP_BLOCKED_TEXT_DESCRIPTION: "^\\D+$",
    });
    mountMarketplace(
      listing("price", "$59", "Desk 123") +
        listing("description", "$500", "A damaged desk") +
        listing("ordinary", "$500", "Desk 123")
    );
    mopMarketplaceFeed(context);
    expect(element("price").getAttribute(postAtt)).toBe("^\\$5[0-9]$");
    expect(element("description").getAttribute(postAtt)).toBe("^\\D+$");
    expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
  }
);

test("invalid saved Marketplace patterns are quarantined individually without suppressing valid rules", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: true,
    MP_BLOCKED_RE: true,
    MP_BLOCKED_TEXT: "[İİ^\\$50$",
    MP_BLOCKED_TEXT_DESCRIPTION: "(İİ^damaged$",
  });
  context.filters = resolveRegexFilters(context.options).filters;
  mountMarketplace(
    listing("price", "$50", "Chair 123") + listing("description", "$500", "damaged")
  );
  expect(() => mopMarketplaceFeed(context)).not.toThrow();
  expect(element("price").getAttribute(postAtt)).toBe("^\\$50$");
  expect(element("description").getAttribute(postAtt)).toBe("^damaged$");
});

test("literal Marketplace matching leaves expression punctuation literal", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: true,
    MP_BLOCKED_RE: false,
    MP_BLOCKED_TEXT: "^\\$50$",
    MP_BLOCKED_TEXT_DESCRIPTION: "^damaged$",
  });
  mountMarketplace(listing("ordinary", "$50", "damaged"));
  mopMarketplaceFeed(context);
  expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});

test("a description-only regex does not turn an absent price list into a match-all expression", () => {
  const context = routeContext("/marketplace", {
    MP_BLOCKED_ENABLED: true,
    MP_BLOCKED_RE: true,
    MP_BLOCKED_TEXT: "",
    MP_BLOCKED_TEXT_DESCRIPTION: "^damaged$",
  });
  context.filters = resolveRegexFilters(context.options).filters;
  mountMarketplace(listing("positive", "$50", "damaged") + listing("ordinary", "$50", "Chair"));
  mopMarketplaceFeed(context);
  expect(element("positive").getAttribute(postAtt)).toBe("^damaged$");
  expect(element("ordinary").hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(false);
});
