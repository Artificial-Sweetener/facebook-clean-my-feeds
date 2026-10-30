// SPDX-License-Identifier: GPL-3.0-only

import { startPostHistory, readPostHistory } from "../../../src/diagnostics/post-history";
import { captureTransitionSnapshot } from "../../../src/diagnostics/transition-snapshot";
import { buildBugReport } from "../../../src/diagnostics/bug-report";
import { buildHistoryFixture } from "../../../src/diagnostics/history-fixture";
import { isPostHistory } from "../../../src/core/diagnostics/post-history";
import { parseReportDocument } from "../../../src/core/diagnostics/report-document";
import { beginPostTrace, finishPostTrace, installPostTraceSink } from "../../../src/dom/post-trace";
import { clearDirtyTracking } from "../../../src/dom/dirty-check";
import { postAtt } from "../../../src/dom/attributes";
import { mopNewsFeed } from "../../../src/feeds/news";
import { createNewsContext, requireElement } from "../../feeds/news-fixtures";
import { mountNewsPost, newsTextBlocks } from "../../validation/news-contract-fixtures";
import { mountSvgDisclosure } from "../../feeds/svg-disclosure-fixtures";

let stop: (() => void) | undefined;
let now = 0;
beforeEach(() => {
  now = 0;
  jest.spyOn(performance, "now").mockImplementation(() => now);
  stop = startPostHistory(document);
});
afterEach(() => {
  stop?.();
  clearDirtyTracking();
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

test("reports retain one identity through hide, nested unload, reload, caption toggle and ordinary replacement", async () => {
  const post = mountSvgDisclosure();
  requireElement(document.getElementById("disclosure")).setAttribute(
    "href",
    `/?__cft__[0]=${"PrivateTrackingToken".repeat(12)}`
  );
  const loaded = post.innerHTML;
  const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
  mopNewsFeed(context);
  const wrapper = requireElement(post.parentElement);
  now += 1100;
  post.innerHTML = '<div><span></span><div data-virtualized="true"><div></div></div></div>';
  mopNewsFeed(context);
  expect(post.parentElement).toBe(wrapper);
  now += 1100;
  post.innerHTML = loaded;
  mopNewsFeed(context);
  wrapper.setAttribute("open", "");
  wrapper.dispatchEvent(new Event("toggle"));
  now += 1100;
  post.innerHTML = "<p>Private ordinary replacement</p>";
  mopNewsFeed(context);
  const report = await buildBugReport(context);
  const history = report.data.history;
  expect(isPostHistory(history)).toBe(true);
  expect(parseReportDocument(JSON.stringify(report.data))).not.toBeNull();
  const matched = history.events.find((event) => event.rule === "NF_SPONSORED");
  expect(matched).toBeDefined();
  const events = history.events.filter((event) => event.post === matched?.post);
  expect(events.map((event) => event.action)).toEqual([
    "hide",
    "defer",
    "hide",
    "retain",
    "restore",
  ]);
  expect(events[1]?.trigger).toBe("virtualized-unload");
  expect(events[3]?.trigger).toBe("caption-toggle");
  expect(events[3]?.after.open).toBe(true);
  expect(events.at(-1)?.after).toMatchObject({ classified: false, wrapper: null });
  expect(
    events.filter((event) => event.action === "hide").map((event) => event.after.wrapper)
  ).toEqual([matched?.after.wrapper, matched?.after.wrapper]);
  expect(JSON.stringify(history)).not.toMatch(
    /Example Publisher|Private authored|Private ordinary|PrivateTrackingToken/
  );
  const fixture = buildHistoryFixture(history);
  expect(fixture.manifest.steps.every((step) => step.expected === null)).toBe(true);
  expect(fixture.files.some((file) => file.html.includes('data-virtualized="true"'))).toBe(true);
  expect(fixture.files.some((file) => file.html.includes("Sponsored"))).toBe(true);
  expect(fixture.files.every((file) => file.html.includes("default-src 'none'"))).toBe(true);
});

test("ordinary posts and unchanged retained captions do not fill the history on periodic sweeps", () => {
  const post = mountSvgDisclosure();
  const context = createNewsContext({ options: { NF_SPONSORED: true, VERBOSITY_LEVEL: "1" } });
  mopNewsFeed(context);
  const initial = readPostHistory();
  for (let index = 0; index < 40; index++) {
    now += 800;
    context.state.forceProcess = true;
    mopNewsFeed(context);
  }
  expect(readPostHistory().events).toEqual(initial.events);
  expect(readPostHistory().captureMs).toBe(initial.captureMs);
  expect(post.parentElement?.localName).toBe("details");
});

test("event, frame, work-rate and age bounds are explicit and cannot leave dangling frame links", () => {
  document.body.innerHTML =
    '<div role="main"><div aria-posinset="1"><h4>Sponsored</h4></div></div>';
  const post = requireElement(document.querySelector("[aria-posinset]"));
  for (let index = 0; index < 200; index++) {
    now = index * 1001;
    finishPostTrace(beginPostTrace(post, "content-changed"), "hide", "NF_SPONSORED");
  }
  const history = readPostHistory();
  expect(history.events.length).toBeLessThanOrEqual(160);
  expect(history.frames.length).toBeLessThanOrEqual(16);
  expect(history.dropped.events).toBeGreaterThan(0);
  expect(history.dropped.frames).toBeGreaterThan(0);
  expect(isPostHistory(history)).toBe(true);
  for (let index = 0; index < 20; index++)
    finishPostTrace(beginPostTrace(post, "content-changed"), "allow");
  expect(readPostHistory().dropped.frames).toBeGreaterThan(history.dropped.frames);
  const detached = readPostHistory();
  const first = detached.events[0];
  if (first) first.before.classified = !first.before.classified;
  expect(isPostHistory(readPostHistory())).toBe(true);
  now += 120_001;
  expect(readPostHistory().events).toHaveLength(0);
  expect(readPostHistory().frames).toHaveLength(0);
});

test("oversized and expired structural captures expose omissions without layout or raw content reads", () => {
  document.body.innerHTML = `<div aria-posinset="1"><h4><a href="/privateperson">Secret Person</a></h4><div data-ad-preview="message">private@example.com secret content</div>${"<div><span>Unknown authored detail</span></div>".repeat(400)}</div>`;
  const post = requireElement(document.querySelector("[aria-posinset]"));
  const layout = jest.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(() => {
    throw new Error("No layout allowed");
  });
  const snapshot = captureTransitionSnapshot(post, Infinity);
  expect(snapshot.coverage.capturedNodes).toBeLessThanOrEqual(256);
  expect(snapshot.coverage.omissions["node-limit"]).toBeGreaterThan(0);
  expect(JSON.stringify(snapshot)).not.toMatch(
    /Secret Person|private@example.com|secret content|Unknown authored detail|privateperson/
  );
  expect(layout).not.toHaveBeenCalled();
  expect(captureTransitionSnapshot(post, -1).coverage.omissions["time-limit"]).toBeGreaterThan(0);
  finishPostTrace(beginPostTrace(post, "content-changed"), "allow");
  expect(isPostHistory(readPostHistory())).toBe(true);
});

test("a referenced public label captured before its control is retained without exposing identity text", () => {
  document.body.innerHTML = `<div aria-posinset="1"><span id="private-label">Commercial notice beta</span><h4><a data-ad-rendering-role="profile_name" href="/privateauthor">Private Author</a><a href="/?__cft__[0]=${"secret-tracking".repeat(30)}"><span aria-labelledby="private-label"><svg></svg></span></a></h4></div>`;
  const snapshot = captureTransitionSnapshot(
    requireElement(document.querySelector("[aria-posinset]")),
    Infinity
  );
  expect(JSON.stringify(snapshot).includes('"value":"Commercial notice beta"')).toBe(true);
  expect(
    /Private Author|privateauthor|secret-tracking|private-label/.test(JSON.stringify(snapshot))
  ).toBe(false);
});

test("failure in optional diagnostics never prevents hiding or restoring content", () => {
  const disconnect = installPostTraceSink(() => {
    throw new Error("capture failed");
  });
  const post = mountSvgDisclosure();
  const context = createNewsContext({ options: { NF_SPONSORED: true } });
  expect(() => mopNewsFeed(context)).not.toThrow();
  expect(post.hasAttribute(postAtt)).toBe(true);
  expect(() =>
    finishPostTrace(
      {
        /** Simulate a broken diagnostics consumer after the DOM mutation has completed. */
        complete: () => {
          throw new Error("finish failed");
        },
      },
      "allow"
    )
  ).not.toThrow();
  post.innerHTML = "<p>Ordinary replacement</p>";
  mopNewsFeed(context);
  expect(post.hasAttribute(postAtt)).toBe(false);
  disconnect();
});

test("old reports remain readable while malformed history and fixture links are rejected", async () => {
  mountSvgDisclosure();
  const context = createNewsContext({ options: { NF_SPONSORED: true } });
  mopNewsFeed(context);
  const report = await buildBugReport(context);
  const { history, ...legacy } = report.data;
  expect(parseReportDocument(JSON.stringify(legacy))).not.toBeNull();
  expect(
    parseReportDocument(
      JSON.stringify({
        ...legacy,
        history: { ...history, events: [{ ...history.events[0], frame: 99999 }] },
      })
    )
  ).toBeNull();
  expect(
    isPostHistory({
      ...history,
      events: [{ ...history.events[0], rule: "Private configured keyword" }],
    })
  ).toBe(false);
  expect(
    isPostHistory({ ...history, frames: Array.from({ length: 17 }, () => history.frames[0]) })
  ).toBe(false);
});

test("stopping collection removes the listener and sink and resets the next session", () => {
  const post = mountSvgDisclosure();
  mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
  expect(readPostHistory().events.length).toBeGreaterThan(0);
  stop?.();
  expect(beginPostTrace(post, "content-changed")).toBeNull();
  expect(readPostHistory().events).toHaveLength(0);
  stop = startPostHistory(document);
  expect(readPostHistory().events).toHaveLength(0);
});

test("a private configured match is represented by its rule ID without preserving its reason or content", () => {
  const { post } = mountNewsPost(newsTextBlocks("ConfidentialKeyword private@example.test"));
  const context = createNewsContext({
    options: { NF_BLOCKED_ENABLED: true, VERBOSITY_DEBUG: true },
  });
  context.filters.NF_BLOCKED_TEXT = ["ConfidentialKeyword"];
  context.filters.NF_BLOCKED_TEXT_LC = ["confidentialkeyword"];
  mopNewsFeed(context);
  now += 1100;
  post.setAttribute("data-update", "changed");
  mopNewsFeed(context);
  const history = readPostHistory();
  expect(history.events.some((event) => event.rule === "NF_BLOCKED_ENABLED")).toBe(true);
  expect(
    /ConfidentialKeyword|confidentialkeyword|private@example.test/.test(JSON.stringify(history))
  ).toBe(false);
});

test.each(["贊助", "Publicidad", "Sponsorowane"])(
  "history preserves public SVG disclosure %s without language-dependent rule IDs",
  (label) => {
    mountSvgDisclosure(label);
    mopNewsFeed(createNewsContext({ options: { NF_SPONSORED: true } }));
    const history = readPostHistory();
    expect(history.events.some((event) => event.rule === "NF_SPONSORED")).toBe(true);
    expect(JSON.stringify(history.frames).includes(`"value":"${label}"`)).toBe(true);
  }
);
