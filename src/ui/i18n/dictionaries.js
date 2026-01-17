const { translations } = require("./translations");

function normaliseToLower(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  try {
    return value.normalize("NFKC").toLowerCase();
  } catch (error) {
    return value.toLowerCase();
  }
}

function buildDictionaries() {
  const dictionarySponsored = Object.values(translations)
    .flatMap((translation) => [
      translation.SPONSORED ? translation.SPONSORED.toLowerCase() : undefined,
      translation.SPONSORED_EXTRA ? translation.SPONSORED_EXTRA.toLowerCase() : undefined,
    ])
    .filter(Boolean);

  const dictionaryFollow = Array.from(
    new Set(
      Object.values(translations)
        .map((translation) => translation.NF_FOLLOW)
        .filter((keyword) => typeof keyword === "string" && keyword.trim() !== "")
        .map(normaliseToLower)
    )
  );

  const dictionaryReelsAndShortVideos = Object.values(translations).map(
    (translation) => translation.NF_REELS_SHORT_VIDEOS
  );

  return {
    dictionarySponsored,
    dictionaryFollow,
    dictionaryReelsAndShortVideos,
  };
}

module.exports = {
  buildDictionaries,
  normaliseToLower,
};
