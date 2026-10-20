import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/todos": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      "/profile": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})

