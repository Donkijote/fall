import path from "path";
import { defineConfig, lazyPlugins } from "vite-plus";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

const host = process.env.TAURI_DEV_HOST;

// https://viteplus.dev/config/
export default defineConfig({
  fmt: {
    // Native tooling and the notice generator own these files' serialization.
    ignorePatterns: ["src-tauri/**", "src/modules/credits/domain/software-notices.json"],
    sortTailwindcss: {
      stylesheet: "./src/index.css",
    },
    sortImports: {
      customGroups: [
        {
          groupName: "react-scope",
          elementNamePattern: ["@react/**"],
        },
        {
          groupName: "app-alias",
          elementNamePattern: ["@/**"],
        },
        {
          groupName: "scoped-packages",
          elementNamePattern: ["@*/**"],
        },
      ],
      groups: [
        ["builtin", "external"],
        "react-scope",
        "app-alias",
        "scoped-packages",
        ["parent", "sibling", "index"],
        "unknown",
      ],
    },
  },
  lint: {
    ignorePatterns: ["src-tauri/**"],
    env: {
      browser: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  plugins: lazyPlugins(() => [react({ compiler: true }), tailwindcss()]),
  build: {
    license: { fileName: "bundled-code-licenses.json" },
  },
  server: {
    open: true,
    port: 3000,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vite.setup-tests.ts"],
    include: ["./src/**/*.test.ts", "./src/**/*.test.tsx", "./scripts/**/*.test.mjs"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/*.test.*", "./src/main.tsx", "./*.config.*", "./*.d.*"],
    },
  },
});
