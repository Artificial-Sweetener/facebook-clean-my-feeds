// SPDX-License-Identifier: GPL-3.0-only

import { element, nested } from "./routes-fixtures";

/** Supported legacy listing layouts differ in wrapper depth and marketplace item namespace. */
export type ListingLayout = "shallow" | "middle" | "deep";

/** Build a listing with a distinct price block and title/description block for the real selectors. */
export function listing(
  id: string,
  price: string,
  description: string,
  layout: ListingLayout = "shallow",
  namespace = "item"
): string {
  const link = `<a href="/marketplace/${namespace}/${id}/"><div><div></div><div><div>${price}</div><div>${description}</div></div></div></a>`;
  const inner = `<span>${nested(link, layout === "deep" ? 4 : 2)}</span>`;
  return `<div id="${id}" style="display:block">${nested(inner, layout === "shallow" ? 1 : 2)}</div>`;
}

/** Place the sponsored card exactly in the legacy six-level main-column selector. */
export function sponsoredListing(id = "sponsored"): string {
  return nested(`<div id="${id}" style="display:block"><span>Sponsored</span></div>`, 5);
}

/** Attach a navigational listing page, or the separate item-dialog layout, with a stable scope ID. */
export function mountMarketplace(content: string, dialog = false): HTMLElement {
  document.body.innerHTML = dialog
    ? `<div hidden></div><div class="modal__root"><div id="marketplace-root" role="dialog">${content}</div></div>`
    : `<div role="navigation"></div><div id="marketplace-root" role="main">${content}</div>`;
  return element("marketplace-root");
}
