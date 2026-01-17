const { hasSizeChanged } = require("../../src/dom/dirty-check");

describe("dom/dirty-check", () => {
  test("hasSizeChanged returns true for missing or invalid values", () => {
    expect(hasSizeChanged(null, "10")).toBe(true);
    expect(hasSizeChanged("10", "abc")).toBe(true);
    expect(hasSizeChanged("abc", "10")).toBe(true);
  });

  test("hasSizeChanged respects tolerance", () => {
    expect(hasSizeChanged("100", "110")).toBe(false);
    expect(hasSizeChanged("100", "200")).toBe(true);
  });
});
