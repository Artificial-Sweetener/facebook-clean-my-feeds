// SPDX-License-Identifier: GPL-3.0-only

import { requireElement } from "./news-fixtures";
import {
  findMetaAiPromptSuggestionRows,
  getMetaAiSuggestionChipSignal,
  hasMetaAiPromptSuggestionRow,
  hideMetaAiPromptSuggestionRows,
  inspectMetaAiPromptRows,
  isMetaAiPromptSuggestionRow,
  scrubMetaAiPromptSuggestions,
} from "../../src/feeds/news";
import { postAtt } from "../../src/dom/attributes";
import { newsSelectors } from "../../src/selectors/news";
import { createMetaAiPromptRow, createPostWithRow, createNewsContext } from "./news-fixtures";

describe("feeds/news-meta-ai", () => {
  test("getMetaAiSuggestionChipSignal extracts the stable React chip props", () => {
    const { buttons } = createMetaAiPromptRow();

    expect(getMetaAiSuggestionChipSignal(buttons[0])).toEqual({
      promptId: "prompt-1",
      genAISessionID: "session-1",
      suggestionKey: "suggestion-0",
    });
  });

  test("React metadata accessors retain the same discovery behavior as ordinary properties", () => {
    const button = document.createElement("button");
    Object.defineProperty(button, "__reactFiber$getter", {
      /** Emulate React metadata exposed through an accessor rather than an own data property. */
      get: () => ({
        key: "suggestion-accessor",
        memoizedProps: { promptId: "prompt-accessor", genAISessionID: "session-accessor" },
        return: null,
      }),
    });

    expect(getMetaAiSuggestionChipSignal(button)).toEqual({
      promptId: "prompt-accessor",
      genAISessionID: "session-accessor",
      suggestionKey: "suggestion-accessor",
    });
  });

  test("findMetaAiPromptSuggestionRows detects Meta AI prompt rows", () => {
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);

    const rows = findMetaAiPromptSuggestionRows(post);

    expect(rows).toEqual([outer]);
    expect(hasMetaAiPromptSuggestionRow(post)).toBe(true);
  });

  test("findMetaAiPromptSuggestionRows ignores similar chip rows without the prompt DOM signature", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const firstButtonIcon = requireElement(outer.querySelector('i[role="img"]'));
    firstButtonIcon.remove();
    const post = createPostWithRow(outer);

    expect(findMetaAiPromptSuggestionRows(post)).toEqual([]);
    expect(hasMetaAiPromptSuggestionRow(post)).toBe(false);
  });

  test("inspectMetaAiPromptRows returns confirmed rows and unresolved candidate state", () => {
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);

    const inspection = inspectMetaAiPromptRows(post);

    expect(inspection.confirmedRows).toEqual([outer]);
    expect(inspection.hasUnresolvedCandidates).toBe(false);
  });

  test("hideMetaAiPromptSuggestionRows hides the outermost matching row", () => {
    const { outer, inner } = createMetaAiPromptRow();
    const context = createNewsContext({
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    hideMetaAiPromptSuggestionRows([outer], context);

    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute("hideNoCaption")).toBe(true);
    expect(inner.hasAttribute(postAtt)).toBe(false);
  });

  test("isMetaAiPromptSuggestionRow returns false when React fiber data is unavailable and the DOM shape does not match", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });
    const firstButtonIcon = requireElement(outer.querySelector('i[role="img"]'));
    firstButtonIcon.remove();

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(false);
  });

  test("isMetaAiPromptSuggestionRow falls back to the DOM signature when React fiber data is unavailable", () => {
    const { outer } = createMetaAiPromptRow({ includeSignals: false });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(true);
  });

  test("isMetaAiPromptSuggestionRow accepts feedback chips that use a plain icon element", () => {
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      feedbackIconRole: null,
    });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(true);
  });

  test("isMetaAiPromptSuggestionRow rejects rows without a feedback marker", () => {
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      includeFeedbackIcon: false,
      feedbackAriaLabel: null,
    });

    expect(isMetaAiPromptSuggestionRow(outer)).toBe(false);
  });

  test("hideMetaAiPromptSuggestionRows adds the debug marker when highlighting is enabled", () => {
    const { outer } = createMetaAiPromptRow();
    const context = createNewsContext({
      options: { VERBOSITY_DEBUG: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    hideMetaAiPromptSuggestionRows([outer], context);

    expect(outer.hasAttribute(context.state.showAtt)).toBe(true);
  });

  test("scrubMetaAiPromptSuggestions hides rendered prompt rows from the feed root in one pass", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const { outer } = createMetaAiPromptRow();
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    expect(scrubMetaAiPromptSuggestions(context, mainColumn)).toBe(true);
    expect(outer.getAttribute(postAtt)).toBe("Meta AI prompt suggestions");
    expect(outer.hasAttribute(context.state.hideWithNoCaptionAtt)).toBe(true);
  });

  test("scrubMetaAiPromptSuggestions ignores similar chip rows that do not confirm", () => {
    document.body.innerHTML = `
      <div role="navigation"></div>
      <div role="main"></div>
    `;

    const mainColumn = requireElement(document.querySelector(newsSelectors.mainColumn));
    const { outer } = createMetaAiPromptRow({
      includeSignals: false,
      includeFeedbackIcon: false,
      feedbackAriaLabel: null,
    });
    const post = createPostWithRow(outer);
    mainColumn.appendChild(post);

    const context = createNewsContext({
      options: { NF_META_AI_PROMPTS: true },
      keyWords: { NF_META_AI_PROMPTS: "Meta AI prompt suggestions" },
    });

    expect(scrubMetaAiPromptSuggestions(context, mainColumn)).toBe(false);
    expect(outer.hasAttribute(postAtt)).toBe(false);
  });
});
