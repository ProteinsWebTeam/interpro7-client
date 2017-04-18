const process = require('process');
const fs = require('fs');

const url = require('url');
const yaml = require('js-yaml');

const plugins = require('./config/plugins');

const DEFAULT_PORT = 80;

const iprConfig = yaml.safeLoad(fs.readFileSync('config.yml'));
const websiteURL = url.parse(iprConfig.root.website, true, true);
const PROD = process.env.NODE_ENV === 'production';

const config = {
  entry: require('./config/entry'),
  output: require('./config/output')({publicPath: websiteURL.pathname}),
  resolve: require('./config/resolve'),
  module: require('./config/module'),
  performance: {
    maxAssetSize: 500000,
  },
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
    '#cheap-module-source-map' :
    '#inline-source-map';
  config.devServer = {
    // contentBase: '',
    stats: {
      colors: true,
    },
    inline: true,
    overlay: true,
    port: websiteURL.port || DEFAULT_PORT,
    hot: true,
    quiet: !!process.env.DASHBOARD,
    historyApiFallback: {
      index: websiteURL.pathname,
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 500,
    },
  };
}

module.exports = config;
