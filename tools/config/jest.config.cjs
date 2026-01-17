const path = require("path");

module.exports = {
  clearMocks: true,
  rootDir: path.resolve(__dirname, "../.."),
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  verbose: false,
};
