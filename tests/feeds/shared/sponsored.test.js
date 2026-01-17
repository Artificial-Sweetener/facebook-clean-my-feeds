const { isSponsored } = require("../../../src/feeds/shared/sponsored");

describe("feeds/shared/sponsored", () => {
  test("isSponsored detects plain sponsored labels", () => {
    const post = document.createElement("div");
    const wrapper = document.createElement("div");
    wrapper.id = "id1";
    const span1 = document.createElement("span");
    const link = document.createElement("a");
    link.setAttribute("role", "link");
    const spanText = document.createElement("span");
    spanText.textContent = "Sponsored";
    link.appendChild(spanText);
    span1.appendChild(link);
    wrapper.appendChild(span1);
    post.appendChild(wrapper);

    const state = { isNF: true, dictionarySponsored: ["sponsored"] };

    expect(isSponsored(post, state)).toBe(true);
  });

  test("isSponsored returns false when dictionary missing", () => {
    const post = document.createElement("div");
    const state = { isNF: true, dictionarySponsored: null };
    expect(isSponsored(post, state)).toBe(false);
  });
});
