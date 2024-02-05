import type { StorybookConfig } from '@storybook/react-webpack5';
import * as path from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import postCSSImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import { RuleSetRule } from 'webpack';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
    {
      name: '@storybook/addon-styling-webpack',

      options: {
        rules: [
          {
            test: /\.css$/,
            sideEffects: true,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: {
                    mode: 'local',
                    localIdentName: '[folder]_[name]__[local]___[hash:2]',
                  },
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  implementation: require.resolve('postcss'),
                  postcssOptions: {
                    plugins: [postCSSImport, postcssPresetEnv({ stage: 0 })],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: 'tag',
  },
  async webpackFinal(config) {
    // do mutation to the config
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.modules) config.resolve.modules = [];
    if (!config.module) config.module = {};
    if (!config.module.rules) config.module.rules = [];
    config.resolve.plugins = [
      new TsconfigPathsPlugin({
        configFile: path.resolve('.', 'stories', 'tsconfig.json'),
      }),
    ];
    config.resolve.modules.push(path.resolve('.', 'src'));

    const cssRule = config.module.rules.find((rule) =>
      ((rule as RuleSetRule).test || '').toString().includes('.css')
    );

    (cssRule as RuleSetRule).exclude = /((clanviewer))\.css$/i;

    config.module.rules.push({
      test: /((clanviewer))\.css$/i,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    });
    config.module.rules.push({
      test: /\.yml$/i,
      use: [{ loader: 'yaml-loader' }],
    });
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|svg|avif|json)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};
export default config;
