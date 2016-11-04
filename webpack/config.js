const process = require('process');

const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');
const cssnext = require('postcss-cssnext');

const entry = require('./config/entry');
const output = require('./config/output');
const plugins = require('./config/plugins');
const loaders = require('./config/loaders');
const resolve = require('./config/resolve');
const yaml = require('js-yaml');
let port = 8080;
const fs = require('fs');
const data = fs.readFileSync('config.yml');
const iprConfig = yaml.safeLoad(data);
try {
  port = iprConfig.root.website.match(/.+:(\d+).*/)[1];
} catch (err) {
  port = 80;
}
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
