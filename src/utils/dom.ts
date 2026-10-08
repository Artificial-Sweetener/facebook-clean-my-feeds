// SPDX-License-Identifier: GPL-3.0-only

/** Narrow foreign values before using browser element APIs. */
export function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

/**
 * Follow parent nodes without skipping document fragments or detached roots.
 *
 * @param element - Starting node, including a detached or missing node.
 * @param numberOfBranches - Maximum parent edges to follow; zero retains the input.
 * @returns The reached ancestor, or null when the chain ends first.
 */
export function climbUpTheTree(element: Node | null, numberOfBranches = 1): Node | null {
  let current = element;
  let remaining = numberOfBranches;
  while (current && remaining > 0) {
    current = current.parentNode;
    remaining -= 1;
  }
  return current;
}

/** Allow optional containers while retaining native invalid-selector errors. */
export function safeQuerySelector(root: ParentNode | null, selector: string): Element | null {
  return root?.querySelector(selector) ?? null;
}

/**
 * Match leaf elements so container text does not duplicate a nested detection signal.
 *
 * @param container - Search scope; defaults to the current document.
 * @param queries - Selectors in priority order, or one selector.
 * @param minText - Minimum text length in JavaScript UTF-16 code units.
 * @param executeAllQueries - Return every matching leaf in document order instead of the first.
 * @returns Matching leaf elements, with first-query priority in single-result mode.
 */
export function querySelectorAllNoChildren(
  container: ParentNode = document,
  queries: string | readonly string[] = [],
  minText = 0,
  executeAllQueries = false
): Element[] {
  const queryList = typeof queries === "string" ? [queries] : queries;
  if (queryList.length === 0) return [];
  if (executeAllQueries) {
    return Array.from(container.querySelectorAll(queryList.join(","))).filter(
      (element) => element.children.length === 0 && (element.textContent?.length ?? 0) >= minText
    );
  }
  for (const query of queryList) {
    for (const element of container.querySelectorAll(query)) {
      if (element.children.length === 0 && (element.textContent?.length ?? 0) >= minText) {
        return [element];
      }
    }
  }
  return [];
}
