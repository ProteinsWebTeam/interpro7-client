const process = require('process');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PROD = process.env.NODE_ENV === 'PRODUCTION';

const cssSettings = {
  modules: true,
  minimize: PROD,
  importLoaders: 1,
  sourceMap: !PROD,
  localIdentName: `${PROD ? '' : '[name]__[local]___'}[hash:base64:3]`,
};

module.exports = {
  loaders: [
    {
      test: /\.js$/i,
      include: [
        path.resolve('.', 'src'),
        path.resolve('.', 'node_modules', 'react-router', 'es6'),
        path.resolve('.', 'node_modules', 'lodash-es'),
        path.resolve('.', 'node_modules', 'color-hash'),
      ],
      // loaders: [
      //   {
      //     loader: 'babel-loader',
      //   },
      // ],
      loader: 'babel-loader',
    },
    {
      test: /\.json$/i,
      // loaders: ['json-loader'],
      loader: 'json-loader',
    },
    {
      test: /\.yml$/i,
      // loaders: ['json-loader', 'yaml-loader'],
      loader: 'json-loader!yaml-loader',
    },
    {
      test: /\.css$/i,
      // loaders: [ExtractTextPlugin.extract({
      //   fallbackLoader: 'style-loader',
      //   loader: [
      //     {
      //       loader: 'css-loader',
      //       query: cssSettings,
      //     },
      //     {
      //       loader: 'postcss-loader',
      //     },
      //   ],
      // })],
      loader: ExtractTextPlugin.extract(
        'style-loader',
        `css-loader?${JSON.stringify(cssSettings)}!postcss-loader`
      ),
    },
    {
      test: /\.scss$/i,
      // loaders: [ExtractTextPlugin.extract({
      //   fallbackLoader: 'style-loader',
      //   loader: [
      //     {
      //       loader: 'css-loader',
      //       query: cssSettings,
      //     },
      //     {
      //       loader: 'sass-loader',
      //       query: {sourceMap: !PROD},
      //     },
      //   ],
      // })],
      loader: ExtractTextPlugin.extract(
        'style-loader',
        `css-loader?${
          JSON.stringify(cssSettings)
        }!sass-loader?sourceMap=${!PROD}`
      ),
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      // loaders: [
      //   {
      //     loader: 'url-loader',
      //     query: {
      //       name: `${PROD ? '' : '[name].'}[hash:3].[ext]`,
      //       limit: 512,
      //     },
      //   },
      //   {
      //     loader: 'img-loader',
      //   },
      // ],
      loader: `url-loader?${JSON.stringify({
        name: `${PROD ? '' : '[name].'}[hash:3].[ext]`,
        limit: 512,
      })}!img-loader`,
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff',
    },
    {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
    },
  ],
};
