// SPDX-License-Identifier: GPL-3.0-only

import { startStoryNavigation } from "../../src/dom/story-navigation";

let stopNavigation: () => void;
let scrollTo: jest.SpyInstance;

/** JSDOM has no layout, so every element under test reports a stubbed box. */
function layOut(element: Element, top: number, height: number): void {
  jest.spyOn(element, "getBoundingClientRect").mockReturnValue({ top, height } as DOMRect);
}

/**
 * Build a feed in Facebook's story order, 500px apart, with the first story resting on the landing line.
 * @param collapsed One flag per story; true models a post hidden without a caption.
 * @returns Stories in feed order.
 */
function feedFixture(collapsed: readonly boolean[]): HTMLElement[] {
  return collapsed.map((isCollapsed, index) => {
    const story = document.createElement("div");
    story.setAttribute("data-focus", "feed_story");
    story.tabIndex = -1;
    layOut(story, isCollapsed ? 0 : 76 + index * 500, isCollapsed ? 0 : 300);
    document.body.append(story);
    return story;
  });
}

/** Deliver a shortcut the way a real keypress reaches the page, reporting whether Facebook would still see it. */
function press(key: string, modifiers: KeyboardEventInit = {}) {
  const reachedPage = jest.fn();
  document.addEventListener("keydown", reachedPage);
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  (document.activeElement ?? document.body).dispatchEvent(event);
  document.removeEventListener("keydown", reachedPage);
  return { consumed: event.defaultPrevented, reachedPage: reachedPage.mock.calls.length > 0 };
}

/** Index access that fails the test loudly when a fixture is shorter than the case assumes. */
function storyAt(stories: readonly HTMLElement[], index: number): HTMLElement {
  const story = stories[index];
  if (!story) throw new Error(`Fixture has no story at index ${index}`);
  return story;
}

const handled = { consumed: true, reachedPage: false };
const leftToFacebook = { consumed: false, reachedPage: true };

beforeEach(() => {
  scrollTo = jest.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  stopNavigation = startStoryNavigation(window);
});

afterEach(() => {
  stopNavigation();
  jest.restoreAllMocks();
  document.body.replaceChildren();
});

test.each([
  ["j", 0, [false, true, false], 2],
  ["j", 0, [false, true, true, true, false], 4],
  ["k", 2, [false, true, false], 0],
  ["k", 4, [false, true, true, true, false], 0],
  ["J", 0, [false, true, false], 2],
  ["j", 0, [false, false, true], 1],
  ["k", 1, [false, false, true], 0],
] as const)(
  "%s from story %i reaches the nearest laid-out story",
  (key, start, collapsed, destinationIndex) => {
    const stories = feedFixture(collapsed);
    storyAt(stories, start).focus();
    expect(press(key)).toEqual(handled);
    expect(document.activeElement).toBe(storyAt(stories, destinationIndex));
    expect(scrollTo).toHaveBeenCalledWith({ top: destinationIndex * 500, behavior: "smooth" });
  }
);

test("a feed with nothing collapsed is left to Facebook's own shortcut", () => {
  const stories = feedFixture([false, false, false]);
  storyAt(stories, 0).focus();
  expect(press("j")).toEqual(leftToFacebook);
  expect(document.activeElement).toBe(storyAt(stories, 0));
  expect(scrollTo).not.toHaveBeenCalled();
});

test.each([
  ["j", [true, false, false], 1],
  ["k", [true, false, false], undefined],
] as const)(
  "%s with no focused story starts from the landing line",
  (key, collapsed, destinationIndex) => {
    const stories = feedFixture(collapsed);
    layOut(storyAt(stories, 1), 76, 300);
    layOut(storyAt(stories, 2), 576, 300);
    expect(press(key)).toEqual(handled);
    expect(document.activeElement).toBe(
      destinationIndex === undefined ? document.body : storyAt(stories, destinationIndex + 1)
    );
  }
);

test("k with no focused story returns to the story the viewport has scrolled into", () => {
  const stories = feedFixture([false, true, false]);
  layOut(storyAt(stories, 0), -900, 300);
  layOut(storyAt(stories, 2), -120, 300);
  expect(press("k")).toEqual(handled);
  expect(document.activeElement).toBe(storyAt(stories, 2));
});

test("a destination Facebook has not yet made focusable still receives focus", () => {
  const stories = feedFixture([false, true, false]);
  storyAt(stories, 2).removeAttribute("tabindex");
  storyAt(stories, 0).focus();
  press("j");
  expect(document.activeElement).toBe(storyAt(stories, 2));
});

test("focus inside a story navigates from that story", () => {
  const stories = feedFixture([false, true, false]);
  const link = document.createElement("a");
  link.href = "https://www.facebook.com/";
  storyAt(stories, 0).append(link);
  link.focus();
  press("j");
  expect(document.activeElement).toBe(storyAt(stories, 2));
});

test("a story quoted inside another is not a stop of its own", () => {
  const stories = feedFixture([false, true, false]);
  const quoted = document.createElement("div");
  quoted.setAttribute("data-focus", "feed_story");
  quoted.tabIndex = -1;
  layOut(quoted, 200, 100);
  storyAt(stories, 0).append(quoted);
  quoted.focus();
  press("j");
  expect(document.activeElement).toBe(storyAt(stories, 2));
  press("k");
  expect(document.activeElement).toBe(storyAt(stories, 0));
});

test("a collapsed tail keeps the selection and scrolls to load further stories", () => {
  const stories = feedFixture([false, true, true]);
  storyAt(stories, 0).focus();
  expect(press("j")).toEqual(handled);
  expect(document.activeElement).toBe(storyAt(stories, 0));
  expect(scrollTo).toHaveBeenCalledWith({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
});

test("collapsed stories above the first laid-out story keep the selection without scrolling", () => {
  const stories = feedFixture([true, true, false]);
  storyAt(stories, 2).focus();
  expect(press("k")).toEqual(handled);
  expect(document.activeElement).toBe(storyAt(stories, 2));
  expect(scrollTo).not.toHaveBeenCalled();
});

test.each([
  ["a modifier", "j", { ctrlKey: true }],
  ["shift", "j", { shiftKey: true }],
  ["another key", "l", {}],
] as const)("%s leaves the keypress to Facebook", (_case, key, modifiers) => {
  const stories = feedFixture([false, true, false]);
  storyAt(stories, 0).focus();
  expect(press(key, modifiers)).toEqual(leftToFacebook);
  expect(document.activeElement).toBe(storyAt(stories, 0));
});

test.each([
  ["input", "<input>"],
  ["textarea", "<textarea></textarea>"],
  ["comment composer", '<div role="textbox" contenteditable="true" tabindex="0"></div>'],
])("typing j in a story's %s is never intercepted", (_case, html) => {
  const stories = feedFixture([false, true, false]);
  storyAt(stories, 0).insertAdjacentHTML("beforeend", html);
  const field = storyAt(stories, 0).lastElementChild;
  if (!(field instanceof HTMLElement)) throw new Error("Fixture requires a text entry element");
  field.focus();
  expect(press("j")).toEqual(leftToFacebook);
  expect(document.activeElement).toBe(field);
});

test("focus in another page region leaves the keypress to Facebook", () => {
  feedFixture([false, true, false]);
  const railButton = document.createElement("button");
  document.body.append(railButton);
  railButton.focus();
  expect(press("j")).toEqual(leftToFacebook);
  expect(document.activeElement).toBe(railButton);
});

test("an open dialog keeps its own meaning for the shortcut", () => {
  feedFixture([false, true, false]);
  const dialog = document.createElement("div");
  dialog.setAttribute("role", "dialog");
  layOut(dialog, 0, 600);
  document.body.append(dialog);
  expect(press("j")).toEqual(leftToFacebook);
  layOut(dialog, 0, 0);
  expect(press("j")).toEqual(handled);
});

test("teardown restores Facebook's unmodified shortcut handling", () => {
  const stories = feedFixture([false, true, false]);
  storyAt(stories, 0).focus();
  stopNavigation();
  expect(press("j")).toEqual(leftToFacebook);
  expect(document.activeElement).toBe(storyAt(stories, 0));
});
