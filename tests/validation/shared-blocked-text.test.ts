// SPDX-License-Identifier: GPL-3.0-only

import type { Filters } from "../../src/core/filters/types";
import { hydrateOptions } from "../../src/core/options/hydrate";
import type { HydratedOptions } from "../../src/core/options/types";
import { postAtt } from "../../src/dom/attributes";
import { getGroupsBlocksQuery, getNewsBlocksQuery } from "../../src/feeds/shared/blocks";
import {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
} from "../../src/feeds/shared/blocked-text";
import { requireShared, sharedContentPost, sharedImage } from "./shared-fixtures";

/** Each adapter supplies the same hydrated settings while preserving the actual route-owned helper. */
const textRoutes: {
  name: string;
  maxBlocks: number;
  match: (post: Element, options: HydratedOptions, filters: Filters) => string;
}[] = [
  { name: "news", maxBlocks: 3, match: findNewsBlockedText },
  { name: "groups", maxBlocks: 3, match: findGroupsBlockedText },
  { name: "profile", maxBlocks: 3, match: findProfileBlockedText },
  {
    name: "videos",
    maxBlocks: 1,
    /** Supply the video route's independently tagged content blocks without replacing extraction. */
    match: (post, options, filters) =>
      findVideosBlockedText(post, options, filters, ".validation-block"),
  },
];

/** Hydrate every scoped list identically so tests isolate extraction and matching rather than inheritance. */
function textSettings(pattern: string, regex = false) {
  return hydrateOptions({
    NF_BLOCKED_ENABLED: true,
    NF_BLOCKED_TEXT: pattern,
    NF_BLOCKED_RE: regex,
    NF_BLOCKED_FEED: ["0", "0", "0"],
    GF_BLOCKED_ENABLED: true,
    GF_BLOCKED_TEXT: pattern,
    GF_BLOCKED_RE: regex,
    GF_BLOCKED_FEED: ["0", "0", "0"],
    VF_BLOCKED_ENABLED: true,
    VF_BLOCKED_TEXT: pattern,
    VF_BLOCKED_RE: regex,
    VF_BLOCKED_FEED: ["0", "0", "0"],
    PP_BLOCKED_ENABLED: true,
    PP_BLOCKED_TEXT: pattern,
    PP_BLOCKED_RE: regex,
  });
}

/** Label the independently constructed blocks only for the video's caller-owned selector. */
function textPost(
  contents: readonly string[],
  depth: 8 | 9 = 8,
  attribute: "aria-posinset" | "aria-describedby" = "aria-posinset"
) {
  const fixture = sharedContentPost(contents, depth, attribute);
  for (const block of fixture.blocks) block.className = "validation-block";
  return fixture;
}

describe("validation: shared content blocks and blocked text", () => {
  test.each([8, 9] as const)(
    "both wrapper families discover independently constructed depth %i",
    (depth) => {
      for (const attribute of ["aria-posinset", "aria-describedby"] as const) {
        const { post, blocks } = textPost(
          ["<span>First</span>", "<span>Second</span>"],
          depth,
          attribute
        );
        const before = post.outerHTML;
        expect(Array.from(post.querySelectorAll(getNewsBlocksQuery(post)))).toEqual(blocks);
        expect(Array.from(post.querySelectorAll(getGroupsBlocksQuery(post)))).toEqual(blocks);
        expect(post.outerHTML).toBe(before);
      }
    }
  );

  test("an empty caller-owned video block selector disables extraction", () => {
    const { options, filters } = textSettings("blocked");
    const { post } = textPost(["<span>blocked</span>", "<span>Extra</span>"]);
    expect(findVideosBlockedText(post, options, filters, "")).toBe("");
  });

  test.each(textRoutes)(
    "$name handles both depths, both wrappers, and case-insensitive literal matching",
    ({ match }) => {
      const { options, filters } = textSettings("BLOCKED");
      for (const depth of [8, 9] as const) {
        for (const attribute of ["aria-posinset", "aria-describedby"] as const) {
          const { post } = textPost(
            ["<span>This blocked text</span>", "<span>Ordinary text</span>"],
            depth,
            attribute
          );
          expect(match(post, options, filters)).toBe("blocked");
        }
      }
    }
  );

  test.each(textRoutes)(
    "$name limits content extraction before later controls and comments",
    ({ match, maxBlocks }) => {
      const { options, filters } = textSettings("blocked");
      const contents = Array.from({ length: 5 }, (_, index) => `<span>block ${index}</span>`);
      const { post, blocks } = textPost(contents);
      requireShared(blocks[maxBlocks]).innerHTML = "<span>blocked in later comments</span>";
      expect(match(post, options, filters)).toBe("");
      requireShared(blocks[maxBlocks - 1]).innerHTML = "<span>blocked in included content</span>";
      expect(match(post, options, filters)).toBe("blocked");
    }
  );

  test.each(textRoutes)(
    "$name includes visible link text but excludes href attributes and HTML comments",
    ({ match }) => {
      const { options, filters } = textSettings("blocked");
      const { post, blocks } = textPost([
        '<span><a href="/blocked">Ordinary author</a><!-- blocked --></span>',
        "<span>Extra</span>",
      ]);
      expect(match(post, options, filters)).toBe("");
      requireShared(blocks[0]).innerHTML =
        '<span><a href="/ordinary">blocked author text</a></span>';
      expect(match(post, options, filters)).toBe("blocked");
    }
  );

  test.each(textRoutes)(
    "$name excludes independently marked descendants and marked block roots",
    ({ match }) => {
      const { options, filters } = textSettings("blocked");
      const { post, blocks } = textPost([
        `<span>Ordinary</span><div ${postAtt}="nested feature"><span>blocked</span></div>`,
        "<span>Second</span>",
      ]);
      expect(match(post, options, filters)).toBe("");
      const first = requireShared(blocks[0]);
      first.innerHTML = "<span>blocked</span>";
      first.setAttribute(postAtt, "nested block");
      expect(match(post, options, filters)).toBe("");
    }
  );

  test.each(textRoutes)(
    "$name normalizes NFKC but preserves diacritics, zero widths, and RTL text",
    ({ match }) => {
      for (const [text, pattern, expected] of [
        ["ＦＯＯ", "foo", "foo"],
        ["cafe\u0301", "café", "café"],
        ["café", "cafe", ""],
        ["ab\u200bcd", "abcd", ""],
        ["שלום مُموَّل", "مُموَّل", "مُموَّل"],
        ["\u200fשלום", "שלום", "שלום"],
      ]) {
        const { options, filters } = textSettings(requireShared(pattern));
        const { post } = textPost([`<span>${text}</span>`, "<span>Extra</span>"]);
        expect(match(post, options, filters)).toBe(expected);
      }
    }
  );

  test.each(textRoutes)(
    "$name only includes image alt descriptions above the loaded-width threshold",
    ({ match }) => {
      const { options, filters } = textSettings("blocked image");
      const { post, blocks } = textPost(["<span>Ordinary</span>", "<span>Extra</span>"]);
      const first = requireShared(blocks[0]);
      first.append(sharedImage("blocked image", 32), sharedImage("blocked image", 0));
      expect(match(post, options, filters)).toBe("");
      first.append(sharedImage("BLOCKED IMAGE", 33));
      expect(match(post, options, filters)).toBe("blocked image");
    }
  );

  test.each(textRoutes)("$name propagates invalid regex without mutating content", ({ match }) => {
    const { options, filters } = textSettings("[", true);
    const { post } = textPost(["<span>Ordinary</span>", "<span>Extra</span>"]);
    const before = post.outerHTML;
    expect(() => match(post, options, filters)).toThrow(SyntaxError);
    expect(post.outerHTML).toBe(before);
  });

  test.each(textRoutes)(
    "$name preserves regex source escapes, backreferences, and case-insensitive flags",
    ({ match }) => {
      for (const [pattern, positive, negative] of [
        ["^\\D+$", "letters", "123"],
        ["^\\S+$", "word", "two words"],
        ["^\\W+$", "!!!", "words"],
        ["oo\\B", "food", "foo"],
        ["(?<Letter>A)\\k<Letter>", "aA", "AB"],
        ["\\\\D", "literal \\D", "123"],
        ["^MiXeD$", "mixed", "other"],
      ]) {
        const source = requireShared(pattern);
        const { options, filters } = textSettings(source, true);
        const positivePost = textPost([`<span>${positive}</span>`, ""]);
        const negativePost = textPost([`<span>${negative}</span>`, ""]);
        expect(match(positivePost.post, options, filters)).toBe(source);
        expect(match(negativePost.post, options, filters)).toBe("");
      }
    }
  );
});
