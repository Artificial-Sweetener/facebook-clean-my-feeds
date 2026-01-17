const {
  findFirstMatch,
  findFirstMatchRegExp,
} = require("../../../src/core/filters/matching");

describe("core/filters/matching", () => {
  test("findFirstMatch returns the first included string", () => {
    expect(findFirstMatch("hello world", ["bye", "world"])).toBe("world");
  });

  test("findFirstMatch returns empty string when none match", () => {
    expect(findFirstMatch("hello world", ["bye", "later"])).toBe("");
  });

  test("findFirstMatchRegExp returns the first matching pattern", () => {
    expect(findFirstMatchRegExp("FOO1 bar", ["bar", "foo\\d"])).toBe("bar");
  });

  test("findFirstMatchRegExp is case-insensitive", () => {
    expect(findFirstMatchRegExp("FOO1 bar", ["foo\\d"])).toBe("foo\\d");
  });

  test("findFirstMatchRegExp returns empty string when none match", () => {
    expect(findFirstMatchRegExp("hello", ["foo\\d"])).toBe("");
  });
});
