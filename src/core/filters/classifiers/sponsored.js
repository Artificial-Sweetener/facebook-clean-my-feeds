function isSponsoredLabel(text, dictionary) {
  if (!text || typeof text !== "string" || !Array.isArray(dictionary)) {
    return false;
  }

  return dictionary.includes(text.trim().toLowerCase());
}

module.exports = {
  isSponsoredLabel,
};
