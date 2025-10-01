import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true, // allows using `describe`, `it`, `expect` without import
    environment: "jsdom", // simulates browser (fixes `document is not defined`)
    setupFiles: "./src/setupTests.js", // your test setup file (RTL config, mocks, etc.)
  },
});
