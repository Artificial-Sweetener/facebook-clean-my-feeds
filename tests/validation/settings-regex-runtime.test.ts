// SPDX-License-Identifier: GPL-3.0-only

import { loadOptions } from "../../src/runtime/load-options";
import { createState } from "../../src/runtime/state";
import { processPage } from "../../src/runtime/process-page";
import { startLoop } from "../../src/runtime/loop";
import { pathInfo } from "../../src/core/rules/feed-rules";
import { getRegexValidationIssues } from "../../src/core/options/regex-validation";
import type { Filters } from "../../src/core/filters/types";
import type { HydratedOptions } from "../../src/core/options/types";
import type { RegexFeed } from "../../src/core/options/regex-validation";
import { clearDirtyTracking } from "../../src/dom/dirty-check";
import { initializeRuntimeAttributes, postAtt } from "../../src/dom/attributes";
import { getOptions, setOptions } from "../../src/storage/idb";
import { allKnownOptions, booleanOptionKeys, control } from "./settings-fixtures";
import { sharedContentPost } from "./shared-fixtures";
import {
  findGroupsBlockedText,
  findNewsBlockedText,
  findProfileBlockedText,
  findVideosBlockedText,
} from "../../src/feeds/shared/blocked-text";

jest.mock("../../src/storage/idb", () => ({
  getOptions: jest.fn(),
  setOptions: jest.fn(),
  deleteOptions: jest.fn(),
}));

/** Exercise each real text extractor with filters supplied by startup rather than by a test sanitizer. */
const textRoutes: {
  feed: RegexFeed;
  match: (post: Element, options: HydratedOptions, filters: Filters) => string;
}[] = [
  { feed: "NF", match: findNewsBlockedText },
  { feed: "GF", match: findGroupsBlockedText },
  { feed: "PP", match: findProfileBlockedText },
  {
    feed: "VF",
    /** Supply the video's caller-selected content blocks without replacing production extraction. */
    match: (post, options, filters) =>
      findVideosBlockedText(post, options, filters, ".regex-validation-block"),
  },
];

/** Give the live processor exact production block depth with independently identifiable posts. */
function newsPost(text: string): Element {
  const post = sharedContentPost([`<span>${text}</span>`, "<span>Body</span>"]).post
    .firstElementChild;
  if (!post) throw new Error("Expected recognized post root");
  return post;
}

beforeEach(() => {
  jest.useFakeTimers({ now: 1000 });
  document.documentElement.lang = "en";
  document.body.innerHTML = '<div role="navigation"></div><div role="main"></div>';
  jest.mocked(getOptions).mockReset();
  jest.mocked(setOptions).mockReset();
});
afterEach(() => {
  clearDirtyTracking();
  document.body.replaceChildren();
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe("legacy regex loading and real scan continuation", () => {
  test.each(textRoutes)(
    "$feed startup quarantine preserves uppercase escapes and subsequent positive/negative scans",
    async ({ feed, match }) => {
      jest.mocked(getOptions).mockResolvedValue({
        [`${feed}_BLOCKED_ENABLED`]: true,
        [`${feed}_BLOCKED_RE`]: true,
        [`${feed}_BLOCKED_TEXT`]: "[privateİİ^\\D+$İİ(",
      });
      const { options, filters } = await loadOptions(createState());
      expect(filters[`${feed}_BLOCKED_TEXT`]).toEqual(["^\\D+$"]);
      for (const [text, expected] of [
        ["Letters", "^\\D+$"],
        ["123", ""],
        ["Later content", "^\\D+$"],
      ]) {
        const { post, blocks } = sharedContentPost([`<span>${text}</span>`, ""]);
        for (const block of blocks) block.className = "regex-validation-block";
        expect(match(post, options, filters)).toBe(expected);
      }
      expect(setOptions).not.toHaveBeenCalled();
    }
  );

  test.each(["serialized", "record"])(
    "isolates invalid effective rules from %s without erasing saved text or unrelated choices",
    async (representation) => {
      const stored = {
        NF_BLOCKED_ENABLED: true,
        NF_BLOCKED_RE: false,
        NF_BLOCKED_TEXT: "Literalİİ[private",
        NF_BLOCKED_FEED: ["1", "1", "1"],
        GF_BLOCKED_ENABLED: true,
        GF_BLOCKED_RE: true,
        GF_BLOCKED_TEXT: "^Group$",
        VF_BLOCKED_ENABLED: true,
        VF_BLOCKED_RE: true,
        VF_BLOCKED_TEXT: "^Video$",
        PP_BLOCKED_ENABLED: true,
        PP_BLOCKED_RE: true,
        PP_BLOCKED_TEXT: "(İİ^Profile$",
        NF_SPONSORED: false,
        CMF_DIALOG_LANGUAGE: "de",
      };
      jest
        .mocked(getOptions)
        .mockResolvedValue(representation === "serialized" ? JSON.stringify(stored) : stored);
      const state = createState();
      const hydrated = await loadOptions(state);
      expect(state.optionsReady).toBe(true);
      expect(state.options.NF_BLOCKED_TEXT).toBe("Literalİİ[private");
      expect(state.options.NF_SPONSORED).toBe(false);
      expect(state.language).toBe("de");
      expect(hydrated.filters.NF_BLOCKED_TEXT).toEqual(["Literal", "[private"]);
      expect(hydrated.filters.GF_BLOCKED_TEXT).toEqual(["^Group$", "Literal"]);
      expect(hydrated.filters.VF_BLOCKED_TEXT).toEqual(["^Video$", "Literal"]);
      expect(hydrated.filters.PP_BLOCKED_TEXT).toEqual(["^Profile$"]);
      expect(getRegexValidationIssues(state.options)).toEqual([
        { field: "NF_BLOCKED_TEXT", line: 2, destination: "GF" },
        { field: "NF_BLOCKED_TEXT", line: 2, destination: "VF" },
        { field: "PP_BLOCKED_TEXT", line: 1, destination: "PP" },
      ]);
      expect(setOptions).not.toHaveBeenCalled();
    }
  );

  test("invalid legacy expressions cannot stop startup, valid matches, unrelated filters or later scans", async () => {
    const stored = { ...allKnownOptions };
    for (const key of booleanOptionKeys) Reflect.set(stored, key, false);
    Object.assign(stored, {
      NF_BLOCKED_ENABLED: true,
      NF_BLOCKED_RE: true,
      NF_BLOCKED_TEXT: "[Private invalidİİmatchable",
      NF_AI_INFO_POSTS: true,
      VERBOSITY_LEVEL: "0",
    });
    jest.mocked(getOptions).mockResolvedValue(JSON.stringify(stored));
    const state = createState();
    initializeRuntimeAttributes(state);
    const hydrated = await loadOptions(state);
    const context = { state, ...hydrated, pathInfo };
    state.isAF = true;
    state.isNF = true;
    state.forceProcess = true;
    state.prevURL = window.location.href;
    const validMatch = newsPost("matchable");
    const negative = newsPost("ordinary");
    const unrelated = newsPost("ordinary");
    const ai = document.createElement("div");
    ai.setAttribute("role", "button");
    ai.textContent = "AI info";
    unrelated.append(ai);
    control('[role="main"]').append(validMatch, negative, unrelated);
    const process = jest.fn((reason: string) => processPage(context, reason));
    const stop = startLoop(state, {
      /** Keep the explicitly selected synthetic news route stable while the real loop scans it. */
      updateRoute: () => undefined,
      process,
    });
    try {
      expect(validMatch.hasAttribute(state.hideAtt)).toBe(true);
      expect(negative.hasAttribute(postAtt)).toBe(false);
      expect(unrelated.hasAttribute(state.hideAtt)).toBe(true);
      const later = newsPost("matchable later");
      control('[role="main"]').append(later);
      await Promise.resolve();
      await jest.advanceTimersByTimeAsync(1000);
      expect(process.mock.calls.length).toBeGreaterThan(1);
      expect(later.hasAttribute(state.hideAtt)).toBe(true);
      expect(negative.hasAttribute(postAtt)).toBe(false);
      expect(hydrated.filters.NF_BLOCKED_TEXT).toEqual(["matchable"]);
      expect(state.options.NF_BLOCKED_TEXT).toContain("[Private invalid");
    } finally {
      stop();
    }
    expect(jest.getTimerCount()).toBe(0);
  });
});
