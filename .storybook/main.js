const path = require('path');
module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-postcss',
  ],
  typescript: {
    reactDocgen: 'none',
  },
  webpackFinal: async (config) => {
    // do mutation to the config
    config.resolve.modules.push(path.resolve('.', 'src'));
    const cssRule = config.module.rules.find(({ test }) =>
      test.toString().includes('.css')
    );
    cssRule.exclude = /((tippy)|(clanviewer))\.css$/i;
    config.module.rules.push({
      test: /((tippy)|(clanviewer))\.css$/i,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
      ],
    });
    config.module.rules.push({
      test: /\.yml$/i,
      use: [
        {
          loader: 'yaml-loader',
        },
      ],
    });
    config.module.rules.push({
      test: /\.ts$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    });
    config.module.rules.push({
      test: /\.avif$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
            esModule: false,
          },
        },
      ],
    });
    // console.dir(config.module.rules);
    return config;
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
