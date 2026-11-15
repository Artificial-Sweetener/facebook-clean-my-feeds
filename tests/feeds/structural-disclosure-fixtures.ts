// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";

/** Mirror the captured portrait/name/action relationships using copy absent from every locale catalog. */
export function peopleStructure(): string {
  const tile = `<div data-type="hscroll-child"><a role="link" aria-hidden="true" href="/friends/suggestions/"><img></a>
    <a role="link" href="/friends/suggestions/">unknown-person</a><button>unknown-action</button><button>unknown-dismiss</button></div>`;
  return `<h3>unknown-heading</h3><div role="region">${tile}${tile}</div><a role="link" href="/friends/">unknown-footer</a>`;
}

/** Preserve report #24's tracked author/avatar, header disclosure and separate CTA/media creative. */
export function sponsoredStructure(kind: "paid" | "sponsored" = "paid"): string {
  const href = `/publisher?__cft__[0]=${"x".repeat(320)}`;
  const disclosure =
    kind === "paid"
      ? '<div id="disclosure" role="button"><span>unknown-disclosure</span><span>unknown-payer</span></div>'
      : `<a id="disclosure" href="${href}"><svg><text>unknown-graphic</text></svg></a>`;
  return `<div data-virtualized="false"><div id="header"><a id="avatar" href="${href}"><svg><image></image></svg></a>
    <div data-ad-rendering-role="profile_name"><h4><a id="author" href="${href}">unknown-author</a></h4></div>${disclosure}</div>
    <div id="creative"><div data-ad-rendering-role="story_message">unknown-body</div>
    <div data-ad-rendering-role="image"><img></div><div data-ad-rendering-role="cta-"><button>unknown-cta</button></div></div></div>`;
}

/** Mount both report families beside a normal post so the same production sweep exercises their combined behavior. */
export function mountStructuralFeed(kind: "paid" | "sponsored" = "paid") {
  document.body.innerHTML = `<div role="navigation"></div><div role="main">
    <div aria-posinset="1" id="people">${peopleStructure()}</div>
    <div aria-posinset="2" id="advertisement">${sponsoredStructure(kind)}</div>
    <div aria-posinset="3" id="ordinary"><h4>unknown-author</h4><p>unknown-post</p><a href="/friends/">unknown-link</a></div></div>`;
  return {
    people: requireElement(document.getElementById("people")),
    advertisement: requireElement(document.getElementById("advertisement")),
    ordinary: requireElement(document.getElementById("ordinary")),
  };
}
