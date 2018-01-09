const path = require('path');

const express = require('express');
const app = express();

const webpackConfig = require('../webpack.config.js')();

const PORT = 8888;

app.use(
  webpackConfig.output.publicPath,
  express.static(path.resolve('.', 'dist'))
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('.', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(
    `Server listening on http://0.0.0.0:${PORT}${
      webpackConfig.output.publicPath
    }`
  );
});
