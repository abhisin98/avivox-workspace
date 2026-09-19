# 🚀 Monorepo Templating & Upstream Synchronization Guide

This guide provides step-by-step instructions on how to use **Avivox Workspace** as a production-grade template for new projects and how to keep downstream repositories continuously updated with upstream enhancements.

---

## 📑 Table of Contents

1. [Using Avivox Workspace as a Template](#1-using-avivox-workspace-as-a-template)
2. [Automated Project Initialization with `/template-init`](#2-automated-project-initialization-with-template-init)
3. [Renaming Reference Table](#3-renaming-reference-table)
4. [Setting Up Upstream Remote for Downstream Repos](#4-setting-up-upstream-remote-for-downstream-repos)
5. [Smart Synchronization with `/sync-upstream`](#5-smart-synchronization-with-sync-upstream)
6. [Intelligent Merging Rules & Safeguards](#6-intelligent-merging-rules--safeguards)

---

## 1. Using Avivox Workspace as a Template

Avivox Workspace is architected from the ground up to serve as a clean, production-ready template for Next.js 16 + React 19 monorepos. It provides out-of-the-box:
- Complete Turborepo and pnpm workspaces setup.
- Modern UI component library (`packages/ui`) bundled with Rslib.
- Centralized ESLint flat config and TypeScript compiler presets.
- 4-Tier CI/CD promotion engine with Railway preview deployments and npm publishing.
- GitHub Copilot AI automation prompts in `.github/prompts/`.

---

## 2. Automated Project Initialization with `/template-init`

### Step 1: Create Your New Repository
1. On GitHub, click **Use this template** (or clone the repository):
   ```bash
   git clone https://github.com/your-org/your-new-project.git
   cd your-new-project
   ```

### Step 2: Run Copilot Initialization
Open GitHub Copilot Chat and run:
```text
/template-init
```

Provide your project details:
- **Project Name**: `acme-platform`
- **Brand / Display Name**: `Acme Platform`
- **Package Scope**: `@acme` (or `@acme-platform`)
- **Repository URL**: `https://github.com/acme/acme-platform`
- **Author / Org**: `https://github.com/acme`
- **Description**: `Next.js monorepo platform for Acme cloud services.`

### Step 3: Automated Actions Performed
Copilot executes the following refactors automatically:
1. Updates root `package.json` (`name`, `repository`, `author`, `scripts` filters).
2. Updates package definitions (`packages/ui/package.json`, `packages/eslint-config/package.json`, `packages/typescript-config/package.json`, `apps/web/package.json`).
3. Refactors all code imports across the workspace to use the new `@<scope>/*` packages.
4. Updates `cliff.toml`, `commitlint.config.js`, `pnpm-workspace.yaml`, and `turbo.json`.
5. Updates web app branding in `apps/web/src/app/layout.tsx` and `apps/web/src/lib/content.ts`.
6. Resets `CHANGELOG.md` files.
7. Executes `pnpm install`, `pnpm lint`, `pnpm type-check`, and `pnpm build` to verify clean build.

---

## 3. Renaming Reference Table

| Target Layer | Old Template Value | New Project Value (Example) |
|---|---|---|
| Root `package.json` | `"name": "avivox-workspace"` | `"name": "acme-platform"` |
| Root Filter Script | `--filter=@avivox-workspace/*` | `--filter=@acme/*` |
| UI Package Name | `"@avivox-workspace/ui"` | `"@acme/ui"` |
| ESLint Config Name | `"@avivox/eslint-config"` | `"@acme/eslint-config"` |
| TSConfig Name | `"@avivox/typescript-config"` | `"@acme/typescript-config"` |
| Web UI Import | `import { Button } from "@avivox-workspace/ui/button"` | `import { Button } from "@acme/ui/button"` |
| Web Brand Display | `brand="Avivox Workspace"` | `brand="Acme Platform"` |
| Cliff Issue Links | `https://github.com/abhisin98/avivox-workspace/issues/$1` | `https://github.com/acme/acme-platform/issues/$1` |

---

## 4. Setting Up Upstream Remote for Downstream Repos

In your downstream repository, configure the parent template as `upstream`:

```bash
git remote add upstream https://github.com/abhisin98/avivox-workspace.git
git fetch upstream
```

To verify:
```bash
git remote -v
```

---

## 5. Smart Synchronization with `/sync-upstream`

When bug fixes, tooling updates, or new components are added to the parent template, open GitHub Copilot Chat in your downstream repository and run:

```text
/sync-upstream
```

Copilot will inspect the diff between your repository and `upstream/main`, applying intelligent selective merging.

---

## 6. Intelligent Merging Rules & Safeguards

### 🚫 Rule 1: Strict Exclusion of `apps/` and `packages/` Folders
- **`apps/**` and `packages/**` are 100% downstream project-owned**: Any upstream changes in `apps/` (e.g. `apps/web`) and `packages/` (e.g. `packages/ui`) are **strictly excluded and skipped** during sync to safeguard your unique application code, pages, and UI components.
- Upstream sync targets **only**:
  - CI/CD Workflows (`.github/workflows/`)
  - Local Composite Actions (`.github/actions/`)
  - Copilot Prompts (`.github/prompts/`)
  - Documentation Guides (`docs/`, `README.md`)
  - Root Configs (`turbo.json`, `cliff.toml`, `commitlint.config.js`, root devDeps & scripts)

### 🛡️ Rule 2: Respect Intentional Deletions
- If your downstream project intentionally deleted an unused workflow, prompt, or doc, `/sync-upstream` will **NOT restore** the deleted file unless it is a mandatory core build config.

### 🛡️ Rule 3: Automatic Scope & Identity Preservation
- Upstream imports and config references to `@avivox-workspace/*` or `@avivox/*` are automatically translated into your project's active package scope (`@acme/*`), and your project name, repository URL, and branding are strictly preserved.

### 🛡️ Rule 4: Verification & Transparent Reporting
- After merging changes, Copilot runs `pnpm lint`, `pnpm type-check`, `pnpm test`, and `pnpm build` and outputs a comprehensive synchronization report of applied, merged, and skipped changes.

