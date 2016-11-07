const process = require('process');
const fs = require('fs');

const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');
const cssnext = require('postcss-cssnext');

const entry = require('./config/entry');
const output = require('./config/output');
const plugins = require('./config/plugins');
const loaders = require('./config/loaders');
const resolve = require('./config/resolve');
const yaml = require('js-yaml');
const iprConfig = yaml.safeLoad(fs.readFileSync('config.yml'));
const defaultPort = 80;
const [, port = defaultPort] = iprConfig.root.website.match(/.+:(\d+).*/) || [];
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
    'inline-source-map';
  config.devServer = {
    contentBase: '',
    colors: true,
    inline: true,
    port,
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
