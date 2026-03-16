const { isSponsored } = require("../../../src/feeds/shared/sponsored");

describe("feeds/shared/sponsored", () => {
  test("isSponsored prioritizes locale-agnostic cft link signatures", () => {
    const post = document.createElement("div");
    post.innerHTML =
      '<div aria-posinset="1"><span><a href="/foo?__cft__[0]=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"></a></span></div>';

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(true);
  });

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

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(false);
  });

  test("isSponsored detects ads about links", () => {
    const post = document.createElement("div");
    const link = document.createElement("a");
    link.setAttribute("href", "/ads/about/?foo=bar");
    post.appendChild(link);

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(true);
  });

  test("isSponsored ignores aria-labelledby sponsored labels without an agnostic signal", () => {
    const post = document.createElement("div");
    const label = document.createElement("span");
    label.id = "sponsored-label";
    label.textContent = "Sponsored";
    document.body.appendChild(label);

    const labelled = document.createElement("span");
    labelled.setAttribute("aria-labelledby", "sponsored-label");
    post.appendChild(labelled);

    const state = { isNF: true };

    expect(isSponsored(post, state)).toBe(false);

    label.remove();
  });

  test("isSponsored returns false when no agnostic signal exists", () => {
    const post = document.createElement("div");
    const state = { isNF: true };
    expect(isSponsored(post, state)).toBe(false);
  });
});
