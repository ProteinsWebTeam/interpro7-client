const path = require('path');

module.exports = {
  path: path.resolve('dist'),
  publicPath: '/interpro/',
  filename: 'app.[chunkhash:3].js',
  chunkFilename: '[id].[name].[chunkhash:3].js',
};
