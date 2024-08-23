import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';

export default [
  {
    input: ['./src/index.tsx'],
    output: {
      file: 'build/index.js',
      format: 'umd',
      name: 'WebComponent',
      inlineDynamicImports: true,
    },
    plugins: [
      nodeResolve({
        browser: true,
      }),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
      json(),
      commonjs(),
      visualizer({
        filename: 'bundle-analysis.html',
        open: true,
      }),
      terser(),
    ],
  },
];
