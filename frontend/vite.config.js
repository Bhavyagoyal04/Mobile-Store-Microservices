import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Plain Vite + React SPA configuration.
// Proxy clean API paths to the Spring Cloud Gateway on :8080.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 5173,
    strictPort: true,
    historyApiFallback: true,
    proxy: {
      "/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/mobiles": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/customers": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/orders": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/bills": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    }
  },
});