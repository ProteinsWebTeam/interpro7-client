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
  import(/* webpackChunkName: offline */ './offline').then(m => m.default());
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
      '@context': [
        'http://schema.org',
        {
          Entry: {
            '@id': 'http://semanticscience.org/resource/SIO_000370.rdf',
          },
          DomainAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_001379.rdf',
          },
          FamilyAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_001380.rdf',
          },
          RepeatAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_000370.rdf',
          },
          UnknownAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_000370.rdf',
          },
          ConservedSiteAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010049.rdf',
          },
          BindingSiteAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010040.rdf',
          },
          ActiveSiteAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010041.rdf',
          },
          PTMAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010049.rdf',
          },
          Protein: {
            '@id': 'http://semanticscience.org/resource/SIO_010043',
          },
          Structure: {
            '@id': 'http://semanticscience.org/resource/SIO_011119.rdf',
          },
          Organism: {
            '@id': 'http://semanticscience.org/resource/SIO_010000.rdf',
          },
        },
        { '@base': 'http://schema.org' },
      ],
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
