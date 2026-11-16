// SPDX-License-Identifier: GPL-3.0-only

import { snapshotDestination } from "../../../src/diagnostics/dom-destinations";
import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../../src/diagnostics/dom-fixture";
import { requireElement } from "../../feeds/news-fixtures";
import { snapshotLimits } from "../../../src/core/diagnostics/dom-snapshot";
import { pageSuggestionCards } from "../../feeds/page-suggestion-fixture";
import { hasPageSuggestionShelf } from "../../../src/feeds/page-suggestions";

afterEach(() => document.body.replaceChildren());

test("an explicit large complaint uses the total budget and retains its last control", async () => {
  document.body.innerHTML = `<section>${"<span>fixed copy</span>".repeat(900)}<button id="last">Last control</button></section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  expect(snapshot.limits.nodesPerRegion).toBe(snapshotLimits.nodes);
  expect(snapshot.coverage.omissions["region-limit"]).toBeUndefined();
  expect(snapshot.coverage.capturedNodes).toBeGreaterThan(snapshotLimits.nodesPerRegion);
  const fixture = snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0]));
  expect(fixture).toContain("Last control");
});

test("a requested smaller target budget remains binding", async () => {
  document.body.innerHTML = `<section>${"<span>fixed copy</span>".repeat(20)}</section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
    limits: { nodesPerRegion: 12 },
  });
  expect(snapshot.limits.nodesPerRegion).toBe(12);
  expect(snapshot.coverage.omissions["region-limit"]).toBeGreaterThan(0);
});

test("page recommendation geometry and destination equality survive report reconstruction", async () => {
  document.body.innerHTML = `<article><div role="list">${pageSuggestionCards.join("")}</div></article>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("article"),
  });
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  expect(hasPageSuggestionShelf(requireElement(fixture.querySelector("article")))).toBe(true);
  expect(JSON.stringify(snapshot)).not.toContain("example.page");
});

test.each([
  ["https://instagram.com/PrivateAccount/", "https://www.instagram.com/[segment]/"],
  [
    "https://www.instagram.com/reel/PrivateReel/?igsh=PrivateToken#PrivateFragment",
    "https://www.instagram.com/reel/[segment]/",
  ],
  ["https://www.instagram.com/p/PrivatePost/", "https://www.instagram.com/p/[segment]/"],
  ["https://www.instagram.com/tv/PrivateVideo/", "https://www.instagram.com/tv/[segment]/"],
  [
    "https://www.instagram.com/stories/PrivateAccount/123456/",
    "https://www.instagram.com/stories/[segment]/[segment]/",
  ],
  [
    "https://www.instagram.com/accounts/PrivateFlow/",
    "https://www.instagram.com/[segment]/[segment]/",
  ],
  ["https://www.instagram.com/", "https://www.instagram.com/"],
])("Instagram service and route shape survive without identifying values: %s", (raw, expected) => {
  expect(snapshotDestination(raw || "").value).toBe(expected);
  expect(JSON.stringify(snapshotDestination(raw || ""))).not.toMatch(/Private|123456/);
});

test.each([
  "https://instagram.com.attacker.invalid/reel/PrivateReel/",
  "https://help.instagram.com/PrivateArticle/",
  "https://wwwinstagram.com/PrivateAccount/",
])("unverified Instagram hosts remain ordinary external destinations: %s", (raw) => {
  expect(snapshotDestination(raw).value).toBe("https://external.invalid/[path]");
});

test.each([
  "https://user@www.instagram.com/PrivateAccount/",
  "https://user@l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2FPrivateAccount%2F",
  "ftp://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2FPrivateAccount%2F",
])("redaction cannot turn invalid source URLs into valid attribution evidence: %s", (raw) => {
  expect(snapshotDestination(raw)).toEqual({ value: "[non-web]", facts: {} });
});

test.each(["top", "liked", "invites", "PrivateCategory"])(
  "Pages category %s stays scoped to its public route",
  (category) => {
    expect(snapshotDestination(`/pages/?category=${category}&token=PrivateToken`).value).toBe(
      `/pages/?category=${category === "PrivateCategory" ? "%5Bvalue%5D" : category}`
    );
    expect(snapshotDestination(`/PrivateAccount/?category=${category}`).value).toBe("/[profile]/");
  }
);

test("captured Instagram redirect keeps its service without exporting an account, media ID or tracking token", async () => {
  const href =
    "https://l.facebook.com/l.php?u=" +
    encodeURIComponent("https://www.instagram.com/reel/PrivateMedia/?igsh=PrivateToken");
  document.body.innerHTML = `<section><a href="${href}"><svg viewBox="0 0 24 24"><path d="M0 0L1 1"></path></svg></a></section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  const projected = new URL(requireElement(fixture.querySelector("a")).getAttribute("href") || "");
  expect(projected.searchParams.get("u")).toBe("https://www.instagram.com/reel/[segment]/");
  expect(fixture.querySelector("path")?.getAttribute("d")).toBe("M0 0L1 1");
  expect(JSON.stringify(snapshot)).not.toContain("Private");
});
