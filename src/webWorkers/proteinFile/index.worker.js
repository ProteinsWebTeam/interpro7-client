import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import { format } from 'url';
import throttle from 'lodash-es/throttle';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

// Max page size provided by the server
// to maximise the number of results sent by the server at once
const MAX_PAGE_SIZE = 200;

// From a pathname and search parameter, generates a full URL
const getUrl = (pathname, page) =>
  format({
    pathname,
    query: {
      page,
      page_size: MAX_PAGE_SIZE,
    },
  });

const THROTTLE_TIME = 500; // half a second

// Helper function to send progress information back to the main thread
// Throttled to avoid sending to much progress info at once
const progress = throttle((value /*: number */) => {
  self.postMessage({ type: 'progress', details: value });
}, THROTTLE_TIME);

// eslint-disable-next-line max-statements
const processEvent = async ({
  data: {
    entryDescription,
    api: { protocol, hostname, port, root },
    taxId,
    type,
  },
}) => {
  const content = [];
  const pathname = format({
    protocol,
    hostname,
    port,
    pathname:
      root +
      descriptionToPath({
        main: { key: type === 'entry-accession' ? 'entry' : 'protein' },
        protein: { db: 'UniProt', isFilter: type === 'entry-accession' },
        entry: {
          ...entryDescription,
          isFilter: type === 'protein-accession',
          db: (type === 'entry-accession' && entryDescription.db) || 'all',
        },
        organism: { isFilter: true, db: 'taxonomy', accession: taxId },
      }),
  });
  const proteinPathFor = accession =>
    format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'protein' },
          protein: { db: 'UniProt', accession },
        }),
    });
  let page = 1;
  let current = 0;
  let totalCount;
  let next = getUrl(pathname, page);
  while (next) {
    const response = await fetch(next);
    const obj = await response.json();
    totalCount = obj.count + 1;
    next = obj.next && getUrl(pathname, ++page);
    for (const {
      metadata: { accession, source_database: db, name },
    } of obj.results) {
      if (type.endsWith('-accession')) {
        content.push(accession);
      } else {
        // FASTA
        const response = await fetch(proteinPathFor(accession));
        const {
          metadata: { sequence },
        } = await response.json();
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
  async event => {
    let url;
    try {
      url = await processEvent(event);
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
