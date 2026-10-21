// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { snapshotRegionHtml, testSnapshotSelector } from "../../../src/diagnostics/dom-fixture";
import { isSponsored } from "../../../src/feeds/shared/sponsored";

/** Reproduce an unknown disclosure and widget beside ordinary authored content, without a working existing detector. */
function mountUnknownLayout(): Element {
  document.body.innerHTML = `<main role="main"><div role="article" id="ad"><h4><a data-ad-rendering-role="profile_name" href="/PrivateAuthor">PrivateAuthor</a><a href="/publisher?__cft__[0]=${"secret-session-".repeat(30)}"><span aria-labelledby="private-label-id"><svg></svg></span></a></h4><p>PrivateCreative</p></div><section id="new-module" role="region" data-new-widget="private-value"><h3>Local discovery capsule</h3><button>Explore local topics</button></section><div role="article"><h4><a href="/PrivateFriend">PrivateFriend</a></h4><p>I wrote about Local discovery capsule and Commercial notice beta</p><button>Comment</button></div></main><span id="private-label-id">Commercial notice beta</span>`;
  const target = document.getElementById("ad");
  if (!target) throw new Error("Missing unknown-ad fixture");
  return target;
}

afterEach(() => document.body.replaceChildren());

test("the normal no-selection workflow captures an unknown disclosure and module without detector matches", async () => {
  const original = mountUnknownLayout();
  expect(isSponsored(original, { isNF: true })).toBe(false);
  const snapshot = await captureDomSnapshot(document);
  document.body.replaceChildren();
  const fixtures = snapshot.regions.map((region) => snapshotRegionHtml(snapshot, region));
  expect(fixtures.join("")).toContain("Commercial notice beta");
  expect(fixtures.join("").includes("Local discovery capsule")).toBe(false);
  expect(fixtures.join("")).toContain("data-new-widget");
  expect(fixtures.join("")).not.toMatch(
    /PrivateAuthor|PrivateFriend|PrivateCreative|secret-session/
  );
  const proposal = testSnapshotSelector(snapshot, "section[data-new-widget] > h3", document);
  expect(proposal.regions.reduce((count, region) => count + region.matches.length, 0)).toBe(1);
});

test("a report alone supports a new precise ad rule when the existing sponsored detector returns false", async () => {
  const original = mountUnknownLayout();
  expect(isSponsored(original, { isNF: true })).toBe(false);
  const snapshot = await captureDomSnapshot(document, { target: original });
  document.body.replaceChildren();
  const decisions = snapshot.regions.map((region) => {
    const fixture = new DOMParser().parseFromString(
      snapshotRegionHtml(snapshot, region),
      "text/html"
    );
    const post = fixture.querySelector(`[data-cmf-node="${region.ref}"]`);
    if (!post) throw new Error("Missing reconstructed regional root");
    const disclosure = post.querySelector("h4 a[href*='__cft__'] span[aria-labelledby]");
    const label = disclosure?.getAttribute("aria-labelledby");
    const name = label ? fixture.getElementById(label)?.textContent : "";
    const link = disclosure?.closest("a");
    const signature = link
      ? new URL(link.getAttribute("href") || "", "https://www.facebook.com/").searchParams.get(
          "__cft__[0]"
        )
      : "";
    return name === "Commercial notice beta" && (signature?.length || 0) >= 301;
  });
  expect(decisions[0]).toBe(true);
  expect(decisions.slice(1).every((matches) => !matches)).toBe(true);
  expect(JSON.stringify(snapshot)).not.toMatch(
    /PrivateAuthor|PrivateFriend|PrivateCreative|secret-session|private-label-id/
  );
});

test("an unfamiliar module can be selected from the exported snapshot without matching authored mentions", async () => {
  mountUnknownLayout();
  const snapshot = await captureDomSnapshot(document, {
    target: document.getElementById("new-module"),
  });
  document.body.replaceChildren();
  const result = testSnapshotSelector(snapshot, "section[data-new-widget] > h3", document);
  expect(result.error).toBeNull();
  expect(result.regions[0]?.matches).toHaveLength(1);
  expect(result.regions.slice(1).every((region) => region.matches.length === 0)).toBe(true);
});

test("offline query diagnostics distinguish invalid syntax and nonportable aliases from source selectors", async () => {
  const target = mountUnknownLayout();
  const snapshot = await captureDomSnapshot(document, { target });
  expect(testSnapshotSelector(snapshot, "[", document).error).toBe("invalid-selector");
  expect(testSnapshotSelector(snapshot, "#cmf-id-1", document).warnings).toContain(
    "identifiers-and-classes-are-report-local"
  );
  expect(testSnapshotSelector(snapshot, "[data-cmf-cft-length]", document).warnings).toContain(
    "diagnostic-attributes-do-not-exist-on-facebook"
  );
});

test("exported fixtures contain escaped interface copy and no active source scripts, handlers or media requests", async () => {
  const target = mountUnknownLayout();
  target.insertAdjacentHTML(
    "beforeend",
    '<button onclick="PrivateHandler()" style="background:url(https://private.example/secret)"><span>&lt;img src=x onerror=PrivatePayload()&gt;</span></button><script>PrivateScript()</script><img src="https://private.example/PrivateImage">'
  );
  const snapshot = await captureDomSnapshot(document, { target });
  const region = snapshot.regions[0];
  if (!region) throw new Error("Missing snapshot region");
  const html = snapshotRegionHtml(snapshot, region);
  const fixture = new DOMParser().parseFromString(html, "text/html");
  expect(
    fixture.querySelector("script, [onclick], [onerror], img[src], iframe[srcdoc]")
  ).toBeNull();
  expect(html).not.toMatch(/PrivateHandler|PrivateScript|private\.example|PrivateImage/);
  expect(fixture.querySelector('meta[http-equiv="Content-Security-Policy"]')).not.toBeNull();
});
