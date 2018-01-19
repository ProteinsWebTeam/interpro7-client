// @flow
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

// Max page size provided by the server
// to maximise the number of results sent by the server at once
const MAX_PAGE_SIZE = 200;

// From a pathname and search parameter, generates a full URL
const getUrl = (pathname, taxId, page) =>
  format({
    pathname,
    query: {
      tax_id: taxId,
      page,
      page_size: MAX_PAGE_SIZE,
    },
  });

// Helper function to send progress information back to the main thread
const progress = (value /*: number */) => {
  self.postMessage({ type: 'progress', details: value });
};

// eslint-disable-next-line max-statements
const processEvent = async ({
  data: { entryDescription, api, taxId, type },
}) => {
  const content = [];
  const pathname = `${api.protocol}//${api.hostname}:${api.port}${
    api.root
  }${descriptionToPath({
    main: { key: 'protein' },
    protein: { db: 'UniProt' },
    entry: { ...entryDescription, isFilter: true },
  })}`;
  const proteinPath = `${api.protocol}//${api.hostname}:${api.port}${
    api.root
  }${descriptionToPath({
    main: { key: 'protein' },
    protein: { db: 'UniProt' },
  })}`;
  let page = 1;
  let current = 0;
  let totalCount;
  let next = getUrl(pathname, taxId, page);
  while (next) {
    const response = await fetch(next);
    const obj = await response.json();
    totalCount = obj.count + 1;
    next = obj.next && getUrl(pathname, taxId, ++page);
    for (const {
      metadata: { accession, source_database: db, name },
    } of obj.results) {
      if (type === 'accession') {
        content.push(accession);
      } else {
        // FASTA
        const response = await fetch(`${proteinPath}${accession}/`);
        const { metadata: { sequence } } = await response.json();
        content.push(`>${accession}|${db}|${name}`);
        for (const line of sequence.match(/.{1,80}/g)) {
          content.push('\n', line);
        }
      }
      content.push('\n');
      progress(current++ / totalCount);
    }
  }
  const blob = new Blob(content, {
    type: `text/${type === 'FASTA' ? 'x-fasta' : 'plain'}`,
  });
  const url = URL.createObjectURL(blob);
  progress(1);
  return url;
};

self.addEventListener(
  'message',
  async e => {
    let url;
    try {
      url = await processEvent(e);
    } catch (error) {
      self.postMessage({ type: 'failed', details: error });
    }
    self.postMessage({ type: 'success', details: url });
    // Don't close it now, otherwise the blob will disappear
    // Let it be terminated by the main thread on component unmount
    // NOTE: should maybe transfer the blob back to main thread to be able to
    // kill the worker without losing the file
  },
  { once: true },
);
