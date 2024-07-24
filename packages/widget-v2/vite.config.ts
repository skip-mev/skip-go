import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.tsx'),
      output: {
        format: 'esm',
        sourcemap: true,
      },
    },
  },
});
