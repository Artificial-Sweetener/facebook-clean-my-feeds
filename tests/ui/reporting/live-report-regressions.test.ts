// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { SensitiveText } from "../../../src/diagnostics/sensitive-text";

afterEach(() => document.body.replaceChildren());

test("SVG avatars identify dotted account links and unmarked paired author links without swallowing disclosures", async () => {
  document.body.innerHTML =
    '<nav><a href="/private.account"><svg><image href="avatar.jpg"></image></svg>Secret Account</a></nav><main><div role="article"><a aria-hidden="true" href="/private.author?author=1"><svg><image href="avatar.jpg"></image></svg></a><div><a href="/private.author?author=1">Secret Author</a><a href="/private.author?disclosure=1">Novel placement</a></div><button aria-label="React to Secret Author">Like</button><p>Secret body</p></div><button>New interface action</button></main>';
  const snapshot = await captureDomSnapshot(document);
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("Secret");
  expect(data).toContain("Novel placement");
  expect(data).toContain("New interface action");
  expect(data).toContain("React to [identity]");
});

test("birthday names are redacted at the emphasized identity without suppressing neighboring module labels", async () => {
  document.body.innerHTML =
    '<section><h3>Birthdays</h3><a href="/events/birthdays/"><b>Secret Friend</b> has a birthday today</a><button>New reminder action</button><b>Unfamiliar diagnostic label</b></section>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("Secret Friend");
  expect(data).toContain("Birthdays");
  expect(data).toContain("has a birthday today");
  expect(data).toContain("New reminder action");
  expect(data).toContain("Unfamiliar diagnostic label");
});

test("personalized short-name references are scrubbed without corrupting ordinary words or month names", () => {
  const text = new SensitiveText();
  text.remember("May Chen");
  text.remember("Ann Smith");
  expect(text.redact("Shared with May's friends")).toBe("Shared with [identity]'s friends");
  expect(text.redact("What's on your mind, Ann?")).toBe("What's on your mind, [identity]?");
  expect(text.redact("People you may know, May 2026, Announcement")).toBe(
    "People you may know, May 2026, Announcement"
  );
  expect(text.redact("An unfamiliar disclosure may appear")).toBe(
    "An unfamiliar disclosure may appear"
  );
});

test("reel-card author labels are sensitive content while the Reels navigation label remains evidence", async () => {
  document.body.innerHTML =
    '<section><h3>Reels</h3><a href="/reel/?s=tab">Novel reel navigation</a><a href="/reel/123456789/" aria-label="Reel by Secret Creator"><img></a></section>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("Secret Creator");
  expect(data).toContain("Reels");
  expect(data).toContain("Novel reel navigation");
});
