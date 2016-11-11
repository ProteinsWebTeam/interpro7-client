const path = require('path');

module.exports = ({publicPath = '/interpro/'} = {}) => ({
  path: path.resolve('dist'),
  publicPath,
  filename: 'app.[chunkhash:3].js',
  chunkFilename: '[id].[name].[chunkhash:3].js',
});
