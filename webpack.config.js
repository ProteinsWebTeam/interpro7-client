/* eslint-env node */
const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const url = require('url');
const yaml = require('js-yaml');

// CSS-related
const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');

// Webpack plugins
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const extractTextPlugin = new ExtractTextPlugin({
  filename: 'styles.[contenthash:3].css',
  allChunks: true,
});

// Dashboard
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

const pkg = require(path.resolve('package.json'));

const DEFAULT_PORT = 80;
const kB = 1024;

const iprConfig = yaml.safeLoad(fs.readFileSync('config.yml'));
const websiteURL = url.parse(iprConfig.root.website, true, true);

const cssSettings = env => ({
  modules: true,
  minimize: env.production,
  importLoaders: 1,
  sourceMap: !env.production,
  localIdentName: `${env.production
    ? ''
    : '[folder]_[name]__[local]___'}[hash:base64:3]`,
});

// eslint-disable-next-line complexity
module.exports = (env = { dev: true }) => {
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
      visual: ['d3', 'gsap/TweenLite', 'popper.js'],
      redux: ['redux', 'react-redux', 'reselect'],
    },
    output: {
      path: path.resolve('dist'),
      publicPath: websiteURL.pathname || '/interpro7/',
      filename:
        env.production || env.staging
          ? '[id].[name].[chunkhash:3].js'
          : '[id].[name].js',
      chunkFilename:
        env.production || env.staging
          ? '[id].[name].[chunkhash:3].js'
          : '[id].[name].js',
    },
    resolve: {
      modules: [path.resolve('.', 'src'), 'node_modules'],
    },
    module: {
      rules: [
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
                      options: cssSettings(env),
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
                    options: cssSettings(env),
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
                name: `${env.production ? '' : '[name].'}[hash:3].[ext]`,
                limit: kB,
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
                limit: 1024,
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
            },
          ],
        },
      ],
    },
    performance: {
      // eslint-disable-next-line no-magic-numbers
      maxAssetSize: 5 * kB * kB, // 5MB
    },
    plugins: [
      // new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          minimize: !!env.production,
          debug: !env.production,
          context: __dirname,
        },
      }),
      new webpack.NamedModulesPlugin(),
      // new WebAppManifestPlugin(),
      env.test || env.production ? extractTextPlugin : null,
      env.test
        ? null
        : new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'visual', 'redux', 'polyfills', 'manifest'],
            filename: env.production ? '[name].[hash:3].js' : '[name].js',
            minChunks: Infinity,
          }),
      // TODO: try to have the next block working again
      // env.test
      //   ? null
      //   : new webpack.optimize.CommonsChunkPlugin({
      //       children: true,
      //       async: true,
      //       minChunks: 3,
      //     }),
      env.dev ? new webpack.HotModuleReplacementPlugin() : null,
      env.dev
        ? new webpack.DefinePlugin({
            'process.env': {
              PERF: JSON.stringify(!!env.performance),
              NODE_ENV: env.production ? JSON.stringify('production') : null,
            },
          })
        : null,
      env.dashboard ? new DashboardPlugin(new Dashboard().setData) : null,
      env.production || env.staging
        ? new FaviconsWebpackPlugin({
            logo: path.join('.', 'images', 'logo', 'logo_75x75.png'),
            prefix: 'icon.[hash:3].',
            minify: true,
          })
        : null,
      env.production || env.staging || env.dev
        ? new HtmlWebpackPlugin({
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
        ? new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
              screw_ie8: true,
              keep_fnames: true,
            },
            compress: {
              screw_ie8: true,
            },
            comments: false,
          })
        : null,
      env.production || env.staging ? extractTextPlugin : null,
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
