// SPDX-License-Identifier: GPL-3.0-only
import { sharedSelectors } from "../selectors/shared";

/** Viewport distance at which Facebook's own next/previous-post shortcut rests a story. */
const landingOffset = 76;

/** Sub-pixel scroll rounding must not make a story resting on the landing line count as above or below it. */
const landingTolerance = 2;

/** Facebook's single-character feed shortcuts and the story order each one follows. */
const directions: Readonly<Record<string, 1 | -1>> = { j: 1, k: -1 };

/** A story hidden without a caption has no layout box, so Facebook can neither focus nor scroll to it. */
function isCollapsed(story: Element): boolean {
  return story.getBoundingClientRect().height === 0;
}

/** Feed stories in document order; a story quoted inside another is part of its parent, not a stop of its own. */
function collectStories(root: Document): Element[] {
  return Array.from(root.querySelectorAll(sharedSelectors.feedStory)).filter(
    (story) => !story.parentElement?.closest(sharedSelectors.feedStory)
  );
}

/**
 * Choose the laid-out story a shortcut press should reach.
 * A focused story navigates by feed order. Without one the landing line decides, matching how
 * Facebook starts from whatever the viewport shows.
 * @param stories Top-level feed stories in document order.
 * @param current Story holding focus, or null when focus rests on the page itself.
 * @param direction 1 for the next story, -1 for the previous one.
 * @returns The destination, or undefined when every remaining story in that direction is collapsed.
 */
function findDestination(
  stories: readonly Element[],
  current: Element | null,
  direction: 1 | -1
): Element | undefined {
  const ordered = direction === 1 ? stories : [...stories].reverse();
  if (current) {
    return ordered.slice(ordered.indexOf(current) + 1).find((story) => !isCollapsed(story));
  }
  return ordered.find((story) => {
    const distance = (story.getBoundingClientRect().top - landingOffset) * direction;
    return !isCollapsed(story) && distance > landingTolerance;
  });
}

/**
 * Keep Facebook's next/previous-post shortcut working while this script has collapsed feed stories.
 * Facebook advances a private story index and re-derives it from the viewport whenever that story is
 * off screen. A collapsed story can take neither focus nor a scroll position, so the index lands on
 * it and the next press falls back to an earlier story, trapping the selection. While any story is
 * collapsed this handler therefore owns both shortcuts: it focuses the nearest laid-out story and
 * rests it where Facebook would. Facebook's per-story shortcuts follow DOM focus and keep working.
 * With nothing collapsed, and for focus inside dialogs or other page regions, Facebook is untouched.
 * @param view Window whose capture phase precedes Facebook's shortcut handling.
 * @returns Teardown that removes the listener.
 */
export function startStoryNavigation(view: Window): () => void {
  /**
   * Move the selection for one shortcut press that Facebook cannot complete reliably.
   * @param event Keypress seen before Facebook; consumed only when this script moves the selection itself.
   */
  const onKeyDown = (event: KeyboardEvent): void => {
    const direction = directions[event.key.toLowerCase()];
    if (
      !direction ||
      event.defaultPrevented ||
      event.isComposing ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    const page = view.document;
    const focused = page.activeElement;
    if (!focused || focused.closest(sharedSelectors.textEntry)) return;
    const current = focused.closest(sharedSelectors.feedStory);
    if (!current) {
      const dialogs = Array.from(page.querySelectorAll(sharedSelectors.dialog));
      if (focused !== page.body || dialogs.some((dialog) => !isCollapsed(dialog))) return;
    }
    const stories = collectStories(page);
    if (!stories.some(isCollapsed)) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const origin = current && stories.find((story) => story.contains(current));
    const destination = findDestination(stories, origin ?? null, direction);
    if (destination instanceof HTMLElement) {
      if (!destination.hasAttribute("tabindex")) destination.tabIndex = -1;
      destination.focus({ preventScroll: true });
      view.scrollTo({
        top: destination.getBoundingClientRect().top + view.pageYOffset - landingOffset,
        behavior: "smooth",
      });
    } else if (direction === 1) {
      // Every remaining loaded story is collapsed; reaching the end lets Facebook load further stories.
      view.scrollTo({ top: page.documentElement.scrollHeight, behavior: "smooth" });
    }
  };
  view.addEventListener("keydown", onKeyDown, true);
  return () => view.removeEventListener("keydown", onKeyDown, true);
}
