// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import { mopGroupsFeed } from "../../src/feeds/groups";
import { mopVideosFeed } from "../../src/feeds/videos";
import {
  cleanRouteDocument,
  element,
  mountGroups,
  mountVideos,
  nested,
  routeContext,
  textPost,
  videoPost,
} from "./routes-fixtures";

afterEach(cleanRouteDocument);

/** Keep the supported Groups recommendation heading while varying only its rendered label. */
function recommendation(label: string): string {
  return `<h3><div><span>Community group</span><span><span><div><div>${label}</div></div></span></span></div></h3>`;
}

/** Keep the known player/status structure separate from the video's authored description. */
function liveStatus(label: string): string {
  return `<div role="presentation"><video></video></div><div><div><span>${label}</span></div></div>`;
}

describe.each(["display:none", "visibility:hidden"])("concealed metadata: %s", (style) => {
  test.each(["icon", "heading"])("Groups ignores a concealed %s", (kind) => {
    const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
    const header = `<i data-visualcompletion="css-img" style="${style}" aria-label="Suggested for you"></i>`;
    const body = recommendation(`<span style="${style}">Suggested groups</span>`);
    mountGroups(
      "/groups/feed",
      textPost(
        "target",
        kind === "heading" ? body : "Ordinary content",
        kind === "icon" ? header : "Person"
      ) + textPost("neighbor", "Keep me")
    );
    mopGroupsFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("neighbor").hasAttribute(postAtt)).toBe(false);
  });

  test.each(["live", "instagram"])("Videos ignores concealed %s attribution", (kind) => {
    const context = routeContext("/watch", { VF_LIVE: true, VF_INSTAGRAM: true });
    const signal =
      kind === "live"
        ? liveStatus("LIVE")
        : nested('<a href="#"><div><svg aria-label="Instagram"></svg></div></a>', 5);
    mountVideos(
      "/watch",
      videoPost("target", "Ordinary video", `<div style="${style}">${signal}</div>`) +
        videoPost("neighbor", "Keep me")
    );
    mopVideosFeed(context);
    expect(element("target").hasAttribute(postAtt)).toBe(false);
    expect(element("neighbor").hasAttribute(postAtt)).toBe(false);
  });
});

test.each(["hidden", 'aria-hidden="true"', 'style="display:none"', 'style="visibility:hidden"'])(
  "Groups reads the visible recommendation through a concealed decoy: %s",
  (attribute) => {
    const context = routeContext("/groups/feed", { GF_SUGGESTIONS: true });
    mountGroups(
      "/groups/feed",
      textPost("target", recommendation(`Suggested<span ${attribute}>decoy</span> groups`))
    );
    mopGroupsFeed(context);
    expect(element("target").getAttribute(postAtt)).toBe(context.keyWords.GF_SUGGESTIONS);
  }
);

test.each(["hidden", 'aria-hidden="true"', 'style="display:none"', 'style="visibility:hidden"'])(
  "Videos reads the visible live status through a concealed decoy: %s",
  (attribute) => {
    const context = routeContext("/watch", { VF_LIVE: true });
    mountVideos(
      "/watch",
      videoPost("target", "Concert", liveStatus(`LI<span ${attribute}>recorded</span>VE`))
    );
    mopVideosFeed(context);
    expect(element("target").getAttribute(postAtt)).toBe(context.keyWords.VF_LIVE);
  }
);
