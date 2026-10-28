// SPDX-License-Identifier: GPL-3.0-only

import { captureDomSnapshot } from "../../../src/diagnostics/dom-capture";
import { snapshotRegionHtml } from "../../../src/diagnostics/dom-fixture";
import { SnapshotPrivacy } from "../../../src/diagnostics/dom-privacy";
import { clearDirtyTracking } from "../../../src/dom/dirty-check";
import { isSponsored } from "../../../src/feeds/shared/sponsored";
import { mountSvgDisclosure } from "../../feeds/svg-disclosure-fixtures";
import { requireElement } from "../../feeds/news-fixtures";

afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
});

test.each(["Ad", "Sponsored", "贊助", "Publicidad"])(
  "a pasted snapshot preserves public SVG label %s and its aliased graph",
  async (label) => {
    const post = mountSvgDisclosure(label);
    const snapshot = await captureDomSnapshot(document, { target: post });
    const text = JSON.stringify(snapshot);
    expect(text).toContain(`"value":"${label}"`);
    expect(text).not.toContain("Example Publisher");
    expect(text).not.toContain("Private authored post");
    expect(text).not.toContain("glyph-7");
    expect(
      snapshot.references.some(
        (reference) => reference.target?.tag === "text" && reference.target.content === "interface"
      )
    ).toBe(true);
    const region = snapshot.regions[0];
    if (!region) throw new Error("Missing complaint region");
    const fixture = snapshotRegionHtml(snapshot, region);
    clearDirtyTracking();
    document.body.innerHTML = fixture;
    const reconstructed = requireElement(document.querySelector('[aria-posinset="1"]'));
    expect(isSponsored(reconstructed, { isNF: true })).toBe(true);
  }
);

test.each([
  "Private User Name",
  "9 minutes ago",
  "alice@example.test",
  "Sponsored by Private User",
])("unproven SVG copy stays redacted: %s", async (label) => {
  const post = mountSvgDisclosure(label);
  const snapshot = await captureDomSnapshot(document, { target: post });
  expect(JSON.stringify(snapshot)).not.toContain(`"value":"${label}"`);
  expect(snapshot.references.some((reference) => reference.target?.content === "interface")).toBe(
    false
  );
});

test("authored SVGs and hidden reference branches do not gain public provenance", async () => {
  const post = mountSvgDisclosure("Sponsored");
  const secret = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  secret.style.display = "none";
  secret.textContent = "Private Hidden Name";
  requireElement(document.getElementById("glyph-7")).append(secret);
  let snapshot = await captureDomSnapshot(document, { target: post });
  expect(JSON.stringify(snapshot)).toContain('"value":"Sponsored"');
  expect(JSON.stringify(snapshot)).not.toContain("Private Hidden Name");
  requireElement(document.getElementById("message")).append(
    requireElement(document.getElementById("disclosure"))
  );
  snapshot = await captureDomSnapshot(document, { target: post });
  expect(JSON.stringify(snapshot)).not.toContain('"value":"Sponsored"');
});

test("a changing SVG label cannot reuse public provenance during capture", async () => {
  const post = mountSvgDisclosure();
  const remember = SnapshotPrivacy.prototype.rememberSvgDisclosure;
  const spy = jest
    .spyOn(SnapshotPrivacy.prototype, "rememberSvgDisclosure")
    .mockImplementation(function (this: SnapshotPrivacy, element: Element): void {
      remember.call(this, element);
      if (element.id === "disclosure")
        requireElement(document.getElementById("glyph-7")).textContent = "Private Changed Name";
    });
  try {
    const snapshot = await captureDomSnapshot(document, { target: post });
    expect(JSON.stringify(snapshot)).not.toContain("Private Changed Name");
  } finally {
    spy.mockRestore();
  }
});
