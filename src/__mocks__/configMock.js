// @flow
/* eslint-env node */
const fs = require('fs');
const yaml = require('js-yaml');

module.exports = yaml.safeLoad(fs.readFileSync('config.yml'), { json: true });
