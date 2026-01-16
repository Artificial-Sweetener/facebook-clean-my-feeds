function findFirstMatch(postFullText, textValuesToFind) {
  const foundText = textValuesToFind.find((text) => postFullText.includes(text));
  return foundText !== undefined ? foundText : "";
}

function findFirstMatchRegExp(postFullText, regexpTextValuesToFind) {
  for (const pattern of regexpTextValuesToFind) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(postFullText)) {
      return pattern;
    }
  }

  return "";
}

module.exports = {
  findFirstMatch,
  findFirstMatchRegExp,
};
