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

## Contributing

Please follow the [commit message guidelines](./commit-message-guidelines.md) for all commits.

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
