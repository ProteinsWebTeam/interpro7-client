// Polyfills
/* global ga: false */
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter';

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
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt.event = event;
});

const schemaOrgManager = (...args) =>
  import(/* webpackChunkName: "schemaOrg" */ 'schema_org').then(
    m => new m.Manager(...args),
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
      '@context': [
        'http://schema.org',
        {
          Entry: {
            '@id': 'http://semanticscience.org/resource/SIO_010471.rdf',
          },
          DomainAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_001379.rdf',
          },
          FamilyAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_001380.rdf',
          },
          RepeatAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010471.rdf',
          },
          UnknownAnnotation: {
            '@id': 'http://semanticscience.org/resource/SIO_010471.rdf',
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
            '@id': 'http://semanticscience.org/resource/SIO_010043.rdf',
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

const handleError = error => {
  if (DEV) {
    throw error;
  }
  try {
    error.preventDefault();
  } catch {
    /**/
  }
  ga('send', 'exception', { exDescription: error.message, exFatal: true });
};

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);
