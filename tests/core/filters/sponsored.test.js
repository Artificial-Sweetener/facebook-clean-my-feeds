const { isSponsoredLabel } = require("../../../src/core/filters/classifiers/sponsored");

describe("core/filters/classifiers/sponsored", () => {
  test("isSponsoredLabel returns false for invalid inputs", () => {
    expect(isSponsoredLabel(null, ["sponsored"])).toBe(false);
    expect(isSponsoredLabel("sponsored", "sponsored")).toBe(false);
  });

  test("isSponsoredLabel matches after trimming and lowercasing", () => {
    expect(isSponsoredLabel(" Sponsored ", ["sponsored"])).toBe(true);
  });
});
