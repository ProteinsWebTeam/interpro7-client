// @flow
import fetch from 'isomorphic-fetch';
import { format, parse } from 'url';
import { throttle } from 'lodash-es';
import { sleep } from 'timing-functions';

import getTableAccess, { DownloadJobs } from 'storage/idb';
import { object2TSV, columns } from './object2TSV';

// $FlowFixMe
import { DOWNLOAD_URL, DOWNLOAD_DELETE } from 'actions/types';

import {
  downloadError,
  downloadProgress,
  downloadSuccess,
  // $FlowFixMe
} from 'actions/creators';

/*:: type FileType = 'accession' | 'fasta' | 'json' | 'tsv'; */

// Max page size provided by the server
// to maximise the number of results sent by the server at once
const MAX_PAGE_SIZE = 200;
const MAX_EBI_PAGE_SIZE = 100;
// Time to wait before retrying to get results from API when we have a problem
const DELAY_WHEN_SOME_KIND_OF_PROBLEM = 60000; // 1 minute
const REQUEST_TIMEOUT = 408;
const MAX_ERROR_COUNT_FOR_ONE_REQUEST = 3;
const THROTTLE_TIME = 500; // half a second

const CHUNK_OF_EIGHTY = /(.{1,80})/g;

const canceled = new Set();

const lut = new Map([
  ['fasta', 'text/x-fasta'],
  ['accession', 'text/plain'],
  ['json', 'application/json'],
  // ['ndjson', 'application/x-ndjson'],
  ['xml', 'application/xml'],
  ['tsv', 'text/tab-separated-values'],
]);

const jobsData = getTableAccess(DownloadJobs);

const deleteFromDB = async (key) => {
  const jobsTable = await jobsData;
  jobsTable.delete(key);
};

const saveInIndexedDB = async (
  key /*: string */,
  content /*: Array<string> */,
  fileType /*: FileType */,
  subset /*: boolean */,
  version /*: number */,
  originURL /*: string */,
) => {
  const _content = fileType === 'json' ? [`[${content.join(',')}]`] : content;
  const blob = new Blob(_content, { type: lut.get(fileType) });
  try {
    // add entry to idb
    const jobsDataTable = await jobsData;
    const obj = {
      key,
      date: new Date().toISOString(),
      fileType,
      length: content.length,
      blob,
      subset,
      version,
      originURL,
    };
    await jobsDataTable.set(obj, key);
    return obj;
  } catch {
    // cleanup if anything bad happens
    await deleteFromDB(key);
  }
};

// always send the same thing, so abstract that
const createActionCallerFor =
  (...args1) =>
  (creator, ...args2) =>
    creator(...args1, ...args2);

const DESCRIPTION_SEPARATOR = '|';

const processResultsFor = (fileType, subset, endpoint) =>
  function* (results) {
    for (const result of results) {
      let content = '';
      if (fileType === 'fasta') {
        if (subset) {
          const matches = result.entries[0].entry_protein_locations;
          for (const [
            index,
            match,
          ] of result.entries[0].entry_protein_locations.entries()) {
            // description
            content += `>${[
              result.metadata.accession,
              `match:${index + 1}/${matches.length}`,
              `subsequence:${match.fragments
                .map(({ start, end }) => `${start}-${end}`)
                .join(';')}`,
              result.metadata.source_database,
              result.metadata.name,
              `taxID:${result.metadata.source_organism.taxId}`,
            ].join(DESCRIPTION_SEPARATOR)}\n`;
            // sequence
            content += match.fragments
              .map(({ start, end }) =>
                result.extra_fields.sequence.substring(start - 1, end),
              )
              .join('-')
              .replace(CHUNK_OF_EIGHTY, '$1\n');
          }
        } else {
          // description
          content += `>${[
            result.metadata.accession,
            result.metadata.source_database,
            result.metadata.name,
            `taxID:${result.metadata.source_organism.taxId}`,
          ].join(DESCRIPTION_SEPARATOR)}\n`;
          // sequence
          content += result.extra_fields.sequence.replace(
            CHUNK_OF_EIGHTY,
            '$1\n',
          );
        }
      } else if (fileType === 'json') {
        content += JSON.stringify(result);
      } else if (fileType === 'accession') {
        content += `${result.metadata.accession}\n`;
      } else if (fileType === 'tsv') {
        content += `${object2TSV(result, columns[endpoint])}\n`;
      } else {
        // TSV?
        content += `${result}\n`;
      }
      yield content;
    }
  };

const getFirstPage = (url, fileType, endpoint) => {
  const location = parse(url, true);
  if (fileType === 'tsv' || fileType === 'json') {
    location.query.extra_fields = ['short_name'];
  } else if (fileType === 'fasta') {
    location.query.extra_fields = [
      ...(location.query.extra_fields, '').split(','),
      'sequence',
    ]
      .filter(Boolean)
      .join(',');
  }
  location.href = null;
  location.path = null;
  location.search = null;
  location.query.page = 1;
  if (endpoint === 'ebisearch') location.query.size = MAX_EBI_PAGE_SIZE;
  else location.query.page_size = MAX_PAGE_SIZE;
  return location;
};

const mutatePayloadTo3rdPartyAPI = (payload, endpoint, page) => {
  if (endpoint === 'ebisearch') {
    payload.results = payload.entries;
    payload.count = payload.hitCount;
    if (page.query.page * MAX_EBI_PAGE_SIZE < payload.hitCount) {
      page.query.start = 1 + page.query.page * MAX_EBI_PAGE_SIZE;
      payload.next = format(page);
    } else payload.next = null;
    page.query.page++;
  }
};
// the `_` is just to make flow happy
const downloadContent =
  (onProgress, onSuccess, onError) =>
  // eslint-disable-next-line max-statements
  async (url, fileType, subset, endpoint, _) => {
    try {
      const firstPage = getFirstPage(url, fileType, endpoint);
      // TSV header
      if (fileType === 'tsv') {
        onProgress({
          part: `${columns[endpoint].map(({ name }) => name).join('\t')}\n`,
          progress: 0,
        });
      }

      const key = [url, fileType, subset].filter(Boolean).join('|');
      // Counters for progress information
      let totalCount;
      let i = 0;
      // Create a function to transform API response into processed file part
      const processResults = processResultsFor(fileType, subset, endpoint);
      // As long as we have a next page, we keep processing
      // Let's start with the first one
      let next = format(firstPage);
      let errorCount = 0;
      let version = null;
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
          version = response.headers.get('InterPro-Version');
          mutatePayloadTo3rdPartyAPI(payload, endpoint, firstPage);
          totalCount = payload.count;
          for (const part of processResults(payload.results)) {
            // Check if it was canceled, if so, stop everything and return
            // eslint-disable-next-line
            if (canceled.has(key)) return;
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
      onSuccess({ key, version: Number(version) });
    } catch (error) {
      onError(error);
    }
  };

const postProgress = throttle(
  (progressAction) => self.postMessage(progressAction),
  THROTTLE_TIME,
);

// Download manager, send messages from there
const download = async (url, fileType, subset, endpoint, originURL) => {
  const action = createActionCallerFor(url, fileType, subset, endpoint);
  const onError = (error) => {
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
        async ({ key, version }) => {
          // Finished getting all the content, generate a blob out of that
          // and get its URL
          const newDownload = await saveInIndexedDB(
            key,
            content,
            fileType,
            subset,
            version,
            originURL,
          );
          // OK, we have done everything, set progress to 1 and set success
          postProgress(action(downloadProgress, 1));
          postProgress.flush();
          self.postMessage(action(downloadSuccess, newDownload));
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
      download(
        data.url,
        data.fileType,
        data.subset,
        data.endpoint,
        data.originURL,
      );
      break;
    case DOWNLOAD_DELETE:
      canceled.add(
        [data.url, data.fileType, data.subset].filter(Boolean).join(''),
      );
      break;
    default:
      console.warn('not a recognised message', data);
  }
};

self.addEventListener('message', main);
