# ESLint Config

Shared ESLint configurations for the Avivox workspace.

## Installation

```bash
pnpm add -D @avivox-workspace/eslint-config eslint
```

## Usage

Import the desired configuration in your `.eslintrc.js` or `eslint.config.js`:

### Configurations

- **`default`** - Base ESLint configuration
- **`react`** - React-specific configuration
- **`node`** - Node.js configuration
- **`native`** - React Native configuration
- **`graphql`** - GraphQL configuration

### Examples

#### React Project

```javascript
import config from '@avivox-workspace/eslint-config/react.js';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  ...config,
];
```

#### Node.js Project

```javascript
import config from '@avivox-workspace/eslint-config/node.js';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  ...config,
];
```

#### GraphQL Project

```javascript
import config from '@avivox-workspace/eslint-config/graphql.js';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  ...config,
];
```

## Dependencies

This configuration extends [`eslint-config-universe`](https://github.com/expo/eslint-config-universe) and includes support for GraphQL linting via `@graphql-eslint/eslint-plugin`.

## Peer Dependencies

- **eslint** >= 8.51
- **prettier** >= 3.0 (optional)

## License

MIT
