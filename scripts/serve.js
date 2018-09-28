const path = require('path');
const http = require('http');

const express = require('express');
const app = express();
const server = http.createServer(app);

const webpackConfig = require('../webpack.config.js')(undefined, {
  mode: 'production',
});

const DEFAULT_PORT = 8888;

app.use(
  webpackConfig[0].output.publicPath,
  express.static(path.resolve('.', 'dist'))
);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('.', 'dist', 'index.html'));
});

const startServerOn = (port /*: number */) =>
  new Promise((resolve, reject) => {
    server.on('listening', resolve);
    server.on('error', error => {
      try {
        server.close();
      } catch (_) {
        /**/
      } finally {
        reject(error);
      }
    });
    try {
      server.listen(port);
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  async start() {
    let port = DEFAULT_PORT;
    while (!server.listening) {
      // eslint-disable-line no-constant-condition
      try {
        await startServerOn(port);
        return port;
      } catch (_) {
        port++;
      }
    }
  },
  close() {
    server.close();
  },
};
