// @flow
/*:: import type { Middleware } from 'redux'; */
/*:: import type { JobMetadata } from 'reducers/jobs/metadata'; */
import url from 'url';
import { schedule } from 'timing-functions';

import { createNotification } from 'utils/browser-notifications';
import { cachedFetchJSON, cachedFetchText } from 'utils/cached-fetch';
import id from 'utils/cheap-unique-id';

import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  UPDATE_JOB_STATUS,
  UPDATE_JOB_TITLE,
  KEEP_JOB_AS_LOCAL,
  NEW_PROCESSED_CUSTOM_LOCATION,
  IMPORT_JOB,
  IMPORT_JOB_FROM_DATA,
} from 'actions/types';
import { rehydrateJobs, updateJob, addToast } from 'actions/creators';

import config from 'config';

import getTableAccess, { IPScanJobsMeta, IPScanJobsData } from 'storage/idb';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_SCHEDULE_DELAY = 1000 * 2; // 2 seconds
// eslint-disable-next-line no-magic-numbers
const DEFAULT_LOOP_TIMEOUT = 1000 * 60; // one minute
// eslint-disable-next-line no-magic-numbers
export const MAX_TIME_ON_SERVER = 1000 * 60 * 60 * 24 * 7; // one week

const metaTA = getTableAccess(IPScanJobsMeta);
const dataTA = getTableAccess(IPScanJobsData);

const deleteJobInDB = async (localID) => {
  const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
  dataT.delete(localID);
  metaT.delete(localID);
};

const rehydrateStoredJobs = async (dispatch) => {
  await schedule(DEFAULT_SCHEDULE_DELAY);
  const metaT = await metaTA;
  const meta = await metaT.getAll();
  // prettier-ignore
  const entries = (Object.entries(meta) /*: any */);
  if (!entries.length) return dispatch(rehydrateJobs({}));
  const jobs = {};
  const now = Date.now();
  for (const [localID, metadata] /*: [string, JobMetadata] */ of entries) {
    // if job expired on server, delete it
    if (
      now - (metadata.times.created || now) > MAX_TIME_ON_SERVER &&
      metadata.status !== 'imported file'
    ) {
      deleteJobInDB(localID);
    } else {
      jobs[localID] = { metadata };
    }
  }
  dispatch(rehydrateJobs(jobs));
};

const createJobInDB = async (metadata /*: JobMetadata */, data) => {
  const { localID } = metadata;
  try {
    // add data and metadata to idb
    const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
    await Promise.all([dataT.set(data, localID), metaT.set(metadata, localID)]);
  } catch {
    // cleanup if anything bad happens
    deleteJobInDB(localID);
  }
};

const updateJobInDB = async (metadata, data, title) => {
  const [metaT, dataT] = await Promise.all([metaTA, dataTA]);
  if (data) {
    dataT.update(metadata.localID, (prev) => ({ ...prev, ...data }));
    metadata.localTitle = title || data?.results?.[0]?.xref?.[0]?.name;
  }
  metaT.set(metadata, metadata.localID);
};

const middleware /*: Middleware<*, *, *> */ = ({ dispatch, getState }) => {
  // function definitions
  // eslint-disable-next-line
  const processJob = async (localID /*: string */, meta /*: JobMetadata */) => {
    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);
    if (meta.status === 'failed') return;
    if (meta.status === 'created') {
      const dataT = await dataTA;
      const { input, applications, goterms, pathways } = await dataT.get(
        localID,
      );

      const ipScanInfo = getState().settings.ipScan;

      // Here is where we actually submit the sequence to InterProScan servers
      const { payload: remoteID, ok } = await cachedFetchText(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          'run',
        ),
        {
          useCache: false,
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: url
            .format({
              query: {
                // prettier-ignore
                email: (config /*: any */).IPScan.contactEmail,
                title: localID,
                sequence: input,
                appl: applications,
                goterms,
                pathways,
              },
            })
            .replace(/^\?/, ''),
        },
      );
      if (ok) {
        dispatch(
          updateJob({ metadata: { ...meta, remoteID, status: 'submitted' } }),
        );
      } else {
        dispatch(updateJob({ metadata: { ...meta, status: 'failed' } }));
      }
      return;
    }
    if (
      meta.status === 'submitted' ||
      meta.status === 'running' ||
      meta.status === 'importing'
    ) {
      const ipScanInfo = getState().settings.ipScan;
      // Here we check the status of a job in the interProScan servers

      const { payload, ok } = await cachedFetchText(
        meta.remoteID
          ? url.resolve(
              url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
              `status/${meta.remoteID || ''}`,
            )
          : null,
        { useCache: false },
      );
      const status = payload.toLowerCase().replace('_', ' ');
      if (ok) {
        // dispatch action to report status in the redux state
        dispatch(updateJob({ metadata: { ...meta, status } }));
        if (status === 'finished') {
          const currentDesc = getState().customLocation.description;
          if (
            currentDesc.main.key !== 'result' ||
            (currentDesc.result.accession &&
              currentDesc.result.accession !== meta.localID &&
              currentDesc.result.accession !== meta.remoteID)
          ) {
            // Sent notification the job is completed/imported
            const notification = createNotification(
              'InterProScan',
              'Your InterProScan search results are ready to view',
            );
            notification.onclick = () => {
              window.open(
                `${window.location.origin}/interpro/result/InterProScan/${
                  meta.remoteID || ''
                }`,
                '_blank',
              );
            };
            // TODO to be removed
            dispatch(
              addToast(
                {
                  title: `Job ${status}`,
                  body: `Your job with id ${
                    meta.remoteID || '_'
                  } is in a “${status}” state.`,
                  ttl: 10000, // eslint-disable-line no-magic-numbers
                  link: {
                    to: {
                      description: {
                        main: { key: 'result' },
                        result: {
                          type: 'InterProScan',
                          accession: meta.remoteID,
                        },
                      },
                    },
                    children: 'Go to the result page',
                  },
                },
                id(),
              ),
            );
          }
        }
      }
      // TODO: we need to handle the cases when the response is not OK.
    }
    if (meta.status === 'finished' && !meta.hasResults) {
      const ipScanInfo = getState().settings.ipScan;
      // Getting the results from the interporScan Server
      const { payload: data, ok } = await cachedFetchJSON(
        meta.remoteID
          ? url.resolve(
              url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
              `result/${meta.remoteID || ''}/json`,
            )
          : null,
      );
      if (ok) {
        dispatch(updateJob({ metadata: { ...meta, hasResults: true }, data }));
      } else {
        console.log('GOT here', data);
        dispatch(
          updateJob({
            metadata: { ...meta, hasResults: false, status: 'error' },
          }),
        );
      }
    }
  };

  let loopID;
  let running = false;
  const loop = async () => {
    if (running) return;
    // This might have been called before the scheduled run, so clear the
    // corresponding scheduled run first
    clearTimeout(loopID);
    running = true;

    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);

    try {
      const metaT = await metaTA;
      for (const [
        localID,
        meta,
      ] /*: [string, JobMetadata] */ of (Object.entries(
        await metaT.getAll(),
        // prettier-ignore
      ) /*: any */)) {
        await processJob(localID, meta);
      }
    } catch (error) {
      console.error(error);
    } finally {
      loopID = setTimeout(loop, DEFAULT_LOOP_TIMEOUT);
      running = false;
    }
  };

  // start the logic
  rehydrateStoredJobs(dispatch);
  running = loop();

  return (next) => (action) => {
    const previousState = getState();
    const output = next(action);

    if (
      action.type === CREATE_JOB ||
      action.type === IMPORT_JOB ||
      action.type === IMPORT_JOB_FROM_DATA
    ) {
      const job = getState().jobs[action.job.metadata.localID];
      createJobInDB(job.metadata, action.job.data);
      if (action.type === IMPORT_JOB)
        processJob(action.job.metadata.localID, job.metadata);
    }

    if (action.type === UPDATE_JOB) {
      updateJobInDB(
        getState().jobs[action.job.metadata.localID].metadata,
        action.job.data,
        null,
      );
    }

    if (action.type === DELETE_JOB) {
      deleteJobInDB(action.job.metadata.localID);
    }

    if (action.type === UPDATE_JOB_STATUS) {
      loop();
    }

    if (action.type === UPDATE_JOB_TITLE) {
      updateJobInDB(
        getState().jobs[action.job.metadata.localID].metadata,
        action.job.data,
        action.value,
      );
    }
    if (action.type === KEEP_JOB_AS_LOCAL) {
      updateJobInDB({
        ...getState().jobs[action.localID].metadata,
        status: 'imported file',
      });
    }

    if (action.type === NEW_PROCESSED_CUSTOM_LOCATION) {
      if (
        !previousState.customLocation.description.result.accession &&
        getState().customLocation.description.result.accession
      ) {
        // load job data
      } else if (
        previousState.customLocation.description.result.accession &&
        getState().customLocation.description.result.accession
      ) {
        // unload data
      }
    }

    return output;
  };
};

export default middleware;
