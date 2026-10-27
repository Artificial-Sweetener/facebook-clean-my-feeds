// SPDX-License-Identifier: GPL-3.0-only

import { selectSnapshotRegions } from "../../../src/diagnostics/dom-selection";
import { SnapshotPrivacy } from "../../../src/diagnostics/dom-privacy";
import { snapshotLimits } from "../../../src/core/diagnostics/dom-snapshot";

/** Reproduce the report's visible feed surrounded by many fixed navigation controls. */
function mountCrowdedViewport(): void {
  document.body.innerHTML = `<nav role="navigation">${"<div><button>Menu</button></div>".repeat(16)}</nav><main role="main"><div>${Array.from({ length: 7 }, (_, index) => `<div aria-posinset="${index + 1}"><p>Private post</p></div>`).join("")}</div></main><aside role="complementary"><section><h3>Unknown module</h3><button>Dismiss</button></section></aside>`;
  jest.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (
    this: Element
  ) {
    const position = Number(this.getAttribute("aria-posinset"));
    const y = position ? (position - 3) * 300 : 0;
    return {
      x: 0,
      y,
      top: y,
      bottom: y + 240,
      left: 0,
      right: 100,
      width: 100,
      height: 240,
      /** Keep mock geometry out of serialized diagnostics; selection consumes only numeric fields. */
      toJSON: () => ({}),
    };
  });
}

afterEach(() => {
  document.body.replaceChildren();
  jest.restoreAllMocks();
});

test("feed neighbors survive a viewport full of navigation controls", async () => {
  mountCrowdedViewport();
  const selection = await selectSnapshotRegions(
    document,
    null,
    snapshotLimits,
    new SnapshotPrivacy()
  );
  const captured = selection.regions.map(({ element }) => element.getAttribute("aria-posinset"));
  expect(captured).toEqual(expect.arrayContaining(["2", "3", "4", "5", "6"]));
  expect(
    selection.regions.some(
      ({ element }) =>
        element.matches('[role="complementary"]') || element.closest('[role="complementary"]')
    )
  ).toBe(true);
});

test("navigation is captured as one coherent landmark rather than isolated buttons", async () => {
  mountCrowdedViewport();
  const selection = await selectSnapshotRegions(
    document,
    null,
    snapshotLimits,
    new SnapshotPrivacy()
  );
  const navigation = document.querySelector("nav");
  expect(
    selection.regions.filter(
      ({ element }) => element === navigation || navigation?.contains(element)
    )
  ).toHaveLength(1);
  expect(selection.regions.some(({ element }) => element === navigation)).toBe(true);
});

test("an explicitly targeted sidebar complaint remains first under tight budgets", async () => {
  mountCrowdedViewport();
  const target = document.querySelector("aside button");
  const selection = await selectSnapshotRegions(
    document,
    target,
    { ...snapshotLimits, regions: 2 },
    new SnapshotPrivacy()
  );
  expect(selection.regions[0]?.selection).toBe("target");
  expect(selection.regions[0]?.element.contains(target)).toBe(true);
  expect(selection.regions).toHaveLength(2);
  expect(selection.selectionComplete).toBe(false);
});
