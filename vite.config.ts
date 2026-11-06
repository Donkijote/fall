import path from "path";
import { defineConfig, lazyPlugins } from "vite-plus";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

// https://viteplus.dev/config/
export default defineConfig({
  fmt: {
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
    env: {
      browser: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  base: "/fall",
  plugins: lazyPlugins(() => [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()]),
  server: {
    open: true,
    port: 3000,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vite.setup-tests.ts"],
    include: ["./src/**/*.test.ts", "./src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/*.test.*", "./src/main.tsx", "./*.config.*", "./*.d.*"],
    },
  },
});
