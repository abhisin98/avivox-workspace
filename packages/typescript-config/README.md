# Typescript Config

Shared TypeScript configuration presets for the Avivox Workspace and external projects.

## Overview

This package provides pre-configured TypeScript configurations for different environments and frameworks, built on top of a comprehensive base configuration with strict type checking and modern best practices.

## Available Configurations

### Base Configuration (`tsconfig.base.json`)
A comprehensive base configuration with strict type checking enabled. Includes:
- Strict mode enabled
- Unused variable detection
- Exact optional property types
- No implicit returns
- And many more strict checks

### Next.js (`nextjs.json`)
Extends the base config for Next.js applications.
- Target: ES2017
- Module: ESNext with bundler resolution
- JSX: preserve
- Includes Next.js plugin and type definitions

### React (`react.json`)
Extends the base config for React applications (non-Next.js).
- Target: ES2015
- Module: ESNext with bundler resolution
- JSX: react-jsx
- DOM libraries included

### Node.js (`node.json`)
Extends the base config for Node.js applications.
- Target: ES2022
- Module: ESNext with bundler resolution
- ES2024 libraries
- JSON module resolution

### React Native (`native.json`)
Extends the base config for React Native applications.
- Target: ESNext
- Module: preserve
- JSX: react-native
- Custom conditions for React Native

## Installation

### In the Avivox Workspace
The package is already available as a workspace dependency. Use it directly in your `tsconfig.json`:

```json
{
  "extends": "@avivox-workspace/typescript-config/nextjs.json"
}
```

### External Projects
Install via npm or pnpm:

```bash
npm install --save-dev @avivox-workspace/typescript-config
```

Or with pnpm:

```bash
pnpm add -D @avivox-workspace/typescript-config
```

Then extend in your `tsconfig.json`:

```json
{
  "extends": "@avivox-workspace/typescript-config/react.json"
}
```

## Usage Examples

### Next.js Project
```json
// tsconfig.json
{
  "extends": "@avivox-workspace/typescript-config/nextjs.json",
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### React Library
```json
// tsconfig.json
{
  "extends": "@avivox-workspace/typescript-config/react.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts", "**/*.test.tsx"]
}
```

### Node.js Application
```json
// tsconfig.json
{
  "extends": "@avivox-workspace/typescript-config/node.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### React Native App
```json
// tsconfig.json
{
  "extends": "@avivox-workspace/typescript-config/native.json",
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "android", "ios"]
}
```

## Customization

You can override any settings by adding them to your `compilerOptions` after extending:

```json
{
  "extends": "@avivox-workspace/typescript-config/base.json",
  "compilerOptions": {
    "target": "es2018",
    "noUnusedLocals": false
  }
}
```

## Contributing

See the root [README.md](../../README.md) for contribution guidelines.

For TypeScript configuration changes, refer to the [NOTES.md](./NOTES.md) for best practices.