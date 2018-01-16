// @flow
import url from 'url';
import { schedule } from 'timing-functions/src';

import {
  CREATE_JOB,
  DELETE_JOB,
  UPDATE_JOB,
  UPDATE_JOB_STATUS,
} from 'actions/types';
import { rehydrateJobs, updateJob } from 'actions/creators';

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

const deleteJob = async localID => {
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
    deleteJob(localID);
  }
};

const updateJobInDB = async metadata => {
  const metaT = await metaTA;
  metaT.set(metadata, metadata.localID);
};

export default ({ dispatch, getState }) => {
  // function definitions
  const processJob = async (localID, meta) => {
    // Wait to have some time to do all the maintenance
    await schedule(DEFAULT_SCHEDULE_DELAY);
    if (meta.status === 'finished' || meta.status === 'failed') return;
    if (meta.status === 'created') {
      const dataT = await dataTA;
      const { input } = await dataT.get(localID);

      const body = new FormData();
      body.set('email', config.IPScan.contactEmail);
      body.set('sequence', input);

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
      const rawStatus = await response.text();
      if (response.ok) {
        dispatch(
          updateJob({
            metadata: {
              ...meta,
              status: rawStatus.toLowerCase().replace('_', ' '),
            },
          }),
        );
      }
    }
  };

  let loopID;
  const loop = async () => {
    // This might have been called before the scheduled run, so clear the
    // corresponding scheduled run first
    clearTimeout(loopID);

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
    }
  };

  // start the logic
  rehydrateStoredJobs(dispatch);
  loop();

  return next => action => {
    const output = next(action);

    if (action.type === CREATE_JOB) {
      const job = getState().jobs[action.job.metadata.localID];
      createJobInDB(job.metadata, action.job.data);
    }

    if (action.type === UPDATE_JOB) {
      updateJobInDB(getState().jobs[action.job.metadata.localID].metadata);
    }

    if (action.type === DELETE_JOB) {
      deleteJob(action.job.metadata.localID);
    }

    if (action.type === UPDATE_JOB_STATUS) {
      loop();
    }

    return output;
  };
};
