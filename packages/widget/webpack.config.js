import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import webpack from 'webpack';

export default {
  entry: './src/web-component.tsx',

  // Output configuration
  output: {
    path: resolve(__dirname, 'build/web-component'),
    filename: 'index.js', // Output file name
    library: {
      // name: 'web-component',
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

  // devtool: 'source-map',

  // Module rules
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
        test: /\.jsx?$/, // Transpile JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react',
            ],
            plugins: ['@babel/plugin-transform-modules-commonjs'],
          },
        },
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-analysis.html',
    }),
    // new webpack.optimize.LimitChunkCountPlugin({
    //   maxChunks: 1,
    // }),
    new webpack.DefinePlugin({
      'process.env.NODE_DEBUG': JSON.stringify(false),
    }),
    new NodePolyfillPlugin(),
  ],

  optimization: {
    minimize: true,
    // splitChunks: false,
    // runtimeChunk: false,
  },

  experiments: {
    outputModule: true,
  },

  externals: [
    // 'chain-registry/types',
    // 'chain-registry',
    // '@initia/initia-registry'
  ],
};
