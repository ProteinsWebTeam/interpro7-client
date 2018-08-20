// @flow
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';
import { format, parse } from 'url';
import throttle from 'lodash-es/throttle';
import { sleep } from 'timing-functions/src';

import { DOWNLOAD_URL } from 'actions/types';

import {
  downloadError,
  downloadProgress,
  downloadSuccess,
} from 'actions/creators';

/*:: type FileType = 'accession' | 'fasta'; */

// Max page size provided by the server
// to maximise the number of results sent by the server at once
const MAX_PAGE_SIZE = 200;
// Time to wait before retrying to get results from API when we have a problem
const DELAY_WHEN_SOME_KIND_OF_PROBLEM = 60000; // 1 minute
const REQUEST_TIMEOUT = 408;
const MAX_ERROR_COUNT_FOR_ONE_REQUEST = 3;
const THROTTLE_TIME = 500; // half a second

const CHUNK_OF_EIGHTY = /(.{1,80})/g;

const lut = new Map([
  ['fasta', 'text/x-fasta'],
  ['accession', 'text/plain'],
  ['json', 'application/json'],
  ['ndjson', 'application/x-ndjson'],
  ['xml', 'application/xml'],
  ['tsv', 'text/tab-separated-values'],
]);

// always send the same thing, so abstract that
const createActionCallerFor = (...args1) => (creator, ...args2) =>
  creator(...args1, ...args2);

const processResultsFor = fileType =>
  function*(results) {
    for (const result of results) {
      let content = '';
      if (fileType === 'fasta') {
        content += `>${result.metadata.accession}|${
          result.metadata.source_database
        }|${result.metadata.name}|taxID:${
          result.metadata.source_organism.taxId
        }`;
      } else {
        content += result.metadata.accession;
      }
      content += '\n';
      if (fileType === 'fasta') {
        content += result.extra_fields.sequence.replace(
          CHUNK_OF_EIGHTY,
          '$1\n',
        );
      }
      yield content;
    }
  };

const getFirstPage = (url, fileType) => {
  const location = parse(url, true);
  if (fileType === 'fasta') {
    location.query.extra_fields = [
      ...(location.query.extra_fields, '').split(','),
      'sequence',
    ]
      .filter(Boolean)
      .join(',');
  }
  location.query.page = 1;
  location.query.page_size = MAX_PAGE_SIZE;
  return location;
};

// the `_` is just to make flow happy
const downloadContent = (onProgress, onSuccess, onError) => async (
  url,
  fileType,
  _,
) => {
  try {
    const firstPage = getFirstPage(url, fileType);
    // Counters for progress information
    let totalCount;
    let i = 0;
    // Create a function to transform API response into processed file part
    const processResults = processResultsFor(fileType);
    // As long as we have a next page, we keep processing
    // Let's start with the first one
    let next = format(firstPage);
    let errorCount = 0;
    while (next) {
      try {
        const response = await fetch(next);
        // If the server sent a timeout response…
        if (response.status === REQUEST_TIMEOUT) {
          // …wait a bit…
          await sleep(DELAY_WHEN_SOME_KIND_OF_PROBLEM);
          // …then restart the loop with at the same URL
          continue;
        }
        const payload = await response.json();
        totalCount = payload.count;
        for (const part of processResults(payload.results)) {
          // use `totalCount + 1` to not finish at exactly 1 to account for the
          // time needed to create the blob
          onProgress({ part, progress: ++i / (totalCount + 1) });
        }
        // If it's the last page, it will be null, so we exit the loop
        next = payload.next;
        // reset error counter as we're finished with that URL
        errorCount = 0;
      } catch (error) {
        // If we have too many errors for one URL, just bail and throw the last
        if (errorCount > MAX_ERROR_COUNT_FOR_ONE_REQUEST) {
          throw error;
        } else {
          errorCount++;
          await sleep(DELAY_WHEN_SOME_KIND_OF_PROBLEM);
        }
      }
    }
    onSuccess();
  } catch (error) {
    onError(error);
  }
};

// Create a file from the passed content and return its blob URL
const generateFileHandle = (
  content /*: Array<string> */,
  fileType /*: FileType */,
) => {
  const blob = new Blob(content, { type: lut.get(fileType) });
  return { blobURL: URL.createObjectURL(blob), size: blob.size };
};

const postProgress = throttle(
  progressAction => self.postMessage(progressAction),
  THROTTLE_TIME,
);

// Download manager, send messages from there
const download = async (url, fileType) => {
  const action = createActionCallerFor(url, fileType);
  const onError = error => {
    console.error(error);
    postProgress(action(downloadProgress, 1));
    postProgress.flush();
    self.postMessage(action(downloadError, error.message));
  };
  try {
    // Store content in there
    const content = [];
    postProgress(action(downloadProgress, 0));
    action(
      downloadContent(
        // onProgress
        ({ part, progress }) => {
          // store content
          content.push(part);
          // and regularly send progress info to main thread
          postProgress(action(downloadProgress, progress));
        },
        // onSuccess
        () => {
          // Finished getting all the content, generate a blob out of that
          // and get its URL
          const urlAndSize = generateFileHandle(content, fileType);
          // OK, we have done everything, set progress to 1 and set success
          postProgress(action(downloadProgress, 1));
          postProgress.flush();
          self.postMessage(action(downloadSuccess, urlAndSize));
        },
        onError,
      ),
    );
  } catch (error) {
    onError(error);
  }
};

const main = ({ data }) => {
  switch (data.type) {
    case DOWNLOAD_URL:
      console.log(data);
      download(data.url, data.fileType);
      break;
    default:
      console.warn('not a recognised message', data);
  }
};

self.addEventListener('message', main);
