// SPDX-License-Identifier: GPL-3.0-only

import {
  clearDirtyTracking,
  pruneDirtyObservers,
  disconnectDirtyObserver,
  ensureDirtyObserver,
  getDirtyToken,
  isElementDirty,
  markElementClean,
  markElementCleanIfUnchanged,
  markElementDirty,
  resetPostState,
} from "../../src/dom/dirty-check";
import { postAtt } from "../../src/dom/attributes";

const originalMutationObserver = global.MutationObserver;
afterEach(() => {
  global.MutationObserver = originalMutationObserver;
});

describe("dom/dirty-check", () => {
  test("markElementDirty and markElementClean toggle dirty state", () => {
    const target = document.createElement("div");
    markElementClean(target);
    expect(isElementDirty(target)).toBe(false);

    markElementDirty(target);
    expect(isElementDirty(target)).toBe(true);

    markElementClean(target);
    expect(isElementDirty(target)).toBe(false);
  });

  test("markElementCleanIfUnchanged skips when token changed", () => {
    const target = document.createElement("div");
    const token = getDirtyToken(target);
    markElementDirty(target);

    markElementCleanIfUnchanged(target, token);
    expect(isElementDirty(target)).toBe(true);

    const newToken = getDirtyToken(target);
    markElementCleanIfUnchanged(target, newToken);
    expect(isElementDirty(target)).toBe(false);
  });

  test("ensureDirtyObserver returns null when MutationObserver missing", () => {
    const original = global.MutationObserver;
    Reflect.deleteProperty(global, "MutationObserver");

    const target = document.createElement("div");
    const observer = ensureDirtyObserver(target);
    expect(observer).toBeNull();

    global.MutationObserver = original;
  });

  test("ensureDirtyObserver wires observer and marks dirty", () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    const original = global.MutationObserver;
    /** Preserve the complete observer API while recording lifecycle registration. */
    class ObserverMock implements MutationObserver {
      observe = observe;
      disconnect = disconnect;
      takeRecords = jest.fn((): MutationRecord[] => []);
    }
    global.MutationObserver = ObserverMock;

    const target = document.createElement("div");
    const observer = ensureDirtyObserver(target);

    expect(observer).not.toBeNull();
    expect(observe).toHaveBeenCalledWith(target, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
    expect(isElementDirty(target)).toBe(true);

    disconnectDirtyObserver(target);
    expect(disconnect).toHaveBeenCalledTimes(1);

    global.MutationObserver = original;
  });

  test("resetPostState clears nested no-caption row markers", () => {
    const post = document.createElement("div");
    const row = document.createElement("div");
    row.setAttribute(postAtt, "Meta AI prompt suggestions");
    row.setAttribute("hideNoCaption", "");
    row.setAttribute("show", "");
    post.appendChild(row);

    resetPostState(post, {
      hideAtt: "hide",
      hideWithNoCaptionAtt: "hideNoCaption",
      showAtt: "show",
    });

    expect(row.hasAttribute(postAtt)).toBe(false);
    expect(row.hasAttribute("hideNoCaption")).toBe(false);
    expect(row.hasAttribute("show")).toBe(false);
  });
});

test("runtime cleanup disconnects every feed root and creates fresh tracking on restart", () => {
  const first = document.createElement("div");
  const second = document.createElement("div");
  const firstObserver = ensureDirtyObserver(first);
  const secondObserver = ensureDirtyObserver(second);
  if (!firstObserver || !secondObserver) throw new Error("Expected connected observers");
  const firstStop = jest.spyOn(firstObserver, "disconnect");
  const secondStop = jest.spyOn(secondObserver, "disconnect");
  clearDirtyTracking();
  expect(firstStop).toHaveBeenCalledTimes(1);
  expect(secondStop).toHaveBeenCalledTimes(1);
  expect(ensureDirtyObserver(first)).not.toBe(firstObserver);
  clearDirtyTracking();
});

test("ordinary SPA scans release replaced roots before final teardown", () => {
  const root = document.createElement("div");
  document.body.appendChild(root);
  const observer = ensureDirtyObserver(root);
  if (!observer) throw new Error("Expected connected root observer");
  const disconnect = jest.spyOn(observer, "disconnect");
  pruneDirtyObservers();
  expect(disconnect).not.toHaveBeenCalled();
  const replacement = document.createElement("div");
  root.replaceWith(replacement);
  pruneDirtyObservers();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(ensureDirtyObserver(replacement)).not.toBe(observer);
  replacement.remove();
  pruneDirtyObservers();
  clearDirtyTracking();
});
