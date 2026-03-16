const {
  disconnectDirtyObserver,
  ensureDirtyObserver,
  getDirtyToken,
  isElementDirty,
  markElementClean,
  markElementCleanIfUnchanged,
  markElementDirty,
  resetPostState,
} = require("../../src/dom/dirty-check");
const { postAtt } = require("../../src/dom/attributes");

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
    delete global.MutationObserver;

    const target = document.createElement("div");
    const observer = ensureDirtyObserver(target);
    expect(observer).toBeNull();

    global.MutationObserver = original;
  });

  test("ensureDirtyObserver wires observer and marks dirty", () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    const original = global.MutationObserver;
    global.MutationObserver = jest.fn(() => ({ observe, disconnect }));

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
