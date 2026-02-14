import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "src/domain"),
      "@application": path.resolve(__dirname, "src/application"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@ui": path.resolve(__dirname, "src/ui"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@routes": path.resolve(__dirname, "src/ui/routes"),
      "@modules": path.resolve(__dirname, "src/ui/modules"),
    },
  },
});
