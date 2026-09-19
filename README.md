# Avivox Workspace

A modern monorepo setup for building scalable applications with Next.js, shared UI components, and robust tooling.

## Overview

This monorepo contains:

- **Web App**: A Next.js application (`apps/web`)
- **UI Library**: Shared React components (`packages/ui`)
- **ESLint Config**: Shared ESLint configurations (`packages/eslint-config`)
- **TypeScript Config**: Shared TypeScript configurations (`packages/typescript-config`)

Built with modern tools including Turborepo for build orchestration, pnpm for package management, and comprehensive testing and linting setups.

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Build Tool**: Turborepo
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Testing**: Jest
- **Linting**: ESLint with custom configs
- **Code Formatting**: Prettier
- **Changelog**: git-cliff

## Getting Started

### Prerequisites

- Node.js >= 24
- pnpm >= 10.33

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhisin98/avivox-workspace.git
   cd avivox-workspace
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:
```bash
pnpm dev
```

This will start the web app at `http://localhost:3000`.

### Building

Build all packages and apps:
```bash
pnpm build
```

Build only packages:
```bash
pnpm build:packages
```

## Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all apps and packages
- `pnpm lint` - Lint all code
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm clean` - Clean build artifacts
- `pnpm format` - Format code with Prettier

## Project Structure

```
├── apps/
│   └── web/                 # Next.js web application
│       ├── app/
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── next.config.ts
│       └── package.json
├── packages/
│   ├── eslint-config/       # Shared ESLint configurations
│   │   ├── default.js
│   │   ├── react.js
│   │   └── ...
│   ├── typescript-config/   # Shared TypeScript configurations
│   │   ├── nextjs.json
│   │   ├── react.json
│   │   └── ...
│   └── ui/                  # Shared React UI components
│       ├── src/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   └── ...
│       └── package.json
├── docs/                    # Central monorepo documentation hub
│   ├── README.md            # Documentation portal index
│   ├── ARCHITECTURE.md      # Monorepo architecture & tech stack
│   ├── WORKFLOW-GUIDE.md    # Developer & QA lifecycle guide
│   ├── COMMIT-GUIDELINES.md # Conventional commit specification
│   ├── BRANCH-PROTECTION.md # GitHub Rulesets & branch policies
│   ├── CI-CD-PIPELINE.md    # Workflows, composite actions & secrets
│   ├── PROMPTS-GUIDE.md     # GitHub Copilot prompt library
│   └── TEMPLATING-GUIDE.md  # Template initialization & upstream sync
├── .github/
│   ├── actions/             # Local composite actions (setup, ci)
│   ├── prompts/             # GitHub Copilot prompt files (.prompt.md)
│   ├── workflows/           # CI/CD pipelines (dev, qa, beta, prod, patch)
│   └── copilot-instructions.md # Global GitHub Copilot workspace instructions
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json             # Root package.json
```

## 🤖 GitHub Copilot Automation Prompts

This repository includes a built-in suite of GitHub Copilot prompt files located in [`.github/prompts/`](.github/prompts/) to automate development workflows:

| Command | Prompt File | Description |
|---|---|---|
| `/sync-docs` | [`.github/prompts/sync-docs.prompt.md`](.github/prompts/sync-docs.prompt.md) | **Auto File/Docs Sync**: Analyzes code/config changes (git diff, modified props, new routes, updated scripts) and automatically synchronizes all affected `README.md` files, architecture matrices, and docs across the repo. |
| `/template-init` | [`.github/prompts/template-init.prompt.md`](.github/prompts/template-init.prompt.md) | **Template Project Initialization**: Initializes this repository for a new project/repo by systematically refactoring package scopes (`@<scope>/*`), project names, repository URLs, branding, and configs with zero broken references. |
| `/sync-upstream` | [`.github/prompts/sync-upstream.prompt.md`](.github/prompts/sync-upstream.prompt.md) | **Upstream Template Sync**: Synchronizes tooling, CI/CD, prompts, docs, and root configs from upstream, **strictly excluding `apps/` and `packages/` folders** to protect downstream project code. |
| `/commit-message` | [`.github/prompts/commit-message.prompt.md`](.github/prompts/commit-message.prompt.md) | **Conventional Commits**: Analyzes staged diffs and generates strict Conventional Commit messages complying with `commitlint.config.js` and `cliff.toml`. |

---

## 🚀 Using as a Template for New Projects

### 1. Initialize a New Repository
1. Click **Use this template** on GitHub or clone this repository.
2. In GitHub Copilot Chat, run `/template-init` and provide your new project name, scope (`@myorg`), and branding.
3. Copilot will automatically rename all package scopes, update code imports, configure tooling configs (`cliff.toml`, `commitlint.config.js`), update documentation, and verify the build.

### 2. Keep Your Project Updated with Upstream Changes
When bug fixes or new tooling updates are pushed to this template:
1. In your downstream repo, add the upstream remote:
   ```bash
   git remote add upstream https://github.com/abhisin98/avivox-workspace.git
   git fetch upstream
   ```
2. In GitHub Copilot Chat, run `/sync-upstream`.
3. Copilot will synchronize CI/CD workflows, actions, docs, and root build configs while **strictly excluding `apps/` and `packages/`** to safeguard your custom application code and UI components.

---

## 📖 Complete Documentation Portal

Explore our full documentation suite in [`docs/`](docs/):

- 📚 [**Documentation Portal Index**](docs/README.md)
- 🏗️ [**Architecture & Tech Stack Reference**](docs/ARCHITECTURE.md)
- 🔄 [**Developer & QA Workflow Guide**](docs/WORKFLOW-GUIDE.md)
- ✍️ [**Commit Message Guidelines**](docs/COMMIT-GUIDELINES.md)
- 🛡️ [**Branch Protection & Rulesets**](docs/BRANCH-PROTECTION.md)
- ⚡ [**CI/CD Pipeline Reference**](docs/CI-CD-PIPELINE.md)
- 🤖 [**Copilot Automation Prompts Guide**](docs/PROMPTS-GUIDE.md)
- 🚀 [**Monorepo Templating & Upstream Sync**](docs/TEMPLATING-GUIDE.md)

## Changelog

Changelogs are automatically generated using git-cliff. See [cliff.toml](./cliff.toml) for configuration.

## Author

[abhisin98](https://github.com/abhisin98)

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

