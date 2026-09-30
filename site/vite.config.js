import { rmSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Media, brand files and the OG image are shared with the rest of the repo in ../public.
// When MEDIA_BASE is set (for example the public URL of the R2 bucket), every "/media/..." path is
// rewritten to "<MEDIA_BASE>/media/..." at build time and the media folder is left out of dist,
// so images and videos are served from R2 instead of Pages. Without it, media ship with the site.
// Cloudflare Pages builds (CF_PAGES is set there) default to the avoflare R2 bucket.
const R2_PUBLIC = 'https://pub-dead812eb1de4654a9d56f298fda8604.r2.dev';
const MEDIA_BASE = (process.env.MEDIA_BASE ?? (process.env.CF_PAGES ? R2_PUBLIC : '')).replace(/\/+$/, '');
const rewrite = code => code.replace(/(?<=["'(\s,`])\/media\//g, `${MEDIA_BASE}/media/`);

function mediaFromR2() {
  let outDir;
  return {
    name: 'media-from-r2',
    apply: 'build',
    enforce: 'pre',
    configResolved(c) { outDir = c.build.outDir; },
    transform(code, id) { if (/\.(jsx?|css)$/.test(id.split('?')[0]) && code.includes('/media/')) return { code: rewrite(code), map: null }; },
    transformIndexHtml: html => rewrite(html),
    closeBundle() { rmSync(resolve(outDir, 'media'), { recursive: true, force: true }); },
  };
}

export default defineConfig({
  plugins: [react(), MEDIA_BASE && mediaFromR2()],
  publicDir: '../public',
  server: { fs: { allow: ['..'] } },
  build: {
    rollupOptions: {
      input: { main: resolve(import.meta.dirname, 'index.html'), how: resolve(import.meta.dirname, 'how-it-works.html') },
    },
  },
});
