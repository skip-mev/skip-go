import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import {resolve, dirname} from 'path';
import css from "rollup-plugin-import-css";
import { vanillaExtractPlugin} from "@vanilla-extract/rollup-plugin"

const createConfig = ({
  input = 'src/index.ts',
  directory = '',
  output = {},
  plugins = [],
  config = {}
}) => ({
  input,
  preserveSymlinks: true,
  output: {
    sourcemap: true,
    file: `${directory}/index.es.js`,
    ...output,
  },
  plugins: [
    postcss({
      config: {
        path: './postcss.config.js',
      },
      inject: false,
      extensions: ['.css'],
      minimize: true,
    }),
    url({
      include: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
      limit: Infinity,
    }),
    ...plugins,
    typescript({
      // tsconfig: './tsconfig.json',
      // tsconfigOverride: {
      //   compilerOptions: {
      //     declaration: true,
      //     declarationDir: './build/types',
      //   },
      // },
      // useTsconfigDeclarationDir: true,
      preserveSymlinks: true,
    }),
    terser(),
  ],
  ...config,
});

export default [
  // (external React)
  // createConfig({
  //   directory: './build/react',
  //   plugins: [peerDepsExternal()],
  // }),
  // (bundled React)
  createConfig({
    input: 'src/web-component.tsx',
    directory:  './build/web-component',
    output: {
      sourcemap: false,
      name: 'WebComponent',
      inlineDynamicImports: true,
    },
    plugins: [
      alias({
        entries: [
          {
            find: 'process.env.NODE_ENV',
            replacement: JSON.stringify('production'),
          },
          // { find: 'cssesc', replacement: resolve(dirname('src/cssesc-wrapper.js')) }
        ]
      }),
      nodeResolve({
         resolveOnly: [
          'react',
          'react-dom',
          'styled-components',
          // '@interchain-ui/react',
          // '@vanilla-extract',
          // '@cosmos-kit/react',
          // 'immer',
          // 'zustand',
          'tslib',
          // 'bignumber.js',
        ],
        dedupe: ['react', 'react-dom'],
        preferBuiltins: false,
        preserveSymlinks: true,
      }),
      nodePolyfills({
        include: ['buffer'],
      }),
      json(),
      commonjs({
        include: [
          /node_modules(\/|\\).*/,
          /node_modules(\/|\\).*\/node_modules/,
        ],
        requireReturnsDefault: 'auto',
        defaultIsModuleExports: 'auto',
      }),
      visualizer({
        filename: 'bundle-analysis.html',
      }),
    ],
    config: {
      external: ['@interchain-ui/react']
    }
  })
];
