// Entry points for the application and some ext libraries
// (don't put ES2016 modules enabled libraries here)
module.exports = {
  app: ['index'], // src/index.js
  vendor: ['babel-polyfill', 'react', 'react-dom', 'isomorphic-fetch'],
};
