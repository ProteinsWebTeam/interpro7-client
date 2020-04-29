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
      '@context': 'http://schema.org',
      '@type': 'DataCatalog',
      '@id': config.root.website.protocol + config.root.website.href,
      url: config.root.website.protocol + config.root.website.href,
      mainEntityOfPage: '@mainEntityOfPage',
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
      citation: {
        '@type': 'ScholarlyArticle',
        '@id': 'https://doi.org/10.1093/nar/gky1100',
        name:
          'InterPro in 2019: improving coverage, classification and access to protein sequence annotations',
        headline:
          'InterPro in 2019: improving coverage, classification and access to protein sequence annotations',
        url: 'https://doi.org/10.1093/nar/gky1100',
        datePublished: '2019-01',
        dateModified: '2019-01',
        publisher: {
          '@type': 'Organization',
          '@id': 'https://academic.oup.com/nar',
          name: 'Nucleic Acids Research',
          url: 'https://academic.oup.com/nar',
        },
        image:
          'https://proteinswebteam.github.io/interpro-blog/assets/media/images/logo_medium.png',
        author: [
          'Mitchell AL',
          'Attwood TK',
          'Babbitt PC',
          'Blum M',
          'Bork P',
          'Bridge A',
          'Brown SD',
          'Chang HY',
          'El-Gebali S',
          'Fraser MI',
          'Gough J',
          'Haft DR',
          'Huang H',
          'Letunic I',
          'Lopez R',
          'Luciani A',
          'Madeira F',
          'Marchler-Bauer A',
          'Mi H',
          'Natale DA',
          'Necci M',
          'Nuka G',
          'Orengo C',
          'Pandurangan AP',
          'Paysan-Lafosse T',
          'Pesseat S',
          'Potter SC',
          'Qureshi MA',
          'Rawlings ND',
          'Redaschi N',
          'Richardson LJ',
          'Rivoire C',
          'Salazar GA',
          'Sangrador-Vegas A',
          'Sigrist CJA',
          'Sillitoe I',
          'Sutton GG',
          'Thanki N',
          'Thomas PD',
          'Tosatto SCE',
          'Yong SY',
          'Finn RD',
        ],
        sameAs: [
          'https://academic.oup.com/nar/article/47/D1/D351/5162469',
          'https://www.ncbi.nlm.nih.gov/pubmed/30398656',
        ],
      },
      sourceOrganization: [
        {
          '@type': 'Organization',
          '@id': 'https://www.ebi.ac.uk',
          name: 'The European Bioinformatics Institute (EMBL-EBI)',
          url: 'https://www.ebi.ac.uk/',
        },
      ],
      encodingFormat: 'text/html',
      license: '@license',
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
  ga('send', 'exception', { exDescription: error.message, exFatal: true });
};

window.addEventListener('unhandledrejection', handleError);

main().catch(handleError);
