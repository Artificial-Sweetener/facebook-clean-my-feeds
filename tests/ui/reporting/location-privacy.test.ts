// SPDX-License-Identifier: GPL-3.0-only
import { buildBugReport } from "../../../src/diagnostics/bug-report";
import { hydrateOptions } from "../../../src/core/options/hydrate";
import { classifyRoute } from "../../../src/core/routing/routes";
import { createFeedState } from "../../../src/feeds/state";

/** Build a complete report at a real same-origin fixture URL, preserving production route classification. */
function reportAt(path: string) {
  window.history.replaceState({}, "", path);
  const settings = hydrateOptions();
  return buildBugReport({
    options: settings.options,
    filters: settings.filters,
    keyWords: settings.keyWords,
    pathInfo: {},
    state: {
      ...createFeedState(),
      ...classifyRoute(window.location.pathname, window.location.search, settings.options),
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
    },
  });
}

describe("diagnostic location privacy", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
    document.body.innerHTML = "";
  });

  test.each([
    { path: "/Private.Profile", safe: "/[profile]", secrets: ["Private.Profile"] },
    { path: "/100089887654321", safe: "/[profile]", secrets: ["100089887654321"] },
    { path: "/groups/SecretGroupName/", safe: "/groups/[group]/", secrets: ["SecretGroupName"] },
    {
      path: "/groups/123456789/posts/987654321",
      safe: "/groups/[group]/posts/[post]",
      secrets: ["123456789", "987654321"],
    },
    { path: "/reel/9988776655/", safe: "/reel/[reel]/", secrets: ["9988776655"] },
    {
      path: "/Private.Profile/posts/88776655?tracking=PrivateToken#PrivateFragment",
      safe: "/[profile]/posts/[post]",
      secrets: ["Private.Profile", "88776655", "PrivateToken", "PrivateFragment"],
    },
    {
      path: "/groups/My%20Private%20Group/posts/44556677",
      safe: "/groups/[group]/posts/[post]",
      secrets: ["My%20Private%20Group", "My Private Group", "44556677"],
    },
    {
      path: "/marketplace/item/76543210",
      safe: "/marketplace/item/[item]",
      secrets: ["76543210"],
    },
  ])("redacts dynamic identifiers from $path throughout report JSON", ({ path, safe, secrets }) => {
    const report = reportAt(path);
    expect(report.data.page.pathname).toBe(safe);
    expect(report.data.page.url).toBe(`${window.location.origin}${safe}`);
    expect(report.data.page.search).toBe("");
    for (const secret of secrets) expect(report.text).not.toContain(secret);
  });

  test.each(["/", "/home.php", "/groups/feed", "/groups/search", "/search/posts/", "/watch/"])(
    "retains static feed routing context for %s",
    (path) => {
      expect(reportAt(path).data.page.pathname).toBe(path);
    }
  );

  test("retains profile and watch route names while removing query-only identifiers", () => {
    const profile = reportAt("/profile.php?id=9876554433");
    expect(profile.data.page.pathname).toBe("/profile.php");
    expect(profile.text).not.toContain("9876554433");
    const video = reportAt("/watch/?v=1122334455");
    expect(video.data.page.pathname).toBe("/watch/");
    expect(video.text).not.toContain("1122334455");
  });
});
