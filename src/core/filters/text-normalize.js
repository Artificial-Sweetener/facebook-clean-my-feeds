function cleanText(text) {
  return text.normalize("NFKC");
}

module.exports = {
  cleanText,
};
