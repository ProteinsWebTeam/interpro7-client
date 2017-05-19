/* eslint-env node */
// Polyfills
import 'babel-polyfill';

import React from 'react';
import {render} from 'react-dom';

import App from 'App';

import config, {DEV, PERF} from 'config';
import ready from 'utils/ready';

const schemaOrgManager = (...args) => import(
  /* webpackChunkName: "schemaOrg" */'schema_org'
).then(m => new m.Manager(...args));

const main = async () => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');

  // If “PERF” is defined in the environment, activate “why-did-you-update” tool
  if (DEV && PERF) {
    require('why-did-you-update').whyDidYouUpdate(
      React,
      {include: /.*/},
    );
  }

  // Instantiates schema.org manager
  schemaOrgManager({
    dev: DEV,
    root: {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: config.root.website.protocol + config.root.website.href,
      mainEntityOfPage: '@mainEntity',
    },
  });

  // Main render function
  render(<App />, DOM_ROOT);

  // This block enables HMR if needed
  if (DEV && module.hot) {
    // If any change in App or its dependency tree
    module.hot.accept('App', () => {
      // Reloads App
      const NextApp = require('App').default;
      // Re-renders App
      render(<NextApp />, DOM_ROOT);
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
