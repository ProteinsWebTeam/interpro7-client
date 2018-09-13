/*:: import type { Middleware } from 'redux'; */
import url from 'url';
import { schedule } from 'timing-functions/src';

import { cachedFetchJSON, cachedFetchText } from 'utils/cached-fetch';
import id from 'utils/cheap-unique-id';

import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  UPDATE_JOB_STATUS,
  NEW_PROCESSED_CUSTOM_LOCATION,
} from 'actions/types';
import { rehydrateJobs, updateJob, addToast } from 'actions/creators';

import config from 'config';

import getTableAccess, { IPScanJobsMeta, IPScanJobsData } from 'storage/idb';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_SCHEDULE_DELAY = 1000 * 2; // 2 seconds
// eslint-disable-next-line no-magic-numbers
const DEFAULT_LOOP_TIMEOUT = 1000 * 60; // one minute
// eslint-disable-next-line no-magic-numbers
const MAX_TIME_ON_SERVER = 1000 * 60 * 60 * 24 * 7; // one week

const metaTA = getTableAccess(IPScanJobsMeta);
const dataTA = getTableAccess(IPScanJobsData);

const deleteJobInDB = async localID => {
  const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
  dataT.delete(localID);
  metaT.delete(localID);
};

const rehydrateStoredJobs = async dispatch => {
  await schedule(DEFAULT_SCHEDULE_DELAY);
  const metaT = await metaTA;
  const meta = await metaT.getAll();
  const entries = Object.entries(meta);
  if (!entries.length) return dispatch(rehydrateJobs({}));
  const jobs = {};
  const now = Date.now();
  for (const [localID, metadata] of entries) {
    // if job expired on server, delete it
    if (now - metadata.times.created > MAX_TIME_ON_SERVER) {
      deleteJobInDB(localID);
    } else {
      jobs[localID] = { metadata };
    }
  }
  dispatch(rehydrateJobs(jobs));
};

const createJobInDB = async (metadata, data) => {
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

const updateJobInDB = async (metadata, data) => {
  const [metaT, dataT] = await Promise.all([metaTA, dataTA]);
  metaT.set(metadata, metadata.localID);
  if (data) dataT.update(metadata.localID, prev => ({ ...prev, ...data }));
};

const middleware /*: Middleware<*, *, *> */ = ({ dispatch, getState }) => {
  // function definitions
  const processJob = async (localID, meta) => {
    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);
    if (meta.status === 'failed') return;
    if (meta.status === 'created') {
      const dataT = await dataTA;
      const { input, applications, goterms, pathways } = await dataT.get(
        localID,
      );

      const ipScanInfo = getState().settings.ipScan;

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
                email: config.IPScan.contactEmail,
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
      }
      return;
    }
    if (meta.status === 'submitted' || meta.status === 'running') {
      const ipScanInfo = getState().settings.ipScan;
      const { payload, ok } = await cachedFetchText(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          `status/${meta.remoteID}`,
        ),
        { useCache: false },
      );
      const status = payload.toLowerCase().replace('_', ' ');
      if (ok) {
        dispatch(updateJob({ metadata: { ...meta, status } }));
        if (status === 'finished') {
          const currentDesc = getState().customLocation.description;
          if (
            currentDesc.main.key !== 'job' ||
            (currentDesc.job.accession &&
              currentDesc.job.accession !== meta.localID &&
              currentDesc.job.accession !== meta.remoteID)
          ) {
            dispatch(
              addToast(
                {
                  title: `Job ${status}`,
                  body: `Your job with id ${
                    meta.remoteID
                  } is in a “${status}” state.`,
                  ttl: 10000, // eslint-disable-line no-magic-numbers
                  link: {
                    to: {
                      description: {
                        main: { key: 'job' },
                        job: { type: 'InterProScan', accession: meta.remoteID },
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
    }
    if (meta.status === 'finished' && !meta.hasResults) {
      const ipScanInfo = getState().settings.ipScan;
      const { payload: data, ok } = await cachedFetchJSON(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          `result/${meta.remoteID}/json`,
        ),
      );
      if (ok) {
        dispatch(updateJob({ metadata: { ...meta, hasResults: true }, data }));
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
      for (const [localID, meta] of Object.entries(await metaT.getAll())) {
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

  return next => action => {
    const previousState = getState();
    const output = next(action);

    if (action.type === CREATE_JOB) {
      const job = getState().jobs[action.job.metadata.localID];
      createJobInDB(job.metadata, action.job.data);
    }

    if (action.type === UPDATE_JOB) {
      updateJobInDB(
        getState().jobs[action.job.metadata.localID].metadata,
        action.job.data,
      );
    }

    if (action.type === DELETE_JOB) {
      deleteJobInDB(action.job.metadata.localID);
    }

    if (action.type === UPDATE_JOB_STATUS) {
      loop();
    }

    if (action.type === NEW_PROCESSED_CUSTOM_LOCATION) {
      if (
        !previousState.customLocation.description.job.accession &&
        getState().customLocation.description.job.accession
      ) {
        // load job data
      } else if (
        previousState.customLocation.description.job.accession &&
        getState().customLocation.description.job.accession
      ) {
        // unload data
      }
    }

    return output;
  };
};

export default middleware;
