/* eslint-env node */
// Polyfills
import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';

import App from 'App';

import {DEV, PERF} from 'config';
import ready from 'utils/ready';

const main = async () => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');

  // If “PERF” is defined in the environment, activate “why-did-you-update” tool
  if (DEV && PERF) require('why-did-you-update').whyDidYouUpdate(
    React,
    {include: /.*/},
  );

  // Main render function
  render(<App />, DOM_ROOT);

  // This block enables HMR if needed
  if (DEV && module.hot) {
    // If any change in App or its dependency tree
    module.hot.accept('App', () => {
      try {
        // Reloads App
        const NextApp = require('App').default;
        // Re-renders App
        render(<NextApp />, DOM_ROOT);
      } catch (error) {
        console.error(error);
      }
    });
  }
};

const handleError = e => {
  try {
    e.preventDefault();
  } catch (_) {/**/}
  console.error(e);
  // TODO: send to analytics
};

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);
