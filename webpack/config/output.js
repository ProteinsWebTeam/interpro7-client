const path = require('path');
const process = require('process');

const PROD = process.env.NODE_ENV === 'production';

module.exports = ({publicPath = '/interpro7/'} = {}) => ({
  path: path.resolve('dist'),
  publicPath,
  filename: PROD ? '[id].[name].[chunkhash:3].js' : '[id].[name].js',
  chunkFilename: PROD ? '[id].[name].[chunkhash:3].js' : '[id].[name].js',
});
