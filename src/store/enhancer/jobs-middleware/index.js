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
  if (Object.keys(meta).length) {
    dispatch(rehydrateJobs(meta));
  }
};

const deleteJob = async job => {
  const dataT = await dataTA;
  dataT.delete(job.localID);
  const metaT = await metaTA;
  metaT.delete(job.localID);
};

const createJob = async (dispatch, job) => {
  try {
    // add data and metadata to idb
  } catch (error) {
    // cleanup if anything bad happens
    deleteJob(job);
  }
};

export default ({ dispatch, getState }) => {
  rehydrateStoredJobs(dispatch);

  return next => action => {
    if (action.type === CREATE_JOB) {
      createJob(action.job);
    }
    if (action.type === DELETE_JOB) {
      deleteJob(action.job);
    }
    return next(action);
  };
};
