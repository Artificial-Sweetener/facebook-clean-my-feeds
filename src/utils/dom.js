function isElement(value) {
  return value instanceof Element;
}

function climbUpTheTree(element, numberOfBranches = 1) {
  let current = element;
  let remaining = numberOfBranches;

  while (current && remaining > 0) {
    current = current.parentNode;
    remaining -= 1;
  }

  return current || null;
}

function safeQuerySelector(root, selector) {
  if (!root || typeof root.querySelector !== "function") {
    return null;
  }

  return root.querySelector(selector);
}

function querySelectorAllNoChildren(container = document, queries = [], minText = 0, executeAllQueries = false) {
  const queryList = Array.isArray(queries) ? queries : [queries];

  if (queryList.length === 0) {
    return [];
  }

  if (executeAllQueries) {
    return Array.from(container.querySelectorAll(queryList)).filter((element) => {
      return element.children.length === 0 && element.textContent.length >= minText;
    });
  }

  for (const query of queryList) {
    const elements = container.querySelectorAll(query);
    for (const element of elements) {
      if (element.children.length === 0 && element.textContent.length >= minText) {
        return [element];
      }
    }
  }

  return [];
}

module.exports = {
  climbUpTheTree,
  isElement,
  querySelectorAllNoChildren,
  safeQuerySelector,
};
