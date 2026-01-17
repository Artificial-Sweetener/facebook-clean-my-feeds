const {
  extractTextContent,
  mpScanTreeForText,
  scanImagesForAltText,
  scanTreeForText,
} = require("../../src/dom/walker");

function setNaturalWidth(img, width) {
  Object.defineProperty(img, "naturalWidth", {
    configurable: true,
    value: width,
  });
}

describe("dom/walker", () => {
  test("scanTreeForText filters hidden, button, and facebook text", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <div>Keep me</div>
      <div aria-hidden="true"><span>Hidden</span></div>
      <div aria-hidden="false">Skip aria false</div>
      <div><span>facebook</span></div>
      <div role="button">Button text</div>
      <div><object><div role="button">Allowed button</div></object></div>
      <div>Keep me</div>
    `;

    const values = scanTreeForText(root);

    expect(values).toEqual(["Keep me", "Hidden", "Allowed button"]);
  });

  test("mpScanTreeForText lowercases and filters short/facebook values", () => {
    const root = document.createElement("div");
    root.innerHTML = `<span>Hi</span><span>fAceBook</span><span>A</span>`;

    expect(mpScanTreeForText(root)).toEqual(["hi"]);
  });

  test("scanImagesForAltText collects unique alt text over size threshold", () => {
    const root = document.createElement("div");
    const img1 = document.createElement("img");
    img1.alt = "Alt text";
    setNaturalWidth(img1, 64);

    const img2 = document.createElement("img");
    img2.alt = "Alt text";
    setNaturalWidth(img2, 80);

    const img3 = document.createElement("img");
    img3.alt = "Small";
    setNaturalWidth(img3, 10);

    root.append(img1, img2, img3);

    expect(scanImagesForAltText(root)).toEqual(["Alt text"]);
  });

  test("extractTextContent merges text and alt text from blocks", () => {
    const post = document.createElement("div");
    post.innerHTML = `
      <div class="block">
        <span>First</span>
        <img alt="Img">
      </div>
      <div class="block"><span>Second</span></div>
    `;

    const img = post.querySelector("img");
    setNaturalWidth(img, 64);

    const values = extractTextContent(post, ".block", 1);

    expect(values).toEqual(["First", "Img"]);
  });
});
