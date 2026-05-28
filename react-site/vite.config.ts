import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In dev: base '/' so public assets are served at /assets/...
  // In build (GitHub Pages): base '/linktree-levelup/' so URLs resolve correctly
  base: command === 'build' ? '/linktree-levelup/' : '/',
  server: { port: 5173, open: true },
}));
