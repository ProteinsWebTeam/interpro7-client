const process = require('process');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postCSSImport = require('postcss-import');
const cssNext = require('postcss-cssnext');

const PROD = process.env.NODE_ENV === 'production';
const TEST = process.env.NODE_ENV === 'test';

const cssSettings = {
  modules: true,
  minimize: PROD,
  importLoaders: 1,
  sourceMap: !PROD,
  localIdentName: `${PROD ? '' : '[folder]_[name]__[local]___'}[hash:base64:3]`,
};

module.exports = {
  rules: [
    {
      test: /\.js$/i,
      include: [
        path.resolve('src'),
        path.resolve('node_modules', 'react-router', 'es'),
        path.resolve('node_modules', 'lodash-es'),
        path.resolve('node_modules', 'color-hash'),
        path.resolve('node_modules', 'timing-functions'),
      ],
      use: [
        {
          loader: 'babel-loader',
        },
      ],
    },
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
      // See https://github.com/webpack/extract-text-webpack-plugin/issues/282
      use:
        PROD || TEST
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: Object.assign({}, cssSettings, {
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
                options: Object.assign({}, cssSettings, {
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
      // See https://github.com/webpack/extract-text-webpack-plugin/issues/282
      use:
        PROD || TEST
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: cssSettings,
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
                options: cssSettings,
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
      // See https://github.com/webpack/extract-text-webpack-plugin/issues/282
      use:
        PROD || TEST
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: cssSettings,
                },
                {
                  loader: 'sass-loader',
                  options: { sourceMap: !PROD },
                },
              ],
            })
          : [
              'style-loader',
              {
                loader: 'css-loader',
                options: cssSettings,
              },
              {
                loader: 'sass-loader',
                options: { sourceMap: !PROD },
              },
            ],
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: `${PROD ? '' : '[name].'}[hash:3].[ext]`,
            limit: 1024,
          },
        },
        {
          loader: 'img-loader',
          options: {
            enabled: PROD,
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
};
