const process = require('process');

const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');
const cssnext = require('postcss-cssnext');

const entry = require('./config/entry');
const output = require('./config/output');
const plugins = require('./config/plugins');
const loaders = require('./config/loaders');
const resolve = require('./config/resolve');

const PROD = process.env.NODE_ENV === 'production';

const config = {
  entry, output, resolve,
  plugins: plugins[PROD ? 'production' : 'dev'],
  module: loaders,
  postcss: [
    postcssImport,
    postcssApply,
    cssnext,
  ],
};

switch (process.env.NODE_ENV) {
  case 'test':
    config.plugins = plugins.test;
    break;
  case 'production':
    config.plugins = plugins.production;
    break;
  default:
    config.plugins = plugins.dev;
}

if (process.env.NODE_ENV === 'test') {
  config.entry = config.output = null;
}

if (!PROD) {
  config.devtool = process.env.NODE_ENV === 'test' ?
    'source-map' :
    'cheap-module-source-map';
  config.devServer = {
    contentBase: '',
    colors: true,
    inline: true,
    hot: true,
    quiet: !!process.env.DASHBOARD,
    historyApiFallback: {
      index: output.publicPath,
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 500,
    },
  };
}

module.exports = config;
