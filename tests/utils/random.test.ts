// SPDX-License-Identifier: GPL-3.0-only
import { generateRandomString } from "../../src/utils/random";

describe("utils/random", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("generateRandomString uses expected length and characters", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    expect(generateRandomString(4)).toBe("AAAA");
  });
});
