import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function pagesFallback() {
  return {
    name: 'pages-fallback',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist');
      const index = path.join(dist, 'index.html');
      if (!fs.existsSync(index)) {
        return;
      }
      fs.copyFileSync(index, path.join(dist, '404.html'));
    },
  };
}

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react(), pagesFallback()],
  server: {
    fs: {
      allow: [path.resolve('..')],
    },
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
