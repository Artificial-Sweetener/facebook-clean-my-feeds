// SPDX-License-Identifier: GPL-3.0-only

import { isSponsoredLabel } from "../../../src/core/filters/classifiers/sponsored";

describe("core/filters/classifiers/sponsored", () => {
  test("isSponsoredLabel returns false for invalid inputs", () => {
    expect(isSponsoredLabel(null, ["sponsored"])).toBe(false);
    expect(isSponsoredLabel("sponsored", "sponsored")).toBe(false);
  });

  test("isSponsoredLabel matches after trimming and lowercasing", () => {
    expect(isSponsoredLabel(" Sponsored ", ["sponsored"])).toBe(true);
  });
});
