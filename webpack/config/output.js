const path = require('path');

module.exports = {
  path: path.resolve('dist'),
  publicPath: '/interpro/',
  filename: 'app.[chunkhash:3].js',
  chunkFilename: '[id].[chunkhash:3].js',
};
