import {
  CREATE_JOB,
  UPDATE_JOB,
  IMPORT_JOB,
  IMPORT_JOB_FROM_DATA,
  IPScanMetadataAction,
} from 'actions/types';

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

export const updateJob = (update: IprscanMetaIDB) => {
  const base = createJobMetadata();
  const now = Date.now();
  const times = { ...base.times, ...(update.times || {}) };
  if (update.status) times[update.status] = times.lastUpdate = now;
  return { ...base, ...update, times };
};

export default (state: MinimalJobMetadata, action: IPScanMetadataAction) => {
  switch (action.type) {
    case CREATE_JOB:
      return updateJob({ ...action.job.metadata, status: 'created' });
    case IMPORT_JOB:
      return updateJob({ ...action.job.metadata, status: 'importing' });
    case IMPORT_JOB_FROM_DATA:
      return updateJob({ ...action.job.metadata, status: 'imported file' });
    case UPDATE_JOB:
      return updateJob({ ...action.job.metadata });
    default:
      return state;
  }
};
