/* eslint-env node */
/* eslint no-process-env: 0 */
const path = require('path');
// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// Other
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');

const PROD = process.env.NODE_ENV === 'production';

// Settings for the loaders
const cssSettings = {
  modules: true,
  minimize: PROD,
  importLoaders: 1,
  sourceMap: !PROD,
  localIdentName: `${PROD ? '' : '[name]__[local]___'}[hash:base64:3]`,
};

const urlSettings = {
  name: path.join('static', 'files', '[name].[hash:3].[ext]'),
  limit: 512,
};

module.exports = {
  plugins: [
    new ExtractTextPlugin(
      path.join('static', 'css', 'styles.[contenthash:3].css')
    ),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/i,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'node_modules', 'react-router', 'es6'),
          path.join(__dirname, 'node_modules', 'lodash-es'),
          path.join(__dirname, 'node_modules', 'color-hash'),
        ],
        loader: 'babel',
      },
      {
        test: /\.json$/i,
        loader: 'json',
      },
      {
        test: /\.yml$/i,
        loader: 'json!yaml',
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract(
          'style',
          `css?${JSON.stringify(cssSettings)}!postcss`
        ),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: `url?${JSON.stringify(urlSettings)}!img`,
      },
    ],
  },
  resolve: {
    root: path.resolve(__dirname, 'src'),
  },
  postcss: [
    postcssImport,
    postcssApply,
    cssnext,
  ],
  devtool: 'cheap-module-source-map',
};
