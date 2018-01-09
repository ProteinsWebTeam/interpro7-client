/* eslint-env node */
const path = require('path');
const http = require('http');

const express = require('express');
const app = express();
const server = http.createServer(app);

const webpackConfig = require('../webpack.config.js')();

const PORT = 8888;

app.use(
  webpackConfig.output.publicPath,
  express.static(path.resolve('.', 'dist'))
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('.', 'dist', 'index.html'));
});

module.exports = {
  start() {
    server.listen(PORT);

    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        // console.log(
        //   `Server listening on http://0.0.0.0:${PORT}${
        //     webpackConfig.output.publicPath
        //   }`
        // );
        resolve(PORT);
      });

      server.on('error', error => {
        try {
          server.close();
        } catch (_) {
          /**/
        } finally {
          reject(error);
        }
      });
    });
  },
  close() {
    server.close();
  },
};
