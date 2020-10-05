// @flow
/* eslint-env node */
const fs = require('fs');
const yaml = require('js-yaml');
const file = fs.readFileSync('./config.yml', 'utf8');
const data /*: Object */ = yaml.safeLoad(file, {
  json: true,
});
module.exports = data;
