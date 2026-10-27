// SPDX-License-Identifier: GPL-3.0-only

import { createDomState } from "../../src/dom/types";
jest.mock("../../src/utils/random", () => ({
  generateRandomString: jest.fn(() => "token"),
}));

import { initializeRuntimeAttributes } from "../../src/dom/attributes";

describe("dom/attributes", () => {
  test("initializeRuntimeAttributes does nothing with empty state", () => {
    expect(() => initializeRuntimeAttributes(null)).not.toThrow();
  });

  test("initializeRuntimeAttributes assigns runtime attributes", () => {
    const state = createDomState();

    initializeRuntimeAttributes(state);

    expect(state.hideAtt).toBe("token");
    expect(state.hideWithNoCaptionAtt).toBe("token");
    expect(state.showAtt).toBe("token");
    expect(state.cssHideEl).toBe("token");
    expect(state.cssHideNumberOfShares).toBe("token");
    expect(state.cssHideVerifiedBadge).toBe("token");
  });
});
