import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import json from '@rollup/plugin-json';
import { visualizer } from 'rollup-plugin-visualizer';

const createConfig = ({
  input = 'src/index.ts',
  directory = '',
  output = {},
  plugins = [],
  config = {}
}) => ({
  input,
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
      tsconfig: './tsconfig.json',
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: './build/types',
        },
      },
      useTsconfigDeclarationDir: true,
    }),
  ],
  ...config,
});

export default [
  // (external React)
  createConfig({
    directory: './build/react',
    plugins: [peerDepsExternal()],
  }),
  // (bundled React)
  createConfig({
    directory:  './build/web-component',
    output: {
      name: 'WebComponent',
      interop: "esModule",
    },
    plugins: [
      nodeResolve({
        browser: true,
        resolveOnly: ['react', 'react-dom', 'styled-components'],
        dedupe: ['react', 'react-dom'],
      }),
      json(),
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto',
        transformMixedEsModules: true,
      }),
      visualizer({
        filename: 'bundle-analysis.html',
        open: true,
      }),
    ]
  })
];
