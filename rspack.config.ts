import { defineConfig } from '@rspack/cli';
import { rspack, SwcLoaderOptions } from '@rspack/core';
import * as RefreshPlugin from '@rspack/plugin-react-refresh';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  context: __dirname,
  entry: {
    main: {
      import: './src/main.tsx',
      layer: 'modern',
    },
    legacy: {
      import: './src/main.tsx',
      layer: 'legacy',
    },
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        layer: 'modern',
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
              env: {
                targets: ['Chrome >= 10'],
              },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
      {
        test: /\.(jsx?|tsx?)$/,
        layer: 'legacy',
        use: [
          {
            loader: './legacy-loader.js',
          },
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
              env: {
                targets: ['Chrome >= 100'],
              },
            } satisfies SwcLoaderOptions,
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './index.html',
    }),
    isDev ? new RefreshPlugin() : null,
    new RsdoctorRspackPlugin({
      // plugin options
    }),
  ].filter(Boolean),
  experiments: {
    css: true,
    layers: true,
  },
});
