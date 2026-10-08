// SPDX-License-Identifier: GPL-3.0-only
import { buildBugReport, getSupportUrl } from "../../../src/diagnostics/bug-report";
import type { BugReportContext, DiagnosticsState } from "../../../src/diagnostics/types";
import type { Options } from "../../../src/core/options/types";
import type { Filters } from "../../../src/core/filters/types";
import type { Keywords } from "../../../src/i18n";
import { translations } from "../../../src/i18n";
import { hydrateOptions, buildFilters } from "../../../src/core/options/hydrate";
import { createFeedState } from "../../../src/feeds/state";
import { postAtt } from "../../../src/dom/attributes";

/** Focus fixtures on their detector while supplying valid initialized shared contracts. */
interface ReportOverrides {
  state?: Partial<DiagnosticsState>;
  options?: Options;
  filters?: Partial<Filters>;
  keyWords?: Partial<Keywords>;
  pathInfo?: BugReportContext["pathInfo"];
}

/**
 * Build complete report inputs without coupling tests to mutable application or UI state.
 * @param overrides Fixture-specific evidence; unspecified news filters remain disabled.
 * @returns Initialized report inputs with independent option, filter, state, and keyword objects.
 */
function createReportContext(overrides: ReportOverrides = {}): BugReportContext {
  return {
    state: {
      ...createFeedState(),
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
      ...overrides.state,
    },
    options: {
      ...hydrateOptions().options,
      NF_SPONSORED: false,
      NF_SUGGESTIONS: false,
      NF_REELS_SHORT_VIDEOS: false,
      NF_SHORT_REEL_VIDEO: false,
      NF_META_AI: false,
      NF_META_AI_PROMPTS: false,
      NF_AI_INFO_POSTS: false,
      NF_PAID_PARTNERSHIP: false,
      NF_PEOPLE_YOU_MAY_KNOW: false,
      NF_FOLLOW: false,
      NF_PARTICIPATE: false,
      NF_SPONSORED_PAID: false,
      NF_EVENTS_YOU_MAY_LIKE: false,
      NF_STORIES: false,
      NF_ANIMATED_GIFS_POSTS: false,
      NF_BLOCKED_ENABLED: false,
      NF_LIKES_MAXIMUM: false,
      NF_SHARES: false,
      ...overrides.options,
    },
    filters: { ...buildFilters({}), ...overrides.filters },
    keyWords: { ...translations.en, ...overrides.keyWords },
    pathInfo: overrides.pathInfo ?? {},
  };
}

/** Minimal private React suggestion metadata used only to exercise read-only prompt detection. */
interface SuggestionMetadata {
  promptId: string;
  genAISessionID: string;
  suggestionKey: string;
}

/** Attach a representative React fiber while failing clearly if the fixture button is absent. */
function attachSuggestionFiber(
  button: Element | undefined,
  { promptId, genAISessionID, suggestionKey }: SuggestionMetadata
): void {
  if (!button) {
    throw new Error("Suggestion fixture requires a button");
  }
  const suggestionFiber = {
    key: suggestionKey,
    memoizedProps: {
      promptId,
      genAISessionID,
    },
    return: null,
  };
  Object.defineProperty(button, "__reactFiber$test", {
    configurable: true,
    value: {
      key: "button",
      memoizedProps: {},
      return: suggestionFiber,
    },
  });
}

describe("ui/reporting/bug-report", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    globalThis.GM = undefined;
  });

  test("getSupportUrl falls back without GM", () => {
    expect(getSupportUrl()).toContain("github.com");
  });

  test("getSupportUrl reads GM support url when available", () => {
    globalThis.GM = { info: { script: { supportURL: "https://example.com/support" } } };
    expect(getSupportUrl()).toBe("https://example.com/support");
  });

  test("buildBugReport returns error without context", () => {
    const report = buildBugReport(null);
    expect(report.data.error).toBe("No context available.");
    expect(report.text).toBe("");
  });

  test("buildBugReport redacts blocked options and filters", () => {
    globalThis.GM = {
      info: {
        script: {
          downloadURL:
            "https://raw.githubusercontent.com/Artificial-Sweetener/facebook-clean-my-feeds/refs/heads/fix/news-sponsored-role-article/fb-clean-my-feeds.user.js?cache=private",
        },
        scriptHandler: "Violentmonkey",
      },
    };
    const state = {
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
    };
    const options = {
      NF_BLOCKED_TEXT: "secret",
      MP_BLOCKED_TEXT_DESCRIPTION: "secret2",
    };
    const filters = {
      NF_BLOCKED_TEXT_LC: ["secret"],
      MP_BLOCKED_TEXT_DESCRIPTION_LC: ["secret2"],
    };
    const keyWords = { NF_FOLLOW: "Hidden" };
    const pathInfo = {};

    const hidden = document.createElement("div");
    hidden.setAttribute(postAtt, "Hidden");
    const hiddenContainer = document.createElement("div");
    hiddenContainer.setAttribute(state.hideAtt, "");
    const hiddenRow = document.createElement("div");
    hiddenRow.setAttribute(state.hideWithNoCaptionAtt, "");
    document.body.append(hidden, hiddenContainer, hiddenRow);

    const report = buildBugReport(
      createReportContext({ state, options, filters, keyWords, pathInfo })
    );

    expect(report.data.options.NF_BLOCKED_TEXT).toBe("[redacted]");
    expect(report.data.filters.NF_BLOCKED_TEXT_LC).toBe("[redacted]");
    expect(report.data.blockedFilters.NF_BLOCKED_TEXT_LC.count).toBe(1);
    expect(report.data.hidden.reasonCounts.Hidden).toBe(1);
    expect(report.data.hidden.hiddenElements.hiddenNoCaptionRows).toBe(1);
    expect(report.data.script.buildSource).toBe(
      "github:refs/heads/fix/news-sponsored-role-article"
    );
    expect(report.text).not.toContain("cache=private");
    expect(report.text).toContain('"generatedAt"');
  });

  test("buildBugReport includes NF_META_AI_PROMPTS sample matches", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div aria-posinset="1">
          <a href="/DemocraticSocialismNow">Democratic Socialism Now</a>
          <div class="prompt-row">
            <div class="prompt-strip">
              <div data-type="hscroll-child"><div role="button">Prompt 1</div></div>
              <div data-type="hscroll-child"><div role="button">Prompt 2</div></div>
            </div>
          </div>
        </div>
      </div>
    `;

    const buttons = document.querySelectorAll('[data-type="hscroll-child"] [role="button"]');
    attachSuggestionFiber(buttons[0], {
      promptId: "prompt-1",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-0",
    });
    attachSuggestionFiber(buttons[1], {
      promptId: "prompt-2",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-1",
    });

    const state = { isNF: true };
    const options = { NF_META_AI_PROMPTS: true };
    const report = buildBugReport(
      createReportContext({
        state,
        options,
        filters: {},
        keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
        pathInfo: {},
      })
    );

    expect(report.data.samples.summary.NF_META_AI_PROMPTS).toBe(1);
  });

  test("buildBugReport includes privacy-safe orphan virtualized diagnostics", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <h3 dir="auto">Feed</h3>
        <div>
          <div role="article">Ordinary post</div>
          <div data-virtualized="false">
            <a href="/ads/about/?entry_product=ad_preferences">Private Advertiser</a>
            <div data-ad-rendering-role="profile_name"></div>
            <div data-ad-rendering-role="creative_body"></div>
          </div>
          <div data-virtualized="false">
            <div data-ad-rendering-role="profile_name">Ordinary content</div>
          </div>
        </div>
      </div>
    `;

    const state = { isNF: true };
    const options = { NF_SPONSORED: true };

    const report = buildBugReport(
      createReportContext({
        state,
        options,
        filters: {},
        keyWords: { SPONSORED: "Sponsored" },
        pathInfo: {},
      })
    );

    expect(report.data.discovery.news.runtime).toEqual({
      selectedQuery: 'div[role="main"] div[role="article"]',
      selectedCount: 1,
    });
    expect(report.data.discovery.news.virtualized).toEqual(
      expect.objectContaining({
        containerCount: 2,
        containersWithAdsAboutLink: 1,
        containersWithAdRenderingRole: 2,
        containersWithAdRenderingRoleOnly: 1,
        adsAboutLinkCount: 1,
        orphanAdsAboutLinkCount: 1,
        orphanWithoutVirtualizedContainerCount: 0,
        orphanContainerCount: 1,
      })
    );
    expect(report.data.discovery.news.virtualized.orphanSamples[0]).toEqual(
      expect.objectContaining({
        dataVirtualized: "false",
        adsAboutLinkCount: 1,
        adRenderingRoleCount: 2,
        roleArticleDescendantCount: 0,
        ariaPosinsetDescendantCount: 0,
        hasPostMarker: false,
        hasHideMarker: false,
      })
    );
    expect(report.data.signals).toEqual(
      expect.objectContaining({ page: expect.any(Object), newsMain: expect.any(Object) })
    );
    expect(report.text).not.toContain("Private Advertiser");
  });

  test("buildBugReport includes NF_AI_INFO_POSTS sample matches", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div aria-posinset="1">
          <a href="/example">Example Page</a>
          <div role="button">AI info</div>
        </div>
      </div>
    `;

    const state = { isNF: true };
    const options = { NF_AI_INFO_POSTS: true };
    const report = buildBugReport(
      createReportContext({
        state,
        options,
        filters: {},
        keyWords: { NF_AI_INFO_POSTS: 'Posts labeled "AI info"' },
        pathInfo: {},
      })
    );

    expect(report.data.samples.summary.NF_AI_INFO_POSTS).toBe(1);
  });

  test("buildBugReport uses translated keywords when diagnosing reels collections", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div aria-posinset="1"><h3>Reels</h3><a href="/reel/?s=ifu_see_more">Reels</a></div>
      </div>
    `;
    const report = buildBugReport(
      createReportContext({
        state: {
          isNF: true,
          hideAtt: "hide",
          hideWithNoCaptionAtt: "hideNoCaption",
          cssHideEl: "hideBlock",
          cssHideNumberOfShares: "hideShares",
        },
        options: { NF_REELS_SHORT_VIDEOS: true },
        filters: {},
        keyWords: { NF_REELS_SHORT_VIDEOS: "Reels and short videos" },
        pathInfo: {},
      })
    );

    expect(report.data.samples.summary.NF_REELS_SHORT_VIDEOS).toBe(1);
  });

  test("buildBugReport uses translated keywords when diagnosing follow headers", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main">
        <div aria-posinset="1">
          <h4><a href="/example-page">Example Page</a><span role="button">Follow</span></h4>
        </div>
      </div>
    `;
    const report = buildBugReport(
      createReportContext({
        state: { isNF: true },
        options: { NF_FOLLOW: true },
        keyWords: { NF_FOLLOW: "Follow" },
      })
    );

    expect(report.data.samples.summary.NF_FOLLOW).toBe(1);
  });

  test("buildBugReport redacts raw and case-folded keywords from hydrated filters", () => {
    const privateKeywords = {
      NF_BLOCKED_TEXT: "Private News Phrase",
      GF_BLOCKED_TEXT: "Private Group Phrase",
      VF_BLOCKED_TEXT: "Private Video Phrase",
      MP_BLOCKED_TEXT: "Private Marketplace Price",
      MP_BLOCKED_TEXT_DESCRIPTION: "Private Marketplace Description",
      PP_BLOCKED_TEXT: "Private Profile Phrase",
    };
    const settings = hydrateOptions({
      ...privateKeywords,
      NF_BLOCKED_ENABLED: true,
      GF_BLOCKED_ENABLED: true,
      VF_BLOCKED_ENABLED: true,
      MP_BLOCKED_ENABLED: true,
      PP_BLOCKED_ENABLED: true,
    });
    const report = buildBugReport(
      createReportContext({
        options: settings.options,
        filters: settings.filters,
      })
    );

    for (const keyword of Object.values(privateKeywords)) {
      expect(report.text).not.toContain(keyword);
      expect(report.text).not.toContain(keyword.toLowerCase());
    }
    for (const key of Object.keys(privateKeywords)) {
      expect(report.data.filters[key]).toBe("[redacted]");
      expect(report.data.filters[`${key}_LC`]).toBe("[redacted]");
    }
    for (const summary of Object.values(report.data.blockedFilters)) {
      expect(summary.count).toBe(1);
      expect(summary.hashes).toEqual([expect.stringMatching(/^fnv1a:[a-f0-9]+$/)]);
      expect(summary.truncated).toBe(false);
    }
    expect(settings.filters).toEqual(buildFilters(settings.options));
  });
});
