import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import server from './server';

/*:: import type {ServerStatus} from './server'; */
/*:: export type ServerStatuses = {[string]: ServerStatus}; */
/*:: import type { State } from 'reducers'; */

// prettier-ignore
export default (combineReducers({
  api: server('api'),
  ebi: server('ebi'),
  ipScan: server('ipScan'),
  wikipedia: server('wikipedia'),
  alphafold: server('alphafold'),
}) /*: (ServerStatuses | void, any) => ServerStatuses */);

export const serverStatusesSelector = (
  state /*: State */,
) /*: ServerStatuses*/ => state.status.servers;

// prettier-ignore
const serverStatusSelectorFor = (server) => (createSelector(
  serverStatusesSelector,
  (servers) => servers[server],
) /*: (State) => ServerStatus */);

export const apiServerStatus = serverStatusSelectorFor('api');
export const ebiServerStatus = serverStatusSelectorFor('ebi');
export const ipScanServerStatus = serverStatusSelectorFor('ipScan');
export const wikipediaServerStatus = serverStatusSelectorFor('wikipedia');
export const alphaFoldServerStatus = serverStatusSelectorFor('alphafold');
