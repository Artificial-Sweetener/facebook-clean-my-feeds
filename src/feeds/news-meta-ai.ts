// SPDX-License-Identifier: GPL-3.0-only

import type { FeedContext } from "./types";
import { cleanText } from "../core/filters/text-normalize";
import { hideFeatureNoCaption } from "../dom/hide";
import { newsSelectors } from "../selectors/news";

/** Foreign React metadata is inspected lazily, never asserted to match a complete private React type. */
type ReactFiber = Record<string, unknown>;

/** Accept only inspectable records at the untyped Facebook runtime boundary. */
function isReactFiber(value: unknown): value is ReactFiber {
  return typeof value === "object" && value !== null;
}

/**
 * Check the element and at most three parents for the first React fiber property on each node.
 * Values remain unknown until object validation; accessor-backed properties are read normally.
 * @param element Starting chip element; missing elements or absent fiber properties yield null.
 * @returns The first object-valued fiber found, without assuming its private React shape.
 * @throws Propagates errors raised by foreign property accessors; this helper does not conceal them.
 */
export function getReactFiberFromElement(element: Element | null | undefined) {
  let current = element;
  let depth = 0;

  while (current && depth < 4) {
    const reactFiberKey = Object.getOwnPropertyNames(current).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
    );
    if (reactFiberKey) {
      const candidate: unknown = Reflect.get(current, reactFiberKey);
      if (isReactFiber(candidate)) return candidate;
    }
    current = current.parentElement;
    depth += 1;
  }

  return null;
}

/** Test the starting fiber and at most 49 return ancestors, bounding cyclic third-party chains; stop when the predicate succeeds or a parent is not an object. */
export function findAncestorFiber(
  fiber: ReactFiber | null,
  predicate: (fiber: ReactFiber) => boolean
) {
  let current = fiber;
  let safetyCounter = 0;

  while (current && safetyCounter < 50) {
    if (predicate(current)) {
      return current;
    }
    current = isReactFiber(current.return) ? current.return : null;
    safetyCounter += 1;
  }

  return null;
}

/** Require a suggestion key and both stable prompt/session property names before accepting a fiber. */
export function isMetaAiSuggestionFiber(fiber: ReactFiber | null) {
  if (!fiber || typeof fiber.key !== "string" || !fiber.key.startsWith("suggestion-")) {
    return false;
  }

  const props = fiber.memoizedProps || fiber.pendingProps;
  if (!isReactFiber(props)) {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(props, "promptId") &&
    Object.prototype.hasOwnProperty.call(props, "genAISessionID")
  );
}

/** Read prompt/session values from the first suggestion ancestor and require both to be truthy; their original values are retained rather than coerced to strings. */
export function getMetaAiSuggestionChipSignal(button: Element | null | undefined) {
  const fiber = getReactFiberFromElement(button);
  if (!fiber) {
    return null;
  }

  const suggestionFiber = findAncestorFiber(fiber, isMetaAiSuggestionFiber);
  const props = suggestionFiber
    ? suggestionFiber.memoizedProps || suggestionFiber.pendingProps
    : null;
  if (!suggestionFiber || !isReactFiber(props)) {
    return null;
  }

  const { promptId, genAISessionID } = props;
  if (!promptId || !genAISessionID) {
    return null;
  }

  return {
    promptId,
    genAISessionID,
    suggestionKey: suggestionFiber.key,
  };
}

/** Recognize native and ARIA buttons when separating prompt controls from content links. */
export function isButtonLike(element: Element | null) {
  if (!element || typeof element.getAttribute !== "function") {
    return false;
  }

  return element.tagName === "BUTTON" || element.getAttribute("role") === "button";
}

/** Collect button-like descendants only inside horizontal-scroll chips. */
export function getMetaAiPromptChipButtons(row: Element | null | undefined) {
  if (!row || typeof row.querySelectorAll !== "function") {
    return [];
  }

  return Array.from(
    row.querySelectorAll(
      '[data-type="hscroll-child"] button, [data-type="hscroll-child"] [role="button"]'
    )
  );
}

/** Normalize a chip label while preserving an empty feedback button label. */
export function getMetaAiPromptButtonText(button: Element | null | undefined) {
  if (!button || typeof button.textContent !== "string") {
    return "";
  }

  return cleanText(button.textContent).trim();
}

/** Recognize the icon-bearing prompt and feedback controls used by the DOM fallback. */
export function hasMetaAiPromptButtonIcon(button: Element | null | undefined) {
  if (!button || typeof button.querySelector !== "function") {
    return false;
  }

  return button.querySelector("i, img, svg") !== null;
}

/** Accept a nonempty accessible label or title as evidence of a feedback control. */
export function hasMetaAiPromptButtonLabel(button: Element | null | undefined) {
  if (!button || typeof button.getAttribute !== "function") {
    return false;
  }

  return ["aria-label", "title"].some((attributeName) => {
    const attributeValue = button.getAttribute(attributeName);
    return typeof attributeValue === "string" && attributeValue.trim() !== "";
  });
}

// Fallback for userscript sandboxes where Facebook's React fibers are not readable.

/** Accept exactly three buttons: two nonempty prompts, an icon on the first prompt, and an empty-text feedback button bearing an icon or accessible label. */
export function hasMetaAiPromptDomSignature(row: Element | null) {
  const chipButtons = getMetaAiPromptChipButtons(row);
  if (chipButtons.length !== 3) {
    return false;
  }

  const buttonTexts = chipButtons.map((button) => getMetaAiPromptButtonText(button));
  if (buttonTexts[0] === "" || buttonTexts[1] === "" || buttonTexts[2] !== "") {
    return false;
  }

  const firstButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[0]);
  const lastButtonHasIcon = hasMetaAiPromptButtonIcon(chipButtons[2]);
  const lastButtonHasLabel = hasMetaAiPromptButtonLabel(chipButtons[2]);

  return firstButtonHasIcon && (lastButtonHasIcon || lastButtonHasLabel);
}

/** Require multiple scroll chips and reject rows containing ordinary content links. */
export function isMetaAiPromptCandidateRow(row: Element | null, root: Element | null) {
  if (!row || !root || row === root || typeof row.querySelectorAll !== "function") {
    return false;
  }

  const hscrollChildren = row.querySelectorAll('[data-type="hscroll-child"]');
  if (hscrollChildren.length < 2) {
    return false;
  }

  const chipButtons = getMetaAiPromptChipButtons(row);
  if (chipButtons.length < 2) {
    return false;
  }

  const contentLinks = Array.from(row.querySelectorAll("a[href]")).filter((link) => {
    if (isButtonLike(link)) {
      return false;
    }

    const buttonAncestor = link.closest('[role="button"], button');
    return !buttonAncestor;
  });

  return contentLinks.length === 0;
}

/** Require all nonempty text and controls to belong to scroll chips, so an ordinary linkless paragraph cannot be hidden with the prompts. */
function containsOnlyPromptContent(row: Element): boolean {
  const textWalker = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = textWalker.nextNode())) {
    if (node.textContent?.trim() && !node.parentElement?.closest('[data-type="hscroll-child"]'))
      return false;
  }
  return Array.from(row.querySelectorAll('button, [role="button"], img, svg, video, input')).every(
    (element) => element.closest('[data-type="hscroll-child"]') !== null
  );
}

/** Keep outermost prompt-only rows below enclosing post boundaries, preserving unrelated text beside a chip strip. */
export function findMetaAiPromptCandidateRows(root: Element | null) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return [];
  }

  const candidateRows = new Set<Element>();
  const chips = root.querySelectorAll('[data-type="hscroll-child"]');

  chips.forEach((chip) => {
    let current = chip.parentElement;
    while (current && current !== root) {
      if (current.matches(newsSelectors.standardPost)) break;
      if (isMetaAiPromptCandidateRow(current, root) && containsOnlyPromptContent(current)) {
        candidateRows.add(current);
      }
      current = current.parentElement;
    }
  });

  const rows = Array.from(candidateRows);
  return rows.filter((row) => !rows.some((other) => other !== row && other.contains(row)));
}

/** Confirm at least two distinct suggestion-key/prompt pairs with the same session value; otherwise try the DOM signature even when partial fiber evidence exists. */
export function isMetaAiPromptSuggestionRow(row: Element | null) {
  const sessionMatches = new Map<unknown, Set<string>>();
  const signals = getMetaAiPromptChipButtons(row)
    .map((button) => getMetaAiSuggestionChipSignal(button))
    .filter((signal) => signal !== null);

  signals.forEach((signal) => {
    if (!sessionMatches.has(signal.genAISessionID)) {
      sessionMatches.set(signal.genAISessionID, new Set());
    }

    sessionMatches.get(signal.genAISessionID)?.add(`${signal.suggestionKey}:${signal.promptId}`);
  });

  if (Array.from(sessionMatches.values()).some((signalSet) => signalSet.size >= 2)) {
    return true;
  }

  return hasMetaAiPromptDomSignature(row);
}

/** Report confirmed rows separately from unresolved candidates so callers can distinguish discovery and confidence. */
export function inspectMetaAiPromptRows(root: Element | null) {
  const candidateRows = findMetaAiPromptCandidateRows(root);
  if (candidateRows.length === 0) {
    return {
      candidateRows: [],
      confirmedRows: [],
      hasUnresolvedCandidates: false,
    };
  }

  const confirmedRows = candidateRows.filter((row) => isMetaAiPromptSuggestionRow(row));
  const confirmedSet = new Set(confirmedRows);

  return {
    candidateRows,
    confirmedRows,
    hasUnresolvedCandidates: candidateRows.some((row) => !confirmedSet.has(row)),
  };
}

/** Expose confirmed prompt rows without the diagnostic candidate list. */
export function findMetaAiPromptSuggestionRows(root: Element | null) {
  return inspectMetaAiPromptRows(root).confirmedRows;
}

/** Trust the caller's confirmed row list, apply no-caption/debug markers to each row, and return true for any nonempty accepted list without revalidating its contents. */
export function hideMetaAiPromptSuggestionRows(
  rows: readonly Element[],
  context: FeedContext | null
) {
  if (!Array.isArray(rows) || !context || rows.length === 0) {
    return false;
  }

  const { keyWords } = context;
  if (!keyWords) {
    return false;
  }

  rows.forEach((row) => hideFeatureNoCaption(row, keyWords.NF_META_AI_PROMPTS, context));
  return true;
}

/** Report whether a root contains a confirmed prompt row without mutating it. */
export function hasMetaAiPromptSuggestionRow(root: Element | null) {
  return findMetaAiPromptSuggestionRows(root).length > 0;
}

/** Scan the supplied root or current feed only when prompt filtering is enabled. */
export function scrubMetaAiPromptSuggestions(
  context: FeedContext | null,
  root: Element | null = null
) {
  if (!context) {
    return false;
  }

  const { options } = context;
  if (!options || options.NF_META_AI_PROMPTS !== true) {
    return false;
  }

  const scanRoot = root || document.querySelector(newsSelectors.mainColumn);
  if (!scanRoot) {
    return false;
  }

  const promptInspection = inspectMetaAiPromptRows(scanRoot);
  return hideMetaAiPromptSuggestionRows(promptInspection.confirmedRows, context);
}
