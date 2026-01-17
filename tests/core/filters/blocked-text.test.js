const { findBlockedText } = require("../../../src/core/filters/classifiers/blocked-text");

describe("core/filters/classifiers/blocked-text", () => {
  test("findBlockedText returns empty string for invalid patterns", () => {
    expect(findBlockedText("post text", null, false)).toBe("");
    expect(findBlockedText("post text", [], false)).toBe("");
  });

  test("findBlockedText returns the first plain-text match", () => {
    expect(findBlockedText("hello world", ["bye", "world"], false)).toBe("world");
  });

  test("findBlockedText supports RegExp matching", () => {
    expect(findBlockedText("hello world", ["world$"], true)).toBe("world$");
  });
});
