const { defineConfig } = require("eslint/config");
const universeConfig = require("eslint-config-universe/flat/node.js");

module.exports = defineConfig([
  universeConfig,
  {
    rules: {
      // Keep Prettier formatting consistent
      "prettier/prettier": ["error", { endOfLine: "auto" }],

      // Prevent unused variables clutter (ignore args starting with "_")
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Simple feature rule for PR testing: enforce strict equality
      eqeqeq: ["error", "always"],

      // Disallow use of alert() — simple test feature
      "no-alert": "warn",
    },
  },
]);
