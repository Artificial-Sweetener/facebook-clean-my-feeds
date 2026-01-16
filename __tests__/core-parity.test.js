const { loadFunctions } = require("../tests/helpers/monolith-loader");
const { getFullNumber } = require("../src/core/filters/classifiers/shares-likes");
const { findFirstMatch, findFirstMatchRegExp } = require("../src/core/filters/matching");
const { cleanText } = require("../src/core/filters/text-normalize");
const { mpScanTreeForText, scanImagesForAltText, scanTreeForText } = require("../src/dom/walker");

function buildScanTreeContainer() {
  const container = document.createElement("div");

  const visibleBlock = document.createElement("div");
  visibleBlock.textContent = "Hello World";
  container.appendChild(visibleBlock);

  const newlineBlock = document.createElement("div");
  newlineBlock.textContent = "Line1\nLine2";
  container.appendChild(newlineBlock);

  const facebookBlock = document.createElement("div");
  facebookBlock.textContent = "Facebook";
  container.appendChild(facebookBlock);

  const hiddenBlock = document.createElement("div");
  hiddenBlock.setAttribute("aria-hidden", "true");
  hiddenBlock.textContent = "Hidden";
  container.appendChild(hiddenBlock);

  const roleButton = document.createElement("div");
  roleButton.setAttribute("role", "button");
  roleButton.textContent = "Click";
  container.appendChild(roleButton);

  const spanBlock = document.createElement("span");
  spanBlock.textContent = "Span Text";
  container.appendChild(spanBlock);

  return container;
}

function buildImagesContainer() {
  const container = document.createElement("div");

  const included = document.createElement("img");
  included.alt = "Cat";
  Object.defineProperty(included, "naturalWidth", { value: 64, configurable: true });
  container.appendChild(included);

  const excluded = document.createElement("img");
  excluded.alt = "Tiny";
  Object.defineProperty(excluded, "naturalWidth", { value: 16, configurable: true });
  container.appendChild(excluded);

  const duplicate = document.createElement("img");
  duplicate.alt = "Cat";
  Object.defineProperty(duplicate, "naturalWidth", { value: 64, configurable: true });
  container.appendChild(duplicate);

  return container;
}

function buildMarketplaceContainer() {
  const container = document.createElement("div");
  const textA = document.createTextNode("Brand New");
  const textB = document.createTextNode("Facebook");
  const textC = document.createTextNode("  ");
  const textD = document.createTextNode("Deal");
  container.appendChild(textA);
  container.appendChild(textB);
  container.appendChild(textC);
  container.appendChild(textD);
  return container;
}

describe("core helpers match monolith behavior", () => {
  test("cleanText matches monolith", () => {
    const monolith = loadFunctions(["cleanText"]);
    const samples = ["e\u0301", "ＡＢＣ", "Hello"];
    for (const sample of samples) {
      expect(cleanText(sample)).toBe(monolith.cleanText(sample));
    }
  });

  test("findFirstMatch matches monolith", () => {
    const monolith = loadFunctions(["findFirstMatch"]);
    const text = "hello world ban";
    const patterns = ["zzz", "ban", "world"];
    expect(findFirstMatch(text, patterns)).toBe(monolith.findFirstMatch(text, patterns));
  });

  test("findFirstMatchRegExp matches monolith", () => {
    const monolith = loadFunctions(["findFirstMatchRegExp"]);
    const text = "Amazing Deal 20%";
    const patterns = ["deal\\s+\\d+", "nope"];
    expect(findFirstMatchRegExp(text, patterns)).toBe(monolith.findFirstMatchRegExp(text, patterns));
  });

  test("scanTreeForText matches monolith", () => {
    const container = buildScanTreeContainer();
    const monolith = loadFunctions(["cleanText", "countDescendants", "scanTreeForText"], {
      document,
      NodeFilter,
    });
    expect(scanTreeForText(container)).toEqual(monolith.scanTreeForText(container));
  });

  test("scanImagesForAltText matches monolith", () => {
    const container = buildImagesContainer();
    const monolith = loadFunctions(["cleanText", "scanImagesForAltText"], {
      document,
    });
    expect(scanImagesForAltText(container)).toEqual(monolith.scanImagesForAltText(container));
  });

  test("mpScanTreeForText matches monolith", () => {
    const container = buildMarketplaceContainer();
    const monolith = loadFunctions(["cleanText", "mp_scanTreeForText"], {
      document,
      NodeFilter,
    });
    expect(mpScanTreeForText(container)).toEqual(monolith.mp_scanTreeForText(container));
  });

  test("getFullNumber matches monolith", () => {
    const monolith = loadFunctions(["getFullNumber"]);
    const samples = ["1.2K", "1,2K", "2M", "323", ""];
    for (const sample of samples) {
      expect(getFullNumber(sample)).toBe(monolith.getFullNumber(sample));
    }
  });
});
