// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { captureTransitionSnapshot } from "../../../src/diagnostics/transition-snapshot";
import { snapshotRegionHtml } from "../../../src/diagnostics/dom-fixture";
import { isSponsored } from "../../../src/feeds/shared/sponsored";
import { clearDirtyTracking } from "../../../src/dom/dirty-check";
import { mountSvgDisclosure } from "../../feeds/svg-disclosure-fixtures";
import { requireElement } from "../../feeds/news-fixtures";
import type { DomSnapshot, SnapshotNode } from "../../../src/core/diagnostics/dom-snapshot";

afterEach(() => {
  document.body.replaceChildren();
  clearDirtyTracking();
});

/** Extract retained text without relying on element IDs or aliased classes surviving reconstruction. */
function retainedText(snapshot: DomSnapshot): string {
  const values: string[] = [];
  const queue: SnapshotNode[] = [
    ...snapshot.regions.map((region) => region.root),
    ...snapshot.references.flatMap((reference) => (reference.target ? [reference.target] : [])),
  ];
  while (queue.length) {
    const node = queue.pop();
    if (node?.kind === "element") queue.push(...node.children);
    if (node?.kind === "text" && node.content === "interface") values.unshift(node.value);
  }
  return values.join("");
}

/** Reproduce the supplied report's separate name/metadata bands and fragmented link; original redacted words are unrecoverable. */
function mountFragmentedHeader(label: string): Element {
  const letters = Array.from(label, (letter) => `<span>${letter}</span>`).join("");
  document.body.innerHTML = `<main role="main"><div aria-posinset="1">${"<div>".repeat(10)}<div><div><div data-ad-rendering-role="profile_name"><a href="/profile.php?id=PrivateId">Private Author</a></div></div><div><span><a id="metadata" href="/?__cft__[0]=private-tracking"><span>${letters}</span></a></span><span> · </span></div></div><div data-ad-rendering-role="story_message"><p>Private authored post</p><button>Private body action</button></div>${"</div>".repeat(10)}</div></main>`;
  return requireElement(document.querySelector("[aria-posinset]"));
}

test.each([
  "Commercial placement alpha",
  "Nouvelle annonce",
  "未分類の広告枠",
  "إعلان تجريبي جديد",
])("unrecognized fragmented header copy survives independent capture: %s", async (label) => {
  const post = mountFragmentedHeader(label);
  expect(isSponsored(post, { isNF: true })).toBe(false);
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(retainedText(snapshot)).toContain(label);
  expect(
    /Private Author|Private authored|Private body action|PrivateId|private-tracking/.test(
      JSON.stringify(snapshot)
    )
  ).toBe(false);
  const region = snapshot.regions[0];
  if (!region) throw new Error("Missing metadata fixture");
  const fixture = new DOMParser().parseFromString(
    snapshotRegionHtml(snapshot, region),
    "text/html"
  );
  const metadata = requireElement(fixture.querySelector('a[href^="/?"]'));
  expect(metadata.textContent).toBe(label);
  expect(metadata.querySelectorAll("span > span").length).toBe(Array.from(label).length);
});

test("bounded transition frames apply the same provenance rules as the full report", () => {
  const post = mountFragmentedHeader("Previously unknown placement");
  const snapshot = captureTransitionSnapshot(post, Infinity);
  expect(retainedText(snapshot)).toContain("Previously unknown placement");
  expect(JSON.stringify(snapshot)).not.toContain("Private Author");
});

test("dense metadata fragmentation is not mistaken for an oversized identity or silently stripped", async () => {
  const label = "Previously unknown placement ".repeat(5);
  const post = mountFragmentedHeader(label);
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(retainedText(snapshot)).toContain(label.trim());
  expect(JSON.stringify(snapshot)).not.toContain("Private Author");
});

test("an unfamiliar header action survives while actual identity controls and conflicting private titles remain redacted", async () => {
  const post = mountFragmentedHeader("New placement");
  const profile = requireElement(post.querySelector('[data-ad-rendering-role="profile_name"]'));
  profile.insertAdjacentHTML(
    "beforeend",
    '<button title="Unobserved Private Title">Inspect new module</button><button data-userid="PrivateId">Private Recipient</button>'
  );
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(retainedText(snapshot)).toContain("Inspect new module");
  expect(
    /Private Recipient|Unobserved Private Title|PrivateId/.test(JSON.stringify(snapshot))
  ).toBe(false);
});

test("names and contact details split across public metadata fragments cannot be reconstructed", async () => {
  const post = mountFragmentedHeader(
    "Sponsored by Private Author via personal@example.test or +1 555 123 4567"
  );
  const snapshot = await captureDomSnapshot(document, { target: post });
  const text = retainedText(snapshot);
  expect(text).not.toContain("Private Author");
  expect(text).not.toContain("personal@example.test");
  expect(text).not.toContain("555 123 4567");
  expect(text).toContain("[redacted interface fragment]");
});

test.each(["Commercial placement alpha", "9 minutes ago", "新規広告枠"])(
  "a structural metadata SVG preserves unfamiliar copy without a sponsorship match: %s",
  async (label) => {
    const post = mountSvgDisclosure(label);
    expect(isSponsored(post, { isNF: true })).toBe(false);
    const snapshot = await captureDomSnapshot(document, { target: post });
    expect(retainedText(snapshot)).toContain(label);
    expect(JSON.stringify(snapshot)).not.toContain("Example Publisher");
  }
);

test("authored, nested-post and unnamed-body controls cannot borrow the outer header's provenance", async () => {
  const post = mountFragmentedHeader("New placement");
  const body = requireElement(post.querySelector('[data-ad-rendering-role="story_message"]'));
  body.innerHTML =
    '<h4><a href="/PrivatePerson">Private Sender</a><button>Private authored action</button></h4><div role="article"><button>Private nested action</button></div>';
  body.insertAdjacentHTML(
    "afterend",
    "<div><span>Private unannotated body</span><button>Private unannotated action</button></div>"
  );
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(
    /Private Sender|Private authored action|Private nested action|Private unannotated/.test(
      JSON.stringify(snapshot)
    )
  ).toBe(false);
  expect(retainedText(snapshot)).toContain("New placement");
});

test("explicitly private ARIA targets remain private even when referenced by metadata controls", async () => {
  const post = mountFragmentedHeader("New placement");
  requireElement(post.querySelector("#metadata")).setAttribute("aria-labelledby", "person");
  document.body.insertAdjacentHTML(
    "beforeend",
    '<span id="person" data-userid="PrivateId">Private Referenced Person</span>'
  );
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(JSON.stringify(snapshot)).not.toContain("Private Referenced Person");
});
