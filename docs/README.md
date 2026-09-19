# 📚 Avivox Workspace — Documentation Portal

Welcome to the comprehensive documentation portal for **Avivox Workspace**. This directory contains complete architectural guides, workflow specifications, branching strategies, commit conventions, CI/CD matrices, and AI automation guides designed to make understanding, developing, maintaining, and templating this monorepo effortless.

---

## 📑 Documentation Navigation

| Guide | Description | Key Topics Covered |
|---|---|---|
| 🏗️ [**Architecture & Tech Stack**](ARCHITECTURE.md) | In-depth workspace architecture and package boundary rules | Turborepo, pnpm workspaces, Next.js 16, React 19, Tailwind CSS 4, Rslib, dependency graphs |
| 🔄 [**Developer & QA Workflow Guide**](WORKFLOW-GUIDE.md) | End-to-end promotion lifecycle and developer playbooks | Branching tiers (`dev/*` ➔ `qa/*` ➔ `beta` ➔ `main`), Railway staging previews, hotfix pathway, team playbooks |
| ✍️ [**Commit Message Guidelines**](COMMIT-GUIDELINES.md) | Strict Conventional Commit specification and rules | Allowed types, monorepo scopes, SemVer impact, breaking changes, commitlint rules |
| 🛡️ [**Branch Protection & Rulesets**](BRANCH-PROTECTION.md) | GitHub Rulesets configuration and security policies | Modern GitHub Rulesets setup, GitHub App bypasses, required status checks, permissions matrix |
| ⚡ [**CI/CD Pipeline Reference**](CI-CD-PIPELINE.md) | Complete reference for all GitHub Actions workflows | Workflow reference matrices, composite actions, Railway preview environments, npm package publishing |
| 🤖 [**Copilot Prompts & Automation**](PROMPTS-GUIDE.md) | Built-in GitHub Copilot prompt library guide | `/sync-docs`, `/template-init`, `/sync-upstream`, `/commit-message` |
| 🚀 [**Monorepo Templating Guide**](TEMPLATING-GUIDE.md) | Guide for cloning and customizing this repo for new projects | Project initialization, package renaming, downstream upstream synchronization |

---

## 🏛️ High-Level Workspace Overview

```
avivox-workspace/
├── apps/
│   └── web/                     # Next.js 16 (React 19) App Router web application
├── packages/
│   ├── ui/                      # Shared React 19 UI component library (Rslib bundler)
│   ├── eslint-config/           # Centralized ESLint flat configurations
│   └── typescript-config/       # Centralized TypeScript tsconfig compiler presets
├── docs/                        # Complete documentation portal (This Directory)
│   ├── README.md                # Documentation portal master index
│   ├── ARCHITECTURE.md          # Architecture & tech stack guide
│   ├── WORKFLOW-GUIDE.md        # Developer & QA workflow lifecycle guide
│   ├── COMMIT-GUIDELINES.md     # Conventional commit guidelines
│   ├── BRANCH-PROTECTION.md     # GitHub Rulesets & branch protection guide
│   ├── CI-CD-PIPELINE.md        # GitHub Actions workflows & secrets reference
│   ├── PROMPTS-GUIDE.md         # Copilot prompt library reference
│   └── TEMPLATING-GUIDE.md      # Template initialization & upstream sync guide
├── .github/
│   ├── actions/                 # Local composite GitHub actions (setup, ci)
│   ├── prompts/                 # GitHub Copilot prompt files (.prompt.md)
│   ├── workflows/               # CI/CD pipelines (dev, qa, beta, prod, patch)
│   └── copilot-instructions.md  # Global GitHub Copilot workspace instructions
├── turbo.json                   # Turborepo task pipeline definitions
├── pnpm-workspace.yaml          # pnpm workspace configuration
├── cliff.toml                   # git-cliff changelog generator configuration
└── commitlint.config.js         # Strict conventional commit linter rules
```

---

## ⚡ Quick Start for Developers

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Local Development**:
   ```bash
   pnpm dev
   ```

3. **Validate Code**:
   ```bash
   pnpm lint        # Run ESLint across all packages
   pnpm type-check  # Verify TypeScript compilation
   pnpm test        # Run Jest unit test suites
   pnpm build       # Build all packages and the web application
   ```

4. **Synchronize Docs with AI**:
   Run `/sync-docs` in GitHub Copilot Chat after changing code or adding features.

