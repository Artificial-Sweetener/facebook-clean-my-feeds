const { getMosquitosQuery, swatTheMosquitos } = require("../../src/dom/animated-gifs");
const { postAtt } = require("../../src/dom/attributes");

describe("dom/animated-gifs", () => {
  test("getMosquitosQuery includes the post attribute", () => {
    expect(getMosquitosQuery()).toContain(postAtt);
  });

  test("swatTheMosquitos clicks hidden gifs and marks the parent", () => {
    const post = document.createElement("div");
    const wrapper = document.createElement("div");
    const gifButton = document.createElement("div");
    gifButton.setAttribute("role", "button");
    gifButton.setAttribute("aria-label", "GIF");
    const icon = document.createElement("i");
    gifButton.appendChild(icon);
    const link = document.createElement("a");
    const clickSpy = jest.fn();
    gifButton.click = clickSpy;
    wrapper.appendChild(gifButton);
    wrapper.appendChild(link);
    post.appendChild(wrapper);

    const original = window.getComputedStyle;
    window.getComputedStyle = jest.fn(() => ({ opacity: "0" }));

    swatTheMosquitos(post);

    window.getComputedStyle = original;

    expect(clickSpy).toHaveBeenCalled();
    expect(gifButton.hasAttribute(postAtt)).toBe(true);
  });
});
