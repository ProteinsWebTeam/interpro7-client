const process = require('process');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';

const cssSettings = {
  modules: true,
  minimize: PROD,
  importLoaders: 1,
  sourceMap: !PROD,
  localIdentName: `${PROD ? '' : '[folder]_[name]__[local]___'}[hash:base64:3]`,
};

module.exports = {
  loaders: [
    {
      test: /\.js$/i,
      include: [
        path.resolve('src'),
        path.resolve('node_modules', 'react-router', 'es'),
        path.resolve('node_modules', 'lodash-es'),
        path.resolve('node_modules', 'color-hash'),
        // path.resolve('node_modules', 'data-loader'),
        // path.resolve('node_modules', 'interpro-components'),
        // path.resolve('node_modules', 'pdb-web-components'),
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
      test: /((ebi-global)|(interpro-new))\.css$/i,
      loader: ExtractTextPlugin.extract(
        'style-loader',
        `css-loader?${
          JSON.stringify(
            Object.assign({}, cssSettings, {localIdentName: '[local]'})
          )}!postcss-loader`
      ),
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
      exclude: /((ebi-global)|(interpro-new))\.css$/i,
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
      //       limit: 1024,
      //     },
      //   },
      //   {
      //     loader: 'img-loader',
      //   },
      // ],
      loader: `url-loader?name=${
        PROD ? '' : '[name].'
      }[hash:3].[ext]&limit=1024!img-loader`,
    },
    {
      test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: 'url-loader?limit=1024&mimetype=application/font-woff',
      // loaders: [
      //   {
      //     loader: 'url-loader',
      //     query: {
      //       limit: 1024,
      //       mimetype: 'application/font-woff',
      //     },
      //   },
      // ],
    },
    {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
      loader: 'file-loader',
      // loaders: ['file-loader'],
    },
  ],
};
