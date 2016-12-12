const path = require('path');

module.exports = ({publicPath = '/interpro7/'} = {}) => ({
  path: path.resolve('dist'),
  publicPath,
  filename: '[id].[name].[chunkhash:3].js',
  chunkFilename: '[id].[name].[chunkhash:3].js',
});
