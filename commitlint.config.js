// commitlint.config.js
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // ✅ Allowed types
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "ci", "revert"]],

    // ✅ Allowed scopes
    "scope-enum": [2, "always", ["infra", "docs", "config", "build", "deps", "tests", "scripts", "ci", "security", "release", "web", "ui", "eslint-config", "typescript-config"]],

    // ✅ Subject rules
    "subject-case": [2, "always", "lower-case"],
    "subject-full-stop": [2, "never", "."],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 100],

    // ✅ Body rules
    "body-leading-blank": [2, "always"],
    "body-empty": [1, "never"],
    "body-max-line-length": [2, "always", 120],

    // ✅ Footer rules
    "footer-leading-blank": [2, "always"],
    "footer-empty": [1, "never"],
  },
};
