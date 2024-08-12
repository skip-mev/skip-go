import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    preserveSymlinks: true,
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      outDir: 'build',
      tsconfigPath: './tsconfig.app.json',
    }),
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
