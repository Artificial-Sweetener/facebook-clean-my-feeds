// SPDX-License-Identifier: GPL-3.0-only

import { findBlockedText } from "../../src/core/filters/classifiers/blocked-text";
import { isReelLink, isReelsAndShortVideosLink } from "../../src/core/filters/classifiers/reels";
import {
  getFullNumber,
  isAboveMaximumLikes,
} from "../../src/core/filters/classifiers/shares-likes";
import { isSponsoredLabel } from "../../src/core/filters/classifiers/sponsored";
import { findFirstMatch, findFirstMatchRegExp } from "../../src/core/filters/matching";
import { cleanText } from "../../src/core/filters/text-normalize";
import { translations } from "../../src/i18n";

const sponsoredLabels = Object.entries(translations).flatMap(([locale, catalog]) =>
  [catalog.SPONSORED, catalog.SPONSORED_EXTRA]
    .filter((label): label is string => label !== undefined)
    .map((label) => ({ locale, label }))
);

describe("validation: pure filter contracts", () => {
  test.each(sponsoredLabels)("exact sponsored dictionary for $locale: $label", ({ label }) => {
    const dictionary = [label.toLowerCase()];
    expect(isSponsoredLabel(label, dictionary)).toBe(true);
    expect(isSponsoredLabel(` \t${label}\n\u00a0`, dictionary)).toBe(true);
    expect(isSponsoredLabel(`${label} extra`, dictionary)).toBe(false);
    expect(isSponsoredLabel(`prefix ${label}`, dictionary)).toBe(false);
    expect(isSponsoredLabel(`${label}\u200b`, dictionary)).toBe(false);
    expect(isSponsoredLabel(`\u200f${label}`, dictionary)).toBe(false);
  });

  test("sponsored dictionaries are supplied lowercase and are not normalized internally", () => {
    expect(sponsoredLabels).toHaveLength(24);
    expect(isSponsoredLabel("SPONSORED", ["sponsored"])).toBe(true);
    expect(isSponsoredLabel("Sponsored", ["Sponsored"])).toBe(false);
    expect(isSponsoredLabel("Ｓｐｏｎｓｏｒｅｄ", ["sponsored"])).toBe(false);
    expect(isSponsoredLabel("Sponsorise\u0301", ["sponsorisé"])).toBe(false);
    expect(isSponsoredLabel("ممول", ["مُموَّل"])).toBe(false);
    expect(isSponsoredLabel("not sponsored", ["sponsored"])).toBe(false);
  });

  test.each([null, undefined, false, 12, {}, [], ""])(
    "malformed sponsored input %p is safely rejected",
    (value) => expect(isSponsoredLabel(value, ["sponsored"])).toBe(false)
  );

  test.each([null, undefined, false, {}, "sponsored"])(
    "malformed sponsored dictionary %p is safely rejected",
    (dictionary) => expect(isSponsoredLabel("Sponsored", dictionary)).toBe(false)
  );

  test.each([
    ["ＦＡＣＥＢＯＯＫ", "FACEBOOK"],
    ["ﬁle ① Ⅳ", "file 1 IV"],
    ["cafe\u0301", "café"],
    ["\u00a0hello\u00a0", " hello "],
    ["مُموَّل ממומן", "مُموَّل ממומן"],
    ["A\u200bB\u200fC", "A\u200bB\u200fC"],
    ["  Mixed\nCASE  ", "  Mixed\nCASE  "],
    ["", ""],
  ])("NFKC normalization preserves its documented boundary: %p", (input, expected) => {
    expect(cleanText(input)).toBe(expected);
    expect(cleanText(cleanText(input))).toBe(expected);
  });

  test("plain matching is a case-sensitive substring search ordered by configuration", () => {
    expect(findFirstMatch("catfish CAT then dog", ["dog", "cat"])).toBe("dog");
    expect(findFirstMatch("catfish", ["cat"])).toBe("cat");
    expect(findFirstMatch("CAT", ["cat"])).toBe("");
    expect(findFirstMatch("cafe\u0301", ["café"])).toBe("");
    expect(findFirstMatch("a\u200bb", ["ab"])).toBe("");
    expect(findFirstMatch("anything", ["", "thing"])).toBe("");
  });

  test("array matching retains exact token, case, priority, and punctuation semantics", () => {
    const tokens = ["$100", "CAT", "one two", "مُموَّل"];
    expect(findFirstMatch(tokens, ["$10", "cat", "one"])).toBe("");
    expect(findFirstMatch(tokens, ["مُموَّل", "$100"])).toBe("مُموَّل");
    expect(findFirstMatch(tokens, ["one two"])).toBe("one two");
  });

  test.each([
    ["CAT", "^cat$", true],
    ["catfish", "\\bcat\\b", false],
    ["cat fish", "\\bcat\\b", true],
    ["abc", "^\\D+$", true],
    ["123", "^\\D+$", false],
    [" a ", "\\S", true],
    ["!!!", "^\\W+$", true],
    ["first\nsecond", "^second", false],
    ["first\nsecond", "first.second", false],
    ["مُموَّل", "مُموَّل", true],
    ["café", "cafe", false],
  ])("regex contract for %p and %p", (input, pattern, matches) => {
    expect(findFirstMatchRegExp(input, [pattern])).toBe(matches ? pattern : "");
    expect(findBlockedText(input, [pattern], true)).toBe(matches ? pattern : "");
  });

  test("regex syntax errors surface only when the invalid pattern is reached", () => {
    expect(() => findFirstMatchRegExp("body", ["["])).toThrow(SyntaxError);
    expect(() => findBlockedText("body", ["no match", "("], true)).toThrow(SyntaxError);
    expect(findFirstMatchRegExp("body", ["body", "["])).toBe("body");
    expect(findBlockedText("a[b", ["["], false)).toBe("[");
    expect(findBlockedText("body", undefined, true)).toBe("");
    expect(findBlockedText("body", null, true)).toBe("");
    expect(findBlockedText("body", [], true)).toBe("");
    expect(findBlockedText("Body", ["body"], undefined)).toBe("");
  });

  test.each([
    ["", 0],
    ["0", 0],
    ["999", 999],
    ["1k", 1000],
    ["1.25K", 1250],
    ["1,25K", 1250],
    ["2m", 2000000],
    ["2.001M", 2001000],
    ["1.000001M", 1000001],
    ["9007199254740991", Number.MAX_SAFE_INTEGER],
  ])("documented numeric rendering %p expands to %p", (input, expected) => {
    expect(getFullNumber(input)).toBe(expected);
  });

  test.each([
    ["1,234", 1234],
    ["12,345,678", 12345678],
    ["123,456", 123456],
    ["1.234", 1234],
    ["12.345.678", 12345678],
    ["1\u00a0234", 1234],
    ["12\u00a0345\u00a0678", 12345678],
    ["1\u202f234", 1234],
    ["12\u202f345\u202f678", 12345678],
    ["9,007,199,254,740,991", Number.MAX_SAFE_INTEGER],
  ])("complete consistently grouped integer count %p expands to %p", (input, expected) => {
    expect(getFullNumber(input)).toBe(expected);
    expect(isAboveMaximumLikes(input, expected)).toBe(true);
    expect(isAboveMaximumLikes(input, expected + 1)).toBe(false);
  });

  test.each([
    ["1,23", 1],
    ["12,34,567", 12],
    ["1,234.567", 1],
    ["1.234,567", 1],
    ["1234,567", 1234],
    ["0,123", 0],
    ["01,234", 1],
    ["-1,234", -1],
    ["1 234", 1],
    ["1\u00a0234\u202f567", 1],
    ["1,234 likes", 1],
    ["1,234\n", 1],
  ])(
    "unsupported grouping %p retains legacy parsing without separator guessing",
    (input, expected) => {
      expect(getFullNumber(input)).toBe(expected);
    }
  );

  test("grouped counts are trimmed at the threshold boundary and K/M decimals keep their scale", () => {
    expect(isAboveMaximumLikes(" \t1,234\n", 1234)).toBe(true);
    expect(getFullNumber("1,234K")).toBe(1234);
    expect(getFullNumber("1.234K")).toBe(1234);
    expect(getFullNumber("1,234M")).toBe(1234000);
    expect(getFullNumber("1.234M")).toBe(1234000);
    expect(getFullNumber("1,2K")).toBe(1200);
    expect(getFullNumber("1.2M")).toBe(1200000);
  });

  test.each(["Likes", "K", "1.K", "١٢", "１２", "NaN"])(
    "unsupported or malformed count %p does not cross a positive limit",
    (input) => {
      expect(getFullNumber(input)).toBeNaN();
      expect(isAboveMaximumLikes(input, 1)).toBe(false);
    }
  );

  test("like threshold is inclusive, whitespace tolerant, and explicitly disabled at zero", () => {
    expect(isAboveMaximumLikes(" 1.25K ", 1250)).toBe(true);
    expect(isAboveMaximumLikes("1.249K", 1250)).toBe(false);
    expect(isAboveMaximumLikes("1000000000", 1000000000)).toBe(true);
    expect(isAboveMaximumLikes("1000", undefined)).toBe(false);
    expect(isAboveMaximumLikes("1000", 0)).toBe(false);
    expect(isAboveMaximumLikes("", 1)).toBe(false);
    for (const input of [null, undefined, 1000, {}, false]) {
      expect(isAboveMaximumLikes(input, 1)).toBe(false);
    }
  });

  test.each([
    ["/reel/123", true, false],
    ["https://www.facebook.com/reel/123", true, false],
    ["/reel/?s=ifu_see_more", true, true],
    ["/reel/?s=ifu_see_more&extra=1", true, false],
    ["/other?next=/reel/123", true, false],
    ["/REEL/123", false, false],
    ["/reels/123", false, false],
    ["/reel", false, false],
    [null, false, false],
    [12, false, false],
    [{ href: "/reel/123" }, false, false],
  ])("reel substring versus exact shelf link %p", (href, reel, shelf) => {
    expect(isReelLink(href)).toBe(reel);
    expect(isReelsAndShortVideosLink(href)).toBe(shelf);
  });
});
