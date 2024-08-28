import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import webpack from 'webpack';
import syncVersion from './web-component/syncVersion.cjs';

syncVersion();

// Custom plugin to copy index.d.ts after build
class CopyIndexDtsPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('CopyIndexDtsPlugin', async (compilation) => {
      const srcPath = resolve(__dirname, 'web-component/index.d.ts');
      const destPath = resolve(__dirname, 'web-component/build/index.d.ts');
      await fs.copyFile(srcPath, destPath);
      console.log('index.d.ts has been copied to the build directory');
    });
  }
}

export default {
  entry: './src/web-component.tsx',

  // Output configuration
  output: {
    path: resolve(__dirname, 'web-component/build'),
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
      'process.env.NODE_DEBUG': 'false',
    }),
    new NodePolyfillPlugin(),
    new CopyIndexDtsPlugin(),
  ],

  optimization: {
    minimize: true,
  },

  experiments: {
    outputModule: true,
  },

  externals: [],
};
