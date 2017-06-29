/* eslint-env node */
const config = require('./webpack.config');
module.exports = config({ test: true });
