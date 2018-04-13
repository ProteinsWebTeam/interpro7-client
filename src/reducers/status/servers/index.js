// @flow
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import server from './server';

/*:: import type ServerStatus from './server'; */
/*:: export type ServerStatuses = {[string]: ServerStatus}; */
/*:: import type { State } from 'reducers'; */

export default combineReducers({
  api: server('api'),
  ebi: server('ebi'),
  ipScan: server('ipScan'),
});

export const serverStatusesSelector = (state /*: State */) =>
  state.status.servers;

const serverStatusSelectorFor = server =>
  createSelector(serverStatusesSelector, servers => servers[server]);

export const apiServerStatus = serverStatusSelectorFor('api');
export const ebiServerStatus = serverStatusSelectorFor('ebi');
export const ipScanServerStatus = serverStatusSelectorFor('ipScan');
