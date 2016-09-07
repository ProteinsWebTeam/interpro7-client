/* eslint-env node */
/* eslint no-process-env: 0 */
/* eslint no-magic-numbers: 0 */
const path = require('path');
const webpack = require('webpack');
// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
// const WebAppManifestPlugin = require('./plugins/web-app-manifest');
// Dashboard
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
// Other
const cssnext = require('postcss-cssnext');
const postcssImport = require('postcss-import');
const postcssApply = require('postcss-apply');
// const validateWebpackConfig = require('webpack-validator');

// Params
const pkg = require('./package.json');

const PROD = process.env.NODE_ENV === 'production';

// Settings for the loaders
// Settings for CSS processing
const cssSettings = {
  modules: true,
  minimize: PROD,
  importLoaders: 1,
  sourceMap: !PROD,
  localIdentName: `${PROD ? '' : '[name]__[local]___'}[hash:base64:3]`,
};

// General settings for file processing
const urlSettings = {
  name: `${PROD ? '' : '[name].'}[hash:3].[ext]`,
  limit: 512,
};

// Settings for html-webpack-plugin
const htmlSettings = {
  title: pkg.name,
  template: path.join(__dirname, 'src', 'index.template.html'),
  inject: false,
  minify: PROD && {
    removeComments: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
  },
};

const config = {
  // Entry points for the application and some ext libraries
  // (don't put ES2016 modules enabled libraries here)
  entry: {
    app: ['index'], // src/index.js
    vendor: ['babel-polyfill', 'react', 'react-dom', 'isomorphic-fetch'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/interpro/',
    filename: 'app.[chunkhash:3].js',
    chunkFilename: '[id].[chunkhash:3].js',
  },
  plugins: [
    // vendor chunk will go in this file
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash:3].js'),
    new ExtractTextPlugin('styles.[contenthash:3].css'),
    // Generates lots of favicons from source image
    // and injects their path into the head of index.html
    new FaviconsWebpackPlugin({
      // source
      logo: path.join(__dirname, 'src', 'images', 'logo', 'logo_75x75.png'),
      // output file prefix (type, size and ext will be added automatically)
      prefix: 'icon.[hash:3].',
      minify: PROD,
    }),
    new HtmlWebpackPlugin(htmlSettings),
    // new WebAppManifestPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/i,
        // Everything that will be processed by loader
        // only include source and external lib with ES2016 modules
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
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract(
          'style',
          `css?${JSON.stringify(cssSettings)}!sass?sourceMap=${!PROD}`
        ),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        // Automatic image optimisation with img-loader
        loader: `url?${JSON.stringify(urlSettings)}!img`,
      },
    ],
  },
  // Resolve module paths (additionally to node_modules)
  resolve: {
    // Project source
    root: path.resolve(__dirname, 'src'),
  },
  postcss: [
    postcssImport,
    postcssApply,
    cssnext,
  ],
};

if (PROD) {
  // Only run uglify for production
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  // This is needed to trigger React's optimizations for prod
  config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }));
} else {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devtool = 'source-map';
  config.devServer = {
    contentBase: [],
    colors: true,
    inline: true,
    hot: true,
    quiet: !!process.env.DASHBOARD,
    historyApiFallback: {
      index: config.output.publicPath,
    },
    watchOptions: {
      ignored: /node_modules/,
      poll: 500,
    },
  };
}

if (process.env.DASHBOARD) {
  config.plugins.push(new DashboardPlugin(new Dashboard().setData));
}

// module.exports = validateWebpackConfig(config);
module.exports = config;
