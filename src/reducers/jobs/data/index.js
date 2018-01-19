// @flow
import { LOAD_DATA_JOB, UNLOAD_DATA_JOB } from 'actions/types';

/*:: type JobData = Object */

export default (state /*?: JobData */, action /*: Object */) => {
  switch (action.type) {
    case LOAD_DATA_JOB:
      return { ...(state || {}), ...action.job.data };
    case UNLOAD_DATA_JOB:
      return;
    default:
      return state;
  }
};
