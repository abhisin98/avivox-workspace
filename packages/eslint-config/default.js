const { defineConfig } = require("eslint/config");
const universeConfig = require("eslint-config-universe/flat/default.js");

module.exports = defineConfig([
  universeConfig,
  {
    rules: {
      // Keep Prettier formatting consistent
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
]);
