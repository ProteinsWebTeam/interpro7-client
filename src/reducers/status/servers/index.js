// @flow
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';

import server from './server';

/*:: import type ServerStatus from './server'; */
/*:: export type ServerStatuses = {[string]: ServerStatus}; */
/*:: import type { State } from 'reducers'; */

export default (combineReducers({
  api: server('api'),
  ebi: server('ebi'),
  ipScan: server('ipScan'),
}) /*: (ServerStatuses | void, any) => ServerStatuses */);

export const serverStatusesSelector = (
  state /*: State */,
) /*: ServerStatuses*/ => state.status.servers;

const serverStatusSelectorFor = server =>
  (createSelector(
    serverStatusesSelector,
    servers => servers[server],
  ) /*: (State, any) => ServerStatus */);

export const apiServerStatus = (serverStatusSelectorFor(
  'api',
) /*: ServerStatus*/);
export const ebiServerStatus = (serverStatusSelectorFor(
  'ebi',
) /*: ServerStatus*/);
export const ipScanServerStatus = (serverStatusSelectorFor(
  'ipScan',
) /*: ServerStatus*/);
