const { cleanText } = require("../core/filters/text-normalize");

function countDescendants(element) {
  return element.querySelectorAll("div, span").length;
}

function scanTreeForText(node) {
  const arrayTextValues = [];
  const elements = node.querySelectorAll(":scope > div, :scope > blockquote, :scope > span");

  for (const element of elements) {
    if (element.hasAttribute("aria-hidden") && element.getAttribute("aria-hidden") === "false") {
      continue;
    }

    const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let currentNode;
    while ((currentNode = walk.nextNode())) {
      const elParent = currentNode.parentElement;
      const elParentTN = elParent.tagName.toLowerCase();
      const val = cleanText(currentNode.textContent).trim();

      if (val === "" || val.toLowerCase() === "facebook") {
        continue;
      }

      if (elParent.hasAttribute("aria-hidden") && elParent.getAttribute("aria-hidden") === "true") {
        continue;
      }

      if (
        elParentTN === "div" &&
        elParent.hasAttribute("role") &&
        elParent.getAttribute("role") === "button"
      ) {
        if (elParent.parentElement && elParent.parentElement.tagName.toLowerCase() !== "object") {
          continue;
        }
      }

      if (elParentTN === "title") {
        continue;
      }

      const elGeneric = elParent.closest('div[role="button"]');
      const elGenericDescendantsCount = elGeneric ? countDescendants(elGeneric) : 0;
      if (elGenericDescendantsCount < 2 && val.length > 1) {
        arrayTextValues.push(...val.split("\n"));
      }
    }
  }

  return [...new Set(arrayTextValues)];
}

function mpScanTreeForText(node) {
  const arrayTextValues = [];
  let currentNode;
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);

  while ((currentNode = walk.nextNode())) {
    const val = cleanText(currentNode.textContent).trim();
    if (val !== "" && val.length > 1 && val.toLowerCase() !== "facebook") {
      arrayTextValues.push(val.toLowerCase());
    }
  }

  return arrayTextValues;
}

function scanImagesForAltText(node) {
  const arrayAltTextValues = [];
  const images = node.querySelectorAll("img[alt]");
  for (const img of images) {
    if (img.alt.length > 0 && img.naturalWidth > 32) {
      const altText = cleanText(img.alt);
      if (!arrayAltTextValues.includes(altText)) {
        arrayAltTextValues.push(altText);
      }
    }
  }

  return arrayAltTextValues;
}

function extractTextContent(post, selector, maxBlocks) {
  const blocks = post.querySelectorAll(selector);
  const arrayTextValues = [];

  for (let b = 0; b < Math.min(maxBlocks, blocks.length); b++) {
    const block = blocks[b];
    if (countDescendants(block) > 0) {
      arrayTextValues.push(...scanTreeForText(block));
      arrayTextValues.push(...scanImagesForAltText(block));
    }
  }

  return arrayTextValues.filter((item) => item !== "");
}

module.exports = {
  countDescendants,
  extractTextContent,
  mpScanTreeForText,
  scanImagesForAltText,
  scanTreeForText,
};
