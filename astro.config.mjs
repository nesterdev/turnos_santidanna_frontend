// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from "path";
export default defineConfig({
  output: "static", // 🔥 CLAVE: build estático
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
});
