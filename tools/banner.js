const fs = require("fs");
const path = require("path");

const metadataPath = path.join(__dirname, "..", "src", "entry", "metadata.user.js");

function loadBanner() {
  try {
    const content = fs.readFileSync(metadataPath, "utf8");
    return content.trim().length > 0 ? `${content.trim()}\n` : "";
  } catch (error) {
    return "";
  }
}

module.exports = {
  loadBanner,
};
