// SPDX-License-Identifier: GPL-3.0-only

import { collectMarketplaceListings } from "../../src/feeds/marketplace-discovery";
import { listing } from "../validation/routes-marketplace-fixtures";

afterEach(() => document.body.replaceChildren());

test.each(["shallow", "middle", "deep"] as const)(
  "legacy %s listings reject external or query-only listing destinations",
  (layout) => {
    for (const destination of [
      "https://example.org/marketplace/item/123/",
      "/person?next=/marketplace/item/123/",
    ]) {
      document.body.innerHTML = listing("123", "$50", "Desk", layout).replace(
        "/marketplace/item/123/",
        destination
      );
      expect(collectMarketplaceListings(document.body)).toEqual([]);
    }
  }
);

test.each(["shallow", "middle", "deep"] as const)(
  "legacy %s listing layouts embedded in an authored post cannot become Marketplace cards",
  (layout) => {
    document.body.innerHTML = `<article>${listing("123", "$50", "Desk", layout)}</article>`;
    expect(collectMarketplaceListings(document.body)).toEqual([]);
  }
);

test.each(["shallow", "middle", "deep"] as const)(
  "legacy %s listing layouts retain valid Facebook destinations",
  (layout) => {
    document.body.innerHTML = listing("123", "$50", "Desk", layout);
    expect(collectMarketplaceListings(document.body)).toHaveLength(1);
  }
);
