// Polyfills
/* global gtag: false */
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

import { elementMatches as elementMatchesPolyfill } from 'utils/polyfills';

import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import App from 'App';

import ready from 'utils/ready';

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

export const main = async (shouldHydrate) => {
  // Waiting for DOMContentReady
  await ready();
  // Root of the DOM to hook React to
  const DOM_ROOT = document.getElementById('root');
  const root = createRoot(DOM_ROOT); // createRoot(container!) if you use TypeScript

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

  if (shouldHydrate) {
    hydrateRoot(DOM_ROOT, <App />);
  } else {
    root.render(<App />);
  }
};

export const handleError = (error) => {
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
