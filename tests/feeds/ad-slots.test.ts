// SPDX-License-Identifier: GPL-3.0-only

import { collectStructuralAdSlots } from "../../src/feeds/shared/ad-slots";
import { collectMarketplaceSponsoredBoxes } from "../../src/feeds/marketplace-discovery";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { structuralAdSlot } from "./ad-slot-fixtures";
import { requireElement } from "./news-fixtures";
import * as disclosureLabels from "../../src/core/filters/disclosure-labels";
import { mopMarketplaceFeed } from "../../src/feeds/marketplace";
import { resetFeedProcessing } from "../../src/feeds/reset";
import { routeContext } from "../validation/routes-fixtures";

/** Mount an independent ad and adjacent listing so every test retains a visible ownership boundary. */
function mountSlot(): HTMLElement {
  document.body.innerHTML = `<section id="root">${structuralAdSlot()}<div id="listing">Listing</div></section>`;
  return requireElement(document.getElementById("root"));
}

afterEach(() => {
  jest.restoreAllMocks();
  clearDirtyTracking();
  document.body.replaceChildren();
});

test("Marketplace filtering restores its structural ad without consuming listing content", () => {
  document.body.innerHTML = `<div hidden></div><div class="modal__root"><div role="dialog">${structuralAdSlot()}<section id="listing">Listing and seller</section></div></div>`;
  const context = routeContext("/marketplace/item/123/", { MP_SPONSORED: false });
  const slot = requireElement(document.getElementById("ad-slot"));
  for (const enabled of [false, true, false]) {
    context.options.MP_SPONSORED = enabled;
    resetFeedProcessing(context.state);
    mopMarketplaceFeed(context);
    expect(slot.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(enabled);
    expect(
      requireElement(document.getElementById("listing")).hasAttribute(
        context.state.hideWithNoCaptionAtt
      )
    ).toBe(false);
    expect(
      requireElement(document.querySelector('[role="dialog"]')).hasAttribute(
        context.state.hideWithNoCaptionAtt
      )
    ).toBe(false);
    if (enabled) {
      const style = document.createElement("style");
      style.textContent = `[${context.state.hideWithNoCaptionAtt}]{display:none}`;
      document.head.append(style);
      context.state.forceProcess = true;
      mopMarketplaceFeed(context);
      expect(slot.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
      style.remove();
    }
  }
});

test.each([0, 3, 8])(
  "structural ad detection survives %i heading wrappers without label reads",
  (depth) => {
    document.body.innerHTML = `<section>${structuralAdSlot(depth)}</section>`;
    const root = requireElement(document.querySelector("section"));
    const heading = requireElement(root.querySelector("h2"));
    const label = jest.spyOn(heading, "textContent", "get");
    const fallback = jest.spyOn(disclosureLabels, "matchesSponsoredLabel");
    expect(collectMarketplaceSponsoredBoxes(root, true).map((slot) => slot.id)).toEqual([
      "ad-slot",
    ]);
    expect(label).not.toHaveBeenCalled();
    expect(fallback).not.toHaveBeenCalled();
  }
);

test.each([
  "wrong disclosure host",
  "wrong disclosure path",
  "wrong creative host",
  "missing ad marker",
  "missing media",
  "hidden media",
  "hidden heading",
  "hidden menu",
  "missing menu",
  "extra link",
  "extra heading",
  "extra branch",
  "foreign text",
  "foreign control",
  "nested article",
  "comment",
  "authored body",
  "hidden slot",
])("structural ads reject %s", (variant) => {
  const root = mountSlot();
  const slot = requireElement(root.querySelector("#ad-slot"));
  const heading = requireElement(slot.querySelector("h2"));
  const disclosure = requireElement(heading.querySelector("a"));
  const creative = requireElement(slot.querySelector('a[href*="l.facebook.com"]'));
  const menu = requireElement(heading.querySelector("button"));
  if (variant === "wrong disclosure host")
    disclosure.setAttribute("href", "https://facebook.com.example/ads/about/");
  if (variant === "wrong disclosure path")
    disclosure.setAttribute("href", "/help/?next=/ads/about/");
  if (variant === "wrong creative host")
    creative.setAttribute("href", "https://l.facebook.com.example/l.php?u=x&ai=y");
  if (variant === "missing ad marker")
    creative.setAttribute("href", "https://l.facebook.com/l.php?u=x");
  if (variant === "missing media")
    creative.querySelectorAll("img,video").forEach((media) => media.remove());
  if (variant === "hidden media")
    creative.querySelectorAll("img,video").forEach((media) => media.setAttribute("hidden", ""));
  if (variant === "hidden heading") heading.setAttribute("hidden", "");
  if (variant === "hidden menu") menu.setAttribute("hidden", "");
  if (variant === "missing menu") menu.remove();
  if (variant === "extra link")
    creative.parentElement?.insertAdjacentHTML("beforeend", '<a href="/friends/">Neighbor</a>');
  if (variant === "extra heading") creative.insertAdjacentHTML("beforeend", "<h3>Neighbor</h3>");
  if (variant === "extra branch") slot.insertAdjacentHTML("beforeend", "<div>Neighbor</div>");
  if (variant === "foreign text") creative.parentElement?.append("Neighbor");
  if (variant === "foreign control")
    creative.parentElement?.insertAdjacentHTML("beforeend", "<button></button>");
  if (variant === "nested article") creative.setAttribute("role", "article");
  if (variant === "comment") slot.setAttribute("data-commentid", "1");
  if (variant === "authored body") slot.setAttribute("data-ad-preview", "message");
  if (variant === "hidden slot") slot.setAttribute("hidden", "");
  expect(collectStructuralAdSlots(root)).toEqual([]);
  expect(collectMarketplaceSponsoredBoxes(root, true)).toEqual([]);
});

test("the disclosure and creative remain associated through report redaction", async () => {
  const root = mountSlot();
  const snapshot = await captureDomSnapshot(document, { target: root });
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  expect(collectStructuralAdSlots(requireElement(fixture.querySelector("section")))).toHaveLength(
    1
  );
  expect(JSON.stringify(snapshot)).not.toContain("private-ad-token");
  expect(JSON.stringify(snapshot)).not.toContain("advertiser.example");
});
