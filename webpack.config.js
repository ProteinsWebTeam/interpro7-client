/* eslint-env node */
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const webpack = require('webpack');
const url = require('url');
const yaml = require('js-yaml');

// CSS-related
const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');

// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pkg = require(path.resolve('package.json'));

const DEFAULT_PORT = 80;
const kB = 1024;

const iprConfig = yaml.safeLoad(fs.readFileSync('config.yml'));
const websiteURL = url.parse(iprConfig.root.website, true, true);

const getCompressionPlugin = (() => {
  let plugin;
  return () => {
    if (!plugin) plugin = require('compression-webpack-plugin');
    return plugin;
  };
})();

const cssSettings = env => ({
  modules: true,
  minimize: env.production,
  importLoaders: 1,
  sourceMap: !env.production,
  localIdentName: (() => {
    if (env.production) return '[hash:base64:6]';
    return '[folder]_[name]__[local]___[hash:base64:2]';
  })(),
  alias: {
    '../libraries': 'ebi-framework/libraries',
    'EBI-Conceptual': 'EBI-Icon-fonts/EBI-Conceptual',
    'EBI-Functional': 'EBI-Icon-fonts/EBI-Functional',
    'EBI-Generic': 'EBI-Icon-fonts/EBI-Generic',
    'EBI-Species': 'EBI-Icon-fonts/EBI-Species',
    'EBI-SocialMedia': 'EBI-Icon-fonts/EBI-SocialMedia',
    'EBI-FileFormats': 'EBI-Icon-fonts/EBI-FileFormats',
    'EBI-Chemistry': 'EBI-Icon-fonts/EBI-Chemistry',
  },
});

const fileLoaderNamer = env => {
  if (env.production) return '[hash:6].[ext]';
  if (env.staging) return '[name].[hash:3].[ext]';
  return '[name].[ext]';
};

// eslint-disable-next-line complexity
module.exports = (env = { dev: true }) => {
  const thisFileLoaderName = fileLoaderNamer(env);
  const config = {
    // Entry points for the application and some ext libraries
    // (don't put ES2016 modules enabled libraries here)
    entry: {
      app: ['index'], // src/index.js
      polyfills: ['core-js'],
      vendor: [
        'react',
        'react-dom',
        'react-helmet',
        'isomorphic-fetch',
        'history',
      ],
      redux: ['redux', 'react-redux', 'reselect'],
    },
    output: {
      path: path.resolve('dist'),
      publicPath: websiteURL.pathname || '/interpro7/',
      filename: (() => {
        if (env.production) return '[id].[hash:3].js';
        if (env.staging) return '[id].[name].[hash:3].js';
        return '[id].[name].js';
      })(),
      chunkFilename: (() => {
        if (env.production) return '[id].[chunkhash:3].js';
        if (env.staging) return '[id].[name].[chunkhash:3].js';
        return '[id].[name].js';
      })(),
    },
    resolve: {
      modules: [path.resolve('.', 'src'), 'node_modules'],
      extensions: ['.js', '.json', '.worker.js'],
    },
    module: {
      rules: [
        {
          test: /\.worker\.js/i,
          use: [
            {
              loader: 'worker-loader',
              options: {
                name: (() => {
                  if (env.production) return '[hash:3].worker.js';
                  if (env.staging) return '[folder].[name].[hash:3].worker.js';
                  return '[folder].[name].worker.js';
                })(),
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
        // {
        //   test: /\.js$/i,
        //   include: [
        //     path.resolve('node_modules', 'data-loader'),
        //     path.resolve('node_modules', 'interpro-components'),
        //     path.resolve('node_modules', 'pdb-web-components'),
        //   ],
        //   use: [
        //     {
        //       loader: 'babel-loader',
        //       options: {
        //         presets: ['stage-2'],
        //       },
        //     },
        //   ],
        // },
        {
          test: /\.json$/i,
          use: [
            {
              loader: 'json-loader',
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
          test: /((ebi-global)|(interpro-new))\.css$/i,
          // Use `loader` instead of `use` for now, otherwise breaks
          // https://github.com/webpack/extract-text-webpack-plugin/issues/282
          use:
            env.production || env.test || env.staging
              ? ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: Object.assign({}, cssSettings(env), {
                        localIdentName: '[local]',
                      }),
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        plugins: [postCSSImport(), cssNext()],
                      },
                    },
                  ],
                })
              : [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: Object.assign({}, cssSettings(env), {
                      localIdentName: '[local]',
                    }),
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      plugins: [postCSSImport(), cssNext()],
                    },
                  },
                ],
        },
        {
          test: /\.css$/i,
          // Use `loader` instead of `use` for now, otherwise breaks
          // https://github.com/webpack/extract-text-webpack-plugin/issues/282
          use:
            env.production || env.test || env.staging
              ? ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: cssSettings(env),
                    },
                    {
                      loader: 'postcss-loader',
                      options: {
                        plugins: [postCSSImport(), cssNext()],
                      },
                    },
                  ],
                })
              : [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: cssSettings(env),
                  },
                  {
                    loader: 'postcss-loader',
                    options: {
                      plugins: [postCSSImport(), cssNext()],
                    },
                  },
                ],
          exclude: /((ebi-global)|(interpro-new))\.css$/i,
        },
        {
          test: /\.scss$/i,
          // Use `loader` instead of `use` for now, otherwise breaks
          // https://github.com/webpack/extract-text-webpack-plugin/issues/282
          use:
            env.production || env.test || env.staging
              ? ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                    {
                      loader: 'css-loader',
                      options: Object.assign({}, cssSettings(env), {
                        localIdentName: '[local]',
                      }),
                    },
                    {
                      loader: 'sass-loader',
                      options: { sourceMap: !env.production },
                    },
                  ],
                })
              : [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: Object.assign({}, cssSettings(env), {
                      localIdentName: '[local]',
                    }),
                  },
                  {
                    loader: 'sass-loader',
                    options: { sourceMap: !env.production },
                  },
                ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: thisFileLoaderName,
                limit: 1 * kB,
              },
            },
            {
              loader: 'img-loader',
              options: {
                enabled: env.production,
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
                name: thisFileLoaderName,
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
                name: thisFileLoaderName,
              },
            },
          ],
        },
      ],
    },
    performance: {
      hints: env.production && 'warning',
      // eslint-disable-next-line no-magic-numbers
      maxAssetSize: 500 * kB, // 500kB
      // eslint-disable-next-line no-magic-numbers
      maxEntrypointSize: 500 * kB, // 500kB TODO: reduce this eventually!
    },
    stats: {
      children: false,
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PERF: JSON.stringify(!!env.performance),
          STAGING: JSON.stringify(!!env.staging),
          NODE_ENV: env.production ? JSON.stringify('production') : null,
        },
        'process.info': JSON.stringify(
          (() => {
            const branch = childProcess
              .execSync('git rev-parse --abbrev-ref HEAD')
              .toString()
              .trim();
            const commit = childProcess
              .execSync('git rev-parse HEAD')
              .toString()
              .trim();
            let tag = null;
            try {
              tag = childProcess
                .execSync(`git describe --exact-match ${commit}`, {
                  stdio: ['pipe', 'pipe', 'ignore'],
                })
                .toString()
                .trim();
            } catch (_) {
              // no tag for this commit
            }
            return {
              git: { branch, commit, tag },
              build: { time: Date.now() },
            };
          })()
        ),
      }),
      env.production || env.staging
        ? new webpack.optimize.ModuleConcatenationPlugin()
        : null,
      new webpack.LoaderOptionsPlugin({
        options: {
          minimize: !!env.production,
          debug: !env.production,
          context: __dirname,
        },
      }),
      new webpack.NamedModulesPlugin(),
      // env.production || env.staging
      //   ? new (require('./plugins/web-app-manifest'))()
      //   : null,
      env.test || env.production || env.staging
        ? new ExtractTextPlugin({
            filename: env.production
              ? '[contenthash:3].css'
              : 'styles.[contenthash:3].css',
            allChunks: true,
          })
        : null,
      env.test
        ? null
        : new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'redux', 'polyfills', 'manifest'],
            filename: env.production ? '[id].[hash:3].js' : '[name].js',
            minChunks: Infinity,
          }),
      env.test
        ? null
        : new webpack.optimize.CommonsChunkPlugin({
            children: true,
            async: true,
            minChunks: 3,
          }),
      env.dev ? new webpack.HotModuleReplacementPlugin() : null,
      env.dashboard
        ? new (require('webpack-dashboard/plugin'))(
            new (require('webpack-dashboard'))().setData
          )
        : null,
      env.production || env.staging
        ? new (require('favicons-webpack-plugin'))({
            logo: path.join('.', 'images', 'logo', 'logo_75x75.png'),
            prefix: 'icon.[hash:3].',
            emitStats: false,
            minify: env.production,
            background: '#007c82',
            title: pkg.name,
          })
        : null,
      env.production || env.staging || env.dev
        ? new (require('html-webpack-plugin'))({
            title: pkg.name,
            template: path.join('.', 'src', 'index.template.html'),
            inject: false,
            // chunksSortMode: 'dependency',
            minify: env.dev && {
              removeComments: true,
              collapseWhitespace: true,
              conservativeCollapse: true,
            },
          })
        : null,
      env.production
        ? new (require('uglifyjs-webpack-plugin'))({
            parallel: {
              workers: true,
            },
            sourceMap: true,
          })
        : null,
      env.production || env.staging
        ? new (require('offline-plugin'))({
            caches: {
              main: [':rest:'],
              additional: [/\.(worker\.js)$/i],
              optional: [/\.(eot|ttf|woff|svg|ico|png|jpe?g)$/i],
            },
            AppCache: false,
            ServiceWorker: {
              minify: env.production,
            },
            safeToUseOptionalCaches: true,
            excludes: ['**/.*', '**/*.{map,br,gz}'],
          })
        : null,
      // GZIP compression
      env.production
        ? new (getCompressionPlugin())({
            asset: '[path].gz[query]',
            test: /\.(js|css|html|svg)$/i,
            algorithm(buffer, options, callback) {
              require('node-zopfli').gzip(buffer, options, callback);
            },
          })
        : null,
      // Brotli compression
      env.production
        ? new (getCompressionPlugin())({
            asset: '[path].br[query]',
            test: /\.(js|css|html|svg)$/i,
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
    ].filter(Boolean), // filter out empty values
  };

  // Overwrite for tests
  if (env.test) {
    config.entry = config.output = null;
  }

  // Sourcemaps
  if (env.dev) {
    config.devtool = 'inline-source-map';
  }
  if (env.test || env.staging) {
    config.devtool = 'cheap-module-source-map';
  }

  // devServer
  if (env.dev) {
    config.devServer = {
      // contentBase: '',
      stats: 'errors-only',
      noInfo: true,
      publicPath: config.output.publicPath,
      inline: true,
      overlay: true,
      port: websiteURL.port || DEFAULT_PORT,
      hot: true,
      quiet: !!env.dashboard,
      historyApiFallback: {
        index: websiteURL.pathname,
      },
      watchOptions: {
        ignored: /node_modules/,
      },
    };
  }

  return config;
};
