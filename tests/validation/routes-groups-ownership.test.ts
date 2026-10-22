// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  routeContext,
  textPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

const routes = ["/groups/feed", "/home.php?filter=groups", "/groups/gardening"];
const partnership =
  '<span dir="auto"><span id="disclosure"><a href="/business/help/123">Paid partnership</a></span></span>';

test.each(routes)(
  "%s filters concrete posts inside anonymous timeline wrappers independently",
  (route) => {
    const context = routeContext(route, { GF_PAID_PARTNERSHIP: true });
    mountGroups(
      route,
      `<div id="wrapper">${textPost("paid", "Promotion", partnership)}${textPost("organic", "Community news")}</div>`
    );
    mopGroupsFeed(context);
    expect(element("paid").getAttribute(postAtt)).toBe(context.keyWords.GF_PAID_PARTNERSHIP);
    expect(element("wrapper").hasAttribute(postAtt)).toBe(false);
    expect(element("organic").hasAttribute(postAtt)).toBe(false);
    element("paid").innerHTML = textPost("new", "Ordinary news");
    context.state.forceProcess = true;
    mopGroupsFeed(context);
    expect(element("paid").hasAttribute(postAtt)).toBe(false);
  }
);

test.each(routes)(
  "%s keeps quoted content and background feeds outside the active post scan",
  (route) => {
    const context = routeContext(route, {
      GF_PAID_PARTNERSHIP: true,
      GF_BLOCKED_ENABLED: true,
      GF_BLOCKED_TEXT: "unwanted",
    });
    mountGroups(
      route,
      `<div id="outer"><h4>Author</h4><p>Community discussion</p>${textPost("quoted", "Promotion", partnership)}</div>` +
        textPost("ordinary", "Community news")
    );
    document.body.insertAdjacentHTML(
      "beforeend",
      `<div hidden><div role="feed">${textPost("background", "Unwanted")}</div></div>`
    );
    mopGroupsFeed(context);
    for (const id of ["outer", "quoted", "background", "ordinary"])
      expect(element(id).hasAttribute(postAtt)).toBe(false);
  }
);
