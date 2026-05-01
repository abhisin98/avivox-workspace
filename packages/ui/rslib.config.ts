import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2022",
      dts: true,
      bundle: false,
    },
    {
      format: "cjs",
      syntax: "es2022",
      bundle: false,
    },
  ],
  source: {
    entry: {
      index: ["src/**/*", "!src/**/{__tests__,__helpers__}/**/*"],
    },
    tsconfigPath: "tsconfig.build.json",
  },
  output: {
    target: "web",
    distPath: "./build",
    cleanDistPath: true,
  },
  plugins: [pluginReact()],
  mode: "production",
});
