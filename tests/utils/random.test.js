const { generateRandomString } = require("../../src/utils/random");

describe("utils/random", () => {
  afterEach(() => {
    if (Math.random.mockRestore) {
      Math.random.mockRestore();
    }
  });

  test("generateRandomString uses expected length and characters", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);

    expect(generateRandomString(4)).toBe("AAAA");
  });
});
