// SPDX-License-Identifier: GPL-3.0-only
import { buildNewsDiscoveryDiagnostics } from "../../../src/diagnostics/collection";
import type { DiagnosticsState } from "../../../src/diagnostics/types";
import { postAtt } from "../../../src/dom/attributes";
import { getNewsPostDiscovery } from "../../../src/feeds/news-discovery";
import { isSponsored } from "../../../src/feeds/shared/sponsored";
import { createFeedState } from "../../../src/feeds/state";

/** Supply immutable news flags and private marker names so diagnostic writes would fail the test. */
function createDiagnosticsState(): DiagnosticsState {
  return Object.freeze({
    ...createFeedState(),
    isNF: true,
    hideAtt: "private-hide-marker",
    hideWithNoCaptionAtt: "private-caption-marker",
    cssHideEl: "private-hide-class",
    cssHideNumberOfShares: "private-shares-class",
  });
}

/** Mount only the navigation/main relationship required by production news discovery. */
function mountNews(content: string): void {
  document.body.innerHTML = `<div role="navigation"></div><div role="main">${content}</div>`;
}

/** Fail at fixture construction rather than silently testing a missing or incorrectly selected root. */
function requireElement(selector: string): HTMLElement {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Missing fixture element: ${selector}`);
  return element;
}

describe("news discovery role-only virtualized evidence", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    jest.restoreAllMocks();
  });

  test("explains ten containers, nine selected posts, and four role-only candidates without classifying them as ads", () => {
    mountNews(`
      <div data-virtualized="false" aria-posinset="1" ${postAtt}="private-reason" private-hide-marker>
        <span data-ad-rendering-role="profile_name"></span>
      </div>
      <div data-virtualized="true">
        <div aria-posinset="2" role="article"><span data-ad-rendering-role="creative_body"></span></div>
      </div>
      <div aria-posinset="3">
        <div data-virtualized=""><span data-ad-rendering-role="story_message"></span></div>
      </div>
      <div data-virtualized="false"><span data-ad-rendering-role="private-role"></span></div>
      ${Array.from({ length: 6 }, (_, index) => `<div data-virtualized="false"><div aria-posinset="${index + 4}">Ordinary content</div></div>`).join("")}
    `);
    const state = createDiagnosticsState();
    const beforeDom = document.body.innerHTML;
    const beforeDiscovery = getNewsPostDiscovery();
    const beforeDecisions = beforeDiscovery.posts.map((post) => isSponsored(post, state));
    const evidence = buildNewsDiscoveryDiagnostics(state);

    expect(evidence.runtime).toEqual({
      selectedQuery: 'div[role="main"] div[aria-posinset]',
      selectedCount: 9,
    });
    expect(evidence.virtualized).toMatchObject({
      containerCount: 10,
      containersWithAdsAboutLink: 0,
      containersWithAdRenderingRole: 4,
      containersWithAdRenderingRoleOnly: 4,
      adsAboutLinkCount: 0,
      orphanAdsAboutLinkCount: 0,
      orphanWithoutVirtualizedContainerCount: 0,
      orphanContainerCount: 0,
      orphanSamples: [],
    });
    expect(evidence.virtualized.adRenderingRoleOnlySamples).toHaveLength(4);
    expect(evidence.virtualized.adRenderingRoleOnlySamples).toMatchObject([
      {
        dataVirtualized: "false",
        isRuntimeSelectedRoot: true,
        runtimeRootDescendantCount: 0,
        runtimeRootAncestorCount: 0,
        ariaPosinsetDescendantCount: 0,
        roleArticleDescendantCount: 0,
        hasPostMarker: true,
        hasHideMarker: true,
      },
      {
        dataVirtualized: "true",
        isRuntimeSelectedRoot: false,
        runtimeRootDescendantCount: 1,
        runtimeRootAncestorCount: 0,
        ariaPosinsetDescendantCount: 1,
        roleArticleDescendantCount: 1,
        hasPostMarker: false,
        hasHideMarker: false,
      },
      {
        dataVirtualized: "",
        isRuntimeSelectedRoot: false,
        runtimeRootDescendantCount: 0,
        runtimeRootAncestorCount: 1,
      },
      {
        isRuntimeSelectedRoot: false,
        runtimeRootDescendantCount: 0,
        runtimeRootAncestorCount: 0,
      },
    ]);
    for (const sample of evidence.virtualized.adRenderingRoleOnlySamples) {
      expect(sample).toMatchObject({
        adsAboutLinkCount: 0,
        adRenderingRoleCount: 1,
        inViewport: false,
        sponsoredDiagnostics: { matchedBy: "none", adsAboutLinkCount: 0 },
      });
    }
    expect(beforeDecisions).toEqual(Array<boolean>(9).fill(false));
    expect(getNewsPostDiscovery()).toEqual(beforeDiscovery);
    expect(beforeDiscovery.posts.map((post) => isSponsored(post, state))).toEqual(beforeDecisions);
    expect(document.body.innerHTML).toBe(beforeDom);
  });

  test("bounds each sample list independently and prefers visible containers without truncating totals", () => {
    mountNews(`
      ${Array.from({ length: 12 }, (_, index) => `<div data-virtualized="false">${'<span data-ad-rendering-role="profile_name"></span>'.repeat(index + 1)}</div>`).join("")}
      <div data-virtualized="false"><a href="/ads/about/">Sponsored</a></div>
      <div data-virtualized="false"><a href="/ads/about/">Sponsored</a></div>
    `);
    const containers = document.querySelectorAll("[data-virtualized]");
    containers.forEach((container, index) => {
      jest
        .spyOn(container, "getBoundingClientRect")
        .mockReturnValue(new DOMRect(0, index === 7 || index === 8 ? 10 : -100, 20, 20));
    });
    const state = createDiagnosticsState();
    const defaults = buildNewsDiscoveryDiagnostics(state).virtualized;
    expect(defaults.containerCount).toBe(14);
    expect(defaults.containersWithAdRenderingRoleOnly).toBe(12);
    expect(
      defaults.adRenderingRoleOnlySamples.map((sample) => sample.adRenderingRoleCount)
    ).toEqual([8, 9, 1, 2, 3]);
    expect(defaults.adRenderingRoleOnlySamples.map((sample) => sample.inViewport)).toEqual([
      true,
      true,
      false,
      false,
      false,
    ]);
    const bounded = buildNewsDiscoveryDiagnostics(state, 1).virtualized;
    expect(bounded.adRenderingRoleOnlySamples).toHaveLength(1);
    expect(bounded.adRenderingRoleOnlySamples[0]?.adRenderingRoleCount).toBe(8);
    expect(bounded.orphanSamples).toHaveLength(1);
    expect(bounded.orphanContainerCount).toBe(2);
    const disabled = buildNewsDiscoveryDiagnostics(state, 0).virtualized;
    expect(disabled.adRenderingRoleOnlySamples).toEqual([]);
    expect(disabled.orphanSamples).toEqual([]);
    expect(disabled.containersWithAdRenderingRoleOnly).toBe(12);
  });

  test("excludes unknown attribute values and private content while preserving read-only detector evidence", () => {
    mountNews(`
      <div data-virtualized="private-virtualized" role="private-root-role" class="private-class"
           id="private-id" aria-label="Private Name" ${postAtt}="private-reason" private-hide-marker="private-hide-value">
        <div data-ad-rendering-role="private-ad-role">Private Person</div>
        <div aria-describedby="private-description"><span>
          <a href="https://www.facebook.com/private-path?__cft__[0]=private-token#private-fragment" title="private-title">Private label</a>
        </span></div>
      </div>
      <div data-virtualized="true" role="private-orphan-role"><a href="/ads/about/?private-query">Sponsored</a></div>
    `);
    const state = createDiagnosticsState();
    const beforeDom = document.body.innerHTML;
    const beforeState = JSON.stringify(state);
    const evidence = buildNewsDiscoveryDiagnostics(state);
    const serialized = JSON.stringify(evidence);
    expect(serialized).not.toMatch(/private-|Private /);
    expect(evidence.virtualized.adRenderingRoleOnlySamples[0]).toMatchObject({
      signature: { tag: "DIV", role: "other", classCount: 1 },
      dataVirtualized: "other",
      hasPostMarker: true,
      hasHideMarker: true,
      sponsoredDiagnostics: { matchedBy: "none", cftLinks: { selectedCount: 0 } },
    });
    expect(evidence.virtualized.orphanSamples[0]?.signature?.role).toBe("other");
    expect(document.body.innerHTML).toBe(beforeDom);
    expect(JSON.stringify(state)).toBe(beforeState);
  });

  test("counts multiple contained runtime roots without treating the container itself as its own ancestor", () => {
    mountNews(`
      <div data-virtualized="false" role="article" aria-posinset="1"><span data-ad-rendering-role="profile_name"></span></div>
      <div data-virtualized="false">
        <div aria-posinset="2"><span data-ad-rendering-role="profile_name"></span></div>
        <div role="article"><span data-ad-rendering-role="profile_name"></span></div>
      </div>
    `);
    const samples =
      buildNewsDiscoveryDiagnostics(createDiagnosticsState()).virtualized
        .adRenderingRoleOnlySamples;
    expect(samples[0]).toMatchObject({
      signature: { role: "article" },
      isRuntimeSelectedRoot: true,
      runtimeRootAncestorCount: 0,
      runtimeRootDescendantCount: 0,
    });
    expect(samples[1]).toMatchObject({
      signature: { role: "" },
      isRuntimeSelectedRoot: false,
      runtimeRootAncestorCount: 0,
      runtimeRootDescendantCount: 2,
    });
  });

  test("reports the sampled container's detector scope even when its selected child is sponsored", () => {
    mountNews(`<div data-virtualized="false"><div aria-posinset="1">
      <span><a href="/?__cft__[0]=${"A".repeat(320)}" aria-label="Sponsored">Sponsored</a></span>
      <span data-ad-rendering-role="profile_name"></span>
    </div></div>`);
    const state = createDiagnosticsState();
    const child = requireElement("[aria-posinset]");
    expect(isSponsored(child, state)).toBe(true);
    const sample = buildNewsDiscoveryDiagnostics(state).virtualized.adRenderingRoleOnlySamples[0];
    expect(sample).toMatchObject({
      isRuntimeSelectedRoot: false,
      runtimeRootDescendantCount: 1,
      sponsoredDiagnostics: { matchedBy: "none", cftLinks: { selectedCount: 0 } },
    });
    expect(isSponsored(child, state)).toBe(true);
  });

  test("rebuilds relationships, markers, and detector evidence when Facebook reuses the same DOM container", () => {
    mountNews(`<div data-virtualized="false" aria-posinset="1" ${postAtt}="private-reason" private-hide-marker>
      <span data-ad-rendering-role="profile_name"></span>
    </div>`);
    const state = createDiagnosticsState();
    const container = requireElement("[data-virtualized]");
    const first = buildNewsDiscoveryDiagnostics(state).virtualized.adRenderingRoleOnlySamples;
    expect(first[0]).toMatchObject({
      isRuntimeSelectedRoot: true,
      hasPostMarker: true,
      hasHideMarker: true,
      sponsoredDiagnostics: { rootAriaPosinset: true },
    });

    container.removeAttribute("aria-posinset");
    container.removeAttribute(postAtt);
    container.removeAttribute(state.hideAtt);
    container.innerHTML =
      '<div aria-posinset="2"><span data-ad-rendering-role="creative_body"></span></div>';
    const reusedDom = document.body.innerHTML;
    const second = buildNewsDiscoveryDiagnostics(state).virtualized.adRenderingRoleOnlySamples;
    expect(second).toHaveLength(1);
    expect(second[0]).toMatchObject({
      isRuntimeSelectedRoot: false,
      runtimeRootDescendantCount: 1,
      runtimeRootAncestorCount: 0,
      hasPostMarker: false,
      hasHideMarker: false,
      sponsoredDiagnostics: { rootAriaPosinset: false },
    });
    expect(first[0]?.isRuntimeSelectedRoot).toBe(true);
    expect(document.body.innerHTML).toBe(reusedDom);
    requireElement("[data-ad-rendering-role]").removeAttribute("data-ad-rendering-role");
    const third = buildNewsDiscoveryDiagnostics(state).virtualized;
    expect(third.containersWithAdRenderingRoleOnly).toBe(0);
    expect(third.adRenderingRoleOnlySamples).toEqual([]);
  });

  test("returns stable empty evidence without a news main root", () => {
    expect(buildNewsDiscoveryDiagnostics(createDiagnosticsState())).toEqual({
      runtime: { selectedQuery: "", selectedCount: 0 },
      virtualized: {
        containerCount: 0,
        containersWithAdsAboutLink: 0,
        containersWithAdRenderingRole: 0,
        containersWithAdRenderingRoleOnly: 0,
        adsAboutLinkCount: 0,
        orphanAdsAboutLinkCount: 0,
        orphanWithoutVirtualizedContainerCount: 0,
        orphanContainerCount: 0,
        orphanSamples: [],
        adRenderingRoleOnlySamples: [],
      },
    });
  });
});
