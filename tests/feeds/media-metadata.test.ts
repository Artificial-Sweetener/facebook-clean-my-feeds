// SPDX-License-Identifier: GPL-3.0-only

import { extractPageMediaFacts } from "../../src/core/filters/page-media-facts";
import { clearPageMediaFacts, readPageMediaFacts } from "../../src/dom/page-media-facts";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { getContentVersion } from "../../src/dom/content-version";
import { hasAiMetadata, hasLiveMetadata } from "../../src/feeds/shared/media-metadata";
import { isNewsAiInfoPost } from "../../src/feeds/news-detectors";
import { isVideoLive } from "../../src/feeds/videos";
import * as disclosure from "../../src/core/filters/disclosure-labels";
import { requireElement } from "./news-fixtures";
import { aiStory, appendPayload, livePlayer } from "./media-metadata-fixtures";
import { captureDomSnapshot } from "../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../src/diagnostics/dom-fixture";
import { textPost } from "../validation/routes-fixtures";

/** Isolate each detector in an ordinary owning post with arbitrary untranslated copy. */
function mount(content: string): HTMLElement {
  document.body.innerHTML = `<article id="post">${content}</article>`;
  return requireElement(document.getElementById("post"));
}

afterEach(() => {
  clearPageMediaFacts();
  clearDirtyTracking();
  jest.restoreAllMocks();
  document.head.replaceChildren();
  document.body.replaceChildren();
});

test("reports retain linked machine facts without server payloads, tokens or private media identities", async () => {
  appendPayload([
    aiStory("private-token"),
    {
      __typename: "Video",
      id: "123456789012345",
      is_live_streaming: true,
      broadcast_status: "LIVE",
      privateField: "private-payload",
    },
  ]);
  const post = mount(
    '<h4><a href="https://www.facebook.com/author?__cft__[0]=private-token">Author</a></h4><div data-video-id="123456789012345"><video></video></div>'
  );
  const snapshot = await captureDomSnapshot(document, { target: post });
  const serialized = JSON.stringify(snapshot);
  const html = snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0]));
  expect(html).toContain('data-cmf-story-ai="true"');
  expect(html).toContain('data-cmf-video-live="true"');
  expect(html).toContain(
    'data-cmf-story-renderers="CometFeedStoryGenAIContentTransparencyStrategy"'
  );
  for (const secret of [
    "private-token",
    "123456789012345",
    "private-payload",
    "encrypted_click_tracking",
  ])
    expect(serialized).not.toContain(secret);
});

test("reports can retain previously unknown renderer types without copying their private props", () => {
  const facts = extractPageMediaFacts({
    __typename: "Video",
    id: "123",
    augments: [
      {
        __typename: "XFBFBShortsFutureAttribution",
        actor: "private-person",
        url: "https://private.example",
      },
      { __typename: "private arbitrary caption" },
    ],
  });
  expect(facts.get("video:123")).toEqual({
    ai: false,
    renderers: ["XFBFBShortsFutureAttribution"],
  });
  expect(JSON.stringify([...facts])).not.toContain("private");
});

test.each(["story-token", "story-token-ufi"])(
  "AI disclosure matches its exact owned %s without caption fallback",
  (token) => {
    appendPayload(aiStory());
    const post = mount(
      `<h4><a href="https://www.facebook.com/author?__cft__[0]=${token}">α</a></h4>`
    );
    const fallback = jest.spyOn(disclosure, "matchesDisclosureLabel");
    expect(isNewsAiInfoPost(post, { NF_AI_INFO_POSTS: "reason" })).toBe("reason");
    expect(fallback).not.toHaveBeenCalled();
  }
);

test.each([
  '<blockquote><h4><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4></blockquote>',
  '<article><h4><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4></article>',
  '<div data-ad-preview="message"><h4><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4></div>',
  '<h4 hidden><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4>',
  '<h4><a href="https://evil.example/author?__cft__[0]=story-token">α</a></h4>',
  '<h4><a href="https://www.facebook.com/author?__cft__[0]=different">α</a></h4>',
  '<h4><a href="https://www.facebook.com/a?__cft__[0]=story-token">α</a><a href="https://www.facebook.com/b?__cft__[0]=other">β</a></h4>',
])("unowned, hidden, foreign or conflicting story evidence is rejected: %s", (html) => {
  appendPayload(aiStory());
  expect(hasAiMetadata(mount(html))).toBe(false);
});

test("a disclosure on an attached story does not propagate to its parent", () => {
  const parent = { ...aiStory("parent", false), attached_story: aiStory("child") };
  const facts = extractPageMediaFacts(parent);
  expect(facts.get("story:parent")).toEqual(expect.objectContaining({ ai: false }));
  expect(facts.get("story:child")).toEqual(expect.objectContaining({ ai: true }));
});

test("a shared body's heading and video cannot classify an ordinary outer post", () => {
  appendPayload([
    aiStory(),
    {
      __typename: "Video",
      id: "123",
      augments: [{ __typename: "XFBFBShortsGenAITransparencyAttribution" }],
    },
  ]);
  document.body.innerHTML = textPost(
    "outer",
    '<h5><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h5><div data-video-id="123"><video></video></div>',
    "<h4>Ordinary outer author</h4>"
  );
  expect(hasAiMetadata(requireElement(document.getElementById("outer")))).toBe(false);
});

test("replacing a native payload in place updates its dependent facts", async () => {
  const script = appendPayload(aiStory());
  const post = mount(
    '<h4><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4>'
  );
  expect(hasAiMetadata(post)).toBe(true);
  script.textContent = JSON.stringify(aiStory("story-token", false));
  await Promise.resolve();
  expect(hasAiMetadata(post)).toBe(false);
});

test("mismatched context/feedback IDs cannot transfer disclosure ownership", () => {
  const story = aiStory();
  story.comet_sections.context_layout.story.id = "foreign";
  expect(extractPageMediaFacts(story).size).toBe(0);
  story.comet_sections.context_layout.story.id = story.id;
  story.comet_sections.feedback.story.story_ufi_container.story.id = "foreign";
  expect(extractPageMediaFacts(story).has("story:story-token-ufi")).toBe(false);
});

test("video AI augmentation is independent of language and requires its own rendered media", () => {
  appendPayload({
    __typename: "Video",
    id: "123",
    augments: [{ __typename: "XFBFBShortsGenAITransparencyAttribution" }],
  });
  const post = mount(
    '<h4><a href="https://www.facebook.com/author/videos/123/">α</a></h4><div data-video-id="123"><video></video></div>'
  );
  expect(hasAiMetadata(post)).toBe(true);
  requireElement(post.querySelector("[data-video-id]")).setAttribute("data-video-id", "456");
  expect(hasAiMetadata(post)).toBe(false);
});

test.each([true, false])(
  "live machine state matches current transport at pressed=%s",
  (pressed) => {
    appendPayload({
      __typename: "Video",
      id: "123",
      is_live_streaming: true,
      broadcast_status: "LIVE",
    });
    const post = mount(livePlayer());
    requireElement(post.querySelector("[aria-pressed]")).setAttribute(
      "aria-pressed",
      String(pressed)
    );
    expect(isVideoLive(post, { VF_LIVE: "reason" })).toBe("reason");
  }
);

test.each([
  { __typename: "Video", id: "123", is_live_streaming: false, broadcast_status: "LIVE" },
  { __typename: "Video", id: "123", is_live_streaming: true, broadcast_status: "PREMIERE" },
  { __typename: "Video", id: "123", is_live_streaming: true },
  { __typename: "Video", id: "456", is_live_streaming: true, broadcast_status: "LIVE" },
  { __typename: "Story", id: "123", is_live_streaming: true, broadcast_status: "LIVE" },
])("recorded, premiere, incomplete and foreign metadata do not match: %j", (facts) => {
  appendPayload(facts);
  expect(hasLiveMetadata(mount(livePlayer()))).toBe(false);
});

test.each([
  "nested",
  "hidden",
  "no-toggle",
  "extra-control",
  "two-videos",
  "foreign-link",
  "conflicting-id",
])("live transport rejects %s false positives", (kind) => {
  appendPayload({
    __typename: "Video",
    id: "123",
    is_live_streaming: true,
    broadcast_status: "LIVE",
  });
  const post = mount(kind === "nested" ? `<article>${livePlayer()}</article>` : livePlayer());
  const player = requireElement(post.querySelector("#player"));
  if (kind === "hidden") player.setAttribute("hidden", "");
  if (kind === "no-toggle") player.querySelector("[aria-pressed]")?.remove();
  if (kind === "extra-control")
    player.querySelector("#transport")?.append(document.createElement("button"));
  if (kind === "two-videos") player.append(document.createElement("video"));
  if (kind === "foreign-link")
    player.querySelector("a")?.setAttribute("href", "https://evil.example/videos/123/");
  if (kind === "conflicting-id") player.setAttribute("data-video-id", "456");
  expect(hasLiveMetadata(post)).toBe(false);
});

test("a cached live flag stops matching as soon as the current transport disappears", () => {
  appendPayload({
    __typename: "Video",
    id: "123",
    is_live_streaming: true,
    broadcast_status: "LIVE",
  });
  const post = mount(livePlayer());
  expect(hasLiveMetadata(post)).toBe(true);
  post.querySelector("[aria-pressed]")?.remove();
  expect(hasLiveMetadata(post)).toBe(false);
});

test.each(["ENDED", "PREMIERE", null])(
  "an explicit %s update revokes a previously live fact",
  (status) => {
    appendPayload({
      __typename: "Video",
      id: "123",
      is_live_streaming: true,
      broadcast_status: "LIVE",
    });
    const post = mount(livePlayer());
    expect(hasLiveMetadata(post)).toBe(true);
    appendPayload({
      __typename: "Video",
      id: "123",
      is_live_streaming: true,
      broadcast_status: status,
    });
    expect(hasLiveMetadata(post)).toBe(false);
  }
);

test("late payload changes invalidate subscribed post versions and replace earlier facts", async () => {
  const post = mount(
    '<h4><a href="https://www.facebook.com/author?__cft__[0]=story-token">α</a></h4>'
  );
  expect(hasAiMetadata(post)).toBe(false);
  const initial = getContentVersion(post);
  appendPayload(aiStory());
  await Promise.resolve();
  expect(getContentVersion(post)).not.toBe(initial);
  expect(hasAiMetadata(post)).toBe(true);
  const positive = getContentVersion(post);
  appendPayload(aiStory("story-token", false));
  await Promise.resolve();
  expect(getContentVersion(post)).not.toBe(positive);
  expect(hasAiMetadata(post)).toBe(false);
});

test("hot lookups neither parse nor enumerate scripts again", () => {
  appendPayload(aiStory());
  const post = mount("<div></div>");
  expect(readPageMediaFacts(post, "story:story-token")).toEqual(
    expect.objectContaining({ ai: true })
  );
  const parse = jest.spyOn(JSON, "parse");
  const query = jest.spyOn(document, "querySelectorAll");
  for (let i = 0; i < 100; i++)
    expect(readPageMediaFacts(post, "story:story-token")).toEqual(
      expect.objectContaining({ ai: true })
    );
  expect(parse).not.toHaveBeenCalled();
  expect(query).not.toHaveBeenCalled();
});

test("malformed and oversized payloads cannot interrupt filtering", () => {
  const script = appendPayload(null);
  script.textContent = '{"augments": invalid';
  const oversized = appendPayload(null);
  oversized.textContent = `{"augments":[],"padding":"${"x".repeat(2500000)}"}`;
  expect(readPageMediaFacts(mount(""), "video:123")).toBeUndefined();
});

test("bounded extraction discards an over-budget payload and contradictory facts resolve false", () => {
  const live = {
    __typename: "Video",
    id: "123",
    is_live_streaming: true,
    broadcast_status: "LIVE",
  };
  expect(extractPageMediaFacts([live, ...Array.from({ length: 100001 }, () => ({}))]).size).toBe(0);
  expect(
    extractPageMediaFacts([live, { ...live, is_live_streaming: false }]).get("video:123")
  ).toEqual({ live: false });
});
