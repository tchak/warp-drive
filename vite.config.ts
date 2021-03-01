import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

process.env['VITE_COMMIT_REF'] = process.env['COMMIT_REF'] ?? '';

export default defineConfig({
  root: './ui',
  plugins: [
    reactRefresh({
      parserPlugins: ['classProperties', 'classPrivateProperties'],
    }),
  ],
  build: {
    outDir: './dist',
    sourcemap: true,
    chunkSizeWarningLimit: 400,
    manifest: true,
    rollupOptions: {
      input: './ui/src/main.tsx',
    },
  },
});
