/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const url = require('url');

// Webpack plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// CSS-related
const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');

const buildInfo = require('./scripts/build-info');
const pkg = require('./package.json');

const DEFAULT_PORT = 80;
const kB = 1024;

const iprConfig = require('./interpro-config.js');

const websiteURL = url.parse(iprConfig.root.website, true, true);

const getCompressionPlugin = (() => {
  let plugin;
  return () => {
    if (!plugin) plugin = require('compression-webpack-plugin');
    return plugin;
  };
})();

const cssSettings = mode => ({
  modules: true,
  importLoaders: 1,
  sourceMap: true,
  minimize: mode === 'production',
  localIdentName: '[folder]_[name]__[local]___[hash:2]',
  alias: {
    '../libraries': 'ebi-framework/libraries',
    'EBI-Common': 'EBI-Icon-fonts/EBI-Common',
    'EBI-Conceptual': 'EBI-Icon-fonts/EBI-Conceptual',
    'EBI-Functional': 'EBI-Icon-fonts/EBI-Functional',
    'EBI-Generic': 'EBI-Icon-fonts/EBI-Generic',
    'EBI-Species': 'EBI-Icon-fonts/EBI-Species',
    'EBI-SocialMedia': 'EBI-Icon-fonts/EBI-SocialMedia',
    'EBI-FileFormats': 'EBI-Icon-fonts/EBI-FileFormats',
    'EBI-Chemistry': 'EBI-Icon-fonts/EBI-Chemistry',
  },
});

const publicPath = websiteURL.pathname || '/interpro/';

module.exports = (env = { dev: true }, { mode = 'production' }) => {
  const config = {
    // MODE
    mode,
    // OUTPUT
    output: {
      path: path.resolve('dist'),
      publicPath,
      filename: path.join('js', '[id].[name].[hash:3].js'),
      chunkFilename: path.join('js', '[id].[name].[chunkhash:3].js'),
    },
    // RESOLVE
    resolve: {
      modules: [path.resolve('.', 'src'), 'node_modules'],
      extensions: ['.js', '.json', '.worker.js'],
    },
    // MODULE
    module: {
      rules: [
        {
          test: /\.worker\.js$/i,
          use: [
            {
              loader: 'worker-loader',
              options: {
                name: path.join(
                  'js',
                  'workers',
                  '[folder].[name].[hash:3].worker.js'
                ),
              },
            },
          ],
        },
        {
          test: /\.js$/i,
          include: [
            path.resolve('src'),
            path.resolve('node_modules', 'lodash-es'),
            path.resolve('node_modules', 'color-hash'),
            path.resolve('node_modules', 'timing-functions'),
            // /protvista-track/i,
            // path.resolve('node_modules', 'data-loader'),
            // path.resolve('node_modules', 'interpro-components'),
            // path.resolve('node_modules', 'pdb-web-components'),
          ],
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(txt|fast[aq])/i,
          use: [
            {
              loader: 'raw-loader',
            },
          ],
        },
        {
          test: /\.yml$/i,
          use: [
            {
              loader: 'json-loader',
            },
            {
              loader: 'yaml-loader',
            },
          ],
        },
        {
          test: /((LiteMol-plugin-blue)|(LiteMol-plugin-light)|(LiteMol-plugin)|(tippy)|(clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
          use: [
            {
              loader:
                mode === 'production'
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: Object.assign({}, cssSettings(mode), {
                localIdentName: '[local]',
              }),
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [postCSSImport, cssNext()],
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            {
              loader:
                mode === 'production'
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: cssSettings(mode),
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [postCSSImport, cssNext()],
              },
            },
          ],
          exclude: /((LiteMol-plugin-blue)|(LiteMol-plugin-light)|(LiteMol-plugin)|(tippy)|(clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
        },
        {
          test: /\.scss$/i,
          use: [
            {
              loader:
                mode === 'production'
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: Object.assign({}, cssSettings(mode), {
                localIdentName: '[local]',
              }),
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: path.join(
                  'assets',
                  'images',
                  '[name].[hash:base62:3].[ext]'
                ),
                limit: 1 * kB,
              },
            },
            {
              loader: 'img-loader',
              options: {
                enabled: mode === 'production',
              },
            },
          ],
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: path.join(
                  'assets',
                  'fonts',
                  '[name].[hash:base62:3].[ext]'
                ),
                limit: 1 * kB,
                mimetype: 'application/font-woff',
              },
            },
          ],
        },
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: path.join(
                  'assets',
                  'fonts',
                  '[name].[hash:base62:3].[ext]'
                ),
              },
            },
          ],
        },
      ],
    },
    // PLUGINS
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          STAGING: JSON.stringify(!!env.staging),
        },
        'process.info': JSON.stringify({
          git: buildInfo.git,
          build: buildInfo.build,
        }),
      }),
      mode === 'production'
        ? new MiniCssExtractPlugin({
            filename: path.join('css', '[name].[contenthash:3].css'),
            chunkFilename: path.join('css', '[id].[contenthash:3].css'),
          })
        : null,
      mode === 'development' ? new webpack.HotModuleReplacementPlugin() : null,
      new HTMLWebpackPlugin({
        title: pkg.name,
        template: path.join('.', 'src', 'index.template.html'),
        inject: false,
      }),
      mode === 'production'
        ? new (require('webapp-webpack-plugin'))({
            logo: path.join('.', 'images', 'logo', 'logo_1776x1776.png'),
            prefix: path.join(
              'assets',
              'icons-and-manifests',
              '[hash:base62:3]'
            ),
            inject: true,
            favicons: {
              background: '#007c82',
              theme_color: '#007c82',
              appName: 'InterPro',
              start_url: `${publicPath}?utm_source=pwa_homescreen`,
              lang: 'en',
              version: pkg.version,
            },
          })
        : null,
      mode === 'production'
        ? new (require('offline-plugin'))({
            caches: {
              main: [':rest:'],
              additional: [/\.(worker\.js)$/i],
              optional: [/\.(eot|ttf|woff|svg|ico|png|jpe?g)$/i],
            },
            // TODO: check a way to use it without affecting /api
            // appShell: publicPath,
            AppCache: false,
            // TODO: Check whats the best way to do this autoupdate.
            // autoUpdate: 60000,
            ServiceWorker: { events: true },
            safeToUseOptionalCaches: true,
            excludes: ['**/.*', '**/*.{map,br,gz}'],
          })
        : null,
      // GZIP compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            asset: '[path].gz[query]',
            test: /\.(js|css|html|svg)$/i,
            cache: true,
            algorithm(buffer, options, callback) {
              require('node-zopfli').gzip(buffer, options, callback);
            },
          })
        : null,
      // Brotli compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/i,
            cache: true,
            algorithm(buffer, _, callback) {
              require('iltorb').compress(
                buffer,
                {
                  mode: 1, // text
                  quality: 11, // goes from 1 (but quick) to 11 (but slow)
                },
                callback
              );
            },
          })
        : null,
    ].filter(Boolean),
    // optimization.minimize: mode === 'production',
    devtool: ((mode, env) => {
      if (mode === 'development') return 'cheap-module-source-map';
      if (env.staging) return 'source-map';
      return false;
    })(mode, env),
  };

  // devServer
  if (mode === 'development') {
    config.devServer = {
      stats: 'errors-only',
      contentBase: publicPath,
      publicPath,
      overlay: true,
      port: websiteURL.port || DEFAULT_PORT,
      hot: true,
      historyApiFallback: {
        index: publicPath,
        disableDotRule: true,
      },
      watchOptions: {
        ignored: /node_modules/,
      },
    };
  }

  return config;
};
