import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@fonts': path.resolve(__dirname, './src/fonts'),
      '@icons': path.resolve(__dirname, './src/icons'),
      '@state': path.resolve(__dirname, './src/state'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@widget': path.resolve(__dirname, './src/widget'),
      '@modals': path.resolve(__dirname, './src/widget/modals'),
      '@pages': path.resolve(__dirname, './src/widget/pages'),
    },
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      outDir: 'build',
      tsconfigPath: './tsconfig.app.json',
    }),
    nodePolyfills(),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.tsx'),
      formats: ['es'],
      name: 'widget-v2',
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@r2wc/react-to-web-component',
      ],
      output: {
        dir: 'build',
        entryFileNames: '[name].js',
      },
    },
  },
});
