import { defineConfig } from "vite";
import builtins from "builtin-modules";

const OBSIDIAN_EXTERNALS = [
  "obsidian",
  "electron",
  "@codemirror/autocomplete",
  "@codemirror/collab",
  "@codemirror/commands",
  "@codemirror/language",
  "@codemirror/lint",
  "@codemirror/search",
  "@codemirror/state",
  "@codemirror/view",
  "@lezer/common",
  "@lezer/highlight",
  "@lezer/lr",
];

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "DynamicTags",
      formats: ["cjs"],
      fileName: () => "main.js",
    },
    outDir: ".",
    emptyOutDir: false,
    sourcemap: "inline",
    target: "es2022",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [...OBSIDIAN_EXTERNALS, ...builtins],
      output: {
        entryFileNames: "main.js",
        assetFileNames: (assetInfo) => {
          // Emit compiled CSS as styles.css at the repo root
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "styles.css";
          }
          return "assets/[name].[ext]";
        },
        globals: {
          obsidian: "obsidian",
        },
      },
    },
  },
});