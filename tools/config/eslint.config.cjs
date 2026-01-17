module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  ignorePatterns: ["fb-clean-my-feeds.user.js", "node_modules/**"],
  plugins: ["import"],
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  rules: {
    "import/order": ["error", { "newlines-between": "always" }],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
};
