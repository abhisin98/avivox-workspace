import eslintConfig from "@avivox/eslint-config/default.js";
import { includeIgnoreFile } from "@eslint/compat";
import { defineConfig } from "eslint/config";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gitignorePath = resolve(__dirname, ".gitignore");
const prettierignorePath = resolve(__dirname, ".prettierignore");

export default defineConfig([
  //
  eslintConfig,
  //
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  includeIgnoreFile(prettierignorePath, "Imported .prettierignore patterns"),
]);
