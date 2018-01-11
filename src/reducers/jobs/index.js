// @flow
import metadata from './metadata';
import data from './data';
import {
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  LOAD_DATA_JOB,
  UNLOAD_DATA_JOB,
} from 'actions/types';

/*:: type Job = {
  metadata: Object,
  data?: Object,
} */

export default (
  state /*: {[key: string]: Job } */ = {},
  action /*: Object */,
) => {
  switch (action.type) {
    case CREATE_JOB:
    case UPDATE_JOB:
    case LOAD_DATA_JOB:
    case UNLOAD_DATA_JOB: // eslint-disable-line no-case-declarations
      const id = action.job.metadata.localID;
      const job = state[id] || {};
      return {
        ...state,
        [id]: {
          metadata: metadata(job.metadata, action),
          data: data(job.data, action),
        },
      };
    case DELETE_JOB: // eslint-disable-line no-case-declarations
      const { [action.job.metadata.localID]: _, ...newState } = state;
      return newState;
    default:
      return state;
  }
};
