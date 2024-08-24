import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

const createConfig = (
  directory = '',
  file = '',
  output = {},
  plugins = [],
  config = {}
) => ({
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    file: `${directory}/${file}`,
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
  createConfig(
    './build/react',
    'index.es.js',
    { format: 'esm' },
    [peerDepsExternal()],
    { external: ['react', 'react-dom'] }
  ),
  // (bundled React)
  createConfig(
    './build/web-component',
    'index.es.js',
    {
      format: 'esm',
      name: 'WebComponent',
      inlineDynamicImports: true,
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react/jsx-runtime': 'React.jsx',
      },
    },
    [
      alias({
        entries: [
          {
            find: /(.*)react\/jsx-runtime$/,
            replacement: 'react/jsx-runtime.js',
          },
          {
            find: 'process.env.NODE_ENV',
            replacement: JSON.stringify('production'),
          },
        ],
      }),
      nodeResolve({
        resolveOnly: [
          'react',
          'react-dom',
          '@radix-ui',
          'styled-components',
          'tslib',
          '@vanilla-extract',
        ],
        dedupe: ['react', 'react-dom'],
        preserveSymlinks: true,
      }),
      commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto',
        transformMixedEsModules: true,
      }),
    ]
  ),
];
