import { defineConfig } from 'vite';
import inspect from 'vite-plugin-inspect';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

const enableVisualizer = process.env.VISUALIZE === 'true';

export default defineConfig({
  plugins: [
    inspect(),
    ...(enableVisualizer ? [visualizer({ open: true })] : [])
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'ClientTest',
      fileName: 'client-test',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
});