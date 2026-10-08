// SPDX-License-Identifier: GPL-3.0-only
/**
 * Allow absent nodes or unsupported observers without interrupting page startup.
 */
export function observeAttributes(
  target: Node | null,
  options: MutationObserverInit,
  callback: MutationCallback
): MutationObserver | null {
  if (!target || typeof MutationObserver === "undefined") {
    return null;
  }

  const observer = new MutationObserver(callback);
  observer.observe(target, options);
  return observer;
}
