const {
  climbUpTheTree,
  isElement,
  querySelectorAllNoChildren,
  safeQuerySelector,
} = require("../../src/utils/dom");

describe("utils/dom", () => {
  test("isElement detects elements", () => {
    const el = document.createElement("div");
    expect(isElement(el)).toBe(true);
    expect(isElement("div")).toBe(false);
  });

  test("climbUpTheTree returns ancestor or null", () => {
    const root = document.createElement("div");
    const child = document.createElement("span");
    root.appendChild(child);

    expect(climbUpTheTree(child, 1)).toBe(root);
    expect(climbUpTheTree(child, 2)).toBe(null);
  });

  test("safeQuerySelector returns null for invalid roots", () => {
    expect(safeQuerySelector(null, "div")).toBe(null);
  });

  test("querySelectorAllNoChildren respects executeAllQueries", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div class="a">hello</div>
      <div class="b"><span>skip</span></div>
      <div class="c">world</div>
    `;

    const first = querySelectorAllNoChildren(root, [".a", ".c"], 1, false);
    expect(first).toHaveLength(1);
    expect(first[0].className).toBe("a");

    const all = querySelectorAllNoChildren(root, [".a", ".c"], 1, true);
    expect(all.map((el) => el.className)).toEqual(["a", "c"]);
  });
});
