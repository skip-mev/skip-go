import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { visualizer } from 'rollup-plugin-visualizer';
import terser from '@rollup/plugin-terser';

// List of @cosmjs packages to externalize
const cosmjsPackages = [
  '@cosmjs/utils',
  '@cosmjs/crypto',
  '@cosmjs/encoding',
  '@cosmjs/math',
  '@cosmjs/amino',
  '@cosmjs/stargate',
  '@cosmjs/proto-signing',
  '@cosmjs/cosmwasm-stargate',
];

export default [
  {
    input: ['./src/index.ts'],
    output: {
      dir: 'build',
      format: 'esm',
      name: 'WebComponent',
      sourcemap: true,
      globals: {
        react: 'react',
        'react-dom': 'ReactDOM',
        ...Object.fromEntries(
          cosmjsPackages.map((pkg) => [pkg, `CosmJS.${pkg.split('/')[1]}`])
        ),
      },
    },
    external: ['react', 'react-dom', ...cosmjsPackages],
    plugins: [
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
      // terser(),
    ],
  },
];
