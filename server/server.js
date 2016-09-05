/* eslint-env node */
/* eslint no-console: 0 */
'use strict';
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express();

const PORT = 8080;
const INDEX_PATH = path.join(__dirname, '..', 'dist', 'static', 'index.html');
let indexContent;
const index = () => {
  if (!indexContent) {
    indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
  }
  return indexContent;
};

app.use(express.static(path.join(__dirname, '..', 'dist')));

// TODO: server-side rendering
app.get('*', (req, res) => res.send(index()));

app.listen(
  PORT,
  () => console.log(`Server listening on http://0.0.0.0:${PORT}`)
);
