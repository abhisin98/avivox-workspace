# Web App

The Next.js web application for Avivox Workspace.

## Overview

This is the main web application built with Next.js 16 and React 19, utilizing shared UI components from the monorepo.

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: React 19
- **Styling**: Shared UI components from `@avivox-workspace/ui`
- **Language**: TypeScript
- **Linting**: ESLint with custom configs
- **Build Tool**: Turborepo

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8.15

### Installation

From the monorepo root:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev --filter=web
```

Or from the web directory:

```bash
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building

```bash
pnpm build
```

### Linting

```bash
pnpm lint
```

### Type Checking

```bash
pnpm type-check
```

## Project Structure

- `app/`: Next.js app router pages and layouts
- `public/`: Static assets
- `package.json`: Dependencies and scripts
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `eslint.config.js`: ESLint configuration

## Contributing

See the root [README.md](../README.md) for monorepo-wide contribution guidelines.