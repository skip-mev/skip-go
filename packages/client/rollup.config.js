import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import polyfillNode from 'rollup-plugin-polyfill-node'; // Add this line

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
        preferBuiltins: false, // Ensure that node built-ins are resolved to polyfills
      }),
    commonjs(),
    polyfillNode(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,            // Generate declaration files
      declarationDir: 'dist/types', // Output for .d.ts files
    }),
    json(),
    terser(),
  ],
  external: ['axios', '@cosmjs/amino', '@cosmjs/stargate'],
};
