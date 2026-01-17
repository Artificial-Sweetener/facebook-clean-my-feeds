const { findNumberOfShares, hideNumberOfShares } = require("../../../src/feeds/shared/shares");
const { postAtt } = require("../../../src/dom/attributes");

function buildSharePost() {
  const post = document.createElement("div");
  const root = document.createElement("div");
  root.setAttribute("data-visualcompletion", "ignore-dynamic");

  const d1 = document.createElement("div");
  const d2 = document.createElement("div");
  const d3 = document.createElement("div");
  const d4 = document.createElement("div");
  d4.className = "x";
  const d5 = document.createElement("div");
  const d6 = document.createElement("div");
  const d7 = document.createElement("div");
  const span1 = document.createElement("span");
  const d8 = document.createElement("div");
  const spanDir = document.createElement("span");
  spanDir.setAttribute("dir", "auto");

  d8.appendChild(spanDir);
  span1.appendChild(d8);
  d7.appendChild(span1);
  d6.appendChild(d7);
  d5.appendChild(d6);
  d4.appendChild(d5);
  d3.appendChild(d4);
  d2.appendChild(d3);
  d1.appendChild(d2);
  root.appendChild(d1);
  post.appendChild(root);

  return { post, share: spanDir };
}

describe("feeds/shared/shares", () => {
  test("findNumberOfShares counts share nodes", () => {
    const { post } = buildSharePost();
    expect(findNumberOfShares(post)).toBe(1);
  });

  test("hideNumberOfShares marks shares", () => {
    const { post, share } = buildSharePost();
    const state = { cssHideNumberOfShares: "hideShares", showAtt: "show" };
    const options = { VERBOSITY_DEBUG: true };

    hideNumberOfShares(post, state, options);

    expect(share.hasAttribute(state.cssHideNumberOfShares)).toBe(true);
    expect(share.hasAttribute(state.showAtt)).toBe(true);
    expect(share.getAttribute(postAtt)).toBe("Shares");
  });
});
