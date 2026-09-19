# 🤖 GitHub Copilot Prompts & Automation Library

Avivox Workspace comes equipped with an official suite of GitHub Copilot prompt files located in [`.github/prompts/`](../.github/prompts/). These prompts automate routine documentation updates, conventional commit creation, repository templating, and upstream synchronization.

---

## 📑 Prompts Overview

| Command | Prompt File | Scope & Purpose |
|---|---|---|
| `/sync-docs` | [`.github/prompts/sync-docs.prompt.md`](../.github/prompts/sync-docs.prompt.md) | **Auto Documentation Sync**: Inspects recent code/config changes and automatically synchronizes all docs, READMEs, and architecture matrices across the repo. |
| `/template-init` | [`.github/prompts/template-init.prompt.md`](../.github/prompts/template-init.prompt.md) | **Template Project Initialization**: Initializes this repository for a new project/repo by systematically refactoring package scopes (`@<scope>/*`), project names, repository URLs, branding, and configs with zero broken references. |
| `/sync-upstream` | [`.github/prompts/sync-upstream.prompt.md`](../.github/prompts/sync-upstream.prompt.md) | **Upstream Template Sync**: Intelligently synchronizes tooling, bug fixes, and improvements from this upstream template into downstream repos, protecting downstream custom code, respecting intentional deletions, and translating scopes. |
| `/commit-message` | [`.github/prompts/commit-message.prompt.md`](../.github/prompts/commit-message.prompt.md) | **Conventional Commits**: Analyzes staged diffs and generates strict Conventional Commit messages complying with `commitlint.config.js` and `cliff.toml`. |

---

## 1. 📚 `/sync-docs` — Auto File & Documentation Sync

### When to Use:
Run `/sync-docs` after making code changes (adding/modifying UI components in `packages/ui`, adding routes in `apps/web`, changing package dependencies, updating scripts, or altering CI/CD workflows).

### How It Works:
1. Copilot analyzes git diff and unstaged/staged changes.
2. Identifies affected documentation files (`README.md`, package READMEs, `docs/ARCHITECTURE.md`, `docs/WORKFLOW-GUIDE.md`, `apps/web/src/lib/content.ts`).
3. Updates tables, component props, route lists, scripts, and version numbers.
4. Preserves formatting, alert callouts, and existing structure.

---

## 2. 🚀 `/template-init` — Template Project Initialization

### When to Use:
Run `/template-init` after cloning or clicking **Use this template** to bootstrap a new project from this repository.

### How It Works:
1. Copilot prompts for (or takes from instructions) your new Project Name, Org/Scope prefix (`@myorg`), Repository URL, Author, Description, and Display Branding.
2. Systematically renames root `package.json`, package `package.json` files, package scopes (`@avivox-workspace/ui` ➔ `@myorg/ui`), and all code imports.
3. Updates `cliff.toml`, `commitlint.config.js`, `pnpm-workspace.yaml`, `turbo.json`, workflows, and web app branding.
4. Resets `CHANGELOG.md` to initial release state.
5. Runs verification: `pnpm install`, `pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`.

---

## 3. 🔄 `/sync-upstream` — Upstream Template Sync

### When to Use:
Run `/sync-upstream` in downstream projects derived from this template to safely pull in CI/CD, tooling, prompt, and documentation upgrades from the upstream template.

### How It Works:
1. Fetches upstream changes via `git fetch upstream`.
2. **Strict Folder Boundary & Exclusion**:
   - **`apps/**` and `packages/**`**: **Strictly skipped and excluded** to safeguard your project-specific application code, custom pages, and UI primitives.
   - **`.github/`, `docs/`, and Root Configs**: Upgraded with upstream improvements (CI workflows, composite actions, prompt files, guidebooks, and Turbo/build tooling).
3. **Deep Conflict & Customization Analysis**:
   - **Deleted files**: Respects intentional deletions in the downstream project without blindly restoring them.
   - **Identity & scope translation**: Preserves downstream project name, repo URL, brand name, and translates upstream package references to your active scope (`@myorg/*`).
4. Runs validation (`pnpm lint`, `pnpm type-check`, `pnpm test`, `pnpm build`) and outputs a transparent sync report.

---

## 4. ✍️ `/commit-message` — Conventional Commit Generation

### When to Use:
Run `/commit-message` after staging changes with `git add .` to generate a strict, commitlint-compliant Conventional Commit message.

### How It Works:
1. Inspects staged diffs.
2. Selects the appropriate type (`feat`, `fix`, `perf`, `refactor`, `docs`, `build`, `ci`, `chore`, `revert`, `style`, `test`).
3. Selects the mandatory scope (`web`, `ui`, `eslint-config`, `typescript-config`, `api`, `core`, `cli`, `ci`, `release`, `monorepo`, `deps`, `docs`, `shared`).
4. Generates a lowercase, imperative subject under 100 characters with no trailing period.

