// SPDX-License-Identifier: GPL-3.0-only

import { isNewsFollow, mopNewsFeed } from "../../src/feeds/news";
import { getNewsBlocks } from "../../src/feeds/shared/blocks";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { releaseDirtyObservers } from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";
import { newsLabels } from "../../src/i18n/news-labels";
import { translations } from "../../src/i18n";
import { createNewsContext, requireElement } from "./news-fixtures";

/** Reproduce the captured profile-name wrapper and hidden preambles without a message marker. */
function mountFollowPost(label = "Follow", extraWrapper = false): HTMLElement {
  const decoys =
    '<div aria-hidden="true"><div role="button"><blockquote>Hidden private decoy</blockquote></div></div>'.repeat(
      11
    );
  const blocks = `<div id="header"><div data-ad-rendering-role="profile_name"><h4><span><span><a href="/profile.php?id=PrivateId">PrivateName PrivateSurname</a></span><span><div id="follow" role="button" tabindex="0"><span>${label}</span></div></span></span></h4></div></div><div id="message"><img><div><span>Private message</span></div></div><div id="footer">Private reactions</div>`;
  const depth = extraWrapper ? 12 : 7;
  document.body.innerHTML = `<div role="navigation"></div><div role="main"><div aria-posinset="1" id="post">${"<div>".repeat(depth)}${decoys}${extraWrapper ? `<div>${blocks}</div>` : blocks}${decoys}${"</div>".repeat(depth)}</div></div>`;
  return requireElement(document.getElementById("post"));
}

afterEach(() => {
  releaseDirtyObservers();
  document.body.replaceChildren();
});

test.each([false, true])(
  "a header remains metadata when message markers are absent and decoys precede it: extra wrapper %s",
  (extraWrapper) => {
    const post = mountFollowPost("Follow", extraWrapper);
    const before = post.outerHTML;
    expect(Array.from(getNewsBlocks(post), (block) => block.id)).toEqual([
      "header",
      "message",
      "footer",
    ]);
    expect(isNewsFollow(post, translations.en)).toBe(translations.en.NF_FOLLOW);
    expect(post.outerHTML).toBe(before);
    const context = createNewsContext({ options: { NF_FOLLOW: true, VERBOSITY_LEVEL: "0" } });
    mopNewsFeed(context);
    expect(post.getAttribute(postAtt)).toBe(context.keyWords.NF_FOLLOW);
    expect(post.hasAttribute(context.state.hideAtt)).toBe(true);
  }
);

test("an embedded Follow action in the unannotated message cannot identify its parent post", () => {
  const post = mountFollowPost("More options");
  requireElement(document.getElementById("message")).innerHTML =
    '<h4><a href="/original">PrivateOriginal</a><button>Follow</button></h4>';
  expect(isNewsFollow(post, translations.en)).toBe("");
});

test("a concealed Follow control does not hide an ordinary post", () => {
  const post = mountFollowPost();
  requireElement(document.getElementById("follow")).setAttribute("hidden", "");
  expect(isNewsFollow(post, translations.en)).toBe("");
});

test("text-only posts still exclude hidden preambles without relying on media evidence", () => {
  const post = mountFollowPost();
  post.querySelector("img")?.remove();
  expect(isNewsFollow(post, translations.en)).toBe(translations.en.NF_FOLLOW);
});

test("a visible Follow caption survives report reconstruction without an accessible-name attribute", async () => {
  const post = mountFollowPost("Follow", true);
  const snapshot = await captureDomSnapshot(document, { target: post });
  const region = snapshot.regions[0];
  if (!region) throw new Error("Missing captured Follow caption");
  expect(JSON.stringify(snapshot)).toContain('"value":"Follow"');
  expect(JSON.stringify(snapshot)).not.toContain("Private");
  document.body.innerHTML = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  ).body.innerHTML;
  expect(
    isNewsFollow(
      requireElement(document.querySelector(`[data-cmf-node="${region.ref}"]`)),
      translations.en
    )
  ).toBe(translations.en.NF_FOLLOW);
});

test.each(Object.entries(newsLabels))(
  "a report preserves the independent Follow control for %s while redacting its surrounding author",
  async (_locale, labels) => {
    const label = labels[0].split("|")[0] || "";
    const post = mountFollowPost(label, true);
    const button = requireElement(document.getElementById("follow"));
    button.setAttribute("aria-label", label);
    button.setAttribute("title", "Private personalized title");
    const snapshot = await captureDomSnapshot(document, { target: post });
    expect(JSON.stringify(snapshot)).toContain(label);
    expect(JSON.stringify(snapshot)).not.toContain("Private");
    const region = snapshot.regions[0];
    if (!region) throw new Error("Missing captured author action");
    document.body.innerHTML = new DOMParser().parseFromString(
      snapshotRegionHtml(snapshot, region),
      "text/html"
    ).body.innerHTML;
    const restored = requireElement(document.querySelector(`[data-cmf-node="${region.ref}"]`));
    expect(isNewsFollow(restored, translations.en)).toBe(translations.en.NF_FOLLOW);
  }
);

test.each([
  '<h4><a href="/person">Follow</a></h4>',
  '<h4><a href="/person"><div role="button">PrivateControlName</div></a></h4>',
  '<h4><a href="/person">PrivateAuthor</a><div role="button">PrivateAuthor</div></h4>',
  '<h4><a href="/person">PrivateAuthor</a><div role="button" aria-label="PrivatePersonalizedAction">Follow</div></h4>',
])(
  "profile-header redaction protects identity anchors, observed names and conflicting accessible labels in %s",
  async (markup) => {
    const post = mountFollowPost();
    requireElement(post.querySelector('[data-ad-rendering-role="profile_name"]')).innerHTML =
      markup;
    const snapshot = await captureDomSnapshot(document, { target: post });
    expect(JSON.stringify(snapshot)).not.toContain("Private");
    expect(JSON.stringify(snapshot)).not.toContain('"value":"Follow"');
  }
);
