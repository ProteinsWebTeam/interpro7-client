/* eslint-env node */
import React from 'react';
import {render} from 'react-dom';

import App from 'App';

import {DEV} from 'config';
import ready from 'utils/ready';

const main = async () => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');

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
        // If any error, renders the error inside a RedBox
        // (displays it in the browser)
        const RedBox = require('redbox-react');
        render(<RedBox error={error} />, DOM_ROOT);
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
