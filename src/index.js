// Polyfills
/* global ga: false */
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { elementMatches as elementMatchesPolyfill } from 'utils/polyfills';

import React from 'react';
import { render } from 'react-dom';

import App from 'App';
import ready from 'utils/ready';

import hmr from 'index-hmr';

import config, { DEV } from 'config';

elementMatchesPolyfill();

// "add to homescreen" banner management
// see https://developers.google.com/web/updates/2018/06/a2hs-updates
// save the event in an exported object to be able to use it wherever we want
export const installPrompt = {};
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt.event = event;
});

const schemaOrgManager = (...args) =>
  import(/* webpackChunkName: "schemaOrg" */ 'schema_org').then(
    (m) => new m.Manager(...args),
  );

const main = async () => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');

  // Instantiates schema.org manager
  schemaOrgManager({
    dev: false,
    root: {
      '@context': [{ bio: 'http://bioschemas.org/' }, 'http://schema.org'],
      '@type': 'Dataset',
      '@id': config.root.website.protocol + config.root.website.href,
      hasPart: '@hasPart',
      url: config.root.website.protocol + config.root.website.href,
      // mainEntityOfPage: '@mainEntityOfPage',
      mainEntity: '@mainEntity',
      name: 'InterPro',
      description:
        'InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites',
      keywords: [
        'proteins',
        'protein families',
        'protein domains',
        'protein sites',
        'protein repeats',
        'protein models',
        'homologus superfamily',
        'entries',
      ],
      sourceOrganization: [
        {
          '@type': 'Organization',
          '@id': 'https://www.ebi.ac.uk',
          name: 'The European Bioinformatics Institute (EMBL-EBI)',
          url: 'https://www.ebi.ac.uk/',
        },
      ],
      encodingFormat: 'text/html',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      citation: '@mainCitation',
    },
  });

  // Main render function
  render(<App />, DOM_ROOT);

  // enables hot module reloading if needed
  if (DEV) hmr(DOM_ROOT);
};

const handleError = (error) => {
  if (DEV) {
    throw error;
  }
  try {
    error.preventDefault();
  } catch {
    /**/
  }
  gtag('event', 'error', {
    event_label: error.message,
    event_fatal: true,
  });
};

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);
