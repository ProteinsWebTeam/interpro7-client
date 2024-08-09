import metadata from './metadata';
import {
  CREATE_JOB,
  UPDATE_JOB,
  DELETE_JOB,
  REHYDRATE_JOBS,
  KEEP_JOB_AS_LOCAL,
  IPScanAction,
  IPScanMetadataAction,
} from 'actions/types';
import { IMPORT_JOB, IMPORT_JOB_FROM_DATA } from '../../actions/types';

export default (state: JobsState = {}, action: IPScanAction) => {
  switch (action.type) {
    case CREATE_JOB:
    case UPDATE_JOB:
    case IMPORT_JOB:
    case IMPORT_JOB_FROM_DATA:
      let id = action.job.metadata.localID;
      let job: { metadata: MinimalJobMetadata } | undefined = undefined;
      if (id) {
        job = state?.[id];
      } else {
        job = Object.values(state).find(
          ({ metadata: { remoteID } }) =>
            remoteID === action.job.metadata.remoteID,
        );
        if (job) {
          id = job.metadata.localID;
        }
      }
      return id
        ? {
            ...state,
            [id]: {
              metadata: metadata(
                job?.metadata || ({} as MinimalJobMetadata),
                action as IPScanMetadataAction,
              ),
            },
          }
        : state;
    case DELETE_JOB:
      const { [action.job.metadata.localID!]: _, ...newState } = state;
      return newState;
    case KEEP_JOB_AS_LOCAL:
      const localID = action.localID!;
      return {
        ...state,
        [localID]: {
          ...state[localID],
          metadata: {
            ...state[localID].metadata,
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
