// @flow
// Polyfills
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';

import App from 'App';

import config, { PROD, STAGING, DEV, PERF } from 'config';
import ready from 'utils/ready';

import hmr from 'index-hmr';

if (PROD || STAGING) {
  const runtime = require('offline-plugin/runtime');
  runtime.install({
    onUpdating: () => {
      console.log('SW Event:', 'onUpdating');
    },
    onUpdateReady: () => {
      console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      console.log('SW Event:', 'onUpdated');
      // Reload the webpage to load into the new version
      window.location.reload();
    },

    onUpdateFailed: () => {
      console.log('SW Event:', 'onUpdateFailed');
    },
  });
}

const schemaOrgManager = (...args) =>
  import(/* webpackChunkName: "schemaOrg" */ 'schema_org').then(
    m => new m.Manager(...args),
  );

const main = async () => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');

  // If “PERF” is defined in the environment, activate “why-did-you-update” tool
  if (DEV && PERF) {
    // if (DEV) {
    // require('why-did-you-update').whyDidYouUpdate(React, { include: /.*/ });
  }

  // Instantiates schema.org manager
  schemaOrgManager({
    dev: DEV,
    root: {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: config.root.website.protocol + config.root.website.href,
      mainEntityOfPage: '@mainEntityOfPage',
    },
  });

  // Main render function
  render(<App />, DOM_ROOT);

  // enables hot module reloading if needed
  if (DEV) hmr(DOM_ROOT);
};

const handleError = e => {
  if (DEV) {
    throw e;
  }
  try {
    e.preventDefault();
  } catch (_) {
    /**/
  }
  console.error(e);
  // TODO: send to analytics
};

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);
