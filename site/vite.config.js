import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Media, brand files and the OG image are shared with the rest of the repo in ../public.
export default defineConfig({
  plugins: [react()],
  publicDir: '../public',
  server: { fs: { allow: ['..'] } },
  build: {
    rollupOptions: {
      input: { main: resolve(import.meta.dirname, 'index.html'), how: resolve(import.meta.dirname, 'how-it-works.html') },
    },
  },
});
