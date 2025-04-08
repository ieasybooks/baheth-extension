import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  minify: !options.watch,
  splitting: false,
  sourcemap: false,
  entry: {
    content: "src/content.ts",
  },
  publicDir: "src/public/",
  dts: false,
}));
