import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import webpack from 'webpack';
import createPackageJson from './widget-web-component/createPackageJson.cjs';

createPackageJson();

export default {
  entry: './src/web-component.tsx',

  // Output configuration
  output: {
    path: resolve(__dirname, 'widget-web-component/build'),
    filename: 'index.js',
    library: {
      type: 'module',
      export: 'default',
    },
    module: true,
    globalObject: 'typeof self !== "undefined" ? self : this',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts'],
    },
  },

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.tsx?$/, // Transpile TypeScript and JSX files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          'raw-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: resolve(__dirname, 'postcss.config.mjs'),
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: Infinity,
              encoding: 'base64',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(false),
    }),
    new NodePolyfillPlugin(),
  ],

  optimization: {
    minimize: true,
  },

  experiments: {
    outputModule: true,
  },

  externals: [],
};
