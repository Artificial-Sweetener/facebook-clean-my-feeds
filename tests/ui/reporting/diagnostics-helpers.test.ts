// SPDX-License-Identifier: GPL-3.0-only
import { buildDomSignature, samplePosts } from "../../../src/diagnostics/collection";
import {
  collectSafeReasons,
  getSanitizedReason,
  hashText,
  redactFilters,
  redactOptions,
  summarizeList,
} from "../../../src/diagnostics/redaction";
import {
  buildSafeLocation,
  getBuildSource,
  getScriptsSample,
} from "../../../src/diagnostics/serialization";
import { translations } from "../../../src/i18n";

describe("diagnostics privacy and bounded collection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState({}, "", "/");
    jest.restoreAllMocks();
  });

  test("keeps recognized labels readable and hashes arbitrary reasons", () => {
    const safeReasons = collectSafeReasons(translations.en);
    expect(getSanitizedReason(translations.en.NF_FOLLOW, safeReasons)).toBe(
      translations.en.NF_FOLLOW
    );
    expect(getSanitizedReason("private matched keyword", safeReasons)).toBe(
      `hash:${hashText("private matched keyword")}`
    );
    expect(getSanitizedReason(" ", safeReasons)).toBe("unlabeled");
    expect(hashText(null)).toBe("");
    expect(hashText("")).toBe("");
  });

  test("redacts copied options and filter lists without mutating their sources", () => {
    const options = { NF_BLOCKED_TEXT: "private keyword", NF_SPONSORED: true };
    const filters = { NF_BLOCKED_TEXT_LC: ["private keyword"] };
    expect(redactOptions(options)).toEqual({
      NF_BLOCKED_TEXT: "[redacted]",
      NF_SPONSORED: true,
    });
    expect(redactFilters(filters)).toEqual({ NF_BLOCKED_TEXT_LC: "[redacted]" });
    expect(options.NF_BLOCKED_TEXT).toBe("private keyword");
    expect(filters.NF_BLOCKED_TEXT_LC).toEqual(["private keyword"]);
    expect(summarizeList(filters.NF_BLOCKED_TEXT_LC, 0)).toEqual({
      count: 1,
      hashes: [],
      truncated: true,
    });
    expect(summarizeList(null)).toEqual({ count: 0, hashes: [], truncated: false });
  });

  test("strips page and script query strings and fragments", () => {
    window.history.replaceState({}, "", "/feed?private=query#private-fragment");
    const script = document.createElement("script");
    script.src = "https://example.com/assets/runtime.js?private=token#secret";
    document.body.append(script, document.createElement("script"));

    expect(buildSafeLocation()).toEqual({
      url: `${window.location.origin}/feed`,
      pathname: "/feed",
      search: "",
    });
    expect(getScriptsSample()).toEqual(["https://example.com/assets/runtime.js", "inline-script"]);
    expect(getScriptsSample(1)).toHaveLength(1);
  });

  test("classifies release sources without copying custom download locations", () => {
    expect(getBuildSource(null)).toBe("unknown");
    expect(getBuildSource({})).toBe("unknown");
    expect(
      getBuildSource({ updateURL: "https://update.greasyfork.org/scripts/1/code.user.js" })
    ).toBe("greasyfork");
    expect(getBuildSource({ downloadURL: "not a URL" })).toBe("custom");
    expect(getBuildSource({ downloadURL: "https://example.com/private-build?token=secret" })).toBe(
      "custom"
    );
  });

  test("prioritizes visible posts without changing either DOM or input order", () => {
    const offscreen = document.createElement("div");
    const visible = document.createElement("div");
    document.body.append(offscreen, visible);
    jest
      .spyOn(offscreen, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(0, window.innerHeight + 100, 20, 20));
    jest.spyOn(visible, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 10, 20, 20));
    const posts = [offscreen, visible];

    expect(samplePosts(posts, 1)).toEqual([visible]);
    expect(samplePosts(posts, 2)).toEqual([visible, offscreen]);
    expect(samplePosts(posts, 0)).toEqual([]);
    expect(posts).toEqual([offscreen, visible]);
    expect(Array.from(document.body.children)).toEqual(posts);
  });

  test("records structure without retaining class names, identifiers, or text", () => {
    const post = document.createElement("article");
    post.className = "private-class";
    post.id = "private-identifier";
    post.textContent = "Private Person";
    post.setAttribute("role", "article");
    expect(buildDomSignature(post)).toEqual({
      tag: "ARTICLE",
      role: "article",
      classHash: hashText("private-class"),
      childCount: 0,
      hasReason: false,
    });
    expect(buildDomSignature(null)).toBeNull();
  });
});
