import metadata from './metadata';
import {
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  REHYDRATE_JOBS,
  KEEP_JOB_AS_LOCAL,
} from 'actions/types';
import { IMPORT_JOB, IMPORT_JOB_FROM_DATA } from '../../actions/types';

/*:: type Job = {
  metadata: Object,
  data?: Object,
} */

export default (
  state /*: ?{[key: string]: Job } */ = null,
  action /*: Object */,
) => {
  switch (action.type) {
    case CREATE_JOB:
    case UPDATE_JOB:
    case IMPORT_JOB:
    case IMPORT_JOB_FROM_DATA:
      let id = action.job.metadata.localID;
      let job = state[id];
      if (!id) {
        job = Object.values(state).find(
          ({ metadata: { remoteID } }) =>
            remoteID === action.job.metadata.remoteID,
        );
        if (job) {
          id = job.metadata.localID;
        }
      }
      job = job || {};
      return {
        ...state,
        [id]: {
          metadata: metadata(job.metadata, action),
        },
      };
    case DELETE_JOB:
      const { [action.job.metadata.localID]: _, ...newState } = state;
      return newState;
    case KEEP_JOB_AS_LOCAL:
      return {
        ...state,
        [action.localID]: {
          ...state[action.localID],
          metadata: {
            ...state[action.localID].metadata,
            status: 'saved in browser',
          },
        },
      };
    case REHYDRATE_JOBS:
      // Needs to be run once and only once before any other action
      return action.jobs;
    default:
      return state;
  }
};
