const fs = require("fs");
const path = require("path");

const metadataPath = path.join(__dirname, "..", "src", "entry", "metadata.user.js");
const packagePath = path.join(__dirname, "..", "package.json");
const iconPath = path.join(__dirname, "..", "src", "res", "mop.png");

function loadBanner() {
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const version = pkg.version;
    let iconDataUri = "";
    try {
      const iconBuffer = fs.readFileSync(iconPath);
      iconDataUri = `data:image/png;base64,${iconBuffer.toString("base64")}`;
    } catch (error) {
      iconDataUri = "";
    }

    let content = fs.readFileSync(metadataPath, "utf8");

    // Replace @version
    content = content.replace(/\/\/ @version\s+.*/, `// @version      ${version}`);

    // Replace version in @name (e.g. "Name (5.07)" or "Name (VERSION)")
    // Matches @name followed by whitespaces, then the name part, then the version in parens
    content = content.replace(/(\/\/ @name\s+.*?)\s*\(.*?\)/, `$1 (${version})`);

    if (iconDataUri) {
      content = content.replace(/\/\/ @icon\s+.*/, `// @icon         ${iconDataUri}`);
      content = content.replace(/\/\/ @icon64\s+.*/, `// @icon64       ${iconDataUri}`);
    }

    return content.trim().length > 0 ? `${content.trim()}\n` : "";
  } catch (error) {
    console.error("Error loading banner:", error);
    return "";
  }
}

module.exports = {
  loadBanner,
};
