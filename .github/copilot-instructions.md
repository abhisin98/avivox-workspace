# 🤖 GitHub Copilot Custom Instructions — Avivox Workspace

These instructions guide GitHub Copilot when assisting developers across the Avivox Workspace monorepo.

---

## 🏗️ Monorepo Architecture & Standards

1. **Workspace Boundaries**:
   - `apps/web` is a Next.js 16 (React 19) App Router application.
   - Shared UI components must live in `packages/ui` and be exported through `@avivox-workspace/ui`.
   - Shared ESLint configurations live in `packages/eslint-config` (`@avivox/eslint-config`).
   - Shared TypeScript tsconfig presets live in `packages/typescript-config` (`@avivox/typescript-config`).

2. **Package Management & Tooling**:
   - Always use `pnpm` (`10.33.0`). Do NOT use `npm` or `yarn`.
   - Build orchestration is handled by **Turborepo** (`pnpm build`, `pnpm dev`, `pnpm lint`, `pnpm test`).

3. **Styling & UI**:
   - Styling is powered by **Tailwind CSS 4**.
   - Iconography uses Lucide icons via `lucide-react`.

---

## ⚡ Prompt Library & Automation Workflows

When assisting developers in this repository, leverage and strictly follow the official prompt files located in [`.github/prompts/`](prompts/):

1. **Auto Sync Documentation** ([`prompts/sync-docs.prompt.md`](prompts/sync-docs.prompt.md) / `/sync-docs`):
   - Trigger whenever code changes, component modifications, scripts, or configurations are updated.
   - Automatically synchronize related documentation files (`README.md`, package READMEs, `docs/README.md`, `docs/ARCHITECTURE.md`, `docs/WORKFLOW-GUIDE.md`, `apps/web/src/lib/content.ts`).

2. **Template Project Initialization** ([`prompts/template-init.prompt.md`](prompts/template-init.prompt.md) / `/template-init`):
   - Trigger when initializing or scaffolding a new project from this template repository.
   - Systematically updates project names, package scopes (`@<scope>/*`), repository URLs, branding, and documentation.

3. **Sync From Upstream Template** ([`prompts/sync-upstream.prompt.md`](prompts/sync-upstream.prompt.md) / `/sync-upstream`):
   - Trigger when pulling updates from the parent template repo into a downstream project.
   - Strictly excludes and skips `apps/` and `packages/` folders to protect downstream project code.
   - Intelligently merges CI/CD workflows, composite actions, prompt files, docs, and root build configs.

4. **Commit Message Generation** ([`prompts/commit-message.prompt.md`](prompts/commit-message.prompt.md) / `/commit-message`):
   - Generate strict Conventional Commit messages complying with [`docs/COMMIT-GUIDELINES.md`](../docs/COMMIT-GUIDELINES.md).

---

## ✍️ Commit Message Generation

When asked to generate or format commit messages, you **MUST strictly adhere to** [`docs/COMMIT-GUIDELINES.md`](../docs/COMMIT-GUIDELINES.md) and [`prompts/commit-message.prompt.md`](prompts/commit-message.prompt.md):

- **Grammar**: `<type>(<scope>): <subject>`
- **Casing**: Lowercase only for `type`, `scope`, and `subject`.
- **Allowed Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **Allowed Scopes**: `web`, `ui`, `eslint-config`, `typescript-config`, `core`, `api`, `cli`, `ci`, `release`, `monorepo`, `deps`, `docs`, `shared`.
- **Subject Rules**: 10–100 chars, imperative mood, NO trailing period, NO vague words (`update`, `changes`, `misc`, `fix stuff`, `improve`).
- **Output**: Output raw single-line Conventional Commit message without markdown fences or quotes.

