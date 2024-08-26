import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import url from '@rollup/plugin-url';
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
    typescript(),
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
            find: 'process.env.NODE_ENV',
            replacement: JSON.stringify('production'),
          },
        ],
      }),
      nodeResolve({
        browser: true,
        preferBuiltins: false,
        resolveOnly: ['react', 'react-dom', '@radix-ui'],
        dedupe: ['react', 'react-dom'],
        preserveSymlinks: true,
      }),
    ],
  ),
];
