import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.tsx'),
      name: 'widget-v2',
    },
    sourcemap: true,
    rollupOptions: {
      output: {
        dir: 'build',
        format: 'esm',
        entryFileNames: '[name].js',
      },
    },
  },
});
