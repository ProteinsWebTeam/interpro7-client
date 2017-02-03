const path = require('path');
const process = require('process');
const webpack = require('webpack');
// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// Dashboard
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
// Other
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');

const pkg = require(path.resolve('package.json'));

const PROD = process.env.NODE_ENV === 'production';

const common = [
  // Webpack 2
  new webpack.LoaderOptionsPlugin({
    options: {
      debug: !PROD,
      context: __dirname,
      postcss: [postcssImport, postcssApply, cssnext],
    },
  }),
  new webpack.NamedModulesPlugin(),
  new ExtractTextPlugin({
    filename: 'styles.[contenthash:3].css',
    allChunks: true,
  }),
  // new WebAppManifestPlugin(),
];

const test = [...common];

// modifying common
common.push(
  // vendor chunk will go in this file
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    filename: '[name].[hash:3].js',
    minChunks: Infinity,
  })
);

const dev = common.concat([
  // Generates lots of favicons from source image
  // and injects their path into the head of index.html
  new FaviconsWebpackPlugin({
    // source
    logo: path.join('.', 'images', 'logo', 'logo_75x75.png'),
    // output file prefix (type, size and ext will be added automatically)
    prefix: 'icon.[hash:3].',
  }),
  new HtmlWebpackPlugin({
    title: pkg.name,
    template: path.join('.', 'src', 'index.template.html'),
    inject: false,
  }),
  new webpack.HotModuleReplacementPlugin(),
]);

if (process.env.DASHBOARD) {
  dev.push(new DashboardPlugin(new Dashboard().setData));
}

const production = common.concat([
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
  new webpack.optimize.UglifyJsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
]);

module.exports = {dev, test, production};
