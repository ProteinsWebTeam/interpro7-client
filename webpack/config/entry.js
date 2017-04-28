// Entry points for the application and some ext libraries
// (don't put ES2016 modules enabled libraries here)
module.exports = {
  app: ['index'], // src/index.js
  polyfills: [
    'core-js',
  ],
  vendor: [
    'react',
    'react-dom',
    'react-helmet',
    'isomorphic-fetch',
    'lodash-es',
    'history',
  ],
  redux: [
    'redux',
    'react-redux',
    'reselect',
  ],
};
