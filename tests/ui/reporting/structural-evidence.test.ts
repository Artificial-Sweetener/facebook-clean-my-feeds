// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../../src/diagnostics/dom-fixture";
import { snapshotDestination } from "../../../src/diagnostics/dom-destinations";
import { snapshotVisualFacts, snapshotMediaFacts } from "../../../src/diagnostics/dom-visual-facts";
import { findStructuralRailAdSection } from "../../../src/feeds/news-rail-structure";
import { hasVerifiedGeometry } from "../../../src/feeds/verified-structure";
import { verifiedGlyph } from "../../feeds/locale-structure-fixtures";
import { requireElement } from "../../feeds/news-fixtures";
import { hasDiscoveryShelf } from "../../../src/feeds/discovery-structure";
import { isManusAiLink } from "../../../src/feeds/ai-destinations";

afterEach(() => document.body.replaceChildren());

test.each(["gif", "emg0"])(
  "image rendition %s survives capture without its private source",
  async (format) => {
    document.body.innerHTML = `<section><img src="https://external.example.fbcdn.net/private-identity?stp=dst-${format}_q75&amp;token=private-token"></section>`;
    const snapshot = await captureDomSnapshot(document, {
      target: document.querySelector("section"),
    });
    const fixture = new DOMParser().parseFromString(
      snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
      "text/html"
    );
    expect(fixture.querySelector("img")?.getAttribute("data-cmf-image-rendition")).toBe(format);
    expect(JSON.stringify(snapshot)).not.toMatch(/private-identity|private-token/);
  }
);

test.each([
  "https://external.example.fbcdn.net.attacker.invalid/image?stp=dst-gif",
  "https://user@external.example.fbcdn.net/image?stp=dst-gif",
  "https://external.example.fbcdn.net/image?stp=dst-webp",
])("image facts reject an unverified rendition: %s", (source) => {
  const image = document.createElement("img");
  image.src = source;
  expect(snapshotMediaFacts(image)).toEqual({});
});

test.each([
  "https://manus.im/private-task?token=private-token",
  "https://l.facebook.com/l.php?u=https%3A%2F%2Fmanus.im%2Fprivate-task%3Ftoken%3Dprivate-token",
])("Manus destinations remain identifiable after report redaction: %s", async (destination) => {
  document.body.innerHTML = `<section><a href="${destination}">Unknown</a></section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  expect(isManusAiLink(requireElement(fixture.querySelector("a")))).toBe(true);
  expect(JSON.stringify(snapshot)).not.toMatch(/private-task|private-token/);
});

test("media evidence distinguishes duration states without exporting its source", () => {
  const video = document.createElement("video");
  video.src = "https://private.invalid/private-video";
  expect(snapshotMediaFacts(video)["data-cmf-video-duration"]).toBe("unavailable");
  Object.defineProperty(video, "duration", { value: Infinity, configurable: true });
  expect(snapshotMediaFacts(video)["data-cmf-video-duration"]).toBe("unbounded");
  Object.defineProperty(video, "duration", { value: 145.2 });
  expect(snapshotMediaFacts(video)["data-cmf-video-duration"]).toBe("145");
  expect(JSON.stringify(snapshotMediaFacts(video))).not.toContain("private");
});

test("normal Facebook class lists and deep wrappers retain selector evidence", async () => {
  const classes = Array.from({ length: 80 }, (_, index) => `native-${index}`).join(" ");
  document.body.innerHTML = `<section>${"<div>".repeat(42)}<button class="${classes}">unknown control</button>${"</div>".repeat(42)}</section>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  expect(snapshot.coverage.omissions["class-token-limit"]).toBeUndefined();
  expect(snapshot.coverage.omissions["depth-limit"]).toBeUndefined();
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  expect(fixture.querySelector("button")?.classList.length).toBe(80);
});

test("external SVG dependencies beyond the previous reference ceiling remain available", async () => {
  document.body.innerHTML =
    "<section><svg>" +
    Array.from({ length: 96 }, (_, index) => `<use href="#glyph-${index}"></use>`).join("") +
    "</svg></section><svg>" +
    Array.from({ length: 96 }, (_, index) => `<path id="glyph-${index}" d="M0 0L1 1"></path>`).join(
      ""
    ) +
    "</svg>";
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  expect(snapshot.coverage.omissions["reference-limit"]).toBeUndefined();
  expect(snapshot.references.length).toBe(96);
  expect(
    snapshot.references.every(
      (reference) => reference.status === "external" || reference.status === "captured"
    )
  ).toBe(true);
});

test("numeric discovery identities stay private and distinct in a locale-independent replay", async () => {
  document.body.innerHTML =
    '<div role="article"><h3>unknown</h3><a href="/events/discover/">unknown</a>' +
    [123456, 234567]
      .map(
        (id) =>
          `<div data-type="hscroll-child"><a href="/events/${id}/"><img></a><button>unknown</button></div>`
      )
      .join("") +
    "</div>";
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("123456");
  expect(data).not.toContain("234567");
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, requireElement(snapshot.regions[0])),
    "text/html"
  );
  expect(
    hasDiscoveryShelf(requireElement(fixture.querySelector('[role="article"]')), "events")
  ).toBe(true);
});

test("identity redaction retains badge geometry and inert object children for offline selectors", async () => {
  document.body.innerHTML = `<div role="article"><h4 data-ad-rendering-role="profile_name"><a href="/private-person">Private Name</a>${verifiedGlyph}</h4><object data="https://private.invalid/document" codebase="secret"><a href="/ads/about/">Unfamiliar disclosure</a></object><p>Private body</p></div>`;
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="article"]'),
  });
  const data = JSON.stringify(snapshot);
  expect(data).not.toContain("Private Name");
  expect(data).not.toContain("Private body");
  expect(data).not.toContain("private.invalid");
  const region = requireElement(snapshot.regions[0]);
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  );
  const root = requireElement(fixture.querySelector('[role="article"]'));
  expect(hasVerifiedGeometry(requireElement(root.querySelector("svg")), root)).toBe(true);
  expect(root.querySelector("object > a")?.textContent).toBe("Unfamiliar disclosure");
  expect(root.querySelector("object")?.hasAttribute("data")).toBe(false);
});

test("report-local destination aliases preserve equality without exposing identities", async () => {
  document.body.innerHTML =
    '<section><a href="/private-a">one</a><a href="/private-a">two</a><a href="/private-b">three</a></section>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector("section"),
  });
  const region = requireElement(snapshot.regions[0]);
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  );
  const keys = Array.from(fixture.querySelectorAll("a"), (link) =>
    link.getAttribute("data-cmf-link-key")
  );
  expect(keys[0]).toBe(keys[1]);
  expect(keys[0]).not.toBe(keys[2]);
  expect(JSON.stringify(snapshot)).not.toContain("private-a");
  expect(JSON.stringify(snapshot)).not.toContain("private-b");
});

test("sidebar ad structure survives redaction, reconstruction and unknown heading text", async () => {
  document.body.innerHTML =
    '<div role="complementary"><section><h3>Unknown copy</h3><a attributionsrc="https://private.invalid/token" href="https://l.facebook.com/l.php?u=https%3A%2F%2Fadvertiser.invalid%2Fprivate-tracking"><img src="private.jpg"></a></section><section><h3>Other section</h3></section></div>';
  const snapshot = await captureDomSnapshot(document, {
    target: document.querySelector('[role="complementary"]'),
  });
  const region = requireElement(snapshot.regions[0]);
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  );
  const rail = requireElement(fixture.querySelector('[role="complementary"]'));
  expect(
    findStructuralRailAdSection(rail, requireElement(rail.querySelector("h3")))
  ).not.toBeNull();
  expect(JSON.stringify(snapshot)).not.toMatch(
    /private\.invalid|private-tracking|advertiser\.invalid|private\.jpg/
  );
});

test("sprite evidence retains static artwork and placement but never private media URLs or CSS", () => {
  const icon = document.createElement("i");
  icon.style.cssText =
    'background-image:url("https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/icon.png?secret=value");background-position:-24px -48px;background-size:100px 200px';
  const facts = snapshotVisualFacts(icon.style);
  expect(facts["data-cmf-background-sprite"]).toBe(
    "https://static.xx.fbcdn.net/rsrc.php/v4/yA/r/icon.png"
  );
  expect(facts["data-cmf-background-position"]).toBe("-24px -48px");
  expect(facts["data-cmf-background-size"]).toBe("100px 200px");
  for (const url of [
    "https://scontent.xx.fbcdn.net/private.jpg",
    "https://static.xx.fbcdn.net/private.png",
    "https://static.xx.fbcdn.net.attacker.invalid/rsrc.php/icon.png",
  ]) {
    icon.style.backgroundImage = `url("${url}")`;
    expect(snapshotVisualFacts(icon.style)).toEqual({});
  }
});

test("known event navigation stays distinct from personal events and redirect chains remain bounded", () => {
  expect(snapshotDestination("/help/123456/").value).toBe("/help/123456/");
  expect(snapshotDestination("/business/help/123456/").value).toBe("/business/help/123456/");
  expect(snapshotDestination("/events/birthdays/").value).toBe("/events/birthdays/");
  expect(snapshotDestination("/events/discover/").value).toBe("/events/discover/");
  expect(snapshotDestination("/events/12345/").value).toBe("/events/[event]/");
  let destination = "https://secret.invalid/";
  for (let index = 0; index < 8; index++)
    destination = `https://l.facebook.com/l.php?u=${encodeURIComponent(destination)}`;
  expect(JSON.stringify(snapshotDestination(destination))).not.toContain("secret.invalid");
  expect(JSON.stringify(snapshotDestination(destination))).toContain("redirect-limit");
});
