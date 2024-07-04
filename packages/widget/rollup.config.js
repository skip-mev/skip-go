import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

import packageJson from './package.json';

export default [
  {
    input: ['./src/index.ts'],
    external: ['react', 'react-dom', '@r2wc/react-to-web-component'],
    output: {
      file: packageJson.exports['.'].import,
      format: 'esm',
      sourcemap: true,
      globals: {
        react: 'react',
        'react-dom': 'react-dom',
        '@r2wc/react-to-web-component': '@r2wc',
      },
    },
    plugins: [
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        extract: 'style.css',
      }),
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
      resolve({
        browser: true,
      }),
    ],
  },
];
