// commitlint.config.js
// Avivox Workspace — Strict Conventional Commit + Monorepo + AI + Changelog Unified System

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ["@commitlint/config-conventional"],

  // -----------------------------------
  // PARSER
  // Supports:
  // feat(scope): message
  // feat(scope)!: breaking
  // -----------------------------------
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)(?:\(([\w-]+)\))?(!?): (.+)$/,
      headerCorrespondence: ["type", "scope", "breaking", "subject"],
      noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
    },
  },

  // -----------------------------------
  // IGNORE
  // -----------------------------------
  ignores: [(message) => message.startsWith("Merge "), (message) => message.startsWith('Revert "Merge ')],

  // -----------------------------------
  // PROMPT CONFIG (for commit tools / AI)
  // -----------------------------------
  prompt: {
    settings: {
      enableMultipleScopes: false,
      scopeEnumSeparator: ",",
    },

    messages: {
      skip: "skip",
      max: "max %d chars",
      min: "min %d chars",
      emptyWarning: "cannot be empty",
      upperLimitWarning: "exceeds max length",
      lowerLimitWarning: "below min length",
    },

    questions: {
      type: {
        description: "Select the type of change",
        enum: {
          feat: {
            description: "✨ A new feature",
            title: "Features",
          },
          fix: {
            description: "🐛 A bug fix",
            title: "Fixes",
          },
          docs: {
            description: "📚 Documentation only changes",
            title: "Documentation",
          },
          style: {
            description: "🎨 Formatting only (no code logic change)",
            title: "Styles",
          },
          refactor: {
            description: "🔧 Code refactor without feature/fix",
            title: "Refactoring",
          },
          perf: {
            description: "⚡ Performance improvement",
            title: "Performance",
          },
          test: {
            description: "🧪 Adding or updating tests",
            title: "Tests",
          },
          build: {
            description: "🏗️ Build system or dependencies",
            title: "Build",
          },
          ci: {
            description: "🔄 CI/CD workflow changes",
            title: "CI/CD",
          },
          chore: {
            description: "🧹 Maintenance",
            title: "Chores",
          },
          revert: {
            description: "⏪ Revert previous commit",
            title: "Reverts",
          },
        },
      },

      scope: {
        description: "Select monorepo scope",
        enum: {
          api: "Backend / API services",
          web: "Frontend / Web app",
          cli: "CLI tooling",
          core: "Core shared logic",
          docs: "Documentation",
          release: "Release system",
          ci: "CI/CD",
          deps: "Dependencies",
          shared: "Shared packages",
          monorepo: "Workspace-wide",
        },
      },

      subject: {
        description: "Write a short, descriptive subject (lowercase, no period, no vague wording)",
      },

      isBreaking: {
        description: "Are there breaking changes?",
      },

      breakingBody: {
        description: "Describe the breaking change",
      },
    },
  },

  // -----------------------------------
  // RULES
  // -----------------------------------
  rules: {
    // -------------------------
    // TYPE
    // -------------------------
    "type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]],

    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // -------------------------
    // SCOPE
    // -------------------------
    "scope-empty": [2, "never"],
    "scope-case": [2, "always", "lower-case"],

    "scope-enum": [2, "always", ["api", "web", "cli", "core", "docs", "release", "ci", "deps", "shared", "monorepo"]],

    // -------------------------
    // SUBJECT
    // -------------------------
    "subject-empty": [2, "never"],

    // lowercase, but allows normal sentence casing restrictions
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],

    "subject-full-stop": [2, "never", "."],

    // Strict header max
    "header-max-length": [2, "always", 100],

    // -------------------------
    // BODY / FOOTER
    // -------------------------
    "body-max-line-length": [2, "always", 120],
    "footer-max-line-length": [2, "always", 120],
  },

  // -----------------------------------
  // HELP URL
  // -----------------------------------
  helpUrl: "https://github.com/abhisin98/avivox-workspace/blob/main/commit-message-guidelines.md",
};
