const express = require('express');
const path = require('path');

// create express application
const app = express();

const webpackConfig = require(path.resolve('.', 'webpack.config.js'))(
  undefined,
  {
    mode: 'production',
  }
);
const DEFAULT_PORT = 8888;

const publicPath = (webpackConfig?.[0] || webpackConfig).output.publicPath;
app.use(publicPath, express.static(path.resolve('.', 'dist')));

app.get('*', (req, res) => {
  const requestPath = path.resolve('.', 'dist', 'index.html');
  res.sendFile(requestPath);
});

// run express server on port 9000
const server = app.listen(DEFAULT_PORT, () => {
  console.log(
    `Express server started at http://localhost:${DEFAULT_PORT}${publicPath}`
  );
});
module.exports = server;
