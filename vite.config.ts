import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Разбиваем по названиям модулей
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'reactVendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('swiper')) {
              return 'swiper';
            }
            // Все остальное из node_modules
            return 'vendor';
          }
        }
      }
    }
  }
});
