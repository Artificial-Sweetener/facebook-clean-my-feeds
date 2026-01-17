const { buildDictionaries, normaliseToLower } = require("../../../src/ui/i18n/dictionaries");

describe("ui/i18n/dictionaries", () => {
  test("normaliseToLower handles falsy and normal values", () => {
    expect(normaliseToLower("TEST")).toBe("test");
    expect(normaliseToLower("")).toBe("");
    expect(normaliseToLower(null)).toBe("");
  });

  test("normaliseToLower falls back when normalize throws", () => {
    const original = String.prototype.normalize;
    String.prototype.normalize = () => {
      throw new Error("fail");
    };
    expect(normaliseToLower("Test")).toBe("test");
    String.prototype.normalize = original;
  });

  test("buildDictionaries returns populated arrays", () => {
    const dictionaries = buildDictionaries();
    expect(dictionaries.dictionarySponsored.length).toBeGreaterThan(0);
    expect(dictionaries.dictionaryFollow.length).toBeGreaterThan(0);
    expect(Array.isArray(dictionaries.dictionaryReelsAndShortVideos)).toBe(true);
  });
});
