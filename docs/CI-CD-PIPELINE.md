# ⚡ CI/CD Pipeline & GitHub Actions Reference Matrix

This document is the definitive reference for all GitHub Actions workflows, composite actions, deployment engines, and secrets configuration in **Avivox Workspace**.

---

## 📑 Table of Contents

1. [Workflow Reference Matrix](#1-workflow-reference-matrix)
2. [Local Composite Actions Matrix](#2-local-composite-actions-matrix)
3. [External GitHub Actions Matrix](#3-external-github-actions-matrix)
4. [GitHub Secrets & Configuration Matrix](#4-github-secrets--configuration-matrix)
5. [Railway Preview & Production Environments](#5-railway-preview--production-environments)
6. [Automated SemVer & Package Release Pipeline](#6-automated-semver--package-release-pipeline)

---

## 1. Workflow Reference Matrix

All automation workflows reside in [`.github/workflows/`](../.github/workflows/) and run on `ubuntu-latest` with standard concurrency cancellation policies (`cancel-in-progress: true`).

| Workflow File | Name | Trigger Event(s) | Key Permissions | Target Branch / Environment | Primary Jobs & Steps |
|---|---|---|---|---|---|
| [`dev.yml`](../.github/workflows/dev.yml) | Dev Deployment | `push` to `dev/*` | `contents: read` | Development (`dev/*`) | • `ci`: Runs local `.github/actions/setup` + `.github/actions/ci` (lint, type-check, test, build). |
| [`create-qa.yml`](../.github/workflows/create-qa.yml) | Create QA Branch | `workflow_dispatch`<br/>(Input: `dev_branch`) | `contents: write`<br/>`pull-requests: write` | `qa/*` | • Authenticates via GitHub App.<br/>• Runs `abhisin98/avivox-action-promotion-engine@v1` with `promotion-target: qa`. |
| [`qa.yml`](../.github/workflows/qa.yml) | QA Deployment | `push` to `qa/*` | `contents: read` | QA / Testing (`qa/*`) | • `ci`: Runs local `.github/actions/setup` + `.github/actions/ci`. |
| [`create-beta.yml`](../.github/workflows/create-beta.yml) | Create Beta Release PR | `workflow_dispatch`<br/>(Input: `qa_branch`) | `contents: write`<br/>`pull-requests: write` | `main` (PR Target) | • Authenticates via GitHub App.<br/>• Runs `abhisin98/avivox-action-promotion-engine@v1` with `promotion-target: beta`. |
| [`beta.yml`](../.github/workflows/beta.yml) | Beta Deployment | `pull_request`<br/>(opened, synchronize, reopened) targeting `main` | `contents: read`<br/>`pull-requests: write` | Railway Staging Preview + npm (`beta` tag) | • `ci`: Validates PR code.<br/>• `deploy-web`: Runs `abhisin98/avivox-action-railway-deploy@v1` (`preview: true`), deploys `preview-<PR#>` and comments preview URL.<br/>• `publish-packages`: Runs `abhisin98/avivox-action-changelogs-and-package-releases@v1` (`release-type: beta`, `publish-package-tag: beta`). |
| [`beta-cleanup.yml`](../.github/workflows/beta-cleanup.yml) | Beta Cleanup | `pull_request` (closed) targeting `main` | `contents: read` | Railway Staging Preview | • `cleanup-web`: Runs `abhisin98/avivox-action-railway-deploy@v1` (`cleanup-preview: true`) to delete preview environment.<br/>• `cleanup-packages`: Cleanup placeholder. |
| [`prod.yml`](../.github/workflows/prod.yml) | Production Deployment | `push` to `main` (Merge) | `contents: write` | Railway Production (`environment: Web`) + npm (`latest` tag) | • `ci`: Final validation on `main`.<br/>• `deploy-web`: Runs `abhisin98/avivox-action-railway-deploy@v1` to deploy live web app.<br/>• `publish-packages`: Runs `abhisin98/avivox-action-changelogs-and-package-releases@v1` (`release-type: auto`, `commit-and-push: true`, `create-release: true`), updates `CHANGELOG.md` via `git-cliff`, tags release, creates GitHub Release, and publishes to npm (`latest`). |
| [`patch.yml`](../.github/workflows/patch.yml) | Patch Deployment | `push` to `patch/*` | `contents: read` | Railway Production + npm (`latest` tag) | • `ci`: Hotfix CI validation.<br/>• `deploy-web`: Immediate production Railway deploy.<br/>• `publish-packages`: Runs `abhisin98/avivox-action-changelogs-and-package-releases@v1` (`release-type: patch`, `publish-package-tag: latest`). |

---

## 2. Local Composite Actions Matrix

Local composite actions are stored directly within the repository under [`.github/actions/`](../.github/actions/) and provide modular, reusable building blocks for workflows:

| Action Name | Path | Inputs | Default Values | Steps & Responsibilities |
|---|---|---|---|---|
| **Setup Monorepo** | [`.github/actions/setup/action.yaml`](../.github/actions/setup/action.yaml) | `node-version` (string) | `24` | 1. `pnpm/action-setup@v6` configures pnpm.<br/>2. `actions/setup-node@v6` sets up Node.js 24 with pnpm caching.<br/>3. `pnpm i --frozen-lockfile` installs exact dependencies.<br/>4. `pnpm build:packages` pre-compiles monorepo packages.<br/>5. `actions/cache@v5` restores & caches Turborepo build caches (`node_modules/.cache/turbo`, `apps/**/.turbo`, `packages/**/.turbo`, `.turbo`). |
| **Continuous Integration Action** | [`.github/actions/ci/action.yaml`](../.github/actions/ci/action.yaml) | • `run-lint` (boolean)<br/>• `run-type-check` (boolean)<br/>• `run-test` (boolean)<br/>• `run-build` (boolean) | `true`<br/>`true`<br/>`true`<br/>`true` | 1. `pnpm lint` (runs ESLint via Turborepo).<br/>2. `pnpm type-check` (runs TypeScript compiler checks).<br/>3. `pnpm test` (runs Jest unit & integration tests).<br/>4. `pnpm build` (runs full production builds across all apps/packages). |

---

## 3. External GitHub Actions Matrix

| Action Identifier | Type / Language | Inputs | Outputs | Secrets Required / Consumed | Core Behavior & Logic |
|---|---|---|---|---|---|
| [`abhisin98/avivox-action-setup-github-app@v1`](https://github.com/abhisin98/avivox-action-setup-github-app) | JavaScript (Node 24) | • `app-client-id` (req)<br/>• `app-private-key` (req)<br/>• `auto-setup-git-identity` (opt, def: `true`) | • `app-token`<br/>• `app-slug` | `APP_CLIENT_ID`<br/>`APP_PRIVATE_KEY` | Generates a scoped GitHub App installation access token and configures git identity (`release-bot[bot] <id+release-bot[bot]@users.noreply.github.com>`). Enables bot commits to trigger downstream GitHub workflows and bypass branch rulesets. |
| [`abhisin98/avivox-action-railway-deploy@v1`](https://github.com/abhisin98/avivox-action-railway-deploy) | TypeScript (Node 24 via `dist/index.cjs`) | • `api-token` (req)<br/>• `project-id` (req)<br/>• `environment-id` (req)<br/>• `service-id` (req)<br/>• `preview` (opt, def: `false`)<br/>• `pr-number` (opt)<br/>• `cleanup-preview` (opt, def: `false`)<br/>• `github-token` (opt) | • `url` (deployed endpoint) | `RAILWAY_API_TOKEN`<br/>`RAILWAY_PROJECT_ID`<br/>`RAILWAY_ENVIRONMENT_ID`<br/>`RAILWAY_SERVICE_ID` | Connects to Railway API. In PR mode (`preview: true`), provisions an isolated environment `preview-<pr-number>`, deploys the service, and creates/updates a single PR comment with the live URL. When `cleanup-preview: true`, deletes the ephemeral preview environment. In production mode, deploys directly to the target environment. |
| [`abhisin98/avivox-action-changelogs-and-package-releases@v1`](https://github.com/abhisin98/avivox-action-changelogs-and-package-releases) | TypeScript (Node 24 via `dist/index.cjs`) | • `release-type` (opt, def: `auto`)<br/>• `pr-number` (opt)<br/>• `head-sha` (opt)<br/>• `commit-and-push` (opt, def: `true`)<br/>• `create-release` (opt, def: `true`)<br/>• `commit-message` (opt)<br/>• `publish-packages` (opt, def: `true`)<br/>• `package-manager` (opt, def: `pnpm`)<br/>• `package-access` (opt, def: `public`)<br/>• `publish-package-tag` (opt, def: `latest`)<br/>• `github-token` (opt) | • `releases` (JSON array of released packages & versions) | `NPM_TOKEN`<br/>`GITHUB_TOKEN` or `APP_TOKEN` | Analyzes commit history against [`cliff.toml`](../cliff.toml) using `git-cliff`. Detects semver bumps (feat ➔ minor, fix ➔ patch, BREAKING CHANGE ➔ major). Updates `package.json` versions and generates `CHANGELOG.md` for each package. Publishes packages to npm, pushes release commit `chore(release): ... [skip ci]`, creates git tags (`package@x.y.z`), and publishes GitHub Releases. |
| [`abhisin98/avivox-action-promotion-engine@v1`](https://github.com/abhisin98/avivox-action-promotion-engine) | TypeScript (Node 24 via `dist/index.cjs`) | • `source-branch-name` (req)<br/>• `promotion-target` (req: `qa` or `beta`)<br/>• `github-token` (opt) | _None (side-effects via GitHub API)_ | `GITHUB_TOKEN` or `APP_TOKEN` | **Target `qa`**: Validates `dev/*` naming regex, creates `qa/*` branch if missing, or creates PR `dev/*` ➔ `qa/*` if branch exists and has diffs.<br/>**Target `beta`**: Validates `qa/*` naming regex, opens PR `qa/*` ➔ `main`, attaches `beta-release` label, prevents duplicate PRs, and skips creation if HEADs match. |
| [`taiki-e/install-action@git-cliff`](https://github.com/taiki-e/install-action) | Composite Action | `tool` (git-cliff) | _None_ | None | Quickly installs the pre-compiled native `git-cliff` binary onto the GitHub Actions runner. |

---

## 4. GitHub Secrets & Configuration Matrix

| Secret Name | Requirement Level | Consuming Workflows | How to Obtain / Configure |
|---|---|---|---|
| `RAILWAY_API_TOKEN` | 🔴 **Required** | `beta.yml`, `beta-cleanup.yml`, `prod.yml`, `patch.yml` | In Railway: **Account Settings → Tokens → Create API Token** (scope to your personal account, not workspace). |
| `RAILWAY_PROJECT_ID` | 🔴 **Required** | `beta.yml`, `beta-cleanup.yml`, `prod.yml`, `patch.yml` | In Railway: Project dashboard URL or Project Settings (**Project ID**). |
| `RAILWAY_ENVIRONMENT_ID` | 🔴 **Required** | `beta.yml`, `beta-cleanup.yml`, `prod.yml`, `patch.yml` | In Railway: Environment settings (ID of base environment to clone for preview or deploy for prod). |
| `RAILWAY_SERVICE_ID` | 🔴 **Required** | `beta.yml`, `beta-cleanup.yml`, `prod.yml`, `patch.yml` | In Railway: Web Service settings (**Service ID**). |
| `NPM_TOKEN` | 🔴 **Required** | `beta.yml`, `prod.yml`, `patch.yml` | In npmjs.com: **Access Tokens → Generate New Token → Granular Access Token** with write permissions for `@avivox` / `@avivox-workspace` packages. |
| `APP_CLIENT_ID` | 🟢 **Recommended** | `create-qa.yml`, `create-beta.yml`, `beta.yml`, `prod.yml`, `patch.yml` | GitHub App Settings: **General → About → Client ID**. |
| `APP_PRIVATE_KEY` | 🟢 **Recommended** | `create-qa.yml`, `create-beta.yml`, `beta.yml`, `prod.yml`, `patch.yml` | GitHub App Settings: **General → Private keys → Generate a private key** (Paste full `.pem` file content). |

> [!NOTE]
> If `APP_CLIENT_ID` and `APP_PRIVATE_KEY` are not set, workflows seamlessly fall back to `${{ github.token }}` (`github-actions[bot]`).

---

## 5. Railway Preview & Production Environments

- **Staging Preview**: When a PR is opened targeting `main` with label `beta-release`, `beta.yml` calls `abhisin98/avivox-action-railway-deploy@v1` with `preview: true`. It duplicates the base environment into `preview-<pr-number>` and posts a pinned comment in the PR with the live URL.
- **Teardown**: When the PR is merged or closed, `beta-cleanup.yml` deletes the ephemeral preview environment automatically.
- **Production**: When code is merged to `main`, `prod.yml` deploys the web app directly to the production environment on Railway.

---

## 6. Automated SemVer & Package Release Pipeline

- Driven by `git-cliff` and [`cliff.toml`](../cliff.toml).
- Inspects Conventional Commits to calculate version increments:
  - `feat`: Minor bump (`0.1.0` ➔ `0.2.0`)
  - `fix` / `perf`: Patch bump (`0.1.0` ➔ `0.1.1`)
  - `!` / `BREAKING CHANGE:`: Major bump (`1.0.0` ➔ `2.0.0`)
- Generates `CHANGELOG.md` per package and creates git release tags automatically.

