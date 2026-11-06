import path from "path";
import { defineConfig } from "vitest/config";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  base: "/fall",
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
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
