const { getPathSegments, hasPathSegment } = require("../../src/utils/url");

describe("utils/url", () => {
  test("getPathSegments splits and filters pathnames", () => {
    expect(getPathSegments("/a/b/")).toEqual(["a", "b"]);
    expect(getPathSegments(null)).toEqual([]);
  });

  test("hasPathSegment validates segment and checks membership", () => {
    expect(hasPathSegment("/a/b", "b")).toBe(true);
    expect(hasPathSegment("/a/b", "")).toBe(false);
    expect(hasPathSegment(null, "b")).toBe(false);
  });
});
