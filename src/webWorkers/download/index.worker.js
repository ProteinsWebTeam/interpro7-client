// @flow
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import { format, parse } from 'url';
import throttle from 'lodash-es/throttle';

import { DOWNLOAD_URL } from 'actions/types';

import {
  downloadError,
  downloadProgress,
  downloadSuccess,
} from 'actions/creators';

/*:: type FileType = 'accession' | 'FASTA'; */

// Max page size provided by the server
// to maximise the number of results sent by the server at once
const MAX_PAGE_SIZE = 200;
// const MAX_PAGE_SIZE = 4;

const THROTTLE_TIME = 500; // half a second

const CHUNK_OF_EIGHTY = /(.{1,80})/g;

// always send the same thing, so abstract that
const createActionCallerFor = (...args1) => (creator, ...args2) =>
  creator(...args1, ...args2);

const processResultsFor = fileType =>
  function*(results) {
    for (const result of results) {
      let content = '';
      if (fileType === 'FASTA') {
        content += `>${result.metadata.accession}|${
          result.metadata.source_database
        }|${result.metadata.name}|taxID:${
          result.metadata.source_organism.taxId
        }`;
      } else {
        content += result.metadata.accession;
      }
      content += '\n';
      if (fileType === 'FASTA') {
        content += result.extra_fields.sequence.replace(
          CHUNK_OF_EIGHTY,
          '$1\n',
        );
      }
      yield content;
    }
  };

// the `_` is just to make flow happy
const downloadContent = async function*(url, fileType, _) {
  const location = parse(url, true);
  const query = location.query;
  if (fileType === 'FASTA') {
    location.query.extra_fields = [
      ...(location.query.extra_fields, '').split(','),
      'sequence',
    ]
      .filter(Boolean)
      .join(',');
  }
  location.query.page = 1;
  location.query.page_size = MAX_PAGE_SIZE;
  let totalCount;
  let i = 0;
  let next = format(location);
  const processResults = processResultsFor(fileType);
  while (next) {
    console.log(`fetching ${next}`);
    const response = await fetch(next);
    const payload = await response.json();
    totalCount = payload.count;
    for (const part of processResults(payload.results)) {
      // use `totalCount + 1` to not finish at exactly 1 to account for the
      // time needed to create the blob
      yield { part, progress: ++i / (totalCount + 1) };
    }
    next = payload.next;
  }
};

// Create a file from the passed content and return its blob URL
const generateFileHandle = (
  content /*: Array<string> */,
  fileType /*: FileType */,
) => {
  const blob = new Blob(content, {
    type: `text/${fileType === 'FASTA' ? 'x-fasta' : 'plain'}`,
  });
  return URL.createObjectURL(blob);
};

const postProgress = throttle(progressAction => {
  self.postMessage(progressAction);
}, THROTTLE_TIME);

// Download manager, send messages from there
const download = async (url, fileType) => {
  const action = createActionCallerFor(url, fileType);
  try {
    // Store content in there
    const content = [];
    postProgress(action(downloadProgress, 0));
    // Loop over what downloadContent yield to…
    for await (const { part, progress } of action(downloadContent)) {
      // …store content
      content.push(part);
      // …and regularly send progress info to main thread
      postProgress(action(downloadProgress, progress));
    }
    // Finished getting all the content, generate a blob out of that
    // and get its URL
    const blobURL = generateFileHandle(content, fileType);
    // OK, we have done everything, set progress to 1 and set success
    postProgress(action(downloadProgress, 1));
    postProgress.flush();
    self.postMessage(action(downloadSuccess, blobURL));
  } catch (error) {
    console.error(error);
    postProgress(action(downloadProgress, 1));
    postProgress.flush();
    self.postMessage(action(downloadError, error.message));
  }
};

const main = ({ data }) => {
  switch (data.type) {
    case DOWNLOAD_URL:
      download(data.url, data.fileType);
      break;
    default:
      console.warn('not a recognised message', data);
  }
};

self.addEventListener('message', main);
