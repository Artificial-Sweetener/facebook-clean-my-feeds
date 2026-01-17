function getFullNumber(value) {
  let numericValue = 0;
  if (value !== "") {
    const upperValue = value.toUpperCase();
    if (upperValue.endsWith("K") || upperValue.endsWith("M")) {
      let multiplier = 1;
      let powY = 0;
      if (upperValue.endsWith("K")) {
        multiplier = 1000;
        powY = 3;
      } else if (upperValue.endsWith("M")) {
        multiplier = 1000000;
        powY = 6;
      }

      const bits = upperValue.replace(/[KM]/g, "").replace(",", ".").split(".");

      numericValue = parseInt(bits[0], 10) * multiplier;

      if (bits.length > 1) {
        numericValue += parseInt(bits[1], 10) * Math.pow(10, powY - bits[1].length);
      }
    } else {
      numericValue = parseInt(upperValue, 10);
    }
  }

  return numericValue;
}

function isAboveMaximumLikes(value, maxLikes) {
  if (!maxLikes || typeof value !== "string") {
    return false;
  }

  return getFullNumber(value.trim()) >= maxLikes;
}

module.exports = {
  getFullNumber,
  isAboveMaximumLikes,
};
