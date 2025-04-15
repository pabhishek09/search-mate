import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, 'build')
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
});
