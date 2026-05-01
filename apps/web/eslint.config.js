import eslintConfig from "@avivox/eslint-config/react.js";
import eslintpluginnext from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";

const { configs } = eslintpluginnext;

export default defineConfig([
  //
  configs.recommended,
  eslintConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-overload-matches": "off",
      "react/jsx-key": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
    settings: {
      next: {
        rootDir: "apps/web/",
      },
    },
  },
  globalIgnores(["node_modules", ".next", "build"]),
]);
