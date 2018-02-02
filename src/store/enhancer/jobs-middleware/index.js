// @flow
import url from 'url';
import { schedule } from 'timing-functions/src';
import id from 'utils/cheapUniqueId';

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

const DEFAULT_SCHEDULE_DELAY = 2000; // 2 seconds
const DEFAULT_LOOP_TIMEOUT = 60000; // one minute

const metaTA = getTableAccess(IPScanJobsMeta);
const dataTA = getTableAccess(IPScanJobsData);

const rehydrateStoredJobs = async dispatch => {
  await schedule(DEFAULT_SCHEDULE_DELAY);
  const metaT = await metaTA;
  const meta = await metaT.getAll();
  const entries = Object.entries(meta);
  if (!entries.length) return;
  const jobs = {};
  for (const [localID, metadata] of entries) {
    jobs[localID] = { metadata };
  }
  dispatch(rehydrateJobs(jobs));
};

const deleteJobInDB = async localID => {
  const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
  dataT.delete(localID);
  metaT.delete(localID);
};

const createJobInDB = async (metadata, data) => {
  const { localID } = metadata;
  try {
    // add data and metadata to idb
    const [dataT, metaT] = await Promise.all([dataTA, metaTA]);
    await Promise.all([dataT.set(data, localID), metaT.set(metadata, localID)]);
  } catch (error) {
    // cleanup if anything bad happens
    deleteJobInDB(localID);
  }
};

const updateJobInDB = async (metadata, data) => {
  const [metaT, dataT] = await Promise.all([metaTA, dataTA]);
  metaT.set(metadata, metadata.localID);
  if (data) dataT.update(metadata.localID, prev => ({ ...prev, ...data }));
};

export default ({ dispatch, getState }) => {
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

      const body = new FormData();
      body.set('email', config.IPScan.contactEmail);
      body.set('title', localID);
      body.set('sequence', input);
      for (const application of applications) {
        body.append('appl', application);
      }
      body.set('goterms', goterms);
      body.set('pathways', pathways);

      const ipScanInfo = getState().settings.ipScan;

      const response = await fetch(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          'run',
        ),
        { method: 'POST', body },
      );
      const remoteID = await response.text();
      if (response.ok) {
        dispatch(
          updateJob({ metadata: { ...meta, remoteID, status: 'submitted' } }),
        );
      }
      return;
    }
    if (meta.status === 'submitted' || meta.status === 'running') {
      const ipScanInfo = getState().settings.ipScan;
      const response = await fetch(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          `status/${meta.remoteID}`,
        ),
      );
      const newStatus = (await response.text()).toLowerCase().replace('_', ' ');
      if (response.ok) {
        dispatch(updateJob({ metadata: { ...meta, status: newStatus } }));
        if (newStatus === 'finished') {
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
                  title: `Job ${newStatus}`,
                  body: `Your job with id ${
                    meta.remoteID
                  } is in a “${newStatus}” state.`,
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
      const response = await fetch(
        url.resolve(
          url.format({ ...ipScanInfo, pathname: ipScanInfo.root }),
          `result/${meta.remoteID}/json`,
        ),
      );
      if (response.ok) {
        dispatch(
          updateJob({
            metadata: { ...meta, hasResults: true },
            data: await response.json(),
          }),
        );
      }
    }
  };

  let loopID;
  let running = false;
  const loop = async () => {
    if (running === true) return;
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
      //
    } catch (error) {
      console.error(error);
    } finally {
      loopID = setTimeout(loop, DEFAULT_LOOP_TIMEOUT);
      running = false;
    }
  };

  // start the logic
  rehydrateStoredJobs(dispatch);
  loop();

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
