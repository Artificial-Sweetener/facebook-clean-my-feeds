// SPDX-License-Identifier: GPL-3.0-only

/** Fail immediately when fixture construction did not create an expected node/value. */
export function requireValue<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Expected fixture value was missing");
  return value;
}

/** Assert a DOM fixture selector resolves before using its explicitly chosen element contract. */
export function findElement<T extends Element = HTMLElement>(
  root: ParentNode,
  selector: string
): T {
  return requireValue(root.querySelector<T>(selector));
}

/** Override layout because jsdom has no rendering engine; dimensions are CSS pixels. */
export function mockRect(
  element: Element,
  { left, top, width, height }: Pick<DOMRect, "left" | "top" | "width" | "height">
): void {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    /** Return deterministic layout measurements because jsdom does not perform rendering. */
    value: () => ({
      x: left,
      y: top,
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      /** Satisfy the DOMRect serialization contract without introducing unrelated fixture state. */
      toJSON: () => null,
    }),
  });
}
