const { default: graphqlPlugin } = require("@graphql-eslint/eslint-plugin");
const { defineConfig } = require("eslint/config");

const jsTsFileProcessorConfig = {
  files: ["**/*.{ts,js,tsx,jsx}"],
  // Setup processor for operations/fragments definitions on code-files
  processor: graphqlPlugin.processor,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

const graphqlFileParserConfig = {
  // Setup GraphQL Parser
  files: ["**/*.{graphql,gql}"],
  languageOptions: {
    parser: graphqlPlugin.parser,
  },
  plugins: {
    "@graphql-eslint": graphqlPlugin,
  },
};

const schemaRecommendedRules = {
  // Setup recommended config for schema files
  ...graphqlPlugin.configs["flat/schema-recommended"].rules,
  "@graphql-eslint/require-description": ["off"],
  "@graphql-eslint/strict-id-in-types": ["off"],
  "@graphql-eslint/no-unreachable-types": ["off"],
  "@graphql-eslint/naming-convention": ["off"],
  "@graphql-eslint/no-hashtag-description": ["off"],
  "@graphql-eslint/no-typename-prefix": ["off"],
};

const operationsRules = {
  // Setup recommended config for operations files
  ...graphqlPlugin.configs["flat/operations-recommended"].rules,
  "@graphql-eslint/naming-convention": ["off"],
  "@graphql-eslint/require-description": ["off"],
  "@graphql-eslint/no-hashtag-description": ["off"],
};

// --------------------------------------------------------------------
const schemaConfig = defineConfig([
  jsTsFileProcessorConfig,
  {
    ...graphqlFileParserConfig,
    rules: {
      ...schemaRecommendedRules,
      "prettier/prettier": "error",
    },
  },
]);

const operationsRulesConfig = defineConfig([
  jsTsFileProcessorConfig,
  {
    ...graphqlFileParserConfig,
    rules: {
      ...operationsRules,
      "prettier/prettier": "error",
    },
  },
]);

module.exports = { schemaConfig, operationsRulesConfig };
