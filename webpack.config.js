/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const url = require('url');

// Webpack plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// custom plugins
const LegacyModuleSplitPlugin = require('./webpack-plugins/legacy-module-split-plugin');

// CSS-related
const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');
const cssNano = require('cssnano');

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

const cssSettings = {
  modules: {
    mode: 'local',
    localIdentName: '[folder]_[name]__[local]___[hash:2]',
  },
  importLoaders: 1,
  sourceMap: true,
  // localIdentName: '[folder]_[name]__[local]___[hash:2]',
};

const publicPath = websiteURL.pathname || '/interpro/';

const getHTMLWebpackPlugin = (mode) =>
  new HTMLWebpackPlugin({
    title: iprConfig.title || 'InterPro',
    template: path.join('.', 'src', 'index.template.html'),
    inject: mode === 'development',
    templateParameters: (compilation, assets, assetTags, options) => ({
      webpack: compilation.getStats().toJson(),
      webpackConfig: compilation.options,
      htmlWebpackPlugin: {
        files: assets,
        options: options,
      },
    }),
  });

const legacyModuleSplitPlugin = new LegacyModuleSplitPlugin();

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: path.join('css', '[name].[contenthash:3].css'),
  chunkFilename: path.join('css', '[id].[contenthash:3].css'),
});

const getConfigFor = (env, mode, module = false) => {
  const name = module ? 'module' : 'legacy';

  return {
    // NAME
    name,
    // MODE
    mode,
    // OUTPUT
    output: {
      path: path.resolve('dist'),
      publicPath,
      filename: path.join('js', `[id].${name}.[name].[hash:3].js`),
      chunkFilename: path.join('js', `[id].${name}.[name].[chunkhash:3].js`),
      globalObject: 'self',
    },
    // RESOLVE
    resolve: {
      modules: [path.resolve('.', 'src'), 'node_modules'],
      extensions: ['.js', '.json', '.worker.js'],
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
        react: path.resolve('node_modules/react'),
      },
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
                filename: path.join(
                  'js',
                  'workers',
                  `[folder].${name}.[name].[hash:3].worker.js`
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
            // path.resolve('node_modules', 'color-hash'),
            path.resolve('node_modules', 'timing-functions'),
            /protvista/i,
            /react-msa-viewer/,
            path.resolve('node_modules', 'd3'),
            path.resolve('node_modules', 'idb'),
            path.resolve('node_modules', 'clanviewer'),
            path.resolve('node_modules', 'interpro-components'),
            path.resolve('node_modules', 'lit-html'),
            // path.resolve('node_modules', 'taxonomy-visualisation'),
          ],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      modules: false,
                      loose: true,
                      useBuiltIns: 'usage',
                      corejs: 3,
                      targets: module
                        ? { esmodules: true }
                        : { browsers: '> 0.25%' },
                    },
                  ],
                  ['@babel/react', { development: mode === 'development' }],
                ],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  ['@babel/plugin-proposal-class-properties', { loose: true }],
                  ['@babel/plugin-proposal-optional-chaining', { loose: true }],
                ],
                env: {
                  dev: {
                    // better sourcemaps for JSX code
                    plugins: ['transform-react-jsx-source'],
                  },
                  production: {
                    plugins: [
                      // optimisations for react
                      'babel-plugin-transform-react-remove-prop-types',
                      'babel-plugin-transform-react-constant-elements',
                      'babel-plugin-transform-react-inline-elements',
                      [
                        'transform-remove-console',
                        { exclude: ['error', 'warn'] },
                      ],
                    ],
                  },
                },
              },
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
          test: /((LiteMol-plugin-blue)|(LiteMol-plugin-light)|(LiteMol-plugin)|(clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
          use: [
            {
              loader:
                mode === 'production'
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                ...cssSettings,
                modules: {
                  ...cssSettings.modules,
                  localIdentName: '[local]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    postCSSImport,
                    cssNext(),
                    mode === 'production' && cssNano(),
                  ].filter(Boolean),
                },
              },
            },
          ],
        },
        {
          test: /tippy.css$/i,
          use: [
            {
              loader:
                mode === 'production'
                  ? MiniCssExtractPlugin.loader
                  : 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                ...cssSettings,
                modules: {
                  ...cssSettings.modules,
                  localIdentName: '[local]',
                },
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
              options: cssSettings,
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    postCSSImport,
                    cssNext(),
                    mode === 'production' && cssNano(),
                  ].filter(Boolean),
                },
              },
            },
          ],
          exclude: /((LiteMol-plugin-blue)|(LiteMol-plugin-light)|(LiteMol-plugin)|(tippy)|(clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
        },
        {
          test: /\.css\?string$/i,
          use: [{ loader: 'raw-loader' }],
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
              options: Object.assign({}, cssSettings, {
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
          test: /\.(jpe?g|png|gif|svg|avif)$/i,
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
          mode,
        }),
      }),
      mode === 'production' ? miniCssExtractPlugin : null,
      mode === 'production'
        ? new (require('offline-plugin'))({
            caches: {
              main: [
                new RegExp(`js/[^/]*${name}[^/]*.js$`, 'i'),
                new RegExp('css/[^/]+.css$', 'i'),
              ],
              additional: [/\.(worker\.js)$/i],
              optional: [/\.(eot|ttf|woff|svg|ico|png|avif|jpe?g)$/i],
            },
            // TODO: check a way to use it without affecting /api
            // appShell: publicPath,
            AppCache: false,
            // TODO: Check whats the best way to do this autoupdate.
            // autoUpdate: 60000,
            ServiceWorker: {
              output: `sw.${name}.js`,
              events: true,
            },
            safeToUseOptionalCaches: true,
            excludes: ['**/.*', '**/*.{map,br,gz}'],
          })
        : null,
      // Custom plugin to split codebase into legacy/modern bundles,
      // depends on HTMLWebpackPlugin
      legacyModuleSplitPlugin,
      // GZIP compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            filename: '[path].gz[query]',
            test: /\.(js|css|html|svg)$/i,
            cache: true,
            algorithm(buffer, options, callback) {
              require('node-zopfli-es').gzip(buffer, options, callback);
            },
          })
        : null,
      // Brotli compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            filename: '[path].br[query]',
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
};

module.exports = (
  env = { dev: true },
  { mode = 'production', testingIE = false }
) => {
  const configModule = getConfigFor(env, mode, !testingIE);

  const htmlWebpackPlugin = getHTMLWebpackPlugin(mode);

  // Add plugins needed only once
  configModule.plugins = [
    mode === 'production'
      ? new (require('webapp-webpack-plugin'))({
          logo: path.join('.', 'images', 'logo', 'logo_1776x1776.png'),
          prefix: path.join('assets', 'icons-and-manifests', '[hash:base62:3]'),
          inject: 'force',
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
    mode === 'development' ? new webpack.HotModuleReplacementPlugin() : null,
    htmlWebpackPlugin,
    ...configModule.plugins,
  ].filter(Boolean);

  // devServer
  if (mode === 'development') {
    configModule.devServer = {
      host: '0.0.0.0',
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

  if (mode === 'production') {
    // also, generate a bundle for legacy browsers
    const configLegacy = getConfigFor(env, mode);
    configLegacy.plugins = [htmlWebpackPlugin, ...configLegacy.plugins];
    return [configLegacy, configModule];
  }
  // just generate for modern browsers
  return configModule;
};
