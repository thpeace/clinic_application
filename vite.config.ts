import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Required for WSL to detect file changes on Windows filesystem
      interval: 50, // Aggressive polling for WSL
    },
  },
  build: {
    // incrase the chunk size warning limit to 2MB
    outDir: "build",
    chunkSizeWarningLimit: 2048,
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
