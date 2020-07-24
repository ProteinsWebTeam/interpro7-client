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
    config.module.rules
      .find(({ test }) => test.toString().includes('.css'))
      .use.find((x) =>
        (x.loader || x).includes('postcss-loader')
      ).options.plugins = [postCSSImport, cssNext()];
    config.module.rules.push({
      test: /\.yml$/i,
      use: [{ loader: 'json-loader' }, { loader: 'yaml-loader' }],
    });
    // console.dir(config);
    return config;
  },
};
