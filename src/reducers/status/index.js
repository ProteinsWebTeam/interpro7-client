// @flow
import { combineReducers } from 'redux';

import browser from './browser';
import servers from './servers';

/*:: import type { BrowserStatus } from './browser'; */
/*:: import type { ServerStatuses } from './servers'; */
/*:: export type Status = {|
  browser: BrowserStatus,
  servers: ServerStatuses,
|} */
/*:: import type { State } from 'reducers'; */

export default (combineReducers({
  browser,
  servers,
}) /*: (Status | void, any) => Status */);

export const statusSelector = (state /*: State */) /*: Status */ =>
  state.status;
