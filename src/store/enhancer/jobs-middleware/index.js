// @flow
import { schedule } from 'timing-functions/src';

import { CREATE_JOB, DELETE_JOB } from 'actions/types';
import { rehydrateJobs } from 'actions/creators';

import getTableAccess, { IPScanJobsMeta, IPScanJobsData } from 'storage/idb';

const DEFAULT_SCHEDULE_DELAY = 2000;

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
  const dataT = await dataTA;
  dataT.delete(localID);
  const metaT = await metaTA;
  metaT.delete(localID);
};

const createJob = async (dispatch, job) => {
  const { localID } = job.metadata;
  try {
    // add data and metadata to idb
    const dataT = await dataTA;
    await dataT.set(job.data, localID);
    const metaT = await metaTA;
    await metaT.set(job.metadata, localID);
  } catch (error) {
    // cleanup if anything bad happens
    deleteJob(localID);
  }
};

export default ({ dispatch, getState }) => {
  rehydrateStoredJobs(dispatch);

  return next => action => {
    if (action.type === CREATE_JOB) {
      createJob(dispatch, action.job);
    }
    if (action.type === DELETE_JOB) {
      deleteJob(action.job.metadata.localID);
    }
    return next(action);
  };
};
