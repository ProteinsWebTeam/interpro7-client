// @flow
import { CREATE_JOB, UPDATE_JOB } from 'actions/types';

/*:: type JobStatus = 'created' | 'submitted'; */

/*:: type JobMetadata = {|
  localID: ?string,
  type: 'InterProScan',
  status: ?JobStatus,
  remoteID: ?string,
  times: {|
    created?: number,
    submitted?: number,
    lastUpdate: ?number,
  |},
|} */

const createJobMetadata = () => ({
  localID: null,
  type: 'InterProScan',
  status: null,
  saved: false,
  remoteID: null,
  times: {
    lastUpdate: null,
  },
});

export const updateJob = (update /*: Object */) => {
  const base = createJobMetadata();
  const now = Date.now();
  const times = { ...base.times, ...(update.times || {}) };
  if (update.status) times[update.status] = times.lastUpdate = now;
  return { ...base, ...update, times };
};

export default (state /*: JobMetadata */, action /*: Object */) => {
  switch (action.type) {
    case CREATE_JOB:
      return updateJob({ ...action.job.metadata, status: 'created' });
    case UPDATE_JOB:
      return updateJob({ ...action.job.metadata });
    default:
      return state;
  }
};
