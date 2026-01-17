const { getFullNumber, isAboveMaximumLikes } = require("../../../src/core/filters/classifiers/shares-likes");

describe("core/filters/classifiers/shares-likes", () => {
  test("getFullNumber parses K and M suffixes", () => {
    expect(getFullNumber("1K")).toBe(1000);
    expect(getFullNumber("1.2K")).toBe(1200);
    expect(getFullNumber("1,2K")).toBe(1200);
    expect(getFullNumber("2M")).toBe(2000000);
    expect(getFullNumber("2.5M")).toBe(2500000);
  });

  test("getFullNumber parses plain numbers and empty strings", () => {
    expect(getFullNumber("999")).toBe(999);
    expect(getFullNumber("")).toBe(0);
  });

  test("isAboveMaximumLikes compares normalized values", () => {
    expect(isAboveMaximumLikes(" 1.2K ", 1200)).toBe(true);
    expect(isAboveMaximumLikes("999", 1000)).toBe(false);
  });

  test("isAboveMaximumLikes returns false for invalid inputs", () => {
    expect(isAboveMaximumLikes(1000, 1000)).toBe(false);
    expect(isAboveMaximumLikes("1000", 0)).toBe(false);
  });
});
