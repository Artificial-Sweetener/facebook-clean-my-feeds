const { buildBugReport, getSupportUrl } = require("../../../src/ui/reporting/bug-report");
const { postAtt } = require("../../../src/dom/attributes");

describe("ui/reporting/bug-report", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    delete global.GM;
  });

  test("getSupportUrl falls back without GM", () => {
    expect(getSupportUrl()).toContain("github.com");
  });

  test("getSupportUrl reads GM support url when available", () => {
    global.GM = { info: { script: { supportURL: "https://example.com/support" } } };
    expect(getSupportUrl()).toBe("https://example.com/support");
  });

  test("buildBugReport returns error without context", () => {
    const report = buildBugReport(null);
    expect(report.data.error).toBe("No context available.");
    expect(report.text).toBe("");
  });

  test("buildBugReport redacts blocked options and filters", () => {
    const state = {
      isNF: false,
      isGF: false,
      isVF: false,
      isMF: false,
      isSF: false,
      isRF: false,
      isPP: false,
      hideAtt: "hide",
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
    const keyWords = { SOME_REASON: "Hidden" };
    const pathInfo = {};

    const hidden = document.createElement("div");
    hidden.setAttribute(postAtt, "Hidden");
    const hiddenContainer = document.createElement("div");
    hiddenContainer.setAttribute(state.hideAtt, "");
    document.body.append(hidden, hiddenContainer);

    const report = buildBugReport({ state, options, filters, keyWords, pathInfo });

    expect(report.data.options.NF_BLOCKED_TEXT).toBe("[redacted]");
    expect(report.data.filters.NF_BLOCKED_TEXT_LC).toBe("[redacted]");
    expect(report.data.blockedFilters.NF_BLOCKED_TEXT_LC.count).toBe(1);
    expect(report.data.hidden.reasonCounts.Hidden).toBe(1);
    expect(report.text).toContain('"generatedAt"');
  });
});
