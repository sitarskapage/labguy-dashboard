import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import version from 'vite-plugin-package-version';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  base: `/labguy-dashboard`,
  plugins: [
    react(),
    version(),
    viteStaticCopy({
      targets: [
        {
          src: 'dist/index.html',
          dest: '',
          rename: '404.html'
        }
      ]
    })
  ]
});
