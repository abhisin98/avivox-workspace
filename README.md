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
├── turbo.json               # Turborepo configuration
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── package.json             # Root package.json
```

## Packages

### @avivox-workspace/ui

A shared React component library built with Rslib.

**Usage:**
```tsx
import { Button } from "@avivox-workspace/ui/button";

<Button appName="my-app">Click me</Button>
```

### @avivox-workspace/eslint-config

Shared ESLint configurations for different environments:
- `default` - Base configuration
- `react` - React-specific rules
- `node` - Node.js rules
- `graphql` - GraphQL rules
- `native` - React Native rules

### @avivox-workspace/typescript-config

Shared TypeScript configurations:
- `nextjs.json` - For Next.js apps
- `react.json` - For React libraries
- `node.json` - For Node.js packages
- `native.json` - For React Native

## Contributing

Please follow the [commit message guidelines](./commit-message-guidelines.md) for all commits.

### Commit Types

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Testing changes
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `revert` — Revert commits

### Scopes

Use appropriate scopes like `web`, `ui`, etc.

## Changelog

Changelogs are automatically generated using git-cliff. See [cliff.toml](./cliff.toml) for configuration.

## Author

[abhisin98](https://github.com/abhisin98)

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
