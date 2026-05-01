# ESLint Config

Shared ESLint configurations for the Avivox Workspace and external projects.

## Installation

```bash
pnpm add -D @avivox/eslint-config eslint@9.39.2
```

## Usage

Import the desired configuration in your `eslint.config.js`:

### Configurations

- **`default`** - Base ESLint configuration
- **`react`** - React-specific configuration
- **`node`** - Node.js configuration
- **`native`** - React Native configuration
- **`graphql`** - GraphQL configuration

### Examples

#### React Project

```javascript
import eslintConfig from '@avivox/eslint-config/react.js';
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslintConfig,
]);
```

#### Node.js Project

```javascript
import eslintConfig from '@avivox/eslint-config/node.js';
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslintConfig,
]);
```

#### GraphQL Project

```javascript
// eslint.config.js
import graphqlEslintconfig from '@avivox/eslint-config/graphql.js';
import eslintConfig from '@avivox/eslint-config/node.js';
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslintConfig,
  graphqlEslintconfig.schemaConfig,
]);
```

```javascript
// eslint.config.js
import graphqlEslintconfig from '@avivox/eslint-config/graphql.js';
import eslintConfig from '@avivox/eslint-config/node.js';
import { defineConfig } from "eslint/config";

export default defineConfig([
  eslintConfig,
  graphqlEslintconfig.operationsRulesConfig,
]);
```

## Dependencies

This configuration extends [`eslint-config-universe`](https://github.com/expo/eslint-config-universe) and includes support for GraphQL linting via `@graphql-eslint/eslint-plugin`.

## Peer Dependencies

- **eslint** >= 8.51
- **prettier** >= 3.0 (optional)

## License

MIT