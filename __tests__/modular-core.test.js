const { loadFunctions } = require("../tests/helpers/monolith-loader");
const { findFirstMatch, findFirstMatchRegExp } = require("../src/core/filters/matching");
const { getFullNumber } = require("../src/core/filters/classifiers/shares-likes");
const { cleanText } = require("../src/core/filters/text-normalize");
const { querySelectorAllNoChildren } = require("../src/utils/dom");

describe("modular core matches monolith behavior", () => {
  test("cleanText matches monolith normalization", () => {
    const { cleanText: monolithCleanText } = loadFunctions(["cleanText"]);
    const fullWidthA = String.fromCharCode(0xff21);

    expect(cleanText(fullWidthA)).toBe(monolithCleanText(fullWidthA));
  });

  test("findFirstMatch matches monolith behavior", () => {
    const { findFirstMatch: monolithFindFirstMatch } = loadFunctions(["findFirstMatch"]);
    const text = "alpha beta gamma";
    const matches = ["gamma", "beta"];

    expect(findFirstMatch(text, matches)).toBe(monolithFindFirstMatch(text, matches));
  });

  test("findFirstMatchRegExp matches monolith behavior", () => {
    const { findFirstMatchRegExp: monolithFindFirstMatchRegExp } =
      loadFunctions(["findFirstMatchRegExp"]);
    const text = "Hello FOO123 world";
    const patterns = ["foo\\d+"];

    expect(findFirstMatchRegExp(text, patterns)).toBe(
      monolithFindFirstMatchRegExp(text, patterns)
    );
  });

  test("getFullNumber matches monolith behavior", () => {
    const { getFullNumber: monolithGetFullNumber } = loadFunctions(["getFullNumber"]);

    expect(getFullNumber("1.4M")).toBe(monolithGetFullNumber("1.4M"));
    expect(getFullNumber("12K")).toBe(monolithGetFullNumber("12K"));
    expect(getFullNumber("312")).toBe(monolithGetFullNumber("312"));
  });

  test("querySelectorAllNoChildren matches monolith behavior", () => {
    const { querySelectorAllNoChildren: monolithQuerySelectorAllNoChildren } =
      loadFunctions(["querySelectorAllNoChildren"], { document });
    const root = document.createElement("div");
    root.innerHTML = '<div><span class="hit">Match</span><span><b>Skip</b></span></div>';

    const selector = ".hit";
    const monolithResult = monolithQuerySelectorAllNoChildren(root, selector, 1, false);
    const modularResult = querySelectorAllNoChildren(root, selector, 1, false);

    const modularText = modularResult.length > 0 ? modularResult[0].textContent : undefined;
    const monolithText = monolithResult.length > 0 ? monolithResult[0].textContent : undefined;

    expect(modularResult.length).toBe(monolithResult.length);
    expect(modularText).toBe(monolithText);
  });
});
