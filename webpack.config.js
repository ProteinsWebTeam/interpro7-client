/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const url = require('url');
const zlib = require('zlib');

// Webpack plugins
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// custom plugins
const LegacyModuleSplitPlugin = require('./webpack-plugins/legacy-module-split-plugin');

// CSS-related
const postCSSImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssNano = require('cssnano');

// Web service plugin
const WorkboxPlugin = require('workbox-webpack-plugin');

const buildInfo = require('./scripts/build-info');
const pkg = require('./package.json');

const DEFAULT_PORT = 80;

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
};

const publicPath = websiteURL.pathname || '/interpro/';

const getHTMLWebpackPlugin = (mode) =>
  new HTMLWebpackPlugin({
    title: iprConfig.title || 'InterPro',
    template: path.join('.', 'src', 'index.template.html'),
    inject: mode === 'development',
    filename: '[name].html',
    templateParameters: (compilation, assets, assetTags, options) => {
      // Leaving this here for easy debugging of the assets
      console.log('****assets****', assets);
      return {
        webpack: compilation.getStats().toJson(),
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          files: assets,
          options: options,
          entry: options.filename.replace('.html', ''),
          faviconTags: assetTags.headTags.filter(
            (tag) =>
              tag && tag.meta && tag.meta.plugin === 'favicons-webpack-plugin'
          ),
        },
      };
    },
  });

const legacyModuleSplitPlugin = new LegacyModuleSplitPlugin();

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  filename: path.join('css', '[name].[fullhash:3].css'),
  chunkFilename: path.join('css', '[id].[chunkhash:3].css'),
  ignoreOrder: true,
});
const getAssetModuleFilename = (pathData) => {
  const ext = pathData.filename.split('.')?.[1].toLowerCase();
  let subfolder = 'other';
  if (['jpeg', 'jpg', 'png', 'gif', 'svg', 'avif'].includes(ext))
    subfolder = 'images';
  else if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) subfolder = 'fonts';
  return path.join('assets', subfolder, '[name].[hash:3][ext]');
};
const getConfigFor = (env, mode, module = false) => {
  const name = module ? 'module' : 'legacy';

  return {
    name,
    entry: {
      index: './src/index.js',
    },
    mode,
    output: {
      publicPath,
      filename: path.join('js', `[id].${name}.[name].[fullhash:3].js`),
      chunkFilename: path.join('js', `[id].${name}.[name].[chunkhash:3].js`),
      globalObject: 'self',
      assetModuleFilename: getAssetModuleFilename,
    },
    optimization:
      mode === 'production'
        ? {
            splitChunks: {
              // include all types of chunks
              chunks: 'all',
            },
          }
        : undefined,
    resolve: {
      modules: [path.resolve('.', 'src'), 'node_modules'],
      extensions: ['.js', '.ts', '.json', '.worker.js'],
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
                  `${name}.[name].[chunkhash:3].worker.js`
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
            path.resolve('node_modules', 'timing-functions'),
            /protvista/i,
            /react-msa-viewer/,
            path.resolve('node_modules', 'd3'),
            path.resolve('node_modules', 'idb'),
            path.resolve('node_modules', 'clanviewer'),
            path.resolve('node_modules', 'interpro-components'),
            path.resolve('node_modules', 'lit-html'),
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
                        ? {
                            esmodules: true,
                            browsers: 'last 2 versions, not dead',
                          }
                        : {
                            esmodules: false,
                            browsers:
                              '> 0.1% and not last 2 versions, not dead',
                          },
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
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(txt|fast[aq])/i,
          type: 'asset/source',
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
          test: /((clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
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
                    postcssPresetEnv({ stage: 0 }),
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
                    postcssPresetEnv({ stage: 0 }),
                    mode === 'production' && cssNano(),
                  ].filter(Boolean),
                },
              },
            },
          ],
          exclude: /((tippy)|(clanviewer)|(ebi-global)|(interpro-new))\.css$/i,
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
        // Images
        {
          test: /\.(jpe?g|png|gif|svg|avif)$/i,
          type: 'asset/resource',
        },
        // fonts
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          type: 'asset/resource',
        },
        // fonts
        {
          test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
          type: 'asset/resource',
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
        ? new WorkboxPlugin.GenerateSW({
            skipWaiting: false,
            swDest: `sw.${name}.js`,
            exclude: ['**/.*', '**/*.{map,br,gz}'],
          })
        : null,

      // Custom plugin to split codebase into legacy/modern bundles,
      // depends on HTMLWebpackPlugin
      legacyModuleSplitPlugin,
      // GZIP compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            filename: '[path][base].gz[query]',
            test: /\.(js|css|html|svg)$/i,
            algorithm: 'gzip',
          })
        : null,
      // Brotli compression
      mode === 'production'
        ? new (getCompressionPlugin())({
            filename: '[path][base].br[query]',
            test: /\.(js|css|html|svg)$/i,
            algorithm: 'brotliCompress',
            compressionOptions: {
              params: {
                [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
              },
            },
          })
        : null,
    ].filter(Boolean),
    devtool: mode === 'development' ? 'cheap-module-source-map' : 'source-map',
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
      ? new (require('favicons-webpack-plugin'))({
          logo: path.join('.', 'src', 'images', 'logo', 'logo_1776x1776.png'),
          prefix: `${path.join(
            'assets',
            'icons-and-manifests',
            '[chunkhash:3]'
          )}/`,
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
    htmlWebpackPlugin,
    ...configModule.plugins,
  ].filter(Boolean);

  // devServer
  if (mode === 'development') {
    configModule.devServer = {
      host: '0.0.0.0',
      port: websiteURL.port || DEFAULT_PORT,
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath,
        watch: {
          ignored: /node_modules/,
        },
      },

      client: {
        overlay: true,
      },
      hot: true,
      historyApiFallback: {
        index: publicPath,
        disableDotRule: true,
      },
    };
    configModule.stats = 'minimal';
  }

  if (mode === 'production') {
    // also, generate a bundle for legacy browsers
    const configLegacy = getConfigFor(env, mode);
    configLegacy.plugins = [htmlWebpackPlugin, ...configLegacy.plugins];

    // generate the hydration entrypoint - disabled as it didn;t offer much improvement
    // configModule.entry.hydrate = './src/index-hydrate.js';
    // configLegacy.entry.hydrate = './src/index-hydrate.js';

    return [configLegacy, configModule];
  }
  // just generate for modern browsers
  return configModule;
};
