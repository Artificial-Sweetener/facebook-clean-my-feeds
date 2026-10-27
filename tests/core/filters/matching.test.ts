// SPDX-License-Identifier: GPL-3.0-only

import { findFirstMatch, findFirstMatchRegExp } from "../../../src/core/filters/matching";

describe("core/filters/matching", () => {
  test("findFirstMatch preserves exact array token matches for Marketplace", () => {
    expect(findFirstMatch(["$10", "$100"], ["$1", "$10"])).toBe("$10");
    expect(findFirstMatch(["$10"], ["$1"])).toBe("");
  });
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

  test("regex price tokens preserve pattern priority and independent anchors", () => {
    expect(findFirstMatchRegExp(["$100", "$50"], ["^\\$50$", "^\\$100$"])).toBe("^\\$50$");
    expect(findFirstMatchRegExp(["$500", "$100"], ["^\\$50$"])).toBe("");
    expect(findFirstMatchRegExp([], [".*"])).toBe("");
  });

  test("findFirstMatchRegExp returns empty string when none match", () => {
    expect(findFirstMatchRegExp("hello", ["foo\\d"])).toBe("");
  });
});
