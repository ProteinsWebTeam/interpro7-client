const path = require('path');
const process = require('process');
const webpack = require('webpack');
// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// Dashboard
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

const pkg = require(path.resolve('package.json'));

const PROD = process.env.NODE_ENV === 'production';

const extractTextPlugin = new ExtractTextPlugin({
  filename: 'styles.[contenthash:3].css',
  allChunks: true,
});

const common = [
  // Webpack 2
  new webpack.LoaderOptionsPlugin({
    options: {
      debug: !PROD,
      context: __dirname,
    },
  }),
  new webpack.NamedModulesPlugin(),
  // new WebAppManifestPlugin(),
];

const test = [...common, extractTextPlugin];

// modifying common
common.push(
  // vendor chunk will go in this file
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'redux', 'polyfills', 'manifest'],
    filename: PROD ? '[name].[hash:3].js' : '[name].js',
    minChunks: Infinity,
  })
);
common.push(
  new webpack.optimize.CommonsChunkPlugin({
    children: true,
    async: true,
    minChunks: 3,
  })
);

const dev = common.concat([
  new HtmlWebpackPlugin({
    title: pkg.name,
    template: path.join('.', 'src', 'index.template.html'),
    inject: false,
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      PERF: JSON.stringify(!!process.env.PERF),
    },
  }),
]);

if (process.env.DASHBOARD) {
  dev.push(new DashboardPlugin(new Dashboard().setData));
}

const production = common.concat([
  // Generates lots of favicons from source image
  // and injects their path into the head of index.html
  extractTextPlugin,
  new FaviconsWebpackPlugin({
    logo: path.join('.', 'images', 'logo', 'logo_75x75.png'),
    prefix: 'icon.[hash:3].',
    minify: true,
  }),
  new HtmlWebpackPlugin({
    title: pkg.name,
    template: path.join('.', 'src', 'index.template.html'),
    inject: false,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
    },
  }),
  // new UglifyJSPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
]);

module.exports = {dev, test, production};
