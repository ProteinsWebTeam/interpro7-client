const path = require('path');

const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs/register',
  ],

  webpackFinal: async (config) => {
    // do mutation to the config
    config.resolve.modules.push(path.resolve('.', 'src'));
    const cssRule = config.module.rules.find(({ test }) =>
      test.toString().includes('.css')
    );

    cssRule.use.find((x) =>
      (x.loader || x).includes('postcss-loader')
    ).options.plugins = [postCSSImport, cssNext()];
    cssRule.exclude = /tippy.css$/i;

    config.module.rules.push({
      test: /tippy.css$/i,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    });
    config.module.rules.push({
      test: /\.yml$/i,
      use: [{ loader: 'json-loader' }, { loader: 'yaml-loader' }],
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
};
