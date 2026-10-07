// SPDX-License-Identifier: GPL-3.0-only

import { postAtt } from "../../src/dom/attributes";
import {
  findAncestorFiber,
  findMetaAiPromptCandidateRows,
  findMetaAiPromptSuggestionRows,
  getMetaAiPromptButtonText,
  getMetaAiPromptChipButtons,
  getMetaAiSuggestionChipSignal,
  getReactFiberFromElement,
  hasMetaAiPromptButtonIcon,
  hasMetaAiPromptButtonLabel,
  hasMetaAiPromptDomSignature,
  inspectMetaAiPromptRows,
  isButtonLike,
  isMetaAiPromptCandidateRow,
  isMetaAiPromptSuggestionRow,
  isMetaAiSuggestionFiber,
  mopNewsFeed,
  scrubMetaAiPromptSuggestions,
} from "../../src/feeds/news";
import {
  attachSuggestionFiber,
  createMetaAiPromptRow,
  createNewsContext,
  createPostWithRow,
  requireElement,
} from "../feeds/news-fixtures";

/** Create a two-chip row that cannot accidentally pass through the three-control DOM fallback. */
function fiberOnlyRow(
  firstSession: string,
  secondSession: string,
  secondKey = "suggestion-2",
  secondPrompt = "prompt-2"
) {
  const { outer, buttons } = createMetaAiPromptRow({
    includeSignals: false,
    includePromptIcon: false,
  });
  attachSuggestionFiber(requireElement(buttons[0]), {
    promptId: "prompt-1",
    genAISessionID: firstSession,
    suggestionKey: "suggestion-1",
  });
  attachSuggestionFiber(requireElement(buttons[1]), {
    promptId: secondPrompt,
    genAISessionID: secondSession,
    suggestionKey: secondKey,
  });
  return outer;
}

describe("Meta AI prompt signals", () => {
  test("requires two independent suggestion pairs sharing the same session", () => {
    expect(isMetaAiPromptSuggestionRow(fiberOnlyRow("same", "same"))).toBe(true);
    expect(isMetaAiPromptSuggestionRow(fiberOnlyRow("one", "two"))).toBe(false);
    expect(
      isMetaAiPromptSuggestionRow(fiberOnlyRow("same", "same", "suggestion-1", "prompt-1"))
    ).toBe(false);
  });

  test.each([
    null,
    {},
    { key: "other-1", memoizedProps: { promptId: "p", genAISessionID: "s" } },
    { key: "suggestion-1", memoizedProps: { promptId: "p" } },
    { key: "suggestion-1", memoizedProps: { genAISessionID: "s" } },
  ])("rejects incomplete suggestion-fiber shapes: %j", (fiber) => {
    expect(isMetaAiSuggestionFiber(fiber)).toBe(false);
  });

  test("reads pending props when committed props are unavailable", () => {
    const button = document.createElement("button");
    Object.defineProperty(button, "__reactInternalInstance$fixture", {
      value: {
        key: "suggestion-1",
        pendingProps: { promptId: "prompt-1", genAISessionID: "session-1" },
      },
    });
    expect(getMetaAiSuggestionChipSignal(button)).toEqual({
      promptId: "prompt-1",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-1",
    });
  });

  test.each(["", 0, null, false])(
    "rejects falsy prompt identifiers despite complete property names: %j",
    (promptId) => {
      const button = document.createElement("button");
      Object.defineProperty(button, "__reactFiber$fixture", {
        value: { key: "suggestion-1", memoizedProps: { promptId, genAISessionID: "session" } },
      });
      expect(getMetaAiSuggestionChipSignal(button)).toBeNull();
    }
  );

  test("does not accept inherited private prompt properties", () => {
    const props: object = Object.create({ promptId: "p", genAISessionID: "s" });
    expect(isMetaAiSuggestionFiber({ key: "suggestion-1", memoizedProps: props })).toBe(false);
  });

  test("bounds cyclic foreign fiber ancestry at fifty inspections", () => {
    const cycle: Record<string, unknown> = {};
    cycle.return = cycle;
    const predicate = jest.fn(() => false);
    expect(findAncestorFiber(cycle, predicate)).toBeNull();
    expect(predicate).toHaveBeenCalledTimes(50);
    expect(findAncestorFiber(null, predicate)).toBeNull();
  });

  test.each([0, 1, 2, 3, 4])("bounds element-to-fiber parent discovery at depth %s", (depth) => {
    const button = document.createElement("button");
    let parent: Element = button;
    for (let index = 0; index < depth; index += 1) {
      const wrapper = document.createElement("div");
      wrapper.append(parent);
      parent = wrapper;
    }
    const fiber = { key: "fixture" };
    Object.defineProperty(parent, "__reactFiber$fixture", { value: fiber });
    expect(getReactFiberFromElement(button)).toBe(depth < 4 ? fiber : null);
  });

  test("ignores primitive fiber values and missing DOM input", () => {
    const button = document.createElement("button");
    Object.defineProperty(button, "__reactFiber$fixture", { value: 42 });
    expect(getReactFiberFromElement(button)).toBeNull();
    expect(getReactFiberFromElement(null)).toBeNull();
    expect(getMetaAiSuggestionChipSignal(undefined)).toBeNull();
  });
});

describe("Meta AI prompt DOM fallback", () => {
  test.each(["icon", "aria", "title"])("accepts supported feedback evidence: %s", (kind) => {
    const { outer, buttons } = createMetaAiPromptRow({
      includeSignals: false,
      includeFeedbackIcon: kind === "icon",
      feedbackAriaLabel: kind === "aria" ? "Feedback" : null,
    });
    if (kind === "title") requireElement(buttons[2]).setAttribute("title", "Feedback");
    expect(hasMetaAiPromptDomSignature(outer)).toBe(true);
  });

  test("requires exactly three controls and excludes ordinary content links", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const post = createPostWithRow(outer);
    expect(findMetaAiPromptSuggestionRows(post)).toEqual([outer]);
    const chip = requireElement(outer.querySelector('[data-type="hscroll-child"]'));
    chip.insertAdjacentHTML("beforeend", "<button>Unrelated action</button>");
    expect(hasMetaAiPromptDomSignature(outer)).toBe(false);
    requireElement(chip.querySelector("button")).remove();
    outer.insertAdjacentHTML("beforeend", '<a href="/alice">Alice</a>');
    expect(isMetaAiPromptCandidateRow(outer, post)).toBe(false);
  });

  test.each([0, 1, 2])(
    "rejects a missing or wrongly populated prompt control at index %s",
    (index) => {
      const { outer, buttons } = createMetaAiPromptRow({ includeSignals: false });
      const button = requireElement(buttons[index]);
      button.textContent = index === 2 ? "Not feedback" : "";
      expect(hasMetaAiPromptDomSignature(outer)).toBe(false);
    }
  );

  test("supports native buttons and anchors intentionally acting as buttons", () => {
    const { outer, buttons } = createMetaAiPromptRow({ includeSignals: false });
    const first = requireElement(buttons[0]);
    const native = document.createElement("button");
    native.innerHTML = first.innerHTML;
    first.replaceWith(native);
    const second = requireElement(buttons[1]);
    const anchor = document.createElement("a");
    anchor.href = "/prompt-action";
    anchor.setAttribute("role", "button");
    anchor.textContent = second.textContent;
    second.replaceWith(anchor);
    expect(isButtonLike(native)).toBe(true);
    expect(isButtonLike(anchor)).toBe(true);
    expect(findMetaAiPromptSuggestionRows(createPostWithRow(outer))).toEqual([outer]);
  });

  test("reports unresolved candidates separately from confirmed rows", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false, includePromptIcon: false });
    const inspection = inspectMetaAiPromptRows(createPostWithRow(outer));
    expect(inspection.candidateRows).toEqual([outer]);
    expect(inspection.confirmedRows).toEqual([]);
    expect(inspection.hasUnresolvedCandidates).toBe(true);
  });

  test("returns empty diagnostics for roots without horizontal chips", () => {
    const post = document.createElement("div");
    post.innerHTML =
      "<p>Prompt 1, prompt 2 and feedback are just words here</p><button>Prompt 1</button><button>Prompt 2</button>";
    expect(inspectMetaAiPromptRows(post)).toEqual({
      candidateRows: [],
      confirmedRows: [],
      hasUnresolvedCandidates: false,
    });
    expect(findMetaAiPromptCandidateRows(null)).toEqual([]);
  });

  test("treats absent optional controls as negative evidence without throwing", () => {
    expect(getMetaAiPromptChipButtons(null)).toEqual([]);
    expect(getMetaAiPromptButtonText(null)).toBe("");
    expect(hasMetaAiPromptButtonIcon(null)).toBe(false);
    expect(hasMetaAiPromptButtonLabel(null)).toBe(false);
    expect(hasMetaAiPromptDomSignature(null)).toBe(false);
    expect(isMetaAiPromptCandidateRow(null, null)).toBe(false);
    expect(isButtonLike(null)).toBe(false);
  });
});

describe("Meta AI prompt option wiring", () => {
  test("leaves confirmed prompt rows visible when their option is disabled", () => {
    document.body.innerHTML = '<div role="navigation"></div><div role="main"></div>';
    const { outer } = createMetaAiPromptRow();
    requireElement(document.querySelector('[role="main"]')).append(createPostWithRow(outer));
    const context = createNewsContext();
    expect(scrubMetaAiPromptSuggestions(context)).toBe(false);
    mopNewsFeed(context);
    expect(outer.hasAttribute(postAtt)).toBe(false);
  });

  test("detects late prompt insertion and leaves its parent post visible", () => {
    document.body.innerHTML =
      '<div role="navigation"></div><div role="main"><div aria-posinset="1" id="post"><a href="/alice">Alice</a><p>Ordinary update</p></div></div>';
    const context = createNewsContext({ options: { NF_META_AI_PROMPTS: true } });
    mopNewsFeed(context);
    const { outer } = createMetaAiPromptRow();
    const post = requireElement(document.getElementById("post"));
    post.append(outer);
    mopNewsFeed(context);
    expect(outer.hasAttribute(postAtt)).toBe(true);
    expect(post.hasAttribute(postAtt)).toBe(false);
    const hiddenMarkup = outer.outerHTML;
    context.state.lastNewsPostSweepAt = 0;
    mopNewsFeed(context);
    expect(outer.outerHTML).toBe(hiddenMarkup);
  });
});
