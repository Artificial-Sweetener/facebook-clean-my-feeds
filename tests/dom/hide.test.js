const {
  addCaptionForHiddenPost,
  hidePost,
  sanitizeReason,
  toggleConsecutivesElements,
  toggleHiddenElements,
} = require("../../src/dom/hide");
const { postAtt, postAttCPID, postAttTab } = require("../../src/dom/attributes");

describe("dom/hide", () => {
  test("sanitizeReason strips quotes", () => {
    expect(sanitizeReason('"quoted"')).toBe("quoted");
    expect(sanitizeReason(123)).toBe("");
  });

  test("addCaptionForHiddenPost wraps post in details", () => {
    const container = document.createElement("div");
    const post = document.createElement("div");
    container.appendChild(post);
    const keyWords = { VERBOSITY_MESSAGE: ["", "Hidden: "] };
    const state = { showAtt: "show" };
    const options = { VERBOSITY_DEBUG: false };

    addCaptionForHiddenPost(post, "Reason", "marker", keyWords, { postAtt }, state, options);

    const details = container.querySelector("details");
    expect(details).not.toBeNull();
    expect(details.querySelector("summary").textContent).toBe("Hidden: Reason");
    expect(details.hasAttribute(postAtt)).toBe(true);
  });

  test("hidePost hides without caption when verbosity is off", () => {
    const post = document.createElement("div");
    const context = {
      options: { VERBOSITY_LEVEL: "0", VERBOSITY_DEBUG: false },
      keyWords: { VERBOSITY_MESSAGE: ["", "Hidden: "] },
      attributes: { postAtt, postAttTab },
      state: { hideAtt: "hide", showAtt: "show" },
    };

    hidePost(post, '"Reason"', "marker", context);

    expect(post.getAttribute(postAtt)).toBe("Reason");
    expect(post.hasAttribute("hide")).toBe(true);
  });

  test("toggleHiddenElements toggles debug visibility", () => {
    const state = {
      hideAtt: "hide",
      cssHideEl: "hideBlock",
      cssHideNumberOfShares: "hideShares",
      showAtt: "show",
    };
    const container = document.createElement("div");
    const el1 = document.createElement("div");
    const el2 = document.createElement("div");
    const el3 = document.createElement("div");
    el1.setAttribute(state.hideAtt, "");
    el2.setAttribute(state.cssHideEl, "");
    el3.setAttribute(state.cssHideNumberOfShares, "");
    container.append(el1, el2, el3);
    document.body.appendChild(container);

    toggleHiddenElements(state, { VERBOSITY_DEBUG: true });
    expect(el1.hasAttribute(state.showAtt)).toBe(true);

    toggleHiddenElements(state, { VERBOSITY_DEBUG: false });
    expect(el1.hasAttribute(state.showAtt)).toBe(false);

    container.remove();
  });

  test("toggleConsecutivesElements toggles visibility for same cpid", () => {
    const state = { showAtt: "show" };
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const post = document.createElement("div");
    post.setAttribute(postAttCPID, "cpid");
    details.appendChild(summary);
    details.appendChild(post);
    const other = document.createElement("div");
    other.setAttribute(postAttCPID, "cpid");
    document.body.append(details, other);

    post.setAttribute(state.showAtt, "");
    other.setAttribute(state.showAtt, "");

    details.setAttribute("open", "");
    toggleConsecutivesElements({ target: summary, stopPropagation: jest.fn() }, state);
    expect(post.hasAttribute(state.showAtt)).toBe(false);
    expect(other.hasAttribute(state.showAtt)).toBe(false);

    details.removeAttribute("open");
    toggleConsecutivesElements({ target: summary, stopPropagation: jest.fn() }, state);
    expect(post.hasAttribute(state.showAtt)).toBe(true);
    expect(other.hasAttribute(state.showAtt)).toBe(true);

    details.remove();
    other.remove();
  });
});
