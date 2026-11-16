// SPDX-License-Identifier: GPL-3.0-only

import { getPostEvidence } from "../../src/dom/post-evidence";
import { hasInlineAuthorAction } from "../../src/feeds/news-author-action";
import { isNewsFollow, isNewsParticipate, mopNewsFeed } from "../../src/feeds/news";
import { postAtt } from "../../src/dom/attributes";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { mountNewsPost } from "../validation/news-contract-fixtures";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Preserve observed Follow/Join branch relationships while removing identities and generated classes. */
function actionHeader(kind: "follow" | "join", caption = "Uncatalogued action"): string {
  const path = kind === "join" ? "/groups/123456/" : "/profile.php?id=123456";
  const overlay = kind === "join" ? '<div role="none" data-visualcompletion="ignore"></div>' : "";
  return `<div data-ad-rendering-role="profile_name"><h4 id="author"><span><span><span><a role="link" href="${path}">PrivateAuthor</a></span></span><span><span><span>&nbsp;</span><span aria-hidden="true"> · </span></span><span><div role="button" tabindex="0"><span>${caption}</span>${overlay}</div></span></span></span></h4></div>`;
}

afterEach(() => jest.restoreAllMocks());

test.each(["follow", "join"] as const)(
  "recognizes %s without reading any label or invoking fallback",
  (kind) => {
    const { post } = mountNewsPost(actionHeader(kind));
    const evidence = getPostEvidence(post);
    const text = jest.spyOn(evidence, "visibleText");
    const names = jest.spyOn(evidence, "explicitNames");
    const { keyWords } = createNewsContext();
    expect((kind === "follow" ? isNewsFollow : isNewsParticipate)(post, keyWords)).toBe(
      kind === "follow" ? keyWords.NF_FOLLOW : keyWords.NF_PARTICIPATE
    );
    expect(text).not.toHaveBeenCalled();
    expect(names).not.toHaveBeenCalled();
    expect(hasInlineAuthorAction(post, kind === "follow" ? "join" : "follow")).toBe(false);
  }
);

test.each(["follow", "join"] as const)(
  "integrates %s with enabled and disabled filter settings",
  (kind) => {
    for (const enabled of [false, true]) {
      const { post, neighbor } = mountNewsPost(actionHeader(kind));
      const option = kind === "follow" ? "NF_FOLLOW" : "NF_PARTICIPATE";
      const context = createNewsContext({ options: { [option]: enabled, VERBOSITY_LEVEL: "0" } });
      mopNewsFeed(context);
      expect(post.hasAttribute(context.state.hideAtt)).toBe(enabled);
      expect(post.getAttribute(postAtt)).toBe(enabled ? context.keyWords[option] : null);
      expect(neighbor.hasAttribute(context.state.hideAtt)).toBe(false);
    }
  }
);

test.each([
  ["menu", 'aria-haspopup="menu"'],
  ["expanded", 'aria-expanded="false"'],
  ["toggle", 'aria-pressed="false"'],
  ["disabled", 'aria-disabled="true"'],
  ["hidden", "hidden"],
  ["concealed", 'aria-hidden="true"'],
  ["controlled panel", 'aria-controls="panel"'],
])("rejects an inline %s control even with the surrounding separator", (_name, attributes) => {
  for (const kind of ["follow", "join"] as const) {
    const { post } = mountNewsPost(
      actionHeader(kind).replace('role="button"', `role="button" ${attributes}`)
    );
    expect(hasInlineAuthorAction(post, kind)).toBe(false);
  }
});

test.each([
  ["icon", '<svg><path d="M0 0"></path></svg>'],
  ["sprite", '<i data-visualcompletion="css-img"></i>'],
  ["nested action", '<span role="button">Action</span>'],
])("rejects %s controls without interpreting their caption", (_name, extra) => {
  const { post } = mountNewsPost(actionHeader("follow").replace("Uncatalogued action", extra));
  expect(hasInlineAuthorAction(post, "follow")).toBe(false);
});

test.each([
  '<div data-ad-preview="message">HEADER</div>',
  '<div role="article">HEADER</div>',
  "<blockquote>HEADER</blockquote>",
])("does not use embedded author actions in %s", (wrapper) => {
  const { post } = mountNewsPost(wrapper.replace("HEADER", actionHeader("join")));
  expect(hasInlineAuthorAction(post, "join")).toBe(false);
});

test("requires a separate preceding author and separator rather than just a button in a heading", () => {
  const variants = [
    actionHeader("follow").replace('aria-hidden="true"', ""),
    actionHeader("follow").replace(
      "/profile.php?id=123456",
      "https://example.com/profile.php?id=123456"
    ),
    actionHeader("follow").replace("/profile.php?id=123456", "/posts/123456"),
    actionHeader("follow")
      .replace('<span><div role="button"', '<span><a href="/other"><div role="button"')
      .replace("</div></span></span></span></h4>", "</div></a></span></span></span></h4>"),
    actionHeader("follow").replace("</h4>", "<button>Extra</button></h4>"),
  ];
  for (const markup of variants) {
    const { post } = mountNewsPost(markup);
    expect(hasInlineAuthorAction(post, "follow")).toBe(false);
  }
});

test.each([
  "/profile.php",
  "/photo.php?id=123",
  "/marketplace",
  "/settings",
  "/saved/",
  "/groups/discover/",
  "/groups/search/",
])("rejects navigation in the author position: %s", (destination) => {
  const { post } = mountNewsPost(
    actionHeader("follow").replace("/profile.php?id=123456", destination)
  );
  expect(hasInlineAuthorAction(post, "follow")).toBe(false);
  expect(hasInlineAuthorAction(post, "join")).toBe(false);
});

test.each(["follow", "vanity", "join"] as const)(
  "report reconstruction retains non-text %s evidence",
  async (variant) => {
    const kind = variant === "join" ? "join" : "follow";
    const markup = actionHeader(kind);
    const { post } = mountNewsPost(
      variant === "vanity" ? markup.replace("/profile.php?id=123456", "/PrivateVanity") : markup
    );
    const snapshot = await captureDomSnapshot(document, { target: post });
    const region = snapshot.regions[0];
    if (!region) throw new Error("Missing author-action region");
    expect(JSON.stringify(snapshot)).not.toContain("PrivateAuthor");
    expect(JSON.stringify(snapshot)).not.toContain("PrivateVanity");
    expect(JSON.stringify(snapshot)).not.toContain("123456");
    document.body.innerHTML = new DOMParser().parseFromString(
      snapshotRegionHtml(snapshot, region),
      "text/html"
    ).body.innerHTML;
    const restored = requireElement(document.querySelector(`[data-cmf-node="${region.ref}"]`));
    expect(hasInlineAuthorAction(restored, kind)).toBe(true);
  }
);
